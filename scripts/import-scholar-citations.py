#!/usr/bin/env python3
"""Import Ali Ertürk Google Scholar citations into site.json (Helmholtz/iBIO era list)."""

from __future__ import annotations

import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / "src" / "content" / "site.json"
SCHOLAR_USER = "iuRecfkAAAAJ"

CITATION_IDS = [
    "kVjdVfd2voEC", "F2UWTTQJPOcC", "IaI1MmNe2tcC", "j7_hQOaDUrUC", "WHdLCjDvYFkC",
    "MhiOAD_qIWkC", "1yWc8FF-_SYC", "7wO8s98CvbsC", "HGTzPopzzJcC", "L1USKYWJimsC",
    "-mN3Mh-tlDkC", "3NQIlFlcGxIC", "WC9gN4BGCRcC", "XUvXOeBm_78C", "AXkvAH5U_nMC",
    "6_hjMsCP8ZoC", "-7ulzOJl1JYC", "QyXJ3EUuO1IC", "X9ykpCP0fEIC", "SjuI4pbJlxcC",
    "jFemdcug13IC", "g5Ck-dwhA_QC", "wE-fMHVdjMkC", "1Ye0OR6EYb4C", "PyEswDtIyv0C",
    "-jrNzM816MMC", "sszUF3NjhM4C", "RoXSNcbkSzsC", "1DsIQWDZLl8C", "U_HPUtbDl20C",
    "HhcuHIWmDEUC", "FiDNX6EVdGUC", "w1MjKQ0l0TYC", "KNjnJ3z-R6IC", "pAkWuXOU-OoC",
    "O0nohqN1r9EC", "w0F2JDEymm0C", "YsrPvlHIBpEC", "mUJArPsKIAAC", "kzcSZmkxUKAC",
    "kF1pexMAQbMC", "BrOSOlqYqPUC", "5bg8sr1QxYwC", "kJDgFkosVoMC", "-nhnvRiOwuoC",
    "rTD5ala9j4wC", "mWEH9CqjF64C", "69ZgNCALVd0C", "SnGPuo6Feq8C", "TlpoogIpr_IC",
    "EPG8bYD4jVwC", "rbm3iO8VlycC", "IsPWOBWtZBwC", "jSAVyFp_754C", "UuEBAcK4md4C",
    "hSRAE-fF4OAC", "v6i8RKmR8ToC", "-DxkuPiZhfEC", "27LrP4qxOz0C", "qwy9JoKyICEC",
    "Hck25ST_3aIC", "2v_ZtQDX9iAC", "zGdJYJv2LkUC", "LXmCCkuhhTsC", "aIdbFUkbNIkC",
    "silx2ntsSuwC", "65Yg0jNCQDAC", "sA9dB-pw3HoC", "SIv7DqKytYAC", "ziOE8S1-AIUC",
    "UmS_249rOGwC", "CYCckWUYoCcC", "L_l9e5I586QC", "DyXnQzXoVgIC", "Xz60mAmATU4C",
    "QsaTk4IG4EwC", "ghEM2AJqZyQC", "eGYfIraVYiQC", "0aBXIfxlw9sC", "RJOyoaXV5v8C",
    "eAlLMO4JVmQC", "zdjWy_NXXwUC", "AYInfyleIOsC", "A8cqit5AE6sC", "__bU50VfleQC",
    "qE4H1tSSYIIC", "isU91gLudPYC", "C33y2ycGS3YC", "D_tqNUsBuKoC", "tHtfpZlB6tUC",
    "T_ojBgVMvoEC", "SAZ1SQo2q1kC", "-6RzNnnwWf8C", "c1e4I3QdEKYC", "unp9ATQDT5gC",
    "EsEWqaRxkBgC",
]

SKIP_TITLE_KEYWORDS = [
    "Author Correction",
    "Publisher Correction",
    "Erratum",
    "Figure ",
    "Table ",
    "Data from ",
    "Supplementary Data",
    "KİSTİK",
    "laminoforaminotomy",
    "Juxtafacet",
    "TMOD-24",
    "SELMA3D 2025 challenge",
]

PREPRINT_VENUES = ("biorxiv", "medrxiv", "arxiv", "ssrn", "research square", "protocol exchange")

MOJIBAKE = (
    ("â€™", "'"),
    ("â€˜", "'"),
    ("â€œ", '"'),
    ("â€", '"'),
    ("Ã¼", "ü"),
    ("Ã¶", "ö"),
    ("Ã¤", "ä"),
    ("ÃŸ", "ß"),
    ("Ali Ertuerk", "Ali Ertürk"),
)

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}


