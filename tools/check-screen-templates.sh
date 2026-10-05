#!/usr/bin/env bash
# Check the Operations screen templates in plugins/fund-os/templates/screens/:
#   1. the extracted <script> of each page parses (node --check)
#   2. the fund-neutral scan is empty: no artifact link, uuid, booking link, Drive id or real e-mail address, and no
#      line of the operator's local denylist (tools/.fund-denylist or $FUND_OS_DENYLIST, never committed); the scan has a
#      self-test with planted values
#   3. `const CONFIG = {` is present exactly once per page
#   4. the scoring mirror in deal-cockpit.html gives the same bands, actions, pin and clock as
#      tools/ops/lib/scoring.mjs on the inline cases of tools/check-ops-tools.sh (tools/check-scoring-mirror.mjs)
#   5. the rank region of deal-cockpit.html (// region:rank) is byte-identical to the one in tools/ops/digest-cli.mjs,
#      and both rank the digest fixtures the same way (tools/check-digest-mirror.mjs)
#   6. the shared pure regions do not drift between pages (a fix is made in every copy): the Inbox guards
#      (// ==== guards:begin ... guards:end ====), the autopilot region (identical but for its MODULES line) and the context
#      region in inbox.html, deal-cockpit.html and investors.html; the store-tabs region and the task region in
#      deal-cockpit.html and investors.html; the local-cache region in deal-cockpit.html, investors.html and start.html;
#      the permhelp region in all seven pages; the channels region in newsletter.html and profile.html. Each comparison has a
#      negative control (a mutated copy of the last page, read through the same extraction, must come out different).
#      The Start entry is the first item of the side menu in every page and CONFIG.links has the start URL
#   7. exactly the seven screens are present
#
#   bash tools/check-screen-templates.sh

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIR="$ROOT/plugins/fund-os/templates/screens"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

command -v node >/dev/null 2>&1 || { echo "node is required"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "python3 is required"; exit 1; }

