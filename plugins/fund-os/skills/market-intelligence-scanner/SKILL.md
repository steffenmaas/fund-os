---
name: market-intelligence-scanner
description: Continuous fund-wide market watch - new sector reports, M&A and funding events, regulatory changes, conferences and competitor moves - surfaced as a weekly digest with critical-alert breakouts. Use this skill when the user says "market intelligence", "sector watch", "new reports" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Market Intelligence Scanner

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

1. Three streams: (1) new reports / studies / whitepapers, (2) new deals (fundings, M&A, partnerships), (3) new events / regulation / talent moves.
2. Critical-alert rules: regulation directly affecting a portfolio company; direct competitor funding > EUR 20m; M&A in the fund's exit-comp set.
3. Archive every cited report into Fund-Market/Reports/ with a 3-line summary and tags.
4. Weekly digest is max 12 items; rank by relevance to active thesis tags.

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
- `Investment-Thesis`
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

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: market-intelligence-scanner@1.5.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.5.0. Do not edit directly — edit the source and rebuild.*
