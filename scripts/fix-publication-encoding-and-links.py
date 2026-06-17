#!/usr/bin/env python3
"""Fix encoding, links, full authors, and add missing Helmholtz-era publications."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / "src" / "content/site.json"

MOJIBAKE_REPLACEMENTS = (
    ("â€™", "'"),
    ("â€˜", "'"),
    ("â€œ", '"'),
    ("â€", '"'),
    ("Ã¼", "ü"),
    ("Ã¶", "ö"),
    ("Ã¤", "ä"),
    ("ÃŸ", "ß"),
    ("Ã ⁄ ", "ü"),
    ("ErtÃrk", "Ertürk"),
    ("ErtÃ¼rk", "Ertürk"),
    ("Ertuerk", "Ertürk"),
    ("Erturk", "Ertürk"),
)

MANUAL_ADDITIONS: list[dict] = [
    {
        "featured": False,
        "title": "Transfer learning from synthetic data reduces need for labels to segment brain vasculature and neural pathways in 3D",
        "authors": "Johannes C. Paetzold, Oliver Schoppe, Rami Al-Maskari, Giles Tetteh, Velizar Efremov, Mihail Ivilinov Todorov, Ruiyao Cai, Hongcheng Mai, Zhouyi Rong, Ali Ertürk, Bjoern Menze",
        "journal": "OpenReview",
        "year": 2019,
        "link": "https://openreview.net/forum?id=BJe02gRiY4",
    },
    {
        "featured": False,
        "type": "preprint",
        "title": "Neutrophils are critical for placental and fetal infection with the human pathogen Listeria monocytogenes",
        "authors": "Myriam Ripphahn, Nikita Raj, Hellen Ishikawa-Ankerhold, Zhouyi Rong, Bastian Popper, Bianca Portugal Tavares de Moraes, Xia Li, Ying Chen, Roland Immler, Lou Martha Wackerbarth, Dominic van den Heuvel, Barbara Schmidinger, Rainer Haas, Udo Jeschke, Sven Kehl, Anne Kathrin Loesslein, S Massberg, Farida Hellal, Ali Ertürk, Markus Sperandio",
        "journal": "bioRxiv",
        "year": 2026,
        "link": "https://doi.org/10.64898/2026.03.16.712023",
    },
    {
        "featured": False,
        "type": "preprint",
        "title": "A Multimodal 3D Foundation Model for Light Sheet Fluorescence Microscopy Enables Few-Shot Segmentation, Classification, and Deblurring",
        "authors": "Adina Scheinfeld, Haotan Zhang, Shang Mu, Rudolf L. M. van Herten, Lucas Stoffl, Ali Ertürk, Zhuhao Wu, Johannes C. Paetzold",
        "journal": "arXiv",
        "year": 2026,
        "link": "https://arxiv.org/abs/2605.26026",
    },
]

MANUAL_TITLE_FIXES = {
    "Microglia in action: how aging and injury can change the brainâ€™s guardians": (
        "Microglia in action: how aging and injury can change the brain's guardians"
    ),
}


def norm_title(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", clean_text(title or "").lower())


def norm_doi(link: str | None) -> str:
    if not link:
        return ""
    link = link.lower().strip()
    for prefix in ("https://doi.org/", "http://doi.org/"):
        if link.startswith(prefix):
            return link[len(prefix) :]
    return link


def clean_text(value: str) -> str:
    text = re.sub(r"</?i>", "", re.sub(r"<[^>]+>", "", value or "")).strip()
    for bad, good in MOJIBAKE_REPLACEMENTS:
        text = text.replace(bad, good)
    return text


def normalize_author_name(name: str) -> str:
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
            names.append(normalize_author_name(name))
    return ", ".join(names)


def fetch_work_by_doi(doi: str) -> dict | None:
    encoded = urllib.parse.quote(f"https://doi.org/{doi}", safe="")
    url = f"https://api.openalex.org/works/{encoded}?select=title,publication_year,doi,authorships,primary_location,type"
    try:
        with urllib.request.urlopen(url) as response:
            return json.load(response)
    except Exception:
        return None


def journal_name(work: dict) -> str:
    location = work.get("primary_location") or {}
    source = location.get("source") or {}
    name = source.get("display_name") or ""
    lower = name.lower()
    if "biorxiv" in lower:
        return "bioRxiv"
    if "medrxiv" in lower:
        return "medRxiv"
    if "arxiv" in lower:
        return "arXiv"
    return name


def resolve_link(pub: dict, work: dict | None) -> str | None:
    if pub.get("link"):
        return pub["link"]
    if not work:
        return None
    doi = work.get("doi")
    if doi:
        return doi
    location = work.get("primary_location") or {}
    return location.get("landing_page_url") or location.get("pdf_url")


def main() -> None:
    with SITE_JSON.open(encoding="utf-8") as handle:
        site = json.load(handle)

    updated_authors = 0
    updated_links = 0
    fixed_encoding = 0

    for pub in site["publications"]:
        original = json.dumps(pub, ensure_ascii=False)

        for old_title, new_title in MANUAL_TITLE_FIXES.items():
            if pub.get("title") == old_title:
                pub["title"] = new_title

        pub["title"] = clean_text(pub.get("title", ""))
        pub["journal"] = clean_text(pub.get("journal", ""))
        pub["authors"] = ", ".join(normalize_author_name(name) for name in pub.get("authors", "").split(","))

        doi = norm_doi(pub.get("link"))
        work = fetch_work_by_doi(doi) if doi and doi.startswith("10.") else None
        time.sleep(0.04)

        if work and not pub.get("featured"):
            authorships = work.get("authorships") or []
            full_authors = format_authors(authorships)
            if full_authors:
                pub["authors"] = full_authors
                updated_authors += 1
            pub["title"] = clean_text(work.get("title") or pub["title"])

            if not pub.get("featured"):
                venue = journal_name(work)
                if venue and venue != "Journal":
                    pub["journal"] = venue

        elif work and pub.get("featured"):
            pub["title"] = clean_text(work.get("title") or pub["title"])

        if pub.get("title") == "Microglia in action: how aging and injury can change the brain's guardians":
            pub["authors"] = "Athanasios Lourbopoulos, Ali Ertürk, Farida Hellal"

        link = resolve_link(pub, work)
        if link and not pub.get("link"):
            pub["link"] = link
            updated_links += 1

        if json.dumps(pub, ensure_ascii=False) != original:
            fixed_encoding += 1

    existing_titles = {norm_title(pub["title"]) for pub in site["publications"]}
    added = 0
    for entry in MANUAL_ADDITIONS:
        entry = {**entry}
        entry["title"] = clean_text(entry["title"])
        entry["authors"] = ", ".join(normalize_author_name(name) for name in entry["authors"].split(","))
        if norm_title(entry["title"]) in existing_titles:
            continue
        site["publications"].append(entry)
        existing_titles.add(norm_title(entry["title"]))
        added += 1

    site["publications"].sort(key=lambda item: (-item["year"], item["title"].lower()))

    with SITE_JSON.open("w", encoding="utf-8") as handle:
        json.dump(site, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    etal = [p for p in site["publications"] if "et al." in p.get("authors", "")]
    no_link = [p for p in site["publications"] if not p.get("link")]
    bad = [p for p in site["publications"] if re.search(r"Ã|â€™|Ertuerk", p.get("title", "") + p.get("authors", ""))]

    print(f"Encoding/field fixes: {fixed_encoding}")
    print(f"Author lists refreshed: {updated_authors}")
    print(f"Links added: {updated_links}")
    print(f"New entries: {added}")
    print(f"Remaining et al.: {len(etal)}")
    print(f"Missing links: {len(no_link)}")
    print(f"Encoding issues left: {len(bad)}")
    if no_link:
        for p in no_link:
            print(f"  no link: {p['title'][:60]}")


if __name__ == "__main__":
    main()
