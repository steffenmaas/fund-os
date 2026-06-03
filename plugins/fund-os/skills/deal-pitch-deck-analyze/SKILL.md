---
name: deal-pitch-deck-analyze
description: Score a pitch deck across 10 dimensions, output structured feedback for the IC and the founder. Use this skill when the user says "analyse deck", "deck score", "pitch deck review" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Deal Pitch Deck Analyze

Score a pitch deck across 10 dimensions, output structured feedback for the IC and the founder.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "analyse deck"
- "deck score"
- "pitch deck review"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

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
- [`vasilyu-startup-idea-validation`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/vasilyu-startup-idea-validation) — 9-dimension weighted scorecard and Riskiest Assumption identification to complement deck dimension scoring

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-pitch-deck-analyze@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