def clean_text(value: str) -> str:
    text = re.sub(r"</?i>", "", re.sub(r"<[^>]+>", "", value or "")).strip()
    for bad, good in MOJIBAKE:
        text = text.replace(bad, good)
    return html.unescape(text)


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
    if len(ta & tb) / len(ta | tb) >= threshold:
        return True
    sa, sb = norm_title(a), norm_title(b)
    return (len(sa) >= 30 and sa[:30] in sb) or (len(sb) >= 30 and sb[:30] in sa)


def normalize_authors(raw: str) -> str:
    raw = clean_text(raw)
    raw = re.sub(r"\*+", "", raw)
    parts = [p.strip() for p in raw.split(",") if p.strip()]
    out = []
    for name in parts:
        key = re.sub(r"[^a-z ]", "", name.lower()).strip()
        if key in {"ali erturk", "ali ertuerk"}:
            out.append("Ali Ertürk")
        else:
            out.append(name)
    return ", ".join(out)


def extract_link(body: str) -> str | None:
    for href in re.findall(r'href="([^"]+)"', body):
        if re.search(r"10\.\d{4,9}/", href, re.I):
            doi = norm_doi(href)
            return f"https://doi.org/{doi}"
    return None


def parse_year(date_str: str) -> int:
    match = re.search(r"(\d{4})", date_str or "")
    return int(match.group(1)) if match else 0


def is_preprint_venue(journal: str, link: str | None) -> bool:
    lower = journal.lower()
    if any(v in lower for v in PREPRINT_VENUES):
        return True
    doi = norm_doi(link)
    return doi.startswith("10.1101/") or doi.startswith("10.64898/")


