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

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `kpi-standards`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

*Fund OS v0.4.0 · skill `portfolio-kpi-collect`. This file is the source — edit it directly.*
