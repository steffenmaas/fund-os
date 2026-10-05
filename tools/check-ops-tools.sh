#!/usr/bin/env bash
# Check the autopilot CLIs in tools/ops/: syntax, then one happy-path run per subcommand against
# tools/ops/fixtures/, then a few runs that must be refused (exit 1).
#
#   bash tools/check-ops-tools.sh
#
# Every run uses FUND_OS_CONFIG=tools/ops/fixtures/user-config.example.json: no real fund configuration
# is read, and nothing is written outside a temp directory.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
OPS=tools/ops
FIX=$OPS/fixtures
export FUND_OS_CONFIG="$FIX/user-config.example.json"
NOW=2026-10-05T09:00:00Z
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

command -v node >/dev/null 2>&1 || { echo "node is required (Node 18 or later)"; exit 1; }

fails=0
runs=0

# ok <label> <command...>: must exit 0
ok() {
  local label="$1"; shift
  runs=$((runs + 1))
  if out=$("$@" 2>"$WORK/err"); then
    echo "  ok    $label"
  else
    fails=$((fails + 1)); echo "  FAIL  $label (exit $?)"; echo "$out" | head -5; head -5 "$WORK/err"
  fi
}

# refused <label> <command...>: must exit 1
refused() {
  local label="$1"; shift
  runs=$((runs + 1))
  "$@" >"$WORK/out" 2>"$WORK/err"
  local code=$?
  if [ "$code" -eq 1 ]; then
    echo "  ok    $label (refused, exit 1)"
  else
    fails=$((fails + 1)); echo "  FAIL  $label (expected exit 1, got $code)"
  fi
}

# exit2 <label> <command...>: must exit 2 (usage)
exit2() {
  local label="$1"; shift
  runs=$((runs + 1))
  "$@" >"$WORK/out" 2>"$WORK/err"
  local code=$?
  if [ "$code" -eq 2 ]; then echo "  ok    $label (usage, exit 2)"; else fails=$((fails + 1)); echo "  FAIL  $label (expected exit 2, got $code)"; fi
}

# has <label> <file> <text>: the output file must contain the text
has() {
  runs=$((runs + 1))
  if grep -qF -- "$3" "$2"; then echo "  ok    $1"; else fails=$((fails + 1)); echo "  FAIL  $1 (no '$3' in $2)"; fi
}

