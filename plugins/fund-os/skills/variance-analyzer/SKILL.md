---
name: variance-analyzer
description: Decompose budget-vs-actual variances for a portfolio company — price/volume/mix effects, headcount and spend category breakdowns, materiality flagging and narrative bridge. Use this skill when the user says "variance analysis", "budget vs actual", "explain the variance", "why did [metric] miss" or "financial variance". Phase 04 (Portfolio Monitoring). Fund-side only.
---

# Variance Analyzer

Decompose budget-vs-actual variances for a portfolio company — price/volume/mix effects, headcount and spend category breakdowns, materiality flagging and narrative bridge.

This skill is part of the **Fund OS** plugin, Phase 04 — Portfolio Monitoring.

## When to trigger

Run this skill when the user says any of:
- "variance analysis"
- "budget vs actual"
- "explain the variance"
- "why did [metric] miss"
- "financial variance"
- "budget bridge"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

1. Establish comparison basis: Actual vs Budget (primary), Actual vs Prior Period, Actual vs Forecast. Always state which comparison is being run.
2. Apply materiality thresholds before deep-diving: Actual vs Budget >10% or >€50K; Actual vs Prior >15%; Actual vs Forecast >5%; Sequential >20%. Only flag variances that breach these thresholds.
3. Decompose revenue variances into Price Effect and Volume Effect: Volume Effect = (Actual Vol − Budget Vol) × Budget Price; Price Effect = (Actual Price − Budget Price) × Actual Volume; Total Variance = Price Effect + Volume Effect.
4. Decompose cost variances by category: headcount (rate × FTE count), COGS (input price × units), OpEx by function (R&D, S&M, G&A).
5. Build a text-based waterfall bridge: list each driver as [Item]: [FAV/UNFAV] €[amount] ([%]) vs [basis] — Driver: [explanation]. Outlook: [trajectory]. Action: [owner + timeline].
6. Produce a three-way comparison table (Budget / Actual / Forecast) for all material line items.
7. Classify each variance as: Structural (persistent, requires plan adjustment), Timing (will reverse next period), One-off (non-recurring), Unknown (flag for founder clarification).
8. Summarise in ≤3 sentences: total variance, primary driver, recommended action.

## Inputs

- Actual financials (P&L, or specific line items)
- Budget or prior period financials
- Forecast (if available)
- Period (month / quarter)

## Outputs

- Materiality-filtered variance table
- Price/Volume decomposition for revenue lines
- Cost decomposition by category
- Waterfall bridge narrative
- Three-way comparison table (Budget / Actual / Forecast)
- Variance classification (Structural / Timing / One-off / Unknown)
- 3-sentence executive summary with recommended action

## Required MCP capabilities

- Wiki / DB
- Drive

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Fund-Portfolio/` — company KPI tracker and prior period financials
- `Fund-Templates/` — variance reporting template

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Variances classified as Structural (>10% budget miss persisting ≥2 consecutive periods) require GP review. The variance report may be shared with the founder without GP sign-off; inclusion in LP reports requires GP sign-off.

## Example output / template

```
# Variance Analysis — Resolutee — Q1 2026
Actual vs Budget  |  Materiality: >10% or >€10K

## Executive summary
Q1 Revenue missed budget by €42K (−14%) driven entirely by slower new logo acquisition
(−22%); expansion ARR was on-plan. The miss is structural — sales motion unproven at
current ACV — and requires hiring the first AE within 30 days to protect the Q2 plan.

## Waterfall bridge (Revenue, €K)
Budget Revenue:   310
  New ARR:        UNFAV €(68K) (−22%) — Volume effect: 5 fewer new logos × €13.6K ACV.
                  Driver: founder-led only, no sales hire. Outlook: persists. Action:
                  AE hire by 2026-06-01 (Jan Müller).
  Expansion ARR:  FAV +€26K (+18%) — Price effect: upsell module launched.
                  Driver: product. Outlook: sustains. Action: none.
Actual Revenue:   268  |  Net variance: UNFAV €(42K) (−14%)

## Three-way comparison (€K)
| Line          | Budget | Actual | Forecast | vs Budget | vs Fcst |
|---------------|--------|--------|----------|-----------|---------|
| New ARR       |   310  |   242  |   220    |  −22% ⚠  |  +10%   |
| Expansion ARR |   145  |   171  |   165    |  +18% ✓  |   +4%   |
| Total Revenue |   455  |   413  |   385    |   −9%    |   +7%   |
| COGS          |   120  |   108  |   115    |  +10% ✓  |   −6%   |
| Gross Profit  |   335  |   305  |   270    |   −9%    |  +13%   |

## Variance classification
New ARR miss:    Structural — sales motion unvalidated without dedicated AE.
Expansion win:   Structural — product-led expansion proving out.
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`kwp-variance-analysis`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/fund_operations/kwp-variance-analysis) — Price/Volume decomposition, materiality thresholds (10%/15%/5%/20%), waterfall bridge narrative format, three-way comparison framework, variance classification taxonomy (Structural/Timing/One-off)

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: variance-analyzer@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of company, period and primary variance driver>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
