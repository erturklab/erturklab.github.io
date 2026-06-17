#!/usr/bin/env python3
"""
Sync site.json publications from Ali Ertürk's Google Scholar + OpenAlex.

Run after adding papers to Scholar:
  python3 scripts/sync-publications.py

Preserves featured flags, notes, images, and videoId on existing entries.
Removes preprints when a peer-reviewed version exists. Refreshes author lists.
"""

from __future__ import annotations

import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / "src/content/site.json"
SCHOLAR_USER = "iuRecfkAAAAJ"
OPENALEX_AUTHOR = "A5050828185"
FROM_YEAR = 2015

# Flagship metadata — never overwrite these fields when merging by DOI/title
PRESERVE_KEYS = ("featured", "note", "image", "videoId")

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
    "Voices of biotech",
    "Research briefing",
    "Approaching peak ground truth",
]

PREPRINT_MARKERS = ("biorxiv", "medrxiv", "arxiv", "ssrn", "research square", "protocol exchange")

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

# Fallback when Scholar profile pages are rate-limited (Ali Ertürk profile citations)
SCHOLAR_CITATION_IDS_FALLBACK = [
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

# Known flagship notes by DOI (when Scholar/OpenAlex title differs)
NOTE_BY_DOI: dict[str, str] = {
    "10.1038/s41586-026-10535-2": "MouseMapper",
    "10.1038/s41587-024-02528-1": "SCP-Nano",
    "10.1038/s41587-023-01846-0": "wildDISCO · cover",
    "10.1016/j.cell.2022.11.021": "DISCO-MS · cover",
    "10.1016/j.cell.2019.04.004": "DeepMACT · cover",
    "10.1016/j.cell.2020.01.030": "SHANEL",
    "10.1038/s41592-020-0792-1": "VesSAP",
    "10.1038/s41592-024-02245-2": "DELiVR · Nature Methods cover",
}


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
    if not match:
        return ""
    doi = match.group(0).lower()
    # bioRxiv Scholar links sometimes append .full.pdf or .abstract to the DOI
    return re.sub(r"\.(full\.pdf|abstract|pdf)$", "", doi)


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
    return ", ".join(
        normalize_author((a.get("author") or {}).get("display_name", ""))
        for a in authorships
        if (a.get("author") or {}).get("display_name")
    )


def journal_name(work: dict) -> str:
    source = ((work.get("primary_location") or {}).get("source") or {}).get("display_name") or ""
    lower = source.lower()
    for marker, label in (
        ("biorxiv", "bioRxiv"),
        ("medrxiv", "medRxiv"),
        ("arxiv", "arXiv"),
        ("ssrn", "SSRN"),
        ("research square", "Research Square"),
    ):
        if marker in lower:
            return label
    return clean_text(source) or "Journal"


def is_preprint_work(work: dict) -> bool:
    doi = norm_doi(work.get("doi"))
    venue = journal_name(work).lower()
    return any(m in venue for m in PREPRINT_MARKERS) or doi.startswith("10.1101/") or doi.startswith("10.64898/")


def should_skip_title(title: str) -> bool:
    return any(kw in title for kw in SKIP_TITLE_KEYWORDS)


def fetch_openalex_works() -> list[dict]:
    works: list[dict] = []
    cursor = "*"
    while cursor:
        url = (
            f"https://api.openalex.org/works?"
            f"filter=author.id:{OPENALEX_AUTHOR},from_publication_date:{FROM_YEAR}-01-01"
            f"&per-page=200&sort=publication_date:desc&cursor={cursor}"
        )
        with urllib.request.urlopen(url) as response:
            payload = json.load(response)
        works.extend(payload.get("results", []))
        cursor = payload.get("meta", {}).get("next_cursor")
        time.sleep(0.05)
    return works


def fetch_scholar_citation_ids() -> list[str]:
    """Scrape citation IDs from the public Scholar profile (paginated)."""
    ids: list[str] = []
    for start in range(0, 400, 100):
        url = (
            f"https://scholar.google.com/citations?"
            f"hl=en&user={SCHOLAR_USER}&cstart={start}&pagesize=100"
            f"&view_op=list_works&sortby=pubdate"
        )
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, timeout=25) as response:
                body = response.read().decode("utf-8", errors="replace")
        except Exception as exc:
            print(f"WARN Scholar page cstart={start}: {exc}")
            break
        page_ids = re.findall(rf"citation_for_view={SCHOLAR_USER}:([^&\"]+)", body)
        if not page_ids:
            break
        ids.extend(page_ids)
        time.sleep(1.5)
    if ids:
        return list(dict.fromkeys(ids))
    print("  Using fallback citation ID list (Scholar rate-limited)")
    return SCHOLAR_CITATION_IDS_FALLBACK


