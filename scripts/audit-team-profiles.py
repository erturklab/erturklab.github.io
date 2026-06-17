#!/usr/bin/env python3
"""Verify lab-wide publication and project linkage for team profiles and project pages."""

from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEAM = json.loads((ROOT / "src/content/team.json").read_text())
SITE = json.loads((ROOT / "src/content/site.json").read_text())

NOTE_TO_PROJECT = {
    "scp nano": "scp-nano",
    "wilddisco": "wilddisco",
    "wilddisco cover": "wilddisco",
    "disco ms": "disco-ms",
    "disco ms cover": "disco-ms",
    "disco seq": "disco-ms",
    "shanel": "shanel",
    "deepmact": "deepmact",
    "deepmact cover": "deepmact",
    "vdisco cover": "deepmact",
    "mousemapper": "mousemapper",
    "vessap": "vessap",
    "lipigo": "scp-nano",
    "udisco cover": "wilddisco",
}

PROJECT_DOI = {}
for project in SITE["technologies"]:
    match = re.search(r"10\.\d{4,9}/[-._;()/:A-Z0-9]+", project.get("link", "") or "", re.I)
    if match:
        PROJECT_DOI[match.group(0).lower()] = project["id"]

ASCII_FOLDS = {"\u0131": "i", "\u00fc": "ue", "\u00f6": "oe", "\u00e4": "ae", "\u00df": "ss", "\u015f": "s", "\u011f": "g"}
EXPLICIT = {
    "ali erturk": "ali-maximilian-erturk",
    "harsharan singh bhatia": "harsharan-bhatia",
    "harsharan s bhatia": "harsharan-bhatia",
    "mihail ivilinov todorov": "mihail-todorov",
    "mihail todorov": "mihail-todorov",
    "louis b kuemmerle": "louis-kuemmerle",
    "laurent h a simons": "laurent-simons",
    "david paul minde": "david-paul-minde",
    "ceren kimna": "ceren-kimna",
    "luciano hoeher": "luciano-hoeher",
    "luciano hoher": "luciano-hoeher",
}


def fold(value: str) -> str:
    return "".join(ASCII_FOLDS.get(char, char) for char in value)


def normalize(value: str) -> str:
    s = fold(value)
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def norm_note(value: str | None) -> str:
    s = unicodedata.normalize("NFD", value or "")
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def build_author_index() -> dict[str, str]:
    index = {normalize(k): v for k, v in EXPLICIT.items()}
    for member in TEAM:
        if member.get("profileTier") != "page":
            continue
        for name in member.get("publicationAuthorNames", []):
            index[normalize(name)] = member["slug"]
        index[normalize(member["name"])] = member["slug"]
    return index


INDEX = build_author_index()


def resolve_author(author: str) -> str | None:
    return INDEX.get(normalize(author))


def resolve_project(pub: dict) -> str | None:
    note = pub.get("note")
    if note:
        key = norm_note(note)
        candidate = NOTE_TO_PROJECT.get(key)
        if not candidate:
            for project in SITE["technologies"]:
                project_name = norm_note(project["name"])
                if project_name in key or key in project_name:
                    candidate = project["id"]
                    break
        if candidate:
            return candidate
    link = pub.get("link") or ""
    match = re.search(r"10\.\d{4,9}/[-._;()/:A-Z0-9]+", link, re.I)
    if match and match.group(0).lower() in PROJECT_DOI:
        return PROJECT_DOI[match.group(0).lower()]
    return None


def main() -> None:
    pubs = SITE["publications"]
    page_members = [m for m in TEAM if m.get("profileTier") == "page"]

    print(f"Publications: {len(pubs)}")
    print(f"Projects: {len(SITE['technologies'])}")
    print(f"Page-tier team: {len(page_members)}\n")

    for member in sorted(page_members, key=lambda m: m["name"]):
        slug = member["slug"]
        member_pubs = [
            pub
            for pub in pubs
            if any(resolve_author(author.strip()) == slug for author in pub.get("authors", "").split(","))
        ]
        projects = {resolve_project(pub) for pub in member_pubs if resolve_project(pub)}
        print(
            f"{member['name']:<28} pubs={len(member_pubs):2d}  projects={len(projects)}  "
            f"authorNames={len(member.get('publicationAuthorNames', []))}"
        )

    print("\nProject pages:")
    for project in SITE["technologies"]:
        linked = [pub for pub in pubs if resolve_project(pub) == project["id"]]
        members = {
            resolve_author(author.strip())
            for pub in linked
            for author in pub.get("authors", "").split(",")
            if resolve_author(author.strip())
        }
        print(f"  {project['name']:<12} {len(linked)} papers  {len(members)} lab members")


if __name__ == "__main__":
    main()
