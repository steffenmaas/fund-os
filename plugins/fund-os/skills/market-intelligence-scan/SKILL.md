---
name: market-intelligence-scan
description: Continuous fund-wide market watch - new sector reports, M&A and funding events, regulatory changes, conferences and competitor moves - surfaced as a weekly digest with critical-alert breakouts. Use this skill when the user says "market intelligence", "sector watch", "new reports" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Market Intelligence Scan

Continuous fund-wide market watch - new sector reports, M&A and funding events, regulatory changes, conferences and competitor moves - surfaced as a weekly digest with critical-alert breakouts.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "market intelligence"
- "sector watch"
- "new reports"
- "new deals in"
- "regulatory update"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `investment-thesis`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Three streams: (1) new reports / studies / whitepapers, (2) new deals (fundings, M&A, partnerships), (3) new events / regulation / talent moves.
2. Critical-alert rules: regulation directly affecting a portfolio company; direct competitor funding > EUR 20m; M&A in the fund's exit-comp set.
3. Archive every cited report into Fund-Market/Reports/ with a 3-line summary and tags.
4. Weekly digest is max 12 items; rank by relevance to active thesis tags.
5. Quarterly funding landscape: once per quarter, generate an investor-landscape snapshot for each active thesis sector — top 5 investors by deal count, median round size, hottest sub-sectors, active acquirers with exit multiples. Output feeds lp-database-prospector (LP targeting) and co-investor-syndicator (co-investment sourcing).

## Inputs

- Sector watchlist
- thesis tags
- competitor list

## Outputs

- Weekly intelligence digest
- real-time alerts on critical events
- report archive entries

## Required MCP capabilities

- Market Data (Dealroom, Specter, PitchBook)
- Web Search
- Email (newsletters)
- Chat

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Sector-Map`
- `investment-thesis` — via knowledge manifest
- `Regulation-Tracker`
- `Competitor-Registry`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Critical alerts route to deal lead; digests are reviewed before LP / portfolio circulation.

## Example output / template

```
# Market intel - week of 2026-05-19

REPORTS (3):
- McKinsey 'European climate-tech deployment 2026' (climate)
  ~ EUR 18bn into climate tech EU through 2027. CAGR 22%.
- BCG 'AI in legal services' (legal-ai)
  Big-law adoption tipping point reached; mid-market still open.

DEALS (5):
- Harvey raises USD 80m Series C (legal-ai, direct competitor) - ALERT
- ContractPodAI acquired by Carlyle (legal-ai, exit comp)

EVENTS / REGULATION (4):
- EU AI Act high-risk effective 2026-06-01 - touches 2 portfolio cos.
- Slush 2026: 14-15 Nov, Helsinki.

Alerts sent to deal lead today: Harvey funding (Resolutee impact).
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`skillsmp-analyzing-funding-landscape`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/investment_analysis/skillsmp-analyzing-funding-landscape) — Investor landscape analysis, M&A tracking, funding round benchmarking, and deal volume analysis templates
- [`tradermonty-bubble-detector`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/investment_analysis/tradermonty-bubble-detector) — Market cycle and sector bubble detection for macro signal monitoring

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: market-intelligence-scan@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `market-intelligence-scan`. This file is the source — edit it directly.*
