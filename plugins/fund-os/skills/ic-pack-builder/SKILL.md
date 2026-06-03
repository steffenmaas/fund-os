---
name: ic-pack-builder
description: Assemble the IC pack - deck, memo, market map, references, term sheet, cap table - and brief participants. Use this skill when the user says "prep IC", "investment committee pack", "IC briefing" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# IC Pack Builder

Assemble the IC pack - deck, memo, market map, references, term sheet, cap table - and brief participants.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "prep IC"
- "investment committee pack"
- "IC briefing"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

1. IC pack order: 1-page briefing / Memo / Deck / Market map / Reference summary / Term sheet / Cap table.
2. Always include the deal lead's three open questions on the briefing page.
3. Lock the pack as PDF before sending; never circulate editable artefacts.
4. Calendar invite must include the link to the data-room folder and an explicit RSVP deadline.

## Inputs

- Deal record, memo, all DD artefacts

## Outputs

- IC pack (PDF + Drive folder)
- 1-page briefing
- agenda

## Required MCP capabilities

- Drive
- Calendar
- CRM

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `IC-Process`
- `Memo-Template`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

All material reviewed by deal lead before circulation.

## Example output / template

```
# IC briefing - Resolutee - 2026-05-26 10:00

Deal lead: Partner X
Recommendation requested: Approve EUR 1.5m at EUR 12m post (5% stake).

Three open questions for IC:
1. Comfortable with single-jurisdiction (Germany) at this stage?
2. Lead vs follow - is EUR 12m post defensible?
3. Reserves: EUR 0.5m or EUR 1m for follow-on?

Pack: /Deals/Resolutee/IC_Pack_v1.0.pdf (45 pages)
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: ic-pack-builder@1.9.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.9.0. Do not edit directly — edit the source and rebuild.*
