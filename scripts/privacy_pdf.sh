#!/bin/sh
# Generate the privacy PDFs from the privacy pages themselves (print stylesheet),
# so the HTML and the PDF can never differ. Needs Google Chrome (headless).
# Usage: sh scripts/privacy_pdf.sh        (run from the repository root)
set -e
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
if [ ! -x "$CHROME" ]; then
  echo "privacy_pdf: Google Chrome not found, PDFs not regenerated" >&2
  exit 0
fi
PORT=8799
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
for pair in "privacy.html:assets/docs/iljuchin-privacy-en.pdf" "cs/privacy.html:assets/docs/iljuchin-privacy-cs.pdf"; do
  page="${pair%%:*}"; out="${pair#*:}"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 \
    --print-to-pdf="$out" "http://localhost:$PORT/$page" >/dev/null 2>&1
  echo "privacy_pdf: $out"
done
