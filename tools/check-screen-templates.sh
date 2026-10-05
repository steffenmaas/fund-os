#!/usr/bin/env bash
# Check the Operations screen templates in plugins/fund-os/templates/screens/:
#   1. the extracted <script> of each page parses (node --check)
#   2. the fund-neutral grep is empty (no fund name, person, artifact link or object id)
#   3. `const CONFIG = {` is present exactly once per page
#   4. the scoring mirror in deal-cockpit.html gives the same bands, actions, pin and clock as
#      tools/ops/lib/scoring.mjs on the inline cases of tools/check-ops-tools.sh (tools/check-scoring-mirror.mjs)
#   5. the rank region of deal-cockpit.html (// region:rank) is byte-identical to the one in tools/ops/digest-cli.mjs,
#      and both rank the digest fixtures the same way (tools/check-digest-mirror.mjs)
#   6. the shared pure regions do not drift between pages: the Inbox guards (// ==== guards:begin ... guards:end ====) are
#      byte-identical in inbox.html and deal-cockpit.html, and the task region (// region:tasks ... endregion:tasks) is
#      byte-identical in deal-cockpit.html and investors.html (the pages are lifted from the same sources, so a fix is
#      made in every copy)
#   7. exactly the six screens are present
#
#   bash tools/check-screen-templates.sh

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIR="$ROOT/plugins/fund-os/templates/screens"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

command -v node >/dev/null 2>&1 || { echo "node is required"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "python3 is required"; exit 1; }

NEUTRAL='claude\.ai/artifact/|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
EXPECTED="deal-cockpit investors inbox knowledge profile newsletter"

fails=0
checked=0

fail() { echo "FAIL: $1"; fails=$((fails + 1)); }

for name in $EXPECTED; do
  f="$DIR/$name.html"
  if [ ! -f "$f" ]; then fail "$name.html is missing"; continue; fi
  checked=$((checked + 1))

  # 1. every <script> block, concatenated, must parse
  js="$WORK/$name.js"
  python3 - "$f" "$js" <<'PY'
import re, sys
t = open(sys.argv[1], encoding="utf-8").read()
blocks = re.findall(r"<script[^>]*>(.*?)</script>", t, re.S)
if not blocks:
    sys.exit(3)
open(sys.argv[2], "w", encoding="utf-8").write("\n".join(blocks))
PY
  rc=$?
  if [ $rc -ne 0 ]; then
    fail "$name.html has no <script> block"
  elif ! err=$(node --check "$js" 2>&1); then
    fail "$name.html script does not parse"; echo "$err" | head -5 | sed 's/^/      /'
  fi

  # 2. fund-neutral
  hits=$(grep -niE "$NEUTRAL" "$f" | cut -c1-160)
  if [ -n "$hits" ]; then
    fail "$name.html names a fund (fund-neutral grep is not empty)"; echo "$hits" | head -5 | sed 's/^/      /'
  fi

  # 3. CONFIG exactly once
  n=$(grep -cE '^[[:space:]]*const CONFIG = \{' "$f")
  if [ "$n" -ne 1 ]; then fail "$name.html declares CONFIG $n times (expected 1)"; fi
done

# 4. the scoring mirror must not drift from tools/ops/lib/scoring.mjs
if out=$(node "$ROOT/tools/check-scoring-mirror.mjs" 2>&1); then
  echo "  $out"
else
  fail "scoring mirror in deal-cockpit.html differs from tools/ops/lib/scoring.mjs"; echo "$out" | head -12 | sed 's/^/      /'
fi

# 5. the rank region must not drift from tools/ops/digest-cli.mjs
if out=$(node "$ROOT/tools/check-digest-mirror.mjs" 2>&1); then
  echo "  $(echo "$out" | tail -1)"
else
  fail "rank region in deal-cockpit.html differs from tools/ops/digest-cli.mjs"; echo "$out" | head -12 | sed 's/^/      /'
fi

# 6. the shared pure regions must be byte-identical across pages
if out=$(python3 - "$DIR" <<'PY'
import re, sys
d = sys.argv[1]
def region(page, start, end):
    t = open(f"{d}/{page}.html", encoding="utf-8").read()
    m = re.search(rf"^[ \t]*// {start}\b.*$[\s\S]*?^[ \t]*// {end}\b.*$", t, re.M)
    return m.group(0) if m else None
bad = 0
for what, start, end, a, b in [("Inbox guards", "==== guards:begin", "==== guards:end", "inbox", "deal-cockpit"), ("task region", "region:tasks", "endregion:tasks", "deal-cockpit", "investors")]:
    ra, rb = region(a, start, end), region(b, start, end)
    if ra is None or rb is None:
        print(f"{what}: the markers are missing in {a if ra is None else b}.html"); bad += 1; continue
    if len(ra.split("\n")) < 20:
        print(f"{what}: the region in {a}.html is suspiciously short ({len(ra.splitlines())} lines)"); bad += 1; continue
    if ra != rb:
        la, lb = ra.split("\n"), rb.split("\n")
        at = next((i for i, (x, y) in enumerate(zip(la, lb)) if x != y), min(len(la), len(lb)))
        print(f"{what} differ between {a}.html and {b}.html (first difference at region line {at + 1}):\n  {a}: {la[at][:140] if at < len(la) else '(ends)'}\n  {b}: {lb[at][:140] if at < len(lb) else '(ends)'}"); bad += 1; continue
    if ra.replace("const", "var", 1) == rb:
        print(f"{what}: negative control failed (a drifted region would pass)"); bad += 1; continue
    print(f"ok  {what} identical in {a}.html and {b}.html ({len(ra.splitlines())} lines)")
sys.exit(1 if bad else 0)
PY
); then
  echo "$out" | sed 's/^/  /'
else
  fail "a shared pure region differs between pages"; echo "$out" | head -12 | sed 's/^/      /'
fi

# a page nobody listed must not slip in unchecked
for f in "$DIR"/*.html; do
  base=$(basename "$f" .html)
  case " $EXPECTED " in *" $base "*) ;; *) fail "$base.html is not in the list of checked templates (add it to EXPECTED)";; esac
done

if [ $fails -gt 0 ]; then
  echo "Screen templates: $fails failure(s)"
  exit 1
fi
echo "Screen templates: $checked checked, ok"
