---
name: financial-modeler
description: Build or review a financial model for a prospective or portfolio investment — P&L, balance sheet, cash flow, DCF valuation, SaaS unit economics and ratio analysis. Use this skill when the user says "financial model", "model the financials", "DCF", "valuation model", "unit economics" or "financial projections". Phase 03 (Due Diligence). Fund-side only.
---

# Financial Modeler

Build or review a financial model for a prospective or portfolio investment — P&L, balance sheet, cash flow, DCF valuation, SaaS unit economics and ratio analysis.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "financial model"
- "model the financials"
- "DCF"
- "valuation model"
- "unit economics"
- "financial projections"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

1. Scoping first: establish model purpose (DD / follow-on / exit / portfolio review), time horizon (3 or 5 years), company stage (pre-revenue / early / growth) and available data quality before building.
2. Build the three-statement model: P&L (revenue by line, COGS, gross profit, OpEx by function, EBITDA, net income); balance sheet (key asset/liability lines, working capital); cash flow (operating, investing, financing, free cash flow).
3. For SaaS companies apply a unit economics layer: ARR/MRR waterfall (new + expansion − churn), CAC by channel, LTV, LTV:CAC, CAC payback period, NRR cohort table.
4. Run DCF valuation: project free cash flows, compute WACC via CAPM (risk-free rate + beta × equity risk premium + size premium), apply terminal value using both Gordon Growth (sustainable growth 2–3%) and exit multiple (EV/Revenue or EV/EBITDA peer median); triangulate to a valuation range.
5. Benchmark results against stage-appropriate peers: ARR growth top quartile >70% at <$5M ARR; NRR >104% healthy, >115% best-in-class; GM 70–75% good, 80%+ excellent; LTV:CAC 3:1 minimum, 5–7:1 ideal; CAC payback <12 months SMB, <18 months mid-market.
6. Run ratio analysis: Profitability (ROE, ROA, gross/operating/net margin), Liquidity (current, quick, cash), Leverage (D/E, interest coverage, net debt/EBITDA), Efficiency (asset turnover, receivables days), Valuation (EV/Revenue, EV/EBITDA, P/E, PEG).
7. Flag materiality variances (>10% vs budget / >15% vs prior period) with favourable/unfavourable classification.
8. Output model as structured tables with a one-paragraph narrative per section; offer to save to the portfolio company folder.

## Inputs

- Company financials (actuals — P&L, balance sheet, cash flow statements)
- Management projections or assumptions (if available)
- Comparable company data or sector benchmarks (optional)

## Outputs

- Three-statement financial model (structured tables)
- SaaS unit economics dashboard (SaaS companies only)
- DCF valuation range with sensitivity table (WACC × terminal growth)
- Ratio analysis table with benchmark flags
- Key assumptions log and materiality flags

## Required MCP capabilities

- Wiki / DB
- Drive
- Market data

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Fund-Templates/` — financial model template
- `Fund-Framework/` — SaaS benchmark table, valuation multiples by stage

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

GP reviews and signs off on the valuation range before it is included in an IC pack or LP report. Never share a model externally without GP sign-off.

## Example output / template

```
# Financial Model — Resolutee — DD Build
As of 2026-05-22

## Revenue model (€K)
| Metric      | 2024A | 2025A | 2026E  | 2027E  | 2028E  |
|-------------|-------|-------|--------|--------|--------|
| ARR (start) |  200  |  600  | 1,200  | 2,800  | 5,600  |
| New ARR     |  450  |  700  | 1,800  | 3,200  | 5,000  |
| Expansion   |   60  |  180  |   360  |   720  | 1,400  |
| Churn ARR   |  (50) | (280) |  (560) |  (920) |(1,400) |
| ARR (end)   |  660  |1,200  | 2,800  | 5,800  |10,600  |
| Growth %    |  —    |  82%  |  133%  |  107%  |   83%  |

## Unit economics
CAC (blended): €3,200  |  LTV: €22,400  |  LTV:CAC: 7.0× ✓
CAC payback: 9.4 months ✓  |  NRR: 107% ✓  |  Gross margin: 74% ✓

## DCF (€M)
WACC: 22%  |  Terminal growth: 3%  |  Exit multiple: 8× ARR
Gordon Growth value: €6.8M  |  Exit multiple value: €8.4M
Valuation range: €7M – €8.4M pre-money

## Benchmark flags
✓  ARR growth 133% > 70% top-quartile threshold
✓  NRR 107% > 104% healthy threshold
✓  LTV:CAC 7.0× > 5× ideal
⚠  GM 74% — in range, watch COGS as team scales
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`alirezarezvani-financial-analyst`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/fund_operations/alirezarezvani-financial-analyst) — 5-phase workflow, ratio category taxonomy, DCF/WACC/CAPM construction, materiality thresholds, SaaS unit-economics adaptation
- [`vercel-saas-financial-projections`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/vercel-saas-financial-projections) — 2025/26 SaaS benchmark tables (growth, NRR, LTV:CAC, margins, CAC payback)

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: financial-modeler@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of model purpose and valuation range>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
