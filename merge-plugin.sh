#!/usr/bin/env bash
# Fund OS — merge two .plugin files
#
# Merges new / changed SKILL.md files and new skill folders from REMOTE into LOCAL,
# while PRESERVING all user customisations (preferences/, knowledge/, templates/).
#
# Usage:
#   ./merge-plugin.sh local.plugin remote.plugin output.plugin
#
# Result:
#   output.plugin = local.plugin + new skills from remote + updated SKILL.md files
#                   with preferences/, knowledge/, templates/ from local untouched

set -euo pipefail

# ── args ──────────────────────────────────────────────────────────────────────

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 local.plugin remote.plugin output.plugin" >&2
  exit 1
fi

LOCAL_PLUGIN="$1"
REMOTE_PLUGIN="$2"
OUTPUT_PLUGIN="$3"

# ── helpers ───────────────────────────────────────────────────────────────────

green()  { printf '\033[0;32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[0;33m%s\033[0m\n' "$*"; }
info()   { printf '  %s\n' "$*"; }

# ── setup temp dirs ───────────────────────────────────────────────────────────

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

LOCAL_DIR="$TMP/local"
REMOTE_DIR="$TMP/remote"
OUTPUT_DIR="$TMP/output"

mkdir -p "$LOCAL_DIR" "$REMOTE_DIR" "$OUTPUT_DIR"

echo ""
yellow "Fund OS plugin merge"
echo "────────────────────────────────────────────────"
echo "  Local   : $LOCAL_PLUGIN"
echo "  Remote  : $REMOTE_PLUGIN"
echo "  Output  : $OUTPUT_PLUGIN"
echo ""

# ── extract ───────────────────────────────────────────────────────────────────

echo "→ Extracting..."
unzip -q "$LOCAL_PLUGIN"  -d "$LOCAL_DIR"
unzip -q "$REMOTE_PLUGIN" -d "$REMOTE_DIR"

# Start with a full copy of local (preserves all customisations)
cp -r "$LOCAL_DIR/." "$OUTPUT_DIR/"

# ── read versions ─────────────────────────────────────────────────────────────

LOCAL_VERSION=$(python3 -c "
import json
with open('$LOCAL_DIR/.claude-plugin/plugin.json') as f:
    print(json.load(f).get('version','?'))
" 2>/dev/null || echo "?")

REMOTE_VERSION=$(python3 -c "
import json
with open('$REMOTE_DIR/.claude-plugin/plugin.json') as f:
    print(json.load(f).get('version','?'))
" 2>/dev/null || echo "?")

echo "  Local version  : $LOCAL_VERSION"
echo "  Remote version : $REMOTE_VERSION"
echo ""

# ── diff skills ───────────────────────────────────────────────────────────────

LOCAL_SKILLS=$(ls "$LOCAL_DIR/skills/"  2>/dev/null | sort)
REMOTE_SKILLS=$(ls "$REMOTE_DIR/skills/" 2>/dev/null | sort)

NEW_SKILLS=$(comm -13 <(echo "$LOCAL_SKILLS") <(echo "$REMOTE_SKILLS"))
COMMON_SKILLS=$(comm -12 <(echo "$LOCAL_SKILLS") <(echo "$REMOTE_SKILLS"))

# ── apply: new skill folders ──────────────────────────────────────────────────

NEW_COUNT=0
if [ -n "$NEW_SKILLS" ]; then
  echo "New skills to add:"
  while IFS= read -r skill; do
    [ -z "$skill" ] && continue
    cp -r "$REMOTE_DIR/skills/$skill" "$OUTPUT_DIR/skills/"
    info "+ $skill"
    NEW_COUNT=$((NEW_COUNT + 1))
  done <<< "$NEW_SKILLS"
  echo ""
fi

# ── apply: updated SKILL.md in existing skills ────────────────────────────────
# Protected paths: preferences/ knowledge/ templates/ — never overwritten

UPDATED_COUNT=0
SKIPPED_COUNT=0
echo "Updating SKILL.md in existing skills:"
while IFS= read -r skill; do
  [ -z "$skill" ] && continue
  REMOTE_SKILL_MD="$REMOTE_DIR/skills/$skill/SKILL.md"
  LOCAL_SKILL_MD="$LOCAL_DIR/skills/$skill/SKILL.md"
  OUTPUT_SKILL_MD="$OUTPUT_DIR/skills/$skill/SKILL.md"

  if [ ! -f "$REMOTE_SKILL_MD" ]; then
    continue
  fi

  if cmp -s "$REMOTE_SKILL_MD" "$LOCAL_SKILL_MD" 2>/dev/null; then
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
  else
    cp "$REMOTE_SKILL_MD" "$OUTPUT_SKILL_MD"
    info "~ $skill  (SKILL.md updated)"
    UPDATED_COUNT=$((UPDATED_COUNT + 1))
  fi
done <<< "$COMMON_SKILLS"
echo ""

# ── apply: top-level plugin files ─────────────────────────────────────────────
# These are always taken from remote (version metadata, dashboard, README)

echo "Updating plugin metadata:"
for f in ".claude-plugin/plugin.json" "README.md" "Fund_OS_Dashboard.html" ".mcp.json.example"; do
  if [ -f "$REMOTE_DIR/$f" ]; then
    mkdir -p "$OUTPUT_DIR/$(dirname "$f")"
    cp "$REMOTE_DIR/$f" "$OUTPUT_DIR/$f"
    info "↑ $f"
  fi
done
echo ""

# ── protected paths — confirm not touched ─────────────────────────────────────

echo "Preserved (not touched):"
info "✓ preferences/user-config.json (all skills)"
info "✓ skills/*/knowledge/*"
info "✓ skills/*/templates/*"
info "✓ skills/*/preferences/*"
echo ""

# ── re-zip as output.plugin ───────────────────────────────────────────────────

echo "→ Building $OUTPUT_PLUGIN..."
(cd "$OUTPUT_DIR" && zip -r "$OLDPWD/$OUTPUT_PLUGIN" . --exclude "*.DS_Store" -q)

# ── summary ───────────────────────────────────────────────────────────────────

echo ""
green "✓ Merge complete"
echo ""
echo "  $LOCAL_VERSION → $REMOTE_VERSION"
echo "  New skills    : $NEW_COUNT"
echo "  Updated skills: $UPDATED_COUNT"
echo "  Unchanged     : $SKIPPED_COUNT"
echo ""
echo "Output saved to: $OUTPUT_PLUGIN"
echo ""
echo "Next: upload $OUTPUT_PLUGIN via Claude Desktop → Cowork → Customize → Marketplace"
echo "      or copy it to ~/.claude/plugins/cache/fund-os-marketplace/fund-os/$REMOTE_VERSION/"
echo ""