def fetch_scholar_citation(cid: str) -> dict | None:
    url = (
        f"https://scholar.google.com/citations?view_op=view_citation&hl=en"
        f"&user={SCHOLAR_USER}&citation_for_view={SCHOLAR_USER}:{cid}"
    )
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            body = response.read().decode("utf-8", errors="replace")
    except Exception:
        return None

    title_match = re.search(r'<div id="gsc_oci_title"[^>]*><a[^>]*>([^<]+)</a>', body)
    title = clean_text(title_match.group(1)) if title_match else None
    if not title or should_skip_title(title):
        return None

    fields = re.findall(
        r'<div class="gsc_oci_field">([^<]+)</div>\s*<div class="gsc_oci_value">(.*?)</div>',
        body,
        re.S,
    )
    meta = {clean_text(k): clean_text(re.sub(r"<[^>]+>", " ", v)) for k, v in fields}
    year_match = re.search(r"(\d{4})", meta.get("Publication date", ""))
    link = None
    for href in re.findall(r'href="([^"]+)"', body):
        if re.search(r"10\.\d{4,9}/", href, re.I):
            link = f"https://doi.org/{norm_doi(href)}"
            break

    journal = meta.get("Journal") or meta.get("Conference") or "Journal"
    preprint = any(m in journal.lower() for m in PREPRINT_MARKERS)

    return {
        "title": title,
        "authors": ", ".join(
            normalize_author(n.strip())
            for n in re.sub(r"\*+", "", meta.get("Authors", "")).split(",")
            if n.strip()
        ),
        "journal": journal,
        "year": int(year_match.group(1)) if year_match else 0,
        "link": link,
        "type": "preprint" if preprint else None,
    }


def fetch_openalex_by_doi(doi: str) -> dict | None:
    encoded = urllib.parse.quote(f"https://doi.org/{doi}", safe="")
    url = f"https://api.openalex.org/works/{encoded}?select=title,publication_year,doi,authorships,primary_location,type"
    try:
        with urllib.request.urlopen(url) as response:
            return json.load(response)
    except Exception:
        return None


def work_to_entry(work: dict, *, preprint: bool = False) -> dict:
    doi = norm_doi(work.get("doi"))
    entry: dict = {
        "featured": False,
        "title": clean_text(work.get("title") or ""),
        "authors": format_authors(work.get("authorships") or []),
        "journal": journal_name(work),
        "year": work.get("publication_year") or 0,
    }
    if work.get("doi"):
        entry["link"] = work["doi"]
    if preprint or is_preprint_work(work):
        entry["type"] = "preprint"
    if doi in NOTE_BY_DOI:
        entry["note"] = NOTE_BY_DOI[doi]
    return entry


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
    if raw.get("type") == "preprint":
        entry["type"] = "preprint"
    doi = norm_doi(raw.get("link"))
    if doi in NOTE_BY_DOI:
        entry["note"] = NOTE_BY_DOI[doi]
    if doi:
        work = fetch_openalex_by_doi(doi)
        time.sleep(0.04)
        if work:
            entry.update(work_to_entry(work, preprint=entry.get("type") == "preprint"))
            for key in ("featured", "note", "image", "videoId"):
                if key in entry and key not in PRESERVE_KEYS:
                    pass
    return entry


def merge_preserve(existing: dict | None, incoming: dict) -> dict:
    if not existing:
        return incoming
    merged = {**incoming}
    for key in PRESERVE_KEYS:
        if existing.get(key):
            merged[key] = existing[key]
    if existing.get("featured") and merged.get("type") == "preprint":
        merged.pop("type", None)
    return merged


def index_publications(pubs: list[dict]) -> tuple[dict[str, dict], dict[str, dict]]:
    by_doi: dict[str, dict] = {}
    by_title: dict[str, dict] = {}
    for pub in pubs:
        doi = norm_doi(pub.get("link"))
        if doi:
            by_doi[doi] = pub
        by_title[norm_title(pub.get("title", ""))] = pub
    return by_doi, by_title


