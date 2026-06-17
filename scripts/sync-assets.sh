#!/usr/bin/env bash
# Download lab images from erturk-lab.com into public/images/ and refresh site.json paths.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p public/images/showcase public/images/team

download() {
  local url="$1" dest="$2"
  if [[ -f "$dest" && $(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest") -gt 1000 ]]; then
    echo "skip $dest"
    return 0
  fi
  echo "get  $dest"
  curl -fsSL -o "$dest" "$url"
}

# Showcase / science / publications
download "https://www.erturk-lab.com/wp-content/uploads/2020/02/image_02-1024x614-640x480.jpg" "public/images/showcase/whole-body-disco.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/02/cell-1-1024x683-640x480.jpg" "public/images/showcase/deepmact-cell.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/03/cover-1024x683-640x480.jpg" "public/images/showcase/disco-ms-cover.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/03/image-640x480.jpg" "public/images/showcase/light-sheet-snapshot.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/04/transparent-human-brain-1024x672-640x480.jpg" "public/images/showcase/transparent-human-brain.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/04/brain-vessels-1.tif-1024x777-640x480.jpg" "public/images/showcase/brain-vasculature.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/04/human-kidney-768x1024-640x480.jpg" "public/images/showcase/cleared-human-kidney.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/04/human-eye-2-921x1024-640x480.jpg" "public/images/showcase/human-eye-cleared.jpg"

# Team photos
download "https://www.erturk-lab.com/wp-content/uploads/2024/11/AliPortrait.jpg" "public/images/team/ali-erturk.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2022/07/Markus-1024x684.jpg" "public/images/team/markus-erturk.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/05/farida_square-1024x1024.png" "public/images/team/farida.png"
download "https://www.erturk-lab.com/wp-content/uploads/2025/11/Thomas-Schubert-Bild.jpg" "public/images/team/thomas-schubert.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/02/hasharan.jpg" "public/images/team/hasharan.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2023/03/CK-1024x1024.jpg" "public/images/team/christian-klein.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2025/09/David.jpg" "public/images/team/david.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2024/08/DSC_7550_coloradjusted_downscaled-681x1024.jpg" "public/images/team/dsc-7550.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/04/Foto-Doris_square.png" "public/images/team/doris.png"
download "https://www.erturk-lab.com/wp-content/uploads/2022/04/IMG_20220405_185532-762x1024.jpg" "public/images/team/img-20220405.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2021/12/Todorov_pic2.jpg" "public/images/team/todorov.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/04/LK_square-1024x1024.jpg" "public/images/team/louis-kuemmerle.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2022/12/Ying_photo-803x1024.jpg" "public/images/team/ying.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2024/06/IMG_3001-919x1024.jpg" "public/images/team/img-3001.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2024/11/profile-1-771x1024.jpg" "public/images/team/profile-1.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2025/02/IMG_20250220_100637-769x1024.jpg" "public/images/team/img-20250220.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2025/02/picture-768x1024.jpeg" "public/images/team/picture.jpeg"
download "https://www.erturk-lab.com/wp-content/uploads/2021/05/Luciano-1024x1024.jpg" "public/images/team/luciano.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2026/01/Self-photo-768x1024.jpg" "public/images/team/zairong-cai.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2020/02/malin.jpg" "public/images/team/malin.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2021/10/Denise.jpg" "public/images/team/denise.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2022/03/Xiaoshan-Hu1-1024x768.jpg" "public/images/team/xiaoshan-hu.jpg"
download "https://www.erturk-lab.com/wp-content/uploads/2022/03/Foto_Stefanie-Reitinger.jpg" "public/images/team/stefanie-reitinger.jpg"

python3 scripts/patch-site-json-assets.py
echo "Done. Assets in public/images/"
