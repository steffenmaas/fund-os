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

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `tone-guide`, `newsletter-template`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Max 350 words total. No fluff, no superlatives.

1a. **Writing style:** Apply `skills/outreach-content-draft/knowledge/writing-style-guide.md` (sections 3, 5 and 6: sentence rules, voice, anti-AI-artefact checklist) to all newsletter prose.
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
skill_version: outreach-newsletter-draft@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `outreach-newsletter-draft`. This file is the source — edit it directly.*
