---
name: outreach-newsletter-draft
description: Draft the monthly LP newsletter - portfolio highlights, fund news, sector view - personalised by LP profile. Drafts filed under /Drafts/ for partner review before send. Use this skill when the user says "LP newsletter", "monthly update", "LP letter" or any natural variant. Phase 07 (Ecosystem & Outreach). Fund-side only.
---

# Outreach Newsletter Draft

Draft the monthly LP newsletter - portfolio highlights, fund news, sector view - personalised by LP profile. Drafts filed under /Drafts/ for partner review before send.

This skill is part of the **Fund OS** plugin, Phase 07 — Ecosystem & Outreach.

## When to trigger

Run this skill when the user says any of:
- "LP newsletter"
- "monthly update"
- "LP letter"
- "draft newsletter"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

1. Max 350 words total. No fluff, no superlatives.
2. Section order: 1 fund news / 2-3 portfolio highlights / 1 sector observation / 1 ask.
3. Personalisation hint per LP: optional add-on paragraph - 1-2 lines max.
4. Always file the draft into /Drafts/LP-Newsletter/<YYYY-MM>/ and emit an audit-trail entry; never auto-send.

## Inputs

- Last 30 days of portfolio events
- fund milestones

## Outputs

- Newsletter draft filed under /Drafts/LP-Newsletter/<YYYY-MM>/
- per-LP personalisation hints
- send-ready distribution list

## Required MCP capabilities

- Email
- Wiki / DB
- Drive

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Narrative-Style-Guide`
- `LP-Database`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Newsletter approved before mass send; draft sits in /Drafts/ until then.

## Example output / template

```
# LP letter - May 2026 (DRAFT, /Drafts/LP-Newsletter/2026-05/)

Quick update from Fund II.

This month:
- Resolutee closed an oversubscribed seed at EUR 12m post.
- Cobalt AI navigating a leadership transition.

Sector watch:
- EU AI Act 'high-risk' classifications effective this month.

Ask:
- Fund III conversations starting end of Q3.

Personalisation:
  Aurora FO -> mention their recent <comp impact fund> commitment.
  Beta Pension -> reference their follow-on policy question from March.
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: outreach-newsletter-draft@2.0.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 2.0.0. Do not edit directly — edit the source and rebuild.*