def upsert(entry: dict, pubs: list[dict], by_doi: dict, by_title: dict) -> bool:
    doi = norm_doi(entry.get("link"))
    nt = norm_title(entry.get("title", ""))
    existing = by_doi.get(doi) if doi else by_title.get(nt)
    merged = merge_preserve(existing, entry)
    if existing:
        existing.update(merged)
        return False
    pubs.append(merged)
    if doi:
        by_doi[doi] = merged
    by_title[nt] = merged
    return True


def deduplicate_publications(pubs: list[dict]) -> tuple[list[dict], int]:
    """Merge entries that share the same normalized DOI or title+year."""
    kept: list[dict] = []
    by_key: dict[str, dict] = {}
    removed = 0

    def link_score(link: str | None) -> int:
        if not link:
            return 0
        if re.search(r"\.(full\.pdf|abstract|pdf)$", link, re.I):
            return 1
        return 2

    for pub in pubs:
        doi = norm_doi(pub.get("link"))
        key = doi if doi else f"{norm_title(pub.get('title', ''))}|{pub.get('year')}"
        existing = by_key.get(key)
        if existing:
            merged = merge_preserve(existing, pub)
            if link_score(pub.get("link")) > link_score(existing.get("link")):
                merged["link"] = pub["link"]
            if len(pub.get("authors", "")) > len(existing.get("authors", "")):
                merged["authors"] = pub["authors"]
            existing.update(merged)
            removed += 1
            continue
        by_key[key] = pub
        kept.append(pub)
    return kept, removed


def is_superseded_preprint(pub: dict, published: list[dict]) -> bool:
    if pub.get("type") != "preprint":
        return False
    return any(similar(pub.get("title", ""), p.get("title", ""), 0.35) for p in published)


def main() -> None:
    with SITE_JSON.open(encoding="utf-8") as handle:
        site = json.load(handle)

    publications = site["publications"]
    by_doi, by_title = index_publications(publications)

    added_openalex = 0
    print("Fetching OpenAlex works…")
    for work in fetch_openalex_works():
        if should_skip_title(work.get("title") or ""):
            continue
        wtype = work.get("type") or ""
        if wtype not in ("article", "review", "letter", "preprint", "book-chapter") and not is_preprint_work(work):
            continue
        entry = work_to_entry(work, preprint=is_preprint_work(work))
        if upsert(entry, publications, by_doi, by_title):
            added_openalex += 1

    added_scholar = 0
    print("Fetching Google Scholar citation IDs…")
    scholar_ids = fetch_scholar_citation_ids()
    print(f"  Found {len(scholar_ids)} citation IDs")
    for index, cid in enumerate(scholar_ids, 1):
        raw = fetch_scholar_citation(cid)
        time.sleep(2.0)
        if not raw:
            continue
        entry = scholar_to_entry(raw)
        if upsert(entry, publications, by_doi, by_title):
            added_scholar += 1
        if index % 25 == 0:
            print(f"  … {index}/{len(scholar_ids)}")

    published = [p for p in publications if p.get("type") != "preprint"]
    kept: list[dict] = []
    removed_preprints = 0
    for pub in publications:
        pub["title"] = clean_text(pub.get("title", ""))
        pub["journal"] = clean_text(pub.get("journal", ""))
        pub["authors"] = ", ".join(
            normalize_author(n) for n in pub.get("authors", "").split(",") if n.strip()
        )
        if is_superseded_preprint(pub, published):
            removed_preprints += 1
            continue
        kept.append(pub)

    kept, removed_dupes = deduplicate_publications(kept)
    kept.sort(key=lambda p: (-p["year"], p["title"].lower()))
    site["publications"] = kept

    with SITE_JSON.open("w", encoding="utf-8") as handle:
        json.dump(site, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    published = [p for p in kept if p.get("type") != "preprint"]
    preprints = [p for p in kept if p.get("type") == "preprint"]
    featured = [p for p in kept if p.get("featured")]
    mm = [p for p in kept if "10535" in (p.get("link") or "") or (p.get("note") or "").lower() == "mousemapper"]

    print(f"\nAdded from OpenAlex: {added_openalex}")
    print(f"Added from Scholar: {added_scholar}")
    print(f"Removed superseded preprints: {removed_preprints}")
    print(f"Removed duplicate entries: {removed_dupes}")
    print(f"Total: {len(kept)} ({len(published)} published, {len(preprints)} preprints, {len(featured)} featured)")
    print(f"MouseMapper entries: {len(mm)}")
    for p in mm:
        print(f"  {p['year']} featured={p.get('featured')} note={p.get('note')} | {p['title'][:55]}")


if __name__ == "__main__":
    main()