def fetch_citation(cid: str) -> dict | None:
    url = (
        f"https://scholar.google.com/citations?view_op=view_citation&hl=en"
        f"&user={SCHOLAR_USER}&citation_for_view={SCHOLAR_USER}:{cid}"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            body = response.read().decode("utf-8", errors="replace")
    except Exception as exc:
        print(f"WARN fetch {cid}: {exc}")
        return None

    title_match = re.search(r'<div id="gsc_oci_title"[^>]*><a[^>]*>([^<]+)</a>', body)
    title = clean_text(title_match.group(1)) if title_match else None
    if not title:
        return None

    fields = re.findall(
        r'<div class="gsc_oci_field">([^<]+)</div>\s*<div class="gsc_oci_value">(.*?)</div>',
        body,
        re.S,
    )
    meta = {
        clean_text(k): clean_text(re.sub(r"<[^>]+>", " ", v))
        for k, v in fields
    }

    journal = meta.get("Journal") or meta.get("Conference") or meta.get("Publisher") or "Journal"
    year = parse_year(meta.get("Publication date", ""))
    authors = normalize_authors(meta.get("Authors", ""))
    link = extract_link(body)

    return {
        "scholar_id": cid,
        "title": title,
        "authors": authors,
        "journal": journal,
        "year": year,
        "link": link,
    }


def fetch_openalex_authors(doi: str) -> str | None:
    encoded = urllib.parse.quote(f"https://doi.org/{doi}", safe="")
    url = f"https://api.openalex.org/works/{encoded}?select=authorships,title,publication_year,primary_location"
    try:
        with urllib.request.urlopen(url) as response:
            work = json.load(response)
    except Exception:
        return None
    names = []
    for authorship in work.get("authorships") or []:
        name = (authorship.get("author") or {}).get("display_name")
        if name:
            key = re.sub(r"[^a-z ]", "", name.lower()).strip()
            names.append("Ali Ertürk" if key in {"ali erturk", "ali ertuerk"} else name)
    return ", ".join(names) if names else None


def enrich_from_openalex(entry: dict) -> None:
    doi = norm_doi(entry.get("link"))
    if not doi:
        return
    encoded = urllib.parse.quote(f"https://doi.org/{doi}", safe="")
    url = f"https://api.openalex.org/works/{encoded}?select=authorships,title,publication_year,primary_location,type"
    try:
        with urllib.request.urlopen(url) as response:
            work = json.load(response)
    except Exception:
        return
    full_authors = fetch_openalex_authors(doi)
    if full_authors:
        entry["authors"] = full_authors
    entry["title"] = clean_text(work.get("title") or entry["title"])
    if work.get("publication_year"):
        entry["year"] = work["publication_year"]
    source = ((work.get("primary_location") or {}).get("source") or {}).get("display_name") or ""
    lower = source.lower()
    if "biorxiv" in lower:
        entry["journal"] = "bioRxiv"
    elif "medrxiv" in lower:
        entry["journal"] = "medRxiv"
    elif "arxiv" in lower:
        entry["journal"] = "arXiv"
    elif source and entry.get("type") != "preprint":
        entry["journal"] = clean_text(source)


def scholar_to_entry(raw: dict) -> dict:
    entry: dict = {
        "featured": False,
        "title": raw["title"],
        "authors": raw["authors"],
        "journal": raw["journal"],
        "year": raw["year"],
    }
    if raw.get("link"):
        entry["link"] = raw["link"]
    if is_preprint_venue(raw["journal"], raw.get("link")):
        entry["type"] = "preprint"
    enrich_from_openalex(entry)
    return entry


def should_skip_title(title: str) -> bool:
    return any(keyword in title for keyword in SKIP_TITLE_KEYWORDS)


def is_superseded_preprint(pub: dict, published: list[dict]) -> bool:
    title = pub.get("title") or ""
    for paper in published:
        if similar(title, paper.get("title") or "", 0.35):
            return True
    return False


def preserve_featured(existing: dict, incoming: dict) -> dict:
    """Keep featured flag, note, image, videoId from existing flagship entries."""
    for key in ("featured", "note", "image", "videoId"):
        if existing.get(key):
            incoming[key] = existing[key]
    if existing.get("type") != "preprint" and incoming.get("type") == "preprint":
        incoming.pop("type", None)
    return incoming


def main() -> None:
    with SITE_JSON.open(encoding="utf-8") as handle:
        site = json.load(handle)

    publications = site["publications"]
    by_title = {norm_title(p["title"]): p for p in publications}
    by_doi = {norm_doi(p.get("link")): p for p in publications if p.get("link")}

    scholar_entries: list[dict] = []
    seen_scholar_titles: set[str] = set()

    print(f"Fetching {len(CITATION_IDS)} Scholar citations...")
    for index, cid in enumerate(CITATION_IDS, 1):
        raw = fetch_citation(cid)
        time.sleep(0.35)
        if not raw:
            continue
        if should_skip_title(raw["title"]):
            print(f"SKIP: {raw['title'][:70]}")
            continue
        nt = norm_title(raw["title"])
        if nt in seen_scholar_titles:
            continue
        seen_scholar_titles.add(nt)
        scholar_entries.append(raw)
        if index % 20 == 0:
            print(f"  ... {index}/{len(CITATION_IDS)}")

    added = 0
    updated = 0
    for raw in scholar_entries:
        entry = scholar_to_entry(raw)
        nt = norm_title(entry["title"])
        doi = norm_doi(entry.get("link"))

        if nt in by_title:
            merged = preserve_featured(by_title[nt], entry)
            if merged != by_title[nt]:
                by_title[nt].update({k: v for k, v in merged.items() if k != "featured" or merged.get("featured")})
                updated += 1
            continue
        if doi and doi in by_doi:
            continue

        publications.append(entry)
        by_title[nt] = entry
        if doi:
            by_doi[doi] = entry
        added += 1
        print(f"ADD: {entry['year']} {entry.get('type', 'pub')} {entry['title'][:65]}")

    published = [p for p in publications if p.get("type") != "preprint"]
    kept: list[dict] = []
    removed_preprints: list[str] = []

    for pub in publications:
        pub["title"] = clean_text(pub.get("title", ""))
        pub["journal"] = clean_text(pub.get("journal", ""))
        pub["authors"] = ", ".join(
            normalize_authors(name) for name in pub.get("authors", "").split(",") if name.strip()
        )
        if pub.get("type") == "preprint" and is_superseded_preprint(pub, published):
            removed_preprints.append(pub["title"])
            continue
        kept.append(pub)

    kept.sort(key=lambda item: (-item["year"], item["title"].lower()))
    site["publications"] = kept

    with SITE_JSON.open("w", encoding="utf-8") as handle:
        json.dump(site, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    published = [p for p in kept if p.get("type") != "preprint"]
    preprints = [p for p in kept if p.get("type") == "preprint"]
    featured = [p for p in kept if p.get("featured")]

    print(f"\nScholar entries parsed: {len(scholar_entries)}")
    print(f"Added: {added}, Updated metadata: {updated}")
    print(f"Removed superseded preprints: {len(removed_preprints)}")
    for title in removed_preprints:
        print(f"  - {title[:75]}")
    print(f"Total: {len(kept)} ({len(published)} published, {len(preprints)} preprints, {len(featured)} featured)")


if __name__ == "__main__":
    main()
