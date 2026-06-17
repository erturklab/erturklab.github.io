#!/usr/bin/env python3
"""Clean up scholar import: remove junk/duplicates, fix authors via OpenAlex, dedupe preprints."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / "src/content/site.json"

REMOVE_EXACT_TITLES = {
    "Voices of biotech research",
    "Research briefing",
    "Approaching peak ground truth",
    "Neuroimmune Cardiovascular Interfaces form Atherosclerosis Brain Circuits",
    "Sympathetic denervation of the pineal gland in heart disease",
    "MetGAN-based Data Augmentation for Improved Metastasis Segmentation in Light-Sheet Microscopy",
    "Leonardo: A toolset to remove sample-induced aberrations in light sheet microscopy images",
    "Tissue clearing and its applications in neuroscience (vol 21, pg 319, 2020)",
    "Methods for large tissue labeling, clearing and imaging using antibiodies",
}

REMOVE_TITLE_CONTAINS = [
    "Publisher Correction:",
    "Author Correction:",
    "Figure ",
    "Table ",
    "Data from ",
    "Supplementary Data",
    "SELMA3D challenge",
    "Breaking boundaries in whole-body imaging and disease understanding",  # editorial/news
    "Creating bottom-up RNA transfer vehicles from synthetic protein assemblies",  # RS preprint, keep if no journal version
]

MOJIBAKE = (
    ("â€™", "'"),
    ("Ã¼", "ü"),
    ("Ã¶", "ö"),
    ("Ã¤", "ä"),
    ("Ali Ertuerk", "Ali Ertürk"),
)


def clean_text(value: str) -> str:
    text = re.sub(r"</?i>", "", re.sub(r"<[^>]+>", "", value or "")).strip()
    for bad, good in MOJIBAKE:
        text = text.replace(bad, good)
    return text


def norm_title(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", clean_text(title).lower())


def norm_doi(link: str | None) -> str:
    if not link:
        return ""
    match = re.search(r"10\.\d{4,9}/[-._;()/:A-Z0-9]+", link, re.I)
    return match.group(0).lower() if match else link.lower().replace("https://doi.org/", "").strip()


def tokens(title: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]{4,}", norm_title(title)))


def similar(a: str, b: str, threshold: float = 0.38) -> bool:
    ta, tb = tokens(a), tokens(b)
    if not ta or not tb:
        return False
    return len(ta & tb) / len(ta | tb) >= threshold


def normalize_author(name: str) -> str:
    cleaned = clean_text(name)
    key = re.sub(r"[^a-z ]", "", cleaned.lower()).strip()
    if key in {"ali erturk", "ali ertuerk"}:
        return "Ali Ertürk"
    return cleaned


def format_authors(authorships: list[dict]) -> str:
    return ", ".join(
        normalize_author((a.get("author") or {}).get("display_name", ""))
        for a in authorships
        if (a.get("author") or {}).get("display_name")
    )


def fetch_work(doi: str) -> dict | None:
    encoded = urllib.parse.quote(f"https://doi.org/{doi}", safe="")
    url = f"https://api.openalex.org/works/{encoded}?select=title,publication_year,doi,authorships,primary_location,type"
    try:
        with urllib.request.urlopen(url) as response:
            return json.load(response)
    except Exception:
        return None


def journal_name(work: dict) -> str:
    source = ((work.get("primary_location") or {}).get("source") or {}).get("display_name") or ""
    lower = source.lower()
    if "biorxiv" in lower:
        return "bioRxiv"
    if "medrxiv" in lower:
        return "medRxiv"
    if "arxiv" in lower:
        return "arXiv"
    if "ssrn" in lower:
        return "SSRN"
    if "research square" in lower:
        return "Research Square"
    return clean_text(source) or "Journal"


def should_remove(pub: dict) -> bool:
    title = pub.get("title") or ""
    if title in REMOVE_EXACT_TITLES:
        return True
    return any(fragment in title for fragment in REMOVE_TITLE_CONTAINS)


def is_superseded_preprint(pub: dict, published: list[dict]) -> bool:
    return pub.get("type") == "preprint" and any(
        similar(pub.get("title", ""), p.get("title", ""), 0.35) for p in published
    )


def main() -> None:
    with SITE_JSON.open(encoding="utf-8") as handle:
        site = json.load(handle)

    removed: list[str] = []
    kept: list[dict] = []
    for pub in site["publications"]:
        if should_remove(pub):
            removed.append(pub["title"])
            continue
        kept.append(pub)

    # Drop preprint when a published peer-reviewed version exists (same title family)
    published = [p for p in kept if p.get("type") != "preprint"]
    final: list[dict] = []
    for pub in kept:
        if is_superseded_preprint(pub, published):
            removed.append(f"[preprint dup] {pub['title']}")
            continue
        final.append(pub)

    refreshed = 0
    for pub in final:
        pub["title"] = clean_text(pub.get("title", ""))
        pub["journal"] = clean_text(pub.get("journal", ""))

        doi = norm_doi(pub.get("link"))
        if not doi.startswith("10."):
            continue
        work = fetch_work(doi)
        time.sleep(0.04)
        if not work:
            continue

        pub["title"] = clean_text(work.get("title") or pub["title"])
        if work.get("publication_year"):
            pub["year"] = work["publication_year"]

        full_authors = format_authors(work.get("authorships") or [])
        if full_authors and ("..." in pub.get("authors", "") or len(full_authors) > len(pub.get("authors", ""))):
            pub["authors"] = full_authors
            refreshed += 1
        elif full_authors and not pub.get("featured"):
            pub["authors"] = full_authors
            refreshed += 1

        venue = journal_name(work)
        is_preprint = pub.get("type") == "preprint" or venue.lower() in {
            "biorxiv", "medrxiv", "arxiv", "ssrn", "research square"
        } or doi.startswith("10.1101/") or doi.startswith("10.64898/")
        if is_preprint:
            pub["type"] = "preprint"
            pub["journal"] = venue if venue != "Journal" else pub.get("journal", "bioRxiv")
        elif pub.get("type") == "preprint":
            pub.pop("type", None)
            if venue != "Journal":
                pub["journal"] = venue

        if not pub.get("link") and work.get("doi"):
            pub["link"] = work["doi"]

    final.sort(key=lambda item: (-item["year"], item["title"].lower()))
    site["publications"] = final

    with SITE_JSON.open("w", encoding="utf-8") as handle:
        json.dump(site, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    published = [p for p in final if p.get("type") != "preprint"]
    preprints = [p for p in final if p.get("type") == "preprint"]
    bad_authors = [p for p in final if "..." in p.get("authors", "")]
    no_link = [p for p in final if not p.get("link")]

    print(f"Removed: {len(removed)}")
    for title in removed:
        print(f"  - {title[:75]}")
    print(f"Author lists refreshed: {refreshed}")
    print(f"Total: {len(final)} ({len(published)} published, {len(preprints)} preprints)")
    print(f"Authors with '...': {len(bad_authors)}")
    print(f"Missing links: {len(no_link)}")
    if no_link:
        for p in no_link[:10]:
            print(f"  - {p['year']} {p['title'][:60]}")


if __name__ == "__main__":
    main()
