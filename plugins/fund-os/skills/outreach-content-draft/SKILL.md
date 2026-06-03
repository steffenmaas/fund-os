---
name: outreach-content-draft
description: Draft public-facing content - LinkedIn posts, blog articles, op-eds, sector reports - in the fund's voice. Use this skill when the user says "draft LinkedIn post", "draft blog", "sector report" or any natural variant. Phase 07 (Ecosystem & Outreach). Fund-side only.
---

# Outreach Content Draft

Draft public-facing content - LinkedIn posts, blog articles, op-eds, sector reports - in the fund's voice.

This skill is part of the **Fund OS** plugin, Phase 07 — Ecosystem & Outreach.

## When to trigger

Run this skill when the user says any of:
- "draft LinkedIn post"
- "draft blog"
- "sector report"
- "op-ed"
- "public content"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `tone-guide`, `content-guidelines`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. If the preferences file is absent, proceed normally — run `fund-os:setup` to create it.

1. Modes: short (LinkedIn post, max 200w), long (blog / op-ed, 400-1200w), report (multi-page).
2. Voice: confident, specific, no superlatives, no 'thought leadership' language.
3. Cite numbers; pull data from market-intelligence-scanner archive when applicable.
4. File drafts under /Drafts/Public-Content/<YYYY-MM>/ - never publish directly.

## Inputs

- Topic
- mode (short / long / report)
- source material

## Outputs

- Draft content piece with style notes
- image / carousel briefs
- filed under /Drafts/Public-Content/

## Required MCP capabilities

- Drive
- Web Search
- Canvas

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Brand-Voice-Guide`
- `Content-Calendar`
- `Sector-Map`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Every piece reviewed by partner before publishing.

## Example output / template

```
# LinkedIn post draft (short mode) - 2026-05-19

The legal AI funding pile-up just hit USD 80m in one round (Harvey, Series C).

Three things we are watching:
1. Big-law is no longer the only buyer - mid-market is now budget-ready.
2. The moat is not the model; it is the workflow integration.
3. Exit landscape favours strategic acquirers, not IPO.

We are pre-seed/seed in legal AI - closed our second investment last week.

Filed: /Drafts/Public-Content/2026-05/linkedin-legal-ai.md
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: outreach-content-draft@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
