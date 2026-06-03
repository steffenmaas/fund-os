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

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

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

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
