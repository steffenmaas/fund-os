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

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `tone-guide`, `content-guidelines`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. **Writing style is mandatory:** Read `knowledge/writing-style-guide.md` in this skill folder and apply all nine sections to every draft. Core rules: structure as Why → What → How; hook in the first two lines; one idea per sentence, 15–25 word ceiling; tension before resolution; founder voice from real experience; real numbers over adjectives; generate 5+ headline options per the headline rules; run the anti-AI-artefact checklist and the quality gate before filing.
2. Modes: short (LinkedIn post, max 200w), long (blog / op-ed, 600-1200w, ~4 min read), report (multi-page, executive summary first).
3. Voice: confident, specific, no superlatives, no 'thought leadership' language. First person where the author is named.
4. Cite numbers; pull data from market-intelligence-scanner archive when applicable.
5. File drafts under /Drafts/Public-Content/<YYYY-MM>/ - never publish directly.

## Inputs

- Topic
- mode (short / long / report)
- source material

## Outputs

- Draft content piece with style notes and quality-gate result
- image / carousel briefs
- filed under /Drafts/Public-Content/

## Required MCP capabilities

- Drive
- Web Search
- Canvas

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `writing-style-guide.md` (in this skill's `knowledge/` folder — mandatory)
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

Quality gate: passed (hook ✓, why-first ✓, numbers ✓, artefact check ✓, length ✓)
Filed: /Drafts/Public-Content/2026-05/linkedin-legal-ai.md
```

## Audit trail
