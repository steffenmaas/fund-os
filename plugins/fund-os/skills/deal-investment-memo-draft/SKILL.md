---
name: deal-investment-memo-draft
description: Generate the first draft of any investment memo - initial, follow-on, or exit - from deal data, deck, meeting notes and market research, in the fund's template. Use this skill when the user says "draft memo", "write IC memo", "investment memo" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Deal Investment Memo Draft

Generate the first draft of any investment memo - initial, follow-on, or exit - from deal data, deck, meeting notes and market research, in the fund's template.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "draft memo"
- "write IC memo"
- "investment memo"
- "draft follow-on memo"
- "exit memo"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

1. Modes (auto-detect from trigger and context): initial / follow-on / exit. Same template, different emphasis.
2. Initial: Snapshot - Team - Market - Product - Model - Traction - Risks - Terms - Open Questions.
3. Follow-on: appends 'Follow-on rationale' + reserve simulation (pro-rata / super-pro-rata / pass).
4. Every number gets a source citation in brackets. Mark unverified with [OPEN: ...].
5. Never write a recommendation. End the memo with the Open Questions list.
6. SaaS benchmark validation: for any SaaS business validate key metrics against 2025 benchmarks before finalising — ARR growth (top quartile >70% at <$5m ARR), NRR (healthy >104%, best-in-class >115%), gross margin (healthy 70–75%, best-in-class 80%+), LTV:CAC (minimum 3:1, ideal 5–7:1), CAC payback (<12m SMB, <18m mid-market). Mark any metric below benchmark as [BELOW BENCHMARK: ...].

## Inputs

- Company file, deck, prior notes, market scan
- memo mode (initial / follow-on / exit)

## Outputs

- Memo draft with citations and clearly marked open fields
- follow-on rationale + reserve simulation in follow-on mode

## Required MCP capabilities

- Drive
- Meeting Intelligence
- CRM
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Memo-Template`
- `Investment-Thesis`
- `DD-Framework`
- `Reserve-Strategy`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Memo is a draft; partners write the recommendation.

## Example output / template

```
# Investment Memo - Resolutee (initial, draft v0.1)

## Snapshot
AI platform for commercial dispute resolution. Seed: EUR 3m @ EUR 12m post.

## Team
Anna B. (CEO), Bjorn K. (CTO).
[OPEN: commercial / head of sales hire]

(...sections...)

## Open Questions
1. Customer concentration - top customer % of MRR?
2. CAC and payback at current ARR.

# Follow-on mode addendum
## Follow-on rationale
New Tier-1 lead at EUR 35m post. Mark-up 2.9x.
## Reserve simulation
| Option        | Cheque   | Outcome                   |
| Pro-rata      | EUR 1.75m| Maintain 5% stake         |
| Super-pro-rata| EUR 2.80m| Move to 7%, signal        |
| Pass          | EUR 0    | Diluted to ~3.6%          |
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`vercel-saas-financial-projections`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/financial_modeling/vercel-saas-financial-projections) — 2025/26 SaaS benchmarks (ARR growth, NRR, unit economics, valuation multiples) and three-scenario projection framework
- [`skillsmp-product-market-fit`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/skillsmp-product-market-fit) — PMF indicators for traction section assessment
- [`vc-skills-market-sizing`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/market_research/vc-skills-market-sizing) — Bottom-up TAM/SAM/SOM for market section validation
- [`alirezarezvani-financial-analyst`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/fund_operations/alirezarezvani-financial-analyst) — DCF/WACC/CAPM construction and ratio taxonomy for the financial analysis section of the memo

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-investment-memo-draft@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
