#!/usr/bin/env python3
"""Apply human-readable labels and titles to project-media.json."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MEDIA_PATH = ROOT / "src/content/project-media.json"

# (label, title) per project — tab label short, title is the heading below the video
CURATED: dict[str, list[tuple[str, str]]] = {
    "mousemapper": [
        ("Nerves", "Whole-body nerve architecture"),
        ("Immune cells", "CD68+ immune map (chow vs obese)"),
        ("Immune · chow", "CD68+ cells in chow-fed mouse"),
        ("Immune · obese", "CD68+ infiltration in high-fat diet"),
        ("Segmentation", "AI organ segmentation (chow-fed)"),
        ("Segmentation · obese", "AI organ segmentation (obese)"),
        ("Immune clusters", "AI immune cell clusters"),
    ],
    "wilddisco": [
        ("Whole-body nerves", "PGP 9.5 peripheral nerve map"),
        ("Heart", "Heart innervation"),
        ("Spleen", "Sympathetic nerves in spleen"),
        ("Liver", "Liver & gallbladder nerves"),
        ("Gut", "Intestinal sympathetic nerves"),
        ("Vagus", "Vagus nerve multi-organ connections"),
        ("Lymphatics", "Whole-body lymphatic vasculature"),
        ("Hind limb", "Hind limb lymphatics & nodes"),
        ("Kidney", "Kidney lymphatic vessels"),
        ("Stomach", "Stomach lymphatic network"),
        ("Intestine", "Intestinal lymphatics & node"),
        ("Intestinal wall", "Lymphatics in intestinal wall"),
        ("Brain cortex", "Lymphatic vessels in cortex"),
        ("Brain surface", "Lymphatic capillaries on brain"),
        ("Gut · immunity", "Sympathetic nerves & immune cells"),
        ("Gut · neurons", "Immune cells on intestinal neurons"),
        ("Nerves & lymph", "Sympathetic–lymphatic whole body"),
        ("Gut wall", "Sympathetic–lymphatic on gut wall"),
        ("Inside intestine", "Sympathetic–lymphatic in intestine"),
        ("Lymph nodes", "Whole-body lymph node distribution"),
        ("Limb node", "Posterior limb lymph node nerves"),
        ("Germ-free gut", "Myenteric nerves (germ-free)"),
        ("Staining", "Homogeneous whole-body staining"),
        ("VR · organs", "VR multi-organ nerve connections"),
        ("VR · gut", "VR intestinal innervation"),
    ],
    "disco-ms": [
        ("Pipeline", "DISCO-MS pipeline on 5xFAD brain"),
        ("DISCO-bot", "Robotic ROI extraction workflow"),
        ("mTBI", "Microglia after mild brain injury"),
        ("Amyloid plaques", "AI-segmented plaques in Alzheimer model"),
        ("Bone marrow", "Real-time scapula extraction"),
        ("Whole body", "LysM+ immune ROIs across mouse"),
        ("Heart", "Coronary atherosclerotic plaques"),
    ],
    "shanel": [
        ("Pancreas", "Beta cells in pig pancreas"),
        ("Human eye", "Intact human eye in 3D"),
        ("Brain · plaques", "Abeta plaques in aged human brain"),
        ("Microglia", "Microglia across human brain tissue"),
        ("Neurons", "TH+ neuronal processes in human brain"),
        ("Kidney", "Human kidney glomeruli & vessels"),
    ],
    "vessap": [
        ("Data quality", "Representative brain vasculature scan"),
        ("Segmentation", "Vessel segmentation demonstration"),
        ("Allen atlas", "Atlas registration & overlay"),
        ("High resolution", "Full-resolution segmentation substack"),
        ("Capillaries", "Capillary-level vasculature detail"),
    ],
    "deepmact": [
        ("Whole body", "Torso metastasis mapping"),
        ("Lung", "Lung micrometastases"),
        ("Antibody", "Therapeutic antibody biodistribution"),
        ("Lung binding", "Antibody binding at micrometastases"),
    ],
    "scp-nano": [
        ("LNP · lung", "LNP biodistribution in lung"),
        ("Heart · EGFP", "EGFP expression in heart"),
        ("Spike mRNA", "LNP spike mRNA in heart"),
        ("DNA origami", "DNA origami across whole body"),
        ("AAV · brain", "PHP.eB AAV in brain regions"),
        ("RetroAAV", "RetroAAV across whole body"),
    ],
}


def main() -> None:
    data = json.loads(MEDIA_PATH.read_text(encoding="utf-8"))
    for project_id, entries in data.items():
        curated = CURATED.get(project_id, [])
        for i, entry in enumerate(entries):
            if i < len(curated):
                label, title = curated[i]
                entry["label"] = label
                entry["title"] = title
            elif "label" not in entry or entry["label"].startswith("S"):
                entry["label"] = entry.get("title", f"Video {i + 1}")[:20]
    MEDIA_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Updated labels/titles in {MEDIA_PATH}")


if __name__ == "__main__":
    main()
