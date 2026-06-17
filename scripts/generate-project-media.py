#!/usr/bin/env python3
"""Fetch discotechnologies.org metadata and emit project-media.json + sync manifest."""
from __future__ import annotations

import json
import re
import subprocess
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

DISCO_PAGES: dict[str, tuple[str, str]] = {
    "mousemapper": ("https://discotechnologies.org/MouseMapper/", "MouseMapper"),
    "wilddisco": ("https://discotechnologies.org/wildDISCO/", "wildDISCO"),
    "disco-ms": ("https://discotechnologies.org/DISCO-MS/", "DISCO-MS"),
    "shanel": ("https://discotechnologies.org/SHANEL/", "SHANEL"),
    "vessap": ("https://discotechnologies.org/VesSAP/", "VesSAP"),
    "deepmact": ("https://discotechnologies.org/DeepMACT/3Dcontent/", "DeepMACT"),
}

SCP_NANO = [
    (
        "https://static-content.springer.com/esm/art%3A10.1038%2Fs41587-024-02528-1/MediaObjects/41587_2024_2528_MOESM3_ESM.mp4",
        "Supplementary Video 1",
        "Lipid nanoparticles (magenta) in the lung after intranasal injection at 0.0005 mg kg⁻¹.",
        "LNP",
    ),
    (
        "https://static-content.springer.com/esm/art%3A10.1038%2Fs41587-024-02528-1/MediaObjects/41587_2024_2528_MOESM4_ESM.mp4",
        "Supplementary Video 2",
        "EGFP protein expression (green) in the heart 72 h after intramuscular LNP EGFP mRNA.",
        "Heart",
    ),
    (
        "https://static-content.springer.com/esm/art%3A10.1038%2Fs41587-024-02528-1/MediaObjects/41587_2024_2528_MOESM5_ESM.mp4",
        "Supplementary Video 3",
        "LNP spike mRNA (magenta) in the heart after intramuscular injection.",
        "Spike mRNA",
    ),
    (
        "https://static-content.springer.com/esm/art%3A10.1038%2Fs41587-024-02528-1/MediaObjects/41587_2024_2528_MOESM6_ESM.mov",
        "Supplementary Video 4",
        "DNA origami (red) at cell level throughout the entire mouse body.",
        "DNA origami",
    ),
    (
        "https://static-content.springer.com/esm/art%3A10.1038%2Fs41587-024-02528-1/MediaObjects/41587_2024_2528_MOESM7_ESM.mp4",
        "Supplementary Video 5",
        "GFP from PHP.eB-AAV in different brain regions (Allen CCF3 color coding).",
        "AAV brain",
    ),
    (
        "https://static-content.springer.com/esm/art%3A10.1038%2Fs41587-024-02528-1/MediaObjects/41587_2024_2528_MOESM8_ESM.mp4",
        "Supplementary Video 6",
        "RetroAAV GFP distribution throughout the entire mouse body at cell-level resolution.",
        "Whole body",
    ),
]


def fetch_html(url: str) -> str:
    result = subprocess.run(
        ["curl", "-fsSL", "-A", UA, url],
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout


def parse_page(html: str) -> list[tuple[str, str, str]]:
    sources = re.findall(r'<source src="([^"]+)"', html)
    descs = re.findall(r'videoDescription"><b>([^<]+)</b><br />([^<]+)', html)
    items: list[tuple[str, str, str]] = []
    for i, src in enumerate(sources):
        title = descs[i][0].strip() if i < len(descs) else f"Video {i + 1}"
        desc = descs[i][1].strip() if i < len(descs) else ""
        items.append((src, title, desc))
    return items


def local_name(project_id: str, index: int, ext: str) -> str:
    return f"{project_id}-{index:02d}.{ext.lower()}"


def main() -> None:
    media: dict[str, list[dict]] = {}
    downloads: list[tuple[str, str]] = []

    for project_id, (page_url, _label) in DISCO_PAGES.items():
        html = fetch_html(page_url)
        items = parse_page(html)
        media[project_id] = []
        base = page_url if page_url.endswith("/") else page_url + "/"

        for i, (src, title, desc) in enumerate(items, start=1):
            ext = src.rsplit(".", 1)[-1]
            filename = local_name(project_id, i, ext)
            remote = base + urllib.parse.quote(src)
            local_path = f"public/videos/projects/{filename}"
            downloads.append((remote, local_path))
            media[project_id].append(
                {
                    "src": f"/videos/projects/{filename}",
                    "title": title,
                    "description": desc,
                }
            )

    media["scp-nano"] = []
    for i, (url, _title, desc, _label) in enumerate(SCP_NANO, start=1):
        ext = url.rsplit(".", 1)[-1]
        filename = local_name("scp-nano", i, ext)
        local_path = f"public/videos/projects/{filename}"
        downloads.append((url, local_path))
        media["scp-nano"].append(
            {
                "src": f"/videos/projects/{filename}",
                "description": desc,
            }
        )

    out_json = ROOT / "src/content/project-media.json"
    out_json.write_text(json.dumps(media, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    manifest = ROOT / "scripts/disco-download-manifest.txt"
    manifest.write_text(
        "\n".join(f"{url}\t{path}" for url, path in downloads) + "\n",
        encoding="utf-8",
    )

    print(f"Wrote {out_json} ({sum(len(v) for v in media.values())} videos)")
    print(f"Wrote {manifest} ({len(downloads)} downloads)")
    print("Run: python3 scripts/humanize-project-media.py")


if __name__ == "__main__":
    main()
