---
name: thesis-fit-scorer
description: Score any startup against the fund's investment thesis on a transparent rubric - pass / watch / proceed. Use this skill when the user says "score startup", "thesis fit", "first screen" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Thesis Fit Scorer

Score any startup against the fund's investment thesis on a transparent rubric - pass / watch / proceed.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "score startup"
- "thesis fit"
- "first screen"

## Key instructions

1. Use the published scoring rubric verbatim - no extra dimensions, no skipped ones.
2. Every dimension score requires a one-line citation (deck slide, web source, founder statement).
3. If a dimension cannot be evidenced, mark it 'INSUFFICIENT DATA' rather than guessing.
4. End with one of three recommendations: PROCEED, WATCHLIST, PASS.
5. Market cross-check: if the company claims a TAM, validate it using ARPC decomposition (Customer Count × ARPC × Penetration). If founder top-down and your bottom-up estimate diverge >3×, log as 'MARKET SIZE: DISPUTED' and do not score the Market dimension above 50% pending resolution.

## Inputs

- One-pager, deck, or public data

## Outputs

- Numerical score (0-100)
- dimension breakdown
- key gaps
- recommended next step

## Required MCP capabilities

- Web Search
- Drive

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Investment-Thesis`
- `Scoring-Rubric`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Score is advisory; the IC decides.

## Example output / template

```
# Thesis fit score - Helios Sensors

Overall: 71 / 100  -> WATCHLIST

Team           14 / 20  (technical founders, no commercial co-founder)
Market         16 / 20  (TAM ~ EUR 4bn, 12% CAGR; deck p.4)
Solution       14 / 20  (sensor + SaaS, clear value prop)
Tech / moat    10 / 15  (patents pending)
Traction        9 / 15  (3 paid pilots, EUR 18k MRR)
Business model  8 / 10  (SaaS + hardware margin known)

Next step: 30-min call; ask for commercial-hire plan.
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`ailabs-startup-validator`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/ailabs-startup-validator) — Systematic startup validation workflow: market opportunity, competitive landscape, problem validation, trends, business model
- [`vc-skills-market-sizing`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/market_research/vc-skills-market-sizing) — ARPC bottom-up market sizing for TAM cross-check

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: thesis-fit-scorer@1.5.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.5.0. Do not edit directly — edit the source and rebuild.*
