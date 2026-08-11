#!/usr/bin/env bash
# Build the distributable .plugin bundle.
#
# This is the ONLY supported way to produce a bundle. Building one by hand is what
# produced the 0.2.2 / 0.3.7 split: bundles existed that no commit ever captured, and
# the running version drifted nine weeks ahead of git. CI runs this on every push to
# main, so every bundle has a commit behind it.
#
#   bash tools/build-plugin.sh [output-dir]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="$ROOT/plugins/fund-os"

# The zip below runs in a subshell that cd's into the plugin directory, so the output
# path must be absolute. Resolve it before anything else.
OUT_DIR="${1:-$ROOT/dist}"
mkdir -p "$OUT_DIR"
OUT_DIR="$(cd "$OUT_DIR" && pwd)"

VERSION=$(python3 -c "import json;print(json.load(open('$PLUGIN_DIR/.claude-plugin/plugin.json'))['version'])")
OUT="$OUT_DIR/fund-os-$VERSION.plugin"

echo "Fund OS — building v$VERSION"

# Never ship a bundle that has not passed validation.
python3 "$ROOT/tools/validate.py"

rm -f "$OUT"

# The repository has exactly one authored README. Copy it into the bundle at build time so
# the upload install path still ships documentation, without a second file to keep in sync.
cp "$ROOT/README.md" "$PLUGIN_DIR/README.md"
trap 'rm -f "$PLUGIN_DIR/README.md"' EXIT

# A .plugin is a zip of the plugin directory contents. Exclude OS noise and any
# real fund configuration that may exist in a working copy — the bundle must never
# carry one fund's config to another.
( cd "$PLUGIN_DIR" && zip -q -r "$OUT" . \
    -x '*.DS_Store' \
    -x '__MACOSX/*' \
    -x 'preferences/user-config.json' \
    -x '*/preferences/user-config.json' )

echo "  -> $OUT ($(wc -c < "$OUT" | tr -d ' ') bytes)"

# Prove the exclusion actually held.
if unzip -l "$OUT" | grep -qE 'preferences/user-config\.json$'; then
  echo "  ERROR: bundle contains a real user-config.json" >&2
  exit 1
fi
echo "  no fund configuration in the bundle: ok"
