---
name: lp-quarterly-reporter
description: Produce the quarterly LP report - performance, portfolio updates, NAV bridge, narrative, ready for partner sign-off. Use this skill when the user says "quarterly report", "Q1 LP report", "investor update" or any natural variant. Phase 05 (Reporting & Impact). Fund-side only.
---

# LP Quarterly Reporter

Produce the quarterly LP report - performance, portfolio updates, NAV bridge, narrative, ready for partner sign-off.

This skill is part of the **Fund OS** plugin, Phase 05 — Reporting & Impact.

## When to trigger

Run this skill when the user says any of:
- "quarterly report"
- "Q1 LP report"
- "investor update"

## Key instructions

1. Fixed structure: Highlights / NAV Bridge / Portfolio Updates / Pipeline / Operations / Outlook.
2. Highlights section: max 5 bullets, all numeric (no adjectives without numbers).
3. Per-LP cover note: 3 sentences, personal-but-not-overdone, one specific reference to that LP's prior question.
4. All financial figures pulled from fund admin verbatim - skill never recomputes NAV.

## Inputs

- Fund admin financials
- Fund View
- health checks
- impact data

## Outputs

- Quarterly report draft
- per-LP cover note
- distribution list

## Required MCP capabilities

- Fund Admin (read)
- Drive
- Email

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `LP-Reporting-Template`
- `Narrative-Style-Guide`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Numbers and narrative reviewed before send.

## Example output / template

```
# Fund II - Q1 2026 LP report (draft)

## Highlights
- NAV: EUR 38.2m (+EUR 2.1m vs Q4 2025).
- Two new investments: Resolutee (EUR 1.5m), Nordwind (EUR 0.7m).
- Three follow-ons; one mark-up at +60%.
- Deployed: EUR 22.3m (58% of committed).
- OpEx on plan; 28% of budget consumed.

## NAV Bridge
Opening 36.1  + Investments 2.2  + Mark-ups 2.0  - Fees 0.2  - FX 0.1
Closing 38.2

Per-LP cover note for Aurora FO:
'As you asked last quarter, we added a sector breakdown on page 6.'
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: lp-quarterly-reporter@1.7.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.7.0. Do not edit directly — edit the source and rebuild.*
