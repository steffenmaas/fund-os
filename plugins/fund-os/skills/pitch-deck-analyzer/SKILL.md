---
name: pitch-deck-analyzer
description: Score a pitch deck across 10 dimensions, output structured feedback for the IC and the founder. Use this skill when the user says "analyse deck", "deck score", "pitch deck review" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Pitch Deck Analyzer

Score a pitch deck across 10 dimensions, output structured feedback for the IC and the founder.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "analyse deck"
- "deck score"
- "pitch deck review"

## Key instructions

1. Dimensions (fixed): Team 20%, Market 15%, Problem-Solution 15%, Tech 15%, Model 10%, Traction 10%, Competition 10%, GTM 10%, Finance 5%, Exit 5%.
2. Score each 0-10; cite the slide(s) supporting the score.
3. Always end with a numeric overall (0-100) and a recommendation: INVEST / CONDITIONAL / WATCHLIST / PASS.
4. Founder feedback section: priority-ranked, with [CRITICAL] / [HIGH] / [MEDIUM] tags.

## Inputs

- Deck PDF / PPTX

## Outputs

- Scorecard
- strengths
- gaps
- founder feedback
- IC recommendation

## Required MCP capabilities

- Drive
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Investment-Thesis`
- `Scoring-Rubric`
- `Red-Flags`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Analysis only - no investment decision.

## Example output / template

```
# Deck score - Resolutee

Overall: 78 / 100  -> CONDITIONAL INVEST

| Dim          | Wt | Score | %  |
| Team         | 20 |  8.5  | 85 |
| Market       | 15 |  7.5  | 75 |
| Solution     | 15 |  8.0  | 80 |
...

Critical gaps:
- [CRITICAL] No moat statement - asked but not answered (slide 9).
- [HIGH] Exit slide vague; no comparables (slide 18).
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`ailabs-startup-validator`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/ailabs-startup-validator) — Systematic market and competitive validation framework for cross-checking deck claims
- [`skillsmp-product-market-fit`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/skillsmp-product-market-fit) — PMF indicators for Traction dimension scoring (retention curves, NRR, DAU/MAU)
- [`vc-skills-market-sizing`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/market_research/vc-skills-market-sizing) — Bottom-up TAM/SAM/SOM for Market dimension cross-check

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: pitch-deck-analyzer@1.5.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.5.0. Do not edit directly — edit the source and rebuild.*
