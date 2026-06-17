#!/usr/bin/env python3
"""Sync publicationAuthorNames in team.json from all publications in site.json."""

from __future__ import annotations

import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEAM_PATH = ROOT / "src/content/team.json"
SITE_PATH = ROOT / "src/content/site.json"

ASCII_FOLDS = {
    "\u0131": "i",
    "\u00fc": "ue",
    "\u00f6": "oe",
    "\u00e4": "ae",
    "\u00df": "ss",
    "\u015f": "s",
    "\u011f": "g",
}

EXPLICIT = {
    "ali erturk": "ali-maximilian-erturk",
    "ali ertürk": "ali-maximilian-erturk",
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


def format_full(member: dict) -> str:
    return " ".join(filter(None, [member.get("title"), member.get("name")]))


def last_name(value: str) -> str:
    parts = normalize(value).split()
    return parts[-1] if parts else ""


def matches_last(author: str, member: dict) -> bool:
    author_norm = normalize(author)
    member_norm = normalize(member["name"])
    if last_name(author) != last_name(member["name"]):
        return False
    author_first = author_norm.split()[0]
    member_first = member_norm.split()[0]
    return bool(author_first and member_first and author_first[0] == member_first[0])


def build_index(team: list[dict]) -> dict[str, str]:
    index: dict[str, str] = {}
    for key, slug in EXPLICIT.items():
        index[normalize(key)] = slug

    for member in team:
        if member.get("profileTier") != "page":
            continue
        for name in member.get("publicationAuthorNames", []):
            index[normalize(name)] = member["slug"]
        index[normalize(member["name"])] = member["slug"]

    return index


def resolve_author(author: str, team: list[dict], index: dict[str, str]) -> str | None:
    key = normalize(author)
    if key in index:
        return index[key]

    explicit = EXPLICIT.get(key)
    if explicit:
        return explicit

    for member in team:
        if member.get("profileTier") != "page":
            continue
        if key in (normalize(format_full(member)), normalize(member["name"])):
            return member["slug"]
        if matches_last(author, member):
            return member["slug"]
    return None


def main() -> None:
    team = json.loads(TEAM_PATH.read_text())
    pubs = json.loads(SITE_PATH.read_text())["publications"]
    index = build_index(team)

    for pub in pubs:
        for author in pub.get("authors", "").split(","):
            author = author.strip()
            if not author:
                continue
            key = normalize(author)
            if key in index:
                continue
            slug = resolve_author(author, team, index)
            if slug:
                index[key] = slug

    by_slug: dict[str, set[str]] = defaultdict(set)
    for pub in pubs:
        for author in pub.get("authors", "").split(","):
            author = author.strip()
            slug = index.get(normalize(author)) or resolve_author(author, team, index)
            if slug:
                by_slug[slug].add(author)

    for member in team:
        if member.get("profileTier") != "page":
            continue
        member["publicationAuthorNames"] = sorted(by_slug.get(member["slug"], []))

    TEAM_PATH.write_text(json.dumps(team, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Synced publicationAuthorNames for {len(by_slug)} members from {len(pubs)} publications.")


if __name__ == "__main__":
    main()
