---
name: market-and-competitor-mapper
description: Per-deal market and competitor scan from closed databases - competitive landscape, exit comps, regulation, M&A signals. Use this skill when the user says "market map", "competitor scan", "TAM SAM SOM" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Market & Competitor Mapper

Per-deal market and competitor scan from closed databases - competitive landscape, exit comps, regulation, M&A signals.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "market map"
- "competitor scan"
- "TAM SAM SOM"
- "exit comps"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

1. Pull from closed databases first (Dealroom / PitchBook / Specter) before public web.
2. Always produce four artefacts: (1) competitor table, (2) market sizing TAM/SAM/SOM, (3) exit comps last 24 months, (4) regulation timeline.
3. Cite every competitor row with a primary source.
4. Flag any direct competitor already in the fund's portfolio.
5. TAM/SAM/SOM: use ARPC decomposition — Market Size = Customer Count × ARPC × Penetration Rate, where ARPC = Volume/Customer/Year × Price/Unit. Segment into 3–8 mutually exclusive groups. Run a parallel top-down estimate from industry reports; if bottom-up and top-down diverge >3×, flag as 'MARKET SIZE: DISPUTED' before publishing.

## Inputs

- Company description, sector

## Outputs

- Market map
- competitor table
- exit comps
- regulation timeline

## Required MCP capabilities

- Market Data (Dealroom, PitchBook, Specter, Crunchbase)
- B2B Database (Apollo)
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Sector-Map`
- `Comparable-Transactions`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Findings reviewed for accuracy by the deal lead.

## Example output / template

```
# Competitor map - Resolutee (Legal AI)

Closed-db pulls: Dealroom (sector filter), Specter (signal tracking).

| Name        | HQ      | Stage    | Last round   | Differentiator        |
| Harvey      | US      | Series C | $80m 2025    | Big-law, horizontal   |
| Eve         | DE      | Seed     | EUR 4m 2026  | Litigation, narrow    |
| <our co>    | DE      | Seed     | -            | Dispute resolution    |

Exit comps (24m): ContractPodAI -> Carlyle 2024.

Regulation: EU AI Act high-risk effective 2026-02.
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`vc-skills-market-sizing`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/market_research/vc-skills-market-sizing) — ARPC bottom-up TAM/SAM/SOM with top-down sanity check
- [`skillsmp-analyzing-funding-landscape`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/investment_analysis/skillsmp-analyzing-funding-landscape) — Investor landscape, M&A activity, and funding round benchmarking templates
- [`sundial-competitive-intelligence`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/market_research/sundial-competitive-intelligence) — Competitive intelligence framework
- [`skillsmp-superforecaster`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/fund_operations/skillsmp-superforecaster) — Probabilistic market scenario framing; calibrated outside-view base rates for market share and growth forecasts

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: market-and-competitor-mapper@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
