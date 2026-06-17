#!/usr/bin/env python3
"""Sync site publications with Google Scholar list: add missing, drop superseded preprints."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / "src" / "content/site.json"

MOJIBAKE = (
    ("â€™", "'"),
    ("â€˜", "'"),
    ("â€œ", '"'),
    ("â€", '"'),
    ("Ã¼", "ü"),
    ("Ã¶", "ö"),
    ("Ã¤", "ä"),
    ("ÃŸ", "ß"),
    ("Ã ⁄ ", "ü"),
    ("Ali Ertuerk", "Ali Ertürk"),
)

# OpenAlex DOI fetch for additions
ADDITIONS_BY_DOI: list[tuple[str, str | None]] = [
    ("10.64898/2026.02.16.702827", "preprint"),  # Aging reprograms
    ("10.64898/2026.05.04.720441", "preprint"),  # Reversible hypervascularization
    ("10.64898/2026.04.28.721386", "preprint"),  # BaSiCPy
    ("10.21203/rs.3.rs-8627080/v1", "preprint"),  # TREM2 PET
    ("10.48550/arxiv.2312.02608", "preprint"),  # Panoptica
    ("10.48550/arxiv.2108.13233", "preprint"),  # VesselGraph
    ("10.2139/ssrn.4484642", "preprint"),  # Early dissemination
]

SUPERSEDED_PREPRINT_DOIS = {
    "10.1101/2024.08.18.608300",
    "10.1101/2023.07.24.550304",
    "10.1101/2023.02.17.528921",
    "10.1101/2021.12.24.473988",
    "10.1101/2021.11.02.466753",
    "10.1101/2023.06.16.545256",
    "10.643908",
    "10.541862",
    "10.374785",
    "10.1101/2019.12.29.889873",
}


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
    return link.lower().replace("https://doi.org/", "").strip()


def tokens(title: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]{4,}", norm_title(title)))


def similar(a: str, b: str, threshold: float = 0.38) -> bool:
    ta, tb = tokens(a), tokens(b)
    if not ta or not tb:
        return False
    if len(ta & tb) / len(ta | tb) >= threshold:
        return True
    sa, sb = norm_title(a), norm_title(b)
    return (len(sa) >= 30 and sa[:30] in sb) or (len(sb) >= 30 and sb[:30] in sa)


def normalize_author(name: str) -> str:
    cleaned = clean_text(name)
    key = re.sub(r"[^a-z ]", "", cleaned.lower()).strip()
    if key in {"ali erturk", "ali ertuerk"}:
        return "Ali Ertürk"
    return cleaned


def format_authors(authorships: list[dict]) -> str:
    names = []
    for authorship in authorships:
        author = authorship.get("author") or {}
        name = author.get("display_name")
        if name:
            names.append(normalize_author(name))
    return ", ".join(names)


def fetch_work(doi: str) -> dict | None:
    encoded = urllib.parse.quote(f"https://doi.org/{doi}", safe="")
    url = f"https://api.openalex.org/works/{encoded}?select=title,publication_year,doi,authorships,primary_location,type"
    try:
        with urllib.request.urlopen(url) as response:
            return json.load(response)
    except Exception:
        return None


def journal_name(work: dict) -> str:
    source = (work.get("primary_location") or {}).get("source") or {}
    name = source.get("display_name") or ""
    lower = name.lower()
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
    return clean_text(name) or "Journal"


def work_to_entry(work: dict, *, pub_type: str | None) -> dict:
    entry: dict = {
        "featured": False,
        "title": clean_text(work.get("title") or ""),
        "authors": format_authors(work.get("authorships") or []),
        "journal": journal_name(work),
        "year": work.get("publication_year") or 0,
        "link": work.get("doi") or ((work.get("primary_location") or {}).get("landing_page_url")),
    }
    if pub_type == "preprint":
        entry["type"] = "preprint"
    return entry


def is_superseded_preprint(pub: dict, published: list[dict]) -> bool:
    doi = norm_doi(pub.get("link"))
    if doi in SUPERSEDED_PREPRINT_DOIS:
        return True
    title = pub.get("title") or ""
    for paper in published:
        if similar(title, paper.get("title") or "", 0.35):
            return True
    return False


def main() -> None:
    with SITE_JSON.open(encoding="utf-8") as handle:
        site = json.load(handle)

    publications = site["publications"]
    existing_titles = {norm_title(p["title"]) for p in publications}
    existing_dois = {norm_doi(p.get("link")) for p in publications if p.get("link")}

    added = 0
    for doi, pub_type in ADDITIONS_BY_DOI:
        if doi.lower() in existing_dois:
            continue
        work = fetch_work(doi)
        time.sleep(0.05)
        if not work:
            print(f"WARN: could not fetch {doi}")
            continue
        entry = work_to_entry(work, pub_type=pub_type)
        nt = norm_title(entry["title"])
        if nt in existing_titles:
            continue
        publications.append(entry)
        existing_titles.add(nt)
        existing_dois.add(doi.lower())
        added += 1
        print(f"ADD: {entry['year']} {entry.get('type', 'pub')} {entry['title'][:60]}")

    published = [p for p in publications if p.get("type") != "preprint"]
    kept: list[dict] = []
    removed_preprints: list[str] = []

    for pub in publications:
        pub["title"] = clean_text(pub.get("title", ""))
        pub["journal"] = clean_text(pub.get("journal", ""))
        pub["authors"] = ", ".join(normalize_author(name) for name in pub.get("authors", "").split(","))

        if pub.get("type") == "preprint" and is_superseded_preprint(pub, published):
            removed_preprints.append(pub["title"])
            continue

        doi = norm_doi(pub.get("link"))
        if doi and not pub.get("featured"):
            work = fetch_work(doi)
            time.sleep(0.04)
            if work:
                if not pub.get("featured"):
                    full = format_authors(work.get("authorships") or [])
                    if full:
                        pub["authors"] = full
                pub["title"] = clean_text(work.get("title") or pub["title"])
                if pub.get("type") != "preprint":
                    venue = journal_name(work)
                    if venue != "Journal":
                        pub["journal"] = venue
                if not pub.get("link"):
                    pub["link"] = work.get("doi") or ((work.get("primary_location") or {}).get("landing_page_url"))

        kept.append(pub)

    kept.sort(key=lambda item: (-item["year"], item["title"].lower()))
    site["publications"] = kept

    with SITE_JSON.open("w", encoding="utf-8") as handle:
        json.dump(site, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    published = [p for p in kept if p.get("type") != "preprint"]
    preprints = [p for p in kept if p.get("type") == "preprint"]
    no_link = [p for p in kept if not p.get("link")]

    print(f"\nAdded: {added}")
    print(f"Removed superseded preprints: {len(removed_preprints)}")
    for title in removed_preprints:
        print(f"  - {title[:70]}")
    print(f"Total: {len(kept)} ({len(published)} published, {len(preprints)} preprints)")
    print(f"Missing links: {len(no_link)}")


if __name__ == "__main__":
    main()
