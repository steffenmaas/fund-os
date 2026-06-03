---
name: public-content-composer
description: Draft public-facing content - LinkedIn posts, blog articles, op-eds, sector reports - in the fund's voice. Use this skill when the user says "draft LinkedIn post", "draft blog", "sector report" or any natural variant. Phase 07 (Ecosystem & Outreach). Fund-side only.
---

# Public Content Composer

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

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

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

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: public-content-composer@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
