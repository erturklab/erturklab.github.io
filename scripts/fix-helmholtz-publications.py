#!/usr/bin/env python3
"""Keep Helmholtz Munich-era publications only and expand full author lists."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / "src" / "content/site.json"

MUNICH_MARKERS = (
    "helmholtz",
    "dzne",
    "isd",
    "ibio",
    "neuherberg",
    "stroke and dementia",
    "synergy",
    "ludwig maxim",
    "lmu",
    "munich medical",
    "planegg",
    "martinsried",
    "klinikum der universität münchen",
    "klinikum der universitat munchen",
)

GENENTECH_MARKERS = ("genentech", "south san francisco")

# Genentech / pre-Munich lab — always remove
FORCE_REMOVE_DOIS = {
    "10.1038/nprot.2012.119",
    "10.1016/j.expneurol.2012.10.018",
    "10.1098/rstb.2013.0138",
    "10.1016/j.neuron.2014.05.027",
    "10.3791/51382",
    "10.3791/51382-v",
    "10.1523/jneurosci.3121-13.2014",
}


def norm_doi(link: str | None) -> str:
    if not link:
        return ""
    return link.lower().replace("https://doi.org/", "").strip()


def clean_title(title: str) -> str:
    return re.sub(r"</?i>", "", re.sub(r"<[^>]+>", "", title or "")).strip()


def format_authors(authorships: list[dict]) -> str:
    names: list[str] = []
    for authorship in authorships:
        author = authorship.get("author") or {}
        name = author.get("display_name")
        if name:
            names.append(name)
    return ", ".join(names)


def ali_affiliation_text(authorship: dict) -> str:
    parts: list[str] = []
    for inst in authorship.get("institutions") or []:
        parts.append(inst.get("display_name") or "")
    parts.extend(authorship.get("raw_affiliation_strings") or [])
    return " ".join(parts).lower()


def is_erturk(authorship: dict) -> bool:
    name = (authorship.get("author") or {}).get("display_name") or ""
    return "ert" in name.lower() and "k" in name.lower()


def is_helmholtz_munich_work(work: dict) -> bool:
    doi = norm_doi(work.get("doi"))
    if doi in FORCE_REMOVE_DOIS:
        return False

    erturk_affiliations: list[str] = []
    for authorship in work.get("authorships") or []:
        if not is_erturk(authorship):
            continue
        erturk_affiliations.append(ali_affiliation_text(authorship))

    if not erturk_affiliations:
        # Manual entries or missing metadata — keep if year >= 2015
        year = work.get("publication_year") or 0
        return year >= 2015

    combined = " ".join(erturk_affiliations)
    has_munich = any(marker in combined for marker in MUNICH_MARKERS)
    has_genentech = any(marker in combined for marker in GENENTECH_MARKERS)

    if has_genentech and not has_munich:
        return False
    if has_munich:
        return True

    # No Munich marker but also not Genentech-only — allow recent collaborations
    year = work.get("publication_year") or 0
    return year >= 2015


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
    if "biorxiv" in name.lower():
        return "bioRxiv"
    if "medrxiv" in name.lower():
        return "medRxiv"
    return name


def main() -> None:
    with SITE_JSON.open(encoding="utf-8") as handle:
        site = json.load(handle)

    kept: list[dict] = []
    removed: list[str] = []
    updated_authors = 0

    for pub in site["publications"]:
        doi = norm_doi(pub.get("link"))
        work = fetch_work_by_doi(doi) if doi else None
        time.sleep(0.05)

        if work and not is_helmholtz_munich_work(work):
            removed.append(pub["title"])
            continue

        if not work and doi in FORCE_REMOVE_DOIS:
            removed.append(pub["title"])
            continue

        if not work and pub.get("year", 0) < 2015 and pub.get("type") != "preprint":
            removed.append(pub["title"])
            continue

        if work:
            authorships = work.get("authorships") or []
            full_authors = format_authors(authorships)
            if full_authors and not pub.get("featured"):
                pub["authors"] = full_authors
                updated_authors += 1

            pub["title"] = clean_title(work.get("title") or pub["title"])
            if not pub.get("featured"):
                venue = journal_name(work)
                if venue and venue != "Journal":
                    pub["journal"] = venue

        pub["title"] = clean_title(pub.get("title", ""))
        kept.append(pub)

    kept.sort(key=lambda item: (-item["year"], item["title"].lower()))

    site["publications"] = kept
    with SITE_JSON.open("w", encoding="utf-8") as handle:
        json.dump(site, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    published = [p for p in kept if p.get("type") != "preprint"]
    preprints = [p for p in kept if p.get("type") == "preprint"]
    etal = [p for p in kept if "et al." in p.get("authors", "")]
    featured = [p for p in kept if p.get("featured")]

    print(f"Removed: {len(removed)}")
    for title in removed:
        print(f"  - {title[:75]}")
    print(f"Updated author lists: {updated_authors}")
    print(f"Remaining et al.: {len(etal)}")
    print(f"Total: {len(kept)} ({len(published)} published, {len(preprints)} preprints, {len(featured)} featured)")


if __name__ == "__main__":
    main()
