#!/usr/bin/env python3
"""Merge Helmholtz-era publications from OpenAlex into site.json without touching featured entries."""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / "src" / "content" / "site.json"
AUTHOR_ID = "A5050828185"
FROM_YEAR = 2015

SKIP_TITLE_KEYWORDS = [
    "Figure",
    "Table",
    "Data from",
    "Author Correction",
    "Erratum",
    "Publisher Correction",
    "Patent",
    "KİSTİK",
    "laminoforaminotomy",
    "Juxtafacet",
    "METGAN",
    "TMOD-24",
]

SKIP_VENUE_KEYWORDS = ["Conference", "IEEE", "eBooks", "Protocol Exchange"]


def norm_title(title: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (title or "").lower())


def norm_doi(link: str | None) -> str:
    if not link:
        return ""
    return link.lower().replace("https://doi.org/", "").strip()


def fetch_works() -> list[dict]:
    url = (
        f"https://api.openalex.org/works?"
        f"filter=author.id:{AUTHOR_ID},from_publication_date:{FROM_YEAR}-01-01"
        f"&per-page=200&sort=publication_date:desc"
    )
    with urllib.request.urlopen(url) as response:
        return json.load(response)["results"]


def format_authors(authorships: list[dict]) -> str:
    names: list[str] = []
    for authorship in authorships:
        author = authorship.get("author") or {}
        name = author.get("display_name")
        if name:
            names.append(name)
    return ", ".join(names)


def journal_name(work: dict) -> str:
    location = work.get("primary_location") or {}
    source = location.get("source") or {}
    name = source.get("display_name") or ""
    if "biorxiv" in name.lower():
        return "bioRxiv"
    if "medrxiv" in name.lower():
        return "medRxiv"
    return name or "Journal"


def is_preprint_work(work: dict) -> bool:
    doi = work.get("doi") or ""
    venue = journal_name(work).lower()
    return "biorxiv" in venue or "medrxiv" in venue or "10.1101" in doi


def should_skip_work(work: dict) -> bool:
    title = work.get("title") or ""
    if any(keyword in title for keyword in SKIP_TITLE_KEYWORDS):
        return True
    venue = journal_name(work)
    if any(keyword in venue for keyword in SKIP_VENUE_KEYWORDS):
        return True
    if is_preprint_work(work):
        return False
    return (work.get("type") or "") not in ("article", "review", "letter")


def work_to_entry(work: dict, *, preprint: bool) -> dict:
    entry: dict = {
        "featured": False,
        "title": work["title"],
        "authors": format_authors(work.get("authorships") or []),
        "journal": journal_name(work),
        "year": work.get("publication_year") or 0,
    }
    doi = work.get("doi")
    if doi:
        entry["link"] = doi
    if preprint:
        entry["type"] = "preprint"
    return entry


SUPERSEDED_PREPRINT_DOIS = {
    "10.1101/2024.08.18.608300",  # MouseMapper
    "10.1101/2023.07.24.550304",  # SCP-Nano precursor
    "10.1101/2023.02.17.528921",  # wildDISCO
    "10.1101/2021.12.24.473988",  # skull bone marrow
    "10.1101/2021.11.02.466753",  # DISCO-MS
    "10.1101/2023.06.16.545256",  # mesoSPIM
    "10.643908",  # SHANEL
    "10.541862",  # DeepMACT
    "10.374785",  # vDISCO
    "10.1101/2019.12.29.889873",  # ocular glymphatic
}


def clean_title(title: str) -> str:
    return re.sub(r"</?i>", "", re.sub(r"<[^>]+>", "", title or "")).strip()


def is_superseded_preprint(work: dict, published_titles: list[str]) -> bool:
    doi = norm_doi(work.get("doi"))
    if doi in SUPERSEDED_PREPRINT_DOIS:
        return True
    title = clean_title(work.get("title") or "")
    for published in published_titles:
        if titles_match(title, published):
            return True
    return False


def titles_match(a: str, b: str) -> bool:
    na, nb = norm_title(a), norm_title(b)
    if not na or not nb:
        return False
    if na == nb:
        return True
    shorter, longer = (na, nb) if len(na) <= len(nb) else (nb, na)
    return len(shorter) >= 40 and shorter in longer


def main() -> None:
    with SITE_JSON.open(encoding="utf-8") as handle:
        site = json.load(handle)

    existing = site["publications"]
    existing_by_title = {norm_title(pub["title"]): pub for pub in existing}
    existing_dois = {norm_doi(pub.get("link")) for pub in existing if pub.get("link")}

    published_titles = [pub["title"] for pub in existing if pub.get("type") != "preprint"]

    added_pubs = 0
    added_preprints = 0
    seen_titles: set[str] = set(existing_by_title)

    for work in fetch_works():
        if should_skip_work(work):
            continue

        title = work.get("title") or ""
        nt = norm_title(title)
        doi = norm_doi(work.get("doi"))

        if nt in existing_by_title or (doi and doi in existing_dois):
            continue

        # Skip duplicate JoVE protocol variants
        if nt in seen_titles:
            continue

        preprint = is_preprint_work(work)
        if preprint:
            title = clean_title(work.get("title") or "")
            if is_superseded_preprint(work, published_titles):
                continue
            entry = work_to_entry(work, preprint=True)
            entry["title"] = title
            existing.append(entry)
            added_preprints += 1
            seen_titles.add(nt)
            continue

        entry = work_to_entry(work, preprint=False)
        existing.append(entry)
        published_titles.append(title)
        added_pubs += 1
        seen_titles.add(nt)
        if doi:
            existing_dois.add(doi)

    existing.sort(key=lambda pub: (-pub["year"], pub["title"].lower()))

    with SITE_JSON.open("w", encoding="utf-8") as handle:
        json.dump(site, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    published = [p for p in existing if p.get("type") != "preprint"]
    preprints = [p for p in existing if p.get("type") == "preprint"]
    featured = [p for p in existing if p.get("featured")]

    print(f"Added publications: {added_pubs}")
    print(f"Added preprints: {added_preprints}")
    print(f"Total: {len(existing)} ({len(published)} published, {len(preprints)} preprints, {len(featured)} featured)")


if __name__ == "__main__":
    main()
