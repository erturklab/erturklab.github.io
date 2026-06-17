#!/usr/bin/env bash
# Download ALL supplementary movies locally into public/videos/projects/.
# Sources: discotechnologies.org + Nature Springer (SCP-Nano).
# Regenerate manifest: python3 scripts/generate-project-media.py
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
DEST="public/videos/projects"
MANIFEST="scripts/disco-download-manifest.txt"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
MIN_BYTES=500000
mkdir -p "$DEST"

if [[ ! -f "$MANIFEST" ]]; then
  echo "Missing $MANIFEST — run: python3 scripts/generate-project-media.py"
  exit 1
fi

download() {
  local url="$1" dest="$2"
  if [[ -f "$dest" ]]; then
    local size
    size=$(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest")
    if [[ "$size" -gt "$MIN_BYTES" ]]; then
      echo "skip $dest"
      return 0
    fi
  fi
  echo "get  $dest"
  curl -fsSL -L -A "$UA" -o "$dest" "$url"
}

while IFS=$'\t' read -r url dest; do
  [[ -z "$url" ]] && continue
  download "$url" "$dest"
done < "$MANIFEST"

echo "Done. $(find "$DEST" -type f | wc -l | tr -d ' ') files in $DEST/"