# Fund-neutral scan. The public repository holds no fund value, so this file holds none either: the built-in
# patterns are generic (artifact links, uuids, booking links, Drive ids, real e-mail domains). A fund's own
# names, slugs and ids go into a local denylist that is never committed: tools/.fund-denylist (git-ignored), or the
# file named by FUND_OS_DENYLIST; one extended regex per line, matched case-insensitively.
DENYLIST="${FUND_OS_DENYLIST:-$ROOT/tools/.fund-denylist}"
SCAN="$WORK/scan-neutral.py"
cat > "$SCAN" <<'PY'
import re, sys
# (label, regex)
PATTERNS = [
    ("artifact link", r"claude\.ai/artifact/"),
    ("uuid", r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"),
    ("booking link", r"calendar\.app\.google/[A-Za-z0-9]+"),
    ("Drive link", r"drive\.google\.com/(drive/folders|file/d)/[A-Za-z0-9_-]{10,}"),
]
RUN = re.compile(r"[A-Za-z0-9_-]{25,}")
MAIL = re.compile(r"[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})")
WORDS = re.compile(r"[a-z]+[0-9]?")

def scan(text):
    """Return [(line number, label, matched text)] for everything that looks like a fund value."""
    out = []
    for n, line in enumerate(text.split("\n"), 1):
        for label, rx in PATTERNS:
            for m in re.finditer(rx, line, re.I):
                out.append((n, label, m.group(0)))
        for m in RUN.finditer(line):
            s = m.group(0)
            if not (re.search(r"[0-9]", s) and re.search(r"[A-Za-z]", s)):
                continue
            # a snake_case or kebab-case identifier (a tool name, a class name) is not an id
            if all(WORDS.fullmatch(w) for w in re.split(r"[_-]", s)):
                continue
            out.append((n, "Drive-style id", s))
        for m in MAIL.finditer(line):
            dom = m.group(1).lower()
            if dom == "example.com" or dom.endswith(".example") or dom.endswith(".example.com"):
                continue
            out.append((n, "e-mail address", m.group(0)))
    return out

bad = 0
for f in sys.argv[1:]:
    for n, label, s in scan(open(f, encoding="utf-8").read()):
        print(f"{f.rsplit('/', 1)[-1]}:{n}: {label}: {s[:100]}")
        bad += 1
sys.exit(1 if bad else 0)
PY

# prints one line per fund-specific hit in $1 (built-in patterns, then the local denylist if there is one)
neutral_hits() {
  python3 "$SCAN" "$1" 2>&1
  if [ -f "$DENYLIST" ]; then
    grep -niEf "$DENYLIST" "$1" | cut -c1-160 | sed "s|^|$(basename "$1"):|; s|\$| (local denylist)|"
  fi
  return 0  # no hit is not a failure: under pipefail a status of 1 would make every "caught?" self-test below fail
}
EXPECTED="deal-cockpit investors inbox knowledge profile newsletter start"

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
  hits=$(neutral_hits "$f" | cut -c1-200)
  if [ -n "$hits" ]; then
    fail "$name.html holds a fund-specific value (fund-neutral scan is not empty)"; echo "$hits" | head -5 | sed 's/^/      /'
  fi

  # 3. CONFIG exactly once
  n=$(grep -cE '^[[:space:]]*const CONFIG = \{' "$f")
  if [ "$n" -ne 1 ]; then fail "$name.html declares CONFIG $n times (expected 1)"; fi
done

# 2b. self-test of the fund-neutral scan: planted values must be caught, the clean copy and the placeholders must not
# (the planted values are made up here; no fund value is involved)
planted="$WORK/planted.html"
selftest() {
  local label="$1" needle="$2" file="$3"
  if ! neutral_hits "$file" | grep -qF "$needle"; then fail "fund-neutral self-test: a planted $label was not caught"; fi
}
cp "$DIR/deal-cockpit.html" "$planted"
if [ -n "$(neutral_hits "$planted")" ]; then fail "fund-neutral self-test: the clean copy already has hits"; fi
# assembled at run time, so this file itself holds nothing that looks like an id
fake_id="1Ab2Cd3Ef4Gh5Ij6""Kl7Mn8Op9Qr0StUvW"            # 33 characters
fake_uuid="123e4567-e89b""-12d3-a456-426614174000"
printf '%s\n' "  const CONFIG = { driveFolderId: \"$fake_id\" };" > "$WORK/p1.html"
selftest "33-character Drive id in a CONFIG default" "$fake_id" "$WORK/p1.html"
printf '%s\n' "  const X = \"$fake_uuid\";" > "$WORK/p2.html"
selftest "uuid" "$fake_uuid" "$WORK/p2.html"
printf '%s\n' '  <a href="https://claude.ai/artifact/abc">x</a> https://calendar.app.google/Xy12Zz' > "$WORK/p3.html"
selftest "artifact link" "claude.ai/artifact/" "$WORK/p3.html"
selftest "booking link" "calendar.app.google/Xy12Zz" "$WORK/p3.html"
printf '%s\n' '  const M = "partner@somefund.vc"; const OK = "name@firma.example";' > "$WORK/p4.html"
selftest "e-mail address" "partner@somefund.vc" "$WORK/p4.html"
if neutral_hits "$WORK/p4.html" | grep -qF "firma.example"; then fail "fund-neutral self-test: the .example placeholder was flagged"; fi
printf '%s\n' 'https://drive.google.com/drive/folders/AbCdEfGhIj12' > "$WORK/p5.html"
selftest "Drive folder link" "AbCdEfGhIj12" "$WORK/p5.html"
printf '%s\n' 'Quartalsbericht der Beispielgesellschaft' > "$WORK/p6.html"
printf '%s\n' 'beispielgesellschaft' > "$WORK/deny.txt"
if [ "$(DENYLIST="$WORK/deny.txt" neutral_hits "$WORK/p6.html" | wc -l)" -ne 1 ]; then fail "fund-neutral self-test: the local denylist did not catch a planted name"; fi

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

# 6. the shared pure regions do not drift between pages (the pages are lifted from the same sources, so a fix is made in every copy).
#    Each comparison has a negative control: a copy of one other page with a trailing space on a line in the middle of the region,
#    read through the same extraction, must come out different. The autopilot regions may differ in their one MODULES line only.
if out=$(python3 - "$DIR" "$WORK" <<'PY'
import os, re, sys
d, work = sys.argv[1], sys.argv[2]
def region(page, start, end, base=None):
    t = open(f"{base or d}/{page}.html", encoding="utf-8").read()
    m = re.search(rf"^[ \t]*// {start}\b.*$[\s\S]*?^[ \t]*// {end}\b.*$", t, re.M)
    return m.group(0) if m else None
def first_diff(x, y):
    """Index of the first differing line of two texts, or None when they are byte-identical."""
    if x == y:
        return None
    lx, ly = x.split("\n"), y.split("\n")
    return next((i for i, (p, q) in enumerate(zip(lx, ly)) if p != q), min(len(lx), len(ly)))
MODULES = re.compile(r"const MODULES = \[[^\]]*\];")
ALL = ["inbox", "deal-cockpit", "investors", "knowledge", "newsletter", "profile", "start"]
REGIONS = [
    # (name, start marker, end marker, pages, normaliser)
    ("Inbox guards", "==== guards:begin", "==== guards:end", ["inbox", "deal-cockpit", "investors"], None),
    ("autopilot region", "==== autopilot:begin", "==== autopilot:end", ["inbox", "deal-cockpit", "investors"], lambda r: MODULES.sub("const MODULES = [X];", r)),
    ("store-tabs region", "==== store-tabs:begin", "==== store-tabs:end", ["deal-cockpit", "investors"], None),
    ("context region", "region:context", "endregion:context", ["inbox", "deal-cockpit", "investors"], None),
    ("task region", "region:tasks", "endregion:tasks", ["deal-cockpit", "investors"], None),
    ("local-cache region", "region:localcache", "endregion:localcache", ["deal-cockpit", "investors", "start"], None),
    ("permhelp region", "region:permhelp", "endregion:permhelp", ALL, None),
    ("channels region", "==== channels:begin", "==== channels:end", ["newsletter", "profile"], None),
]
bad = 0
for what, start, end, pages, norm in REGIONS:
    norm = norm or (lambda r: r)
    regs = [region(p, start, end) for p in pages]
    missing = [p for p, r in zip(pages, regs) if r is None]
    if missing:
        print(f"{what}: the markers are missing in {', '.join(m + '.html' for m in missing)}"); bad += 1; continue
    ra = regs[0]
    if len(ra.split("\n")) < 20:
        print(f"{what}: the region in {pages[0]}.html is suspiciously short ({len(ra.splitlines())} lines)"); bad += 1; continue
    ok = True
    for p, r in zip(pages[1:], regs[1:]):
        at = first_diff(norm(ra), norm(r))
        if at is not None:
            la, lb = norm(ra).split("\n"), norm(r).split("\n")
            print(f"{what} differ between {pages[0]}.html and {p}.html (first difference at region line {at + 1}):\n  {pages[0]}: {la[at][:140] if at < len(la) else '(ends)'}\n  {p}: {lb[at][:140] if at < len(lb) else '(ends)'}"); bad += 1; ok = False; break
    if not ok:
        continue
    # negative control on the last page of the list
    b = pages[-1]
    lines = open(f"{d}/{b}.html", encoding="utf-8").read().split("\n")
    first = next(i for i, l in enumerate(lines) if re.match(rf"[ \t]*// {start}\b", l))
    last = next(i for i in range(first, len(lines)) if re.match(rf"[ \t]*// {end}\b", lines[i]))
    lines[(first + last) // 2] += " "
    mut = os.path.join(work, "mut-" + re.sub(r"[^a-z]", "", start))
    os.makedirs(mut, exist_ok=True)
    open(f"{mut}/{b}.html", "w", encoding="utf-8").write("\n".join(lines))
    rm = region(b, start, end, mut)
    if rm is None or first_diff(norm(ra), norm(rm)) is None:
        print(f"{what}: negative control failed (a drifted region would pass)"); bad += 1; continue
    print(f"ok  {what} identical in {', '.join(p + '.html' for p in pages)} ({len(ra.splitlines())} lines)")
# the Start entry first in every side menu: the six pages carry item("start", ...), and CONFIG.links has the seventh URL
for p in ALL:
    t = open(f"{d}/{p}.html", encoding="utf-8").read()
    has_item = 'item("start", "Start")' in t
    has_link = re.search(r"links: \{[^}]*\bstart: \"\"", t) is not None
    if not (has_item and has_link):
        print(f"{p}.html: the Start entry is missing from the side menu (item) or from CONFIG.links.start"); bad += 1
    elif p != "start" and t.index('item("start", "Start")') > t.index('item("deals", "Deal Cockpit")'):
        print(f"{p}.html: the Start entry is not the first in the side menu"); bad += 1
# negative control of the menu check: a page without the entry must be reported
probe = open(f"{d}/knowledge.html", encoding="utf-8").read().replace('${item("start", "Start")}', "")
if 'item("start", "Start")' in probe:
    print("side-menu negative control failed"); bad += 1
else:
    print("ok  the Start entry is the first item of the side menu in all seven pages (negative control: a page without it is reported)")
sys.exit(1 if bad else 0)
PY
); then
  echo "$out" | sed 's/^/  /'
else
  fail "a shared pure region differs between pages, or the Start entry is missing"; echo "$out" | head -14 | sed 's/^/      /'
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
