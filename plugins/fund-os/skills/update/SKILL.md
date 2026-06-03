---
name: update
description: Fetch the latest Fund OS release from GitHub, show what is new, and merge only new and changed skill files into the local plugin — preserving all preferences, knowledge and template customisations. Trigger with "update fund OS", "check for fund OS updates" or "fund-os:update". Phase 00 (Setup). Fund-side only.
---

# Fund OS Update

Fetch the latest Fund OS release from GitHub, show what is new, and merge only the new or changed skill files — your customisations (preferences, knowledge files, templates) are never touched.

This skill is part of the **Fund OS** plugin, Phase 00 — Setup.

## When to trigger

Run this skill when the user says any of:
- "update fund OS"
- "check for fund OS updates"
- "fund-os:update"
- "are there new skills?"

## Key instructions

1. **Check current version** by reading `plugin.json`:
   ```bash
   cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/plugin.json 2>/dev/null | grep version
   # or
   cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/.claude-plugin/plugin.json 2>/dev/null | grep version
   ```

2. **Fetch latest plugin.json from GitHub** to check the remote version:
   ```bash
   curl -fsSL "https://raw.githubusercontent.com/steffenmaas/fund-os/main/plugins/fund-os/.claude-plugin/plugin.json" | grep version
   ```

   If local version == remote version: tell the user "Fund OS is already up to date (v[X])." and stop.

3. **Download the latest release** to a temp directory:
   ```bash
   TMP=$(mktemp -d)
   curl -fsSL "https://github.com/steffenmaas/fund-os/archive/refs/heads/main.tar.gz" | tar -xz -C "$TMP"
   REMOTE="$TMP/fund-os-main/plugins/fund-os"
   ```

4. **Diff and show the changelog.** Compare remote skills against local:
   ```bash
   LOCAL=$(ls -d ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/skills/ | head -1)
   # New skills = dirs in remote not in local
   comm -23 <(ls "$REMOTE/skills/" | sort) <(ls "$LOCAL" | sort)
   # Changed SKILL.md files (excluding preferences/ knowledge/ templates/)
   ```
   Present a clear list:
   ```
   Fund OS update available: v[current] → v[new]

   New skills (N):
     + meeting-briefer
     + variance-analyzer

   Updated skills (M):
     ~ deal-flow-triage  (SKILL.md changed)
     ~ setup             (SKILL.md changed)

   Unchanged: 38 skills

   Your customisations (NOT touched):
     preferences/user-config.json ✓ preserved
     skills/*/knowledge/*         ✓ preserved
     skills/*/templates/*         ✓ preserved
     skills/*/preferences/*       ✓ preserved
   ```

5. **Ask for confirmation:**
   "Apply this update? (yes / no / show diff for [skill-name])"
   - If the user asks for a diff, show the SKILL.md diff for that skill before proceeding.
   - Only proceed on explicit "yes".

6. **Apply the merge** — copy only:
   - New skill folders (entire directory)
   - Updated `SKILL.md` files in existing skills
   - Updated `plugin.json`, `marketplace.json`, `README.md`, `Fund_OS_Dashboard.html`
   - **Never overwrite:** `*/preferences/*`, `*/knowledge/*`, `*/templates/*`

   ```bash
   INSTALL=$(ls -d ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/ | head -1)

   # Copy new skills
   for skill in $(comm -23 <(ls "$REMOTE/skills/" | sort) <(ls "$INSTALL/skills/" | sort)); do
     cp -r "$REMOTE/skills/$skill" "$INSTALL/skills/"
   done

   # Update SKILL.md in changed skills (skip protected dirs)
   for skill in $(ls "$REMOTE/skills/"); do
     if [ -f "$REMOTE/skills/$skill/SKILL.md" ]; then
       cp "$REMOTE/skills/$skill/SKILL.md" "$INSTALL/skills/$skill/SKILL.md"
     fi
   done

   # Update top-level plugin files
   cp "$REMOTE/.claude-plugin/plugin.json" "$INSTALL/.claude-plugin/plugin.json"
   cp "$TMP/fund-os-main/.claude-plugin/marketplace.json" \
      "$INSTALL/../../../.claude-plugin/marketplace.json" 2>/dev/null || true

   # Clean up
   rm -rf "$TMP"
   ```

7. **Update installed_plugins.json** with the new version:
   ```bash
   INSTALLED="$HOME/.claude/plugins/installed_plugins.json"
   NEW_VERSION=$(cat "$INSTALL/.claude-plugin/plugin.json" | grep '"version"' | sed 's/.*"\([0-9.]*\)".*/\1/')
   # Use python3 to update the JSON safely
   python3 -c "
   import json
   with open('$INSTALLED') as f: d = json.load(f)
   d['plugins']['fund-os@fund-os-marketplace'][0]['version'] = '$NEW_VERSION'
   with open('$INSTALLED', 'w') as f: json.dump(d, f, indent=2)
   "
   ```

8. **Confirm completion:**
   ```
   ✓ Fund OS updated to v[new version]

   New skills now available:
     /fund-os:meeting-briefer
     /fund-os:portfolio-variance-analyze

   Your preferences and customisations were preserved.
   Run /reload-plugins to activate the new skills.
   ```

## Inputs

- None required — fetches from GitHub automatically

## Outputs

- Updated SKILL.md files and new skill folders in the local plugin cache
- Updated version in `installed_plugins.json`
- Changelog shown to user before and after update

## Required MCP capabilities

- None — uses Bash tool for all file operations and HTTP fetch

The Bash tool must be available. If it is not, fall back to instructing the user to run `install.sh` manually.

## Knowledge references

None.

## Human-in-the-loop

User must explicitly confirm ("yes") before any files are written. The diff is shown first so the user knows exactly what changes.

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: update@0.2.0
output_ref:    ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/
rationale:     Fund OS updated from v[old] to v[new]; N new skills, M updated
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
