---
name: lp-newsletter-composer
description: Draft the monthly LP newsletter - portfolio highlights, fund news, sector view - personalised by LP profile. Drafts filed under /Drafts/ for partner review before send. Use this skill when the user says "LP newsletter", "monthly update", "LP letter" or any natural variant. Phase 07 (Ecosystem & Outreach). Fund-side only.
---

# LP Newsletter Composer

Draft the monthly LP newsletter - portfolio highlights, fund news, sector view - personalised by LP profile. Drafts filed under /Drafts/ for partner review before send.

This skill is part of the **Fund OS** plugin, Phase 07 — Ecosystem & Outreach.

## When to trigger

Run this skill when the user says any of:
- "LP newsletter"
- "monthly update"
- "LP letter"
- "draft newsletter"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

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

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: lp-newsletter-composer@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
