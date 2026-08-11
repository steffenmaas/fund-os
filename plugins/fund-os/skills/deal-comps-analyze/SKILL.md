---
name: deal-comps-analyze
description: Pull comparable public company and M&A transaction data, compute valuation multiples (EV/Revenue, EV/EBITDA, ARR multiple) and benchmark a target against peers. Use this skill when the user says "comps", "comparable companies", "comp set", "peer valuation" or "valuation multiples". Phase 03 (Due Diligence). Fund-side only.
---

# Deal Comps Analyze

Pull comparable public company and M&A transaction data, compute valuation multiples (EV/Revenue, EV/EBITDA, ARR multiple) and benchmark a target against peers.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "comps"
- "comparable companies"
- "comp set"
- "peer valuation"
- "valuation multiples"
- "what is the market paying for [sector]"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `saas-benchmarks`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Define the comp universe: identify 5–10 comparable public companies and 3–5 recent M&A transactions in the same sector, stage-adjacency and geography. Prioritise recency (transactions <3 years old weighted higher).
2. For each public comp pull: EV, Revenue (LTM + NTM), EBITDA (LTM), ARR (if SaaS), growth rate, gross margin, NRR. Compute: EV/LTM Revenue, EV/NTM Revenue, EV/EBITDA, EV/ARR.
3. For each M&A transaction pull: deal date, acquirer, target, deal value, implied ARR/Revenue multiple, strategic rationale.
4. Apply SaaS growth-adjusted multiples where relevant: median 6–7× ARR; >40% YoY growth commands 7–10×; NRR >120% = 11–12×; NRR <90% = 1–2×; apply Rule of 40 premium (+1.1× per 10 points above 40).
5. Triangulate to a valuation range for the target: anchor to median comp multiple, then adjust ±1–2 turns for premium/discount factors (growth rate, NRR, market position, management quality).
6. Present a Bull / Base / Bear scenario table with the implied pre-money valuation for each.
7. Flag any outlier comps (>2σ from median) and explain why they are included or excluded.

## Inputs

- Target company name and sector
- Target's key financials (ARR/Revenue, growth rate, NRR, gross margin)
- Preferred geography scope (global / EU / US)

## Outputs

- Public comps table (5–10 companies with multiples)
- M&A transactions table (3–5 transactions with multiples)
- Valuation range (Bull / Base / Bear) for target
- Adjustment narrative (premium/discount factors)
- Rule of 40 premium calculation (SaaS)

## Required MCP capabilities

- Market data
- Web search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Fund-Market/` — sector reports and competitor maps
- `Fund-Framework/` — SaaS valuation multiples reference table

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

GP reviews comp set selection and valuation range before inclusion in an IC pack. Market data should be verified against primary sources.

## Example output / template

```
# Comps Analysis — HR-tech SaaS / EU SMB
Target: Resolutee (ARR €1.2M, growth 133%, NRR 107%, GM 74%)
As of 2026-05-22

## Public comps
| Company  | EV (€M) | ARR (€M) | Growth | EV/ARR | EV/Rev |
|----------|---------|----------|--------|--------|--------|
| Leapsome | 320     | 45       | 42%    | 7.1×   | 7.1×   |
| Personio | 1,600   | 180      | 31%    | 8.9×   | 8.9×   |
| HiBob    | 1,100   | 120      | 38%    | 9.2×   | 9.2×   |
| Median   | —       | —        | —      | 8.4×   | 8.4×   |

## M&A transactions
| Target              | Acquirer       | Date | ARR (€M) | Multiple |
|---------------------|----------------|------|----------|----------|
| Reflektive          | Cornerstone    | 2023 | 25       | 5.5×     |
| Small Improvements  | Culture Amp    | 2024 | 8        | 7.2×     |
| Median              |                |      |          | 6.4×     |

## Valuation range — Resolutee
Base: 8.4× ARR = €10.1M pre-money
Growth premium (133% growth; Rule of 40 = 137): +1.5× → 9.9× = €11.9M

| Scenario | Multiple | Pre-money |
|----------|----------|-----------|
| Bear     | 6.5×     | €7.8M     |
| Base     | 8.4×     | €10.1M    |
| Bull     | 11.0×    | €13.2M    |

Recommended anchor: Base €10.1M.
Offer at €8.5M (15% haircut for illiquidity + early stage).
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`vercel-saas-financial-projections`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/vercel-saas-financial-projections) — valuation multiples by growth rate and NRR tier; Rule of 40 premium framework (+1.1× per 10 points)

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-comps-analyze@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of sector, comp set and valuation range>
```

---

*Fund OS v0.4.0 · skill `deal-comps-analyze`. This file is the source — edit it directly.*
