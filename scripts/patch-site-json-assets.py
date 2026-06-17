#!/usr/bin/env python3
"""Replace erturk-lab.com image URLs in site.json with local /images/ paths."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE_JSON = ROOT / "src/content/site.json"

REPLACEMENTS = {
    "https://www.erturk-lab.com/wp-content/uploads/2020/02/image_02-1024x614-640x480.jpg": "/images/showcase/whole-body-disco.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/02/cell-1-1024x683-640x480.jpg": "/images/showcase/deepmact-cell.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/03/cover-1024x683-640x480.jpg": "/images/showcase/disco-ms-cover.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/03/image-640x480.jpg": "/images/showcase/light-sheet-snapshot.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/04/transparent-human-brain-1024x672-640x480.jpg": "/images/showcase/transparent-human-brain.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/04/brain-vessels-1.tif-1024x777-640x480.jpg": "/images/showcase/brain-vasculature.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/04/human-kidney-768x1024-640x480.jpg": "/images/showcase/cleared-human-kidney.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/04/human-eye-2-921x1024-640x480.jpg": "/images/showcase/human-eye-cleared.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2024/11/AliPortrait.jpg": "/images/team/ali-erturk.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2022/07/Markus-1024x684.jpg": "/images/team/markus-erturk.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/05/farida_square-1024x1024.png": "/images/team/farida.png",
    "https://www.erturk-lab.com/wp-content/uploads/2025/11/Thomas-Schubert-Bild.jpg": "/images/team/thomas-schubert.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/02/hasharan.jpg": "/images/team/hasharan.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2023/03/CK-1024x1024.jpg": "/images/team/christian-klein.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2025/09/David.jpg": "/images/team/david.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2024/08/DSC_7550_coloradjusted_downscaled-681x1024.jpg": "/images/team/dsc-7550.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/04/Foto-Doris_square.png": "/images/team/doris.png",
    "https://www.erturk-lab.com/wp-content/uploads/2022/04/IMG_20220405_185532-762x1024.jpg": "/images/team/img-20220405.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2021/12/Todorov_pic2.jpg": "/images/team/todorov.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/04/LK_square-1024x1024.jpg": "/images/team/louis-kuemmerle.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2022/12/Ying_photo-803x1024.jpg": "/images/team/ying.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2024/06/IMG_3001-919x1024.jpg": "/images/team/img-3001.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2024/11/profile-1-771x1024.jpg": "/images/team/profile-1.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2025/02/IMG_20250220_100637-769x1024.jpg": "/images/team/img-20250220.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2025/02/picture-768x1024.jpeg": "/images/team/picture.jpeg",
    "https://www.erturk-lab.com/wp-content/uploads/2021/05/Luciano-1024x1024.jpg": "/images/team/luciano.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2026/01/Self-photo-768x1024.jpg": "/images/team/zairong-cai.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2020/02/malin.jpg": "/images/team/malin.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2021/10/Denise.jpg": "/images/team/denise.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2022/03/Xiaoshan-Hu1-1024x768.jpg": "/images/team/xiaoshan-hu.jpg",
    "https://www.erturk-lab.com/wp-content/uploads/2022/03/Foto_Stefanie-Reitinger.jpg": "/images/team/stefanie-reitinger.jpg",
}


def replace_in_obj(obj):
    if isinstance(obj, dict):
        return {k: replace_in_obj(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [replace_in_obj(v) for v in obj]
    if isinstance(obj, str) and obj in REPLACEMENTS:
        return REPLACEMENTS[obj]
    return obj


def main():
    data = json.loads(SITE_JSON.read_text())
    updated = replace_in_obj(data)
    SITE_JSON.write_text(json.dumps(updated, indent=2, ensure_ascii=False) + "\n")
    remaining = json.dumps(updated)
    import re
    external = re.findall(r"https://www\.erturk-lab\.com/wp-content/uploads/[^\"]+", remaining)
    if external:
        print("WARNING: still external:", external)
    else:
        print("site.json updated — no erturk-lab.com image URLs remain")


if __name__ == "__main__":
    main()
