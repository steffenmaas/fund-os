---
name: portfolio-kpi-collect
description: Coordinate the monthly KPI request to portfolio companies, parse PDFs / XLSX, normalise into the central dashboard. Use this skill when the user says "collect KPIs", "monthly KPI run", "remind portfolio" or any natural variant. Phase 04 (Portfolio Monitoring). Fund-side only.
---

# Portfolio KPI Collect

Coordinate the monthly KPI request to portfolio companies, parse PDFs / XLSX, normalise into the central dashboard.

This skill is part of the **Fund OS** plugin, Phase 04 — Portfolio Monitoring.

## When to trigger

Run this skill when the user says any of:
- "collect KPIs"
- "monthly KPI run"
- "remind portfolio"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

1. Send reminders on D+0, D+3, D+7 - escalate to partner contact on D+10.
2. Always parse to the fund's canonical schema; reject submissions missing required fields.
3. Use the same column names everywhere: MRR, ARR, NRR, GRR, Cash, Runway, Headcount, NPS.
4. Maintain a per-company late-submission tally for the fund-view aggregator.

## Inputs

- Reporting schedule
- company list

## Outputs

- Sent reminders
- parsed metrics
- exception list

## Required MCP capabilities

- Email
- Spreadsheet
- Wiki / DB

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `KPI-Standards`
- `Reporting-Standards`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Tracker updates flagged for human sign-off.

## Example output / template

```
# May 2026 KPI run - status

Companies:   14
Submitted:   11 (on time)
Late D+3-7:   2
Escalation:   1 (Helios, 14d late, 3rd month)

Exceptions:
- Resolutee: NRR field missing - request resend.
- Nordwind:  Cash differs from fund-admin by EUR 80k - reconcile.
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: portfolio-kpi-collect@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
