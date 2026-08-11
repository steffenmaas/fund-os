---
name: portfolio-fund-view
description: Aggregate portfolio data into a fund-level view - outliers, trends, sector concentration, fund-level early warnings. Use this skill when the user says "fund view", "portfolio summary", "concentration risk" or any natural variant. Phase 04 (Portfolio Monitoring). Fund-side only.
---

# Portfolio Fund View

Aggregate portfolio data into a fund-level view - outliers, trends, sector concentration, fund-level early warnings.

This skill is part of the **Fund OS** plugin, Phase 04 — Portfolio Monitoring.

## When to trigger

Run this skill when the user says any of:
- "fund view"
- "portfolio summary"
- "concentration risk"

## Key instructions

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `kpi-standards`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Three views: aggregate KPIs, sector concentration, watch list.
2. Benchmark each company's KPIs against stage benchmarks; mark below-median yellow, below-25th-pct red.
3. Concentration risks to call out: sector >30%, single company >15% of fund value, geography >60%.
4. Narrative summary: 5 lines, plain English, partner-ready.

## Inputs

- All health checks
- KPI tracker

## Outputs

- Fund dashboard
- narrative summary
- watch list

## Required MCP capabilities

- Spreadsheet
- Wiki / DB
- Drive

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `KPI-Standards`
- `Benchmarks-by-Stage`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Numbers are sense-checked before LP reporting.

## Example output / template

```
# Fund view - 2026 Q1

Aggregate (14 companies):
  Weighted-avg ARR growth: 78% YoY
  Median NRR: 108%
  Median runway: 14 months

Concentration:
  Sector: 35% DACH B2B SaaS - ABOVE 30% threshold, monitor.
  Top NAV: Resolutee at 11% of fund value - OK.

Watch list:
  - Helios (3rd consecutive late submission)
  - Cobalt AI (NRR 102% -> 88% in Q1)
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: portfolio-fund-view@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `portfolio-fund-view`. This file is the source — edit it directly.*
