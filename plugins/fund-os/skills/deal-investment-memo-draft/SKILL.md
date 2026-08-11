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

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `investment-thesis`, `dd-framework`, `memo-template`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. If the preferences file is absent, proceed normally — run `fund-os:setup` to create it.

1. **Always load `templates/memo-template.md` and follow its structure exactly** (the Ocean One / O1 Framework format). Modes (auto-detect from trigger and context): initial / follow-on / exit — same template, different emphasis.
2. **Section order (O1 format):** Header (company, tagline, sector, Round/Ticket/Post-Money/Equity grid, HQ/Legal Entity/Website) — Analysis Status + Summary Findings — 1. Executive Summary — 2. O1 Framework Overall Scorecard — 3. Detailed Assessment by Dimension — 4. Competitive Analysis — 5. Valuation Analysis — 6. Opportunities & Risks — 7. Recommendation + Next Steps.
3. **O1 Scorecard (mandatory):** score all 10 dimensions and compute the weighted total /100. Weights: Team 20%, Market Opportunity 15%, Problem–Solution Fit 15%, Technology & Product 10%, Business Model 10%, Traction & Validation 10%, Competition & Differentiation 5%, Go-to-Market 5%, Financial Planning & Use of Funds 5%, Exit Potential 5% (weights sum to 100%) (+ optional Storytelling & Design bonus, 0% weight). Bands: ≥90 Strong Conviction · 75–89 Investable — Minor Gaps · 60–74 Watchlist — Material Gaps · <60 Pass. Each dimension gets a two-column table: positive signals (+) vs. negative signals / risks (−).
4. Follow-on: appends 'Follow-on rationale' + reserve simulation (pro-rata / super-pro-rata / pass).
5. Every number gets a source citation in brackets. Mark unverified with [OPEN: ...].
6. The **Recommendation** section is written by the partners — populate Status, Total Score and Recommended Next Steps, but leave the final invest/pass call to the partners.
7. SaaS benchmark validation: for any SaaS business validate key metrics against 2025 benchmarks before finalising — ARR growth (top quartile >70% at <$5m ARR), NRR (healthy >104%, best-in-class >115%), gross margin (healthy 70–75%, best-in-class 80%+), LTV:CAC (minimum 3:1, ideal 5–7:1), CAC payback (<12m SMB, <18m mid-market). Mark any metric below benchmark as [BELOW BENCHMARK: ...].

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

The full Ocean One / O1 Framework structure lives in `templates/memo-template.md` — always load and follow it. Skeleton:

```
**INVESTMENT NOTE — [COMPANY]**
[tagline] | [sector]
Ocean One Ventures | [Month Year] | Confidential – Internal Use Only

| Round | Ticket | Post-Money | Equity |
| Pre-Seed | EUR 333K | EUR 3.33M | 10% |
| Sector | HQ | Legal Entity | Website |

## Analysis Status — [Month Year]
- Summary Findings: Score X/100 → [Band]; critical gate; valuation; open items

## 1. Executive Summary
## 2. O1 Framework — Overall Scorecard   (10 dims, weighted, /100 + band)
## 3. Detailed Assessment by Dimension    (per-dim: + signals | − risks)
## 4. Competitive Analysis                (profile, landscape, findings, funding)
## 5. Valuation Analysis                  (pricing, methods, fair value, tranching)
## 6. Opportunities & Risks               (bull | bear)
## 7. Recommendation                      (Status | Score | next steps — partners decide)

# Follow-on mode addendum
## Reserve simulation
| Option | Cheque | Outcome |
| Pro-rata | EUR 1.75m | Maintain 5% stake |
| Super-pro-rata | EUR 2.80m | Move to 7%, signal |
| Pass | EUR 0 | Diluted to ~3.6% |
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
skill_version: deal-investment-memo-draft@0.2.4
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.4. Do not edit directly — edit the source and rebuild.*
