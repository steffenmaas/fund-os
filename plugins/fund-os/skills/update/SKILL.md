---
name: update
description: Check whether a newer Fund OS release exists, show what changed since the installed version, and walk through the update for the install method actually in use. Never writes into the plugin directory. Trigger with "update fund OS", "check for fund OS updates", "are there new skills?" or "fund-os:update". Phase 00 (Setup). Fund-side only.
---

# Fund OS Update

Check for a newer Fund OS release, show what changed, and guide the update.

This skill is part of the **Fund OS** plugin, Phase 00 — Setup.

> **This skill never writes into the plugin directory.** Earlier versions tried to patch the
> installed plugin in place. That is what produced the 0.2.2 / 0.3.7 split: the plugin
> directory is managed by Claude (Desktop materialises it per session under
> `local-agent-mode-sessions/…/rpm/plugin_<id>/`; the CLI manages
> `~/.claude/plugins/`), so anything written there is unversioned, invisible to git, and
> discarded on the next install. Updates go through the release, not through the filesystem.

## When to trigger

Run this skill when the user says any of:
- "update fund OS"
- "check for fund OS updates"
- "are there new skills?"
- `fund-os:update`

## Key instructions

### 1. Read the installed version

```bash
cat "${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json" | python3 -c "import json,sys;print(json.load(sys.stdin)['version'])"
```

If `${CLAUDE_PLUGIN_ROOT}` is not set, say so and stop — without it there is no reliable way to know which copy is running, and guessing is what caused the split in the first place.

### 2. Read the latest release

The repository is **private**, so `raw.githubusercontent.com` returns 404 without credentials. Use the authenticated CLI:

```bash
gh release view --repo steffenmaas/fund-os --json tagName,body,publishedAt 2>/dev/null
```

If `gh` is missing or not authenticated, say exactly that and stop — do not fall back to an unauthenticated fetch that will silently 404.

### 3. Compare and report

If installed == latest: *"Fund OS is up to date (v[X])."* and stop.

Otherwise show the delta from `CHANGELOG.md` between the two versions:

```
Fund OS update available: v[installed] → v[latest]

  <changelog entries between the two versions>

Your configuration is not affected — it lives in ~/.fund-os/ and is never
touched by an update.
```

### 4. Explain the update path for the install actually in use

Detect it from `${CLAUDE_PLUGIN_ROOT}`:

| `${CLAUDE_PLUGIN_ROOT}` contains | Install method | What the user does |
|---|---|---|
| `local-agent-mode-sessions/…/rpm/` | Claude Desktop upload | Download the `fund-os-<version>.plugin` asset from the release, then in Claude Desktop: **+ → Create plugin → Upload plugin**. The new upload replaces the old one. |
| `~/.claude/plugins/marketplaces/` | CLI marketplace | `/plugin marketplace update fund-os-marketplace`, then `/plugin install fund-os@fund-os-marketplace` |
| anything else | unknown | Report the path and ask how it was installed rather than guessing. |

Download link for the Desktop path:

```bash
gh release download --repo steffenmaas/fund-os --pattern '*.plugin' --dir ~/Downloads
```

### 5. Never do any of the following

- Write, copy or `rm` anything under `${CLAUDE_PLUGIN_ROOT}`
- Edit `~/.claude/plugins/installed_plugins.json` or `known_marketplaces.json`
- Build a `.plugin` bundle by hand — bundles are built by CI so that every bundle has a commit behind it

If the user asks for an in-place patch anyway, explain the trade-off once — it works until the next reinstall, and it puts the running version out of sync with git again — and let them decide.

## Inputs

- None. Reads the installed `plugin.json` and the latest GitHub release.

## Outputs

- Installed vs. latest version
- The changelog delta between them
- The concrete update steps for the detected install method

## Required MCP capabilities

- None. Uses the Bash tool and the `gh` CLI.

## Knowledge references

None.

## Human-in-the-loop

This skill only reads and reports. Every write — the upload, the marketplace install — is performed by the user.

## Audit trail

After a reported update, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: update@0.4.0
output_ref:    ${CLAUDE_PLUGIN_ROOT}
rationale:     Fund OS update check — installed v[old], latest v[new]
```

---

*Fund OS v0.4.0 · Phase 00 — Setup*
