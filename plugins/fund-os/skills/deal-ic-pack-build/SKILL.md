---
name: deal-ic-pack-build
description: Assemble the IC pack - deck, memo, market map, references, term sheet, cap table - and brief participants. Use this skill when the user says "prep IC", "investment committee pack", "IC briefing" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Deal IC Pack Build

Assemble the IC pack - deck, memo, market map, references, term sheet, cap table - and brief participants.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "prep IC"
- "investment committee pack"
- "IC briefing"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `investment-thesis`, `dd-framework`, `memo-template`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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
- `memo-template` — via knowledge manifest
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

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-ic-pack-build@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `deal-ic-pack-build`. This file is the source — edit it directly.*