echo "Syntax"
for f in $OPS/*.mjs $OPS/lib/*.mjs; do
  runs=$((runs + 1))
  if node --check "$f"; then echo "  ok    node --check $f"; else fails=$((fails + 1)); echo "  FAIL  node --check $f"; fi
done

D="node $OPS/deal-score-cli.mjs"
I="node $OPS/investor-cli.mjs"
N="node $OPS/newsletter-cli.mjs"

echo "Scoring arithmetic (tools/ops/lib/scoring.mjs)"
runs=$((runs + 1))
if node --input-type=module -e '
import * as s from "./tools/ops/lib/scoring.mjs";
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`${m}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`); process.exit(1); } };
eq([s.capSum(s.QUALITY_DIMENSIONS), s.capSum(s.THESIS_DIMENSIONS), s.capSum(s.URGENCY_DIMENSIONS), s.capSum(s.LP_DIMENSIONS)], [100, 100, 100, 120], "caps");
eq([89, 90, 74, 75, 59, 60, 39, 40].map(s.qualityBand), ["Investable", "Strong", "Possible", "Investable", "Weak", "Possible", "Poor", "Weak"], "quality bands");
eq([s.recommendedAction(75, 70, 0), s.recommendedAction(75, 40, 0), s.recommendedAction(75, 39, 0), s.recommendedAction(60, 70, 0), s.recommendedAction(59, 70, 0), s.recommendedAction(90, 90, 1), s.recommendedAction(70, 90, 1)], ["Pursue", "Exception review", "Refer out", "Watchlist", "Monitor", "Refer out", "Pass"], "action table");
eq([s.nextStepBy(85, new Date("2026-10-04T12:00:00Z")), s.nextStepBy(0, new Date("2026-10-04T12:00:00Z")), s.voidAfter(new Date("2026-10-04T12:00:00Z"))], ["2026-10-07", "2027-01-02", "2026-11-03"], "urgency clock");
const pinned = s.pin(s.QUALITY_DIMENSIONS, [{ points: 25 }, { points: -4 }, { points: 7.6 }, { points: NaN }]);
eq(pinned.slice(0, 5).map((d) => d.points), [20, 0, 8, 0, 0], "pin clamps and rounds");
eq([s.lpNormalise(120), s.lpNormalise(84), s.lpTier(80).label, s.lpTier(79).label], [100, 70, "Priority", "High Fit"], "lp");
'; then echo "  ok    caps, bands, action table, urgency clock, pin, lp tiers"; else fails=$((fails + 1)); echo "  FAIL  scoring arithmetic"; fi

echo "deal-score-cli.mjs"
ok "prompt"            $D prompt --deal $FIX/deal.json --docs $FIX/docs --at $NOW
$D prompt --deal $FIX/deal.json --docs $FIX/docs --at $NOW > "$WORK/deal-prompt.txt" 2>/dev/null
has "prompt names the cut" "$WORK/deal-prompt.txt" "# cap=40000"
ok "assemble"          $D assemble --deal $FIX/deal.json --docs $FIX/docs --model-output $FIX/deal-model-output.json --at $NOW --out "$WORK/deal"
has "assemble maps the quality slug" "$WORK/deal/entry_values.json" '"example_quality": 67'
ok "reply-prompt"      $D reply-prompt --deal $FIX/deal.json --result "$WORK/deal/result.json" --purpose acknowledge --tone $FIX/docs/tone-guide.md --to founder@example.com --at $NOW
ok "extract-recipient" $D extract-recipient --thread $FIX/mails/thread.json
$D extract-recipient --thread $FIX/mails/thread.json > "$WORK/rcpt.json" 2>/dev/null
has "extract-recipient reads the From header" "$WORK/rcpt.json" '"to":"founder@example.com"'
ok "extract-recipient (form lead)" $D extract-recipient --thread $FIX/mails/thread-form.json
ok "check-mail"       $D check-mail --mail $FIX/mails/mail-acknowledge.json --purpose-list dealflow --recent $FIX/mails/recent.json --expect-to founder@example.com --now $NOW
ok "switch"           $D switch --settings $FIX/gate/settings-on.json --module dealflow
ok "gate"             $D gate --module dealflow --audit $FIX/gate/audit.json --settings $FIX/gate/settings-on.json --now $NOW --to founder@example.com --thread thr-0001 --token-out "$WORK/token.json"
has "gate writes the one-send token" "$WORK/token.json" '"to":"founder@example.com"'
ok "check-write (stage)"  $D check-write --kind stage --from New --to Screening
ok "check-write (status)" $D check-write --kind status --from Target --to Outreach
ok "check-write (score)"  $D check-write --kind score --stage New
refused "check-mail: wrong recipient" $D check-mail --mail $FIX/mails/mail-acknowledge.json --purpose-list dealflow --recent $FIX/mails/recent.json --expect-to other@example.com --now $NOW
refused "check-mail: no --expect-to"  $D check-mail --mail $FIX/mails/mail-acknowledge.json --purpose-list dealflow --recent $FIX/mails/recent.json --now $NOW
refused "gate: mode review-first"     $D gate --module dealflow --audit $FIX/gate/audit.json --settings $FIX/gate/settings-review-first.json --now $NOW --to founder@example.com --thread thr-0001
refused "gate: recipient written to inside the window" $D gate --module dealflow --audit $FIX/gate/audit.json --settings $FIX/gate/settings-on.json --now $NOW --to someone-else@example.com --thread thr-9
refused "check-write: stage into a committed stage" $D check-write --kind stage --from Screening --to Invested
refused "check-write: status into a committed status" $D check-write --kind status --from Outreach --to Commitment
refused "check-write: score on a late stage" $D check-write --kind score --stage "Term sheet"
refused "assemble: wrong dimension count" bash -c "echo '{}' > '$WORK/empty.json'; $D assemble --deal $FIX/deal.json --docs $FIX/docs --model-output '$WORK/empty.json' --out '$WORK/x'"
exit2 "unknown subcommand" $D bogus

echo "investor-cli.mjs"
ok "lp-prompt"        $I lp-prompt --investor $FIX/investors/investor.json --docs $FIX/docs --at $NOW
ok "lp-assemble"      $I lp-assemble --investor $FIX/investors/investor.json --model-output $FIX/investors/lp-model-output.json --docs $FIX/docs --at $NOW --out "$WORK/lp"
has "lp-assemble maps the fit slug" "$WORK/lp/entry_values.json" '"example_investor_fit": 70'
ok "next-step"        $I next-step --investor $FIX/investors/investor.json --now $NOW
$I next-step --investor $FIX/investors/investor.json --now $NOW > "$WORK/next.json" 2>/dev/null
has "next-step proposes a first touch" "$WORK/next.json" '"purpose": "lp-first-touch"'
ok "outreach-prompt"  $I outreach-prompt --investor $FIX/investors/investor.json --result $FIX/investors/investor-result.json --purpose lp-first-touch --tone $FIX/docs/tone-guide.md --to investor@example.com --now $NOW
ok "check-mail"       $I check-mail --mail $FIX/mails/mail-first-touch.json --module investors --recent $FIX/mails/recent.json --expect-to investor@example.com --now $NOW
ok "check-invite"     $I check-invite --invite $FIX/investors/invite.json --expect-to investor@example.com --now $NOW
ok "classify"         $I classify --record $FIX/investors/org.json
$I classify --record $FIX/investors/org.json > "$WORK/classify.json" 2>/dev/null
has "classify reads the geography from the config" "$WORK/classify.json" '"geographyFit": "core"'
refused "check-mail: first touch without the deck link" bash -c "sed 's#https://example.org/decks/lp-deck#the deck#' $FIX/mails/mail-first-touch.json > '$WORK/no-deck.json'; $I check-mail --mail '$WORK/no-deck.json' --module investors --recent $FIX/mails/recent.json --expect-to investor@example.com --now $NOW"
refused "check-invite: wrong attendee" $I check-invite --invite $FIX/investors/invite.json --expect-to someone@example.com --now $NOW
refused "check-invite: start too soon" $I check-invite --invite $FIX/investors/invite.json --expect-to investor@example.com --now 2026-10-12T09:00:00Z

echo "newsletter-cli.mjs"
ok "collect-prompt"   $N collect-prompt --items $FIX/newsletter/items.json --tone $FIX/docs/tone-guide.md
ok "check-issue"      $N check-issue --issue $FIX/newsletter/issue.json --today 2026-10-05 --items $FIX/newsletter/items.json --config "$FUND_OS_CONFIG"
ok "render"           $N render --issue $FIX/newsletter/issue.json --template $FIX/newsletter/template.html --out "$WORK/nl"
has "render keeps the service placeholders" "$WORK/nl/issue.txt" "{{unsubscribeUrl}}"
ok "render (template from the config)" $N render --issue $FIX/newsletter/issue.json --out "$WORK/nl2"
refused "check-issue: a thin issue with an http CTA" $N check-issue --issue $FIX/newsletter/issue-bad.json --today 2026-10-05 --config "$FUND_OS_CONFIG"
refused "render: an issue the template cannot take" $N render --issue $FIX/newsletter/issue-bad.json --template $FIX/newsletter/template.html --out "$WORK/nl3"

echo "Config handling"
refused "missing configuration is refused" env FUND_OS_CONFIG="$WORK/does-not-exist.json" $D check-write --kind stage --from New --to Screening

echo
echo "$runs checks, $fails failed"
[ "$fails" -eq 0 ]
