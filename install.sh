#!/usr/bin/env bash
# Fund OS — plug-and-play installer (no git required)
#
# Usage (run directly from the web):
#   bash <(curl -fsSL https://raw.githubusercontent.com/steffenmaas/fund-os/main/install.sh)
#
# Or download this file and run:
#   bash install.sh
#
# What it does:
#   1. Downloads the latest Fund OS plugin from GitHub
#   2. Places it in the correct Claude plugin directory
#   3. Registers the marketplace in known_marketplaces.json
#   4. Registers the installed plugin in installed_plugins.json
#   5. Prints next steps

set -euo pipefail

REPO="steffenmaas/fund-os"
BRANCH="main"
PLUGIN_NAME="fund-os"
MARKETPLACE_NAME="fund-os-marketplace"
CLAUDE_DIR="$HOME/.claude"
PLUGINS_DIR="$CLAUDE_DIR/plugins"
MARKETPLACE_DIR="$PLUGINS_DIR/marketplaces/$MARKETPLACE_NAME"
CACHE_DIR="$PLUGINS_DIR/cache/$MARKETPLACE_NAME/$PLUGIN_NAME"

# ── helpers ──────────────────────────────────────────────────────────────────

green()  { printf '\033[0;32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[0;33m%s\033[0m\n' "$*"; }
red()    { printf '\033[0;31m%s\033[0m\n' "$*"; die ""; }
die()    { [ -n "$1" ] && red "$1"; exit 1; }

require() {
  command -v "$1" >/dev/null 2>&1 || die "Required tool not found: $1. Please install it and retry."
}

# ── preflight ─────────────────────────────────────────────────────────────────

require curl
require tar

echo ""
yellow "Fund OS installer"
echo "─────────────────────────────────────────────────"
echo "Repo    : https://github.com/$REPO"
echo "Branch  : $BRANCH"
echo "Target  : $PLUGINS_DIR"
echo ""

# ── download ──────────────────────────────────────────────────────────────────

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

echo "→ Downloading fund-os from GitHub..."
curl -fsSL "https://github.com/$REPO/archive/refs/heads/$BRANCH.tar.gz" \
  -o "$TMP_DIR/fund-os.tar.gz"

echo "→ Extracting..."
tar -xz -C "$TMP_DIR" -f "$TMP_DIR/fund-os.tar.gz"
EXTRACTED_DIR="$TMP_DIR/fund-os-$BRANCH"

# ── read plugin version ───────────────────────────────────────────────────────

VERSION=$(python3 -c "
import json, sys
with open('$EXTRACTED_DIR/plugins/fund-os/.claude-plugin/plugin.json') as f:
    print(json.load(f)['version'])
" 2>/dev/null || grep '"version"' "$EXTRACTED_DIR/plugins/fund-os/.claude-plugin/plugin.json" | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')

echo "→ Plugin version: $VERSION"

# ── install files ─────────────────────────────────────────────────────────────

echo "→ Installing plugin files..."
mkdir -p "$MARKETPLACE_DIR"
cp -r "$EXTRACTED_DIR/." "$MARKETPLACE_DIR/"

INSTALL_PATH="$CACHE_DIR/$VERSION"
mkdir -p "$INSTALL_PATH"
cp -r "$EXTRACTED_DIR/plugins/$PLUGIN_NAME/." "$INSTALL_PATH/"

# ── update known_marketplaces.json ────────────────────────────────────────────

KNOWN_FILE="$PLUGINS_DIR/known_marketplaces.json"
NOW=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

if [ ! -f "$KNOWN_FILE" ]; then
  echo '{"version":1,"marketplaces":{}}' > "$KNOWN_FILE"
fi

python3 - <<PYEOF
import json, sys
with open('$KNOWN_FILE', 'r') as f:
    data = json.load(f)
data.setdefault('marketplaces', {})
data['marketplaces']['$MARKETPLACE_NAME'] = {
    'name': '$MARKETPLACE_NAME',
    'source': 'https://github.com/$REPO.git',
    'installLocation': '$MARKETPLACE_DIR',
    'addedAt': '$NOW'
}
with open('$KNOWN_FILE', 'w') as f:
    json.dump(data, f, indent=2)
PYEOF

# ── update installed_plugins.json ─────────────────────────────────────────────

INSTALLED_FILE="$PLUGINS_DIR/installed_plugins.json"

if [ ! -f "$INSTALLED_FILE" ]; then
  echo '{"version":2,"plugins":{}}' > "$INSTALLED_FILE"
fi

python3 - <<PYEOF
import json
with open('$INSTALLED_FILE', 'r') as f:
    data = json.load(f)
data.setdefault('plugins', {})
data['plugins']['${PLUGIN_NAME}@${MARKETPLACE_NAME}'] = [{
    'scope': 'user',
    'installPath': '$INSTALL_PATH',
    'version': '$VERSION',
    'installedAt': '$NOW',
    'lastUpdated': '$NOW'
}]
with open('$INSTALLED_FILE', 'w') as f:
    json.dump(data, f, indent=2)
PYEOF

# ── done ──────────────────────────────────────────────────────────────────────

echo ""
green "✓ Fund OS $VERSION installed successfully"
echo ""
echo "Next steps:"
echo "  1. Open Claude Code and run:  /reload-plugins"
echo "  2. Run the welcome wizard:    fund-os:setup"
echo "  3. Start your first skill:    /fund-os:deal-flow-triage"
echo ""
echo "To update later, re-run this script."
echo "Your preferences in ~/.fund-os-prefs.json are never touched by updates."
echo ""
