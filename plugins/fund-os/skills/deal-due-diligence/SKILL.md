---
name: deal-due-diligence
description: Plan and run the full due diligence process for a deal — workstreams, data room checklist, reference checks, financial benchmarks, and the IC memo draft (initial, follow-on or exit) in the fund's O1 Framework format — anchored to the fund's evaluation criteria and DD framework. Use this skill when the user says "run DD", "start due diligence", "DD plan", "draft memo", "write IC memo", "investment memo", "follow-on memo" or "exit memo" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Deal Due Diligence

Plan and run the full due diligence process — from data room to IC memo draft — anchored to the fund's own evaluation criteria and DD framework.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "run DD"
- "start due diligence"
- "due diligence plan"
- "DD plan"
- "draft memo"
- "draft the IC memo"
- "write IC memo"
- "investment memo"
- "draft follow-on memo"
- "exit memo"
- `fund-os:deal-due-diligence`

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, outside the plugin, so it survives every update. If it is missing, say so and stop: *"Fund OS is not configured — run `fund-os:setup` first."* Do not silently continue with defaults; an unconfigured run produces a memo with the wrong fund name, wrong ticket sizes and the wrong save location.

   From the config, apply `brandGuidelines.tone` to all prose. Use `storagePaths.deals` for DD artefacts and `storagePaths.drafts` for the memo draft. Reference `systems.crm`, `systems.documentStorage` and `systems.meetingNotes` by their configured names. From `knowledge.manifest`, load `evaluation-criteria`, `investment-thesis`, `dd-framework`, `saas-benchmarks` and `memo-template` from Drive if present — a Drive document always wins over the bundled copy.

1. **Evaluation criteria check first.** Before opening any other document, load `evaluation-criteria`. Verify the deal has passed all hard filters and holds a P1 or P2 priority tag from `deal-flow-triage`. If the deal is P3 or Pass, surface this prominently and ask the user to confirm DD is intentional before continuing.

2. **Detect mode from context:**
   - **DD plan** — a deal has just been approved for DD; output workstream table, data room checklist and timeline anchored to today.
   - **Memo draft (initial)** — deal data is in hand and the IC memo is wanted.
   - **Memo draft (follow-on)** — same template, plus follow-on rationale and reserve simulation.
   - **Memo draft (exit)** — same template, adapted for the exit scenario.

3. **DD plan output.** Use the workstreams, timeline and data room checklist from `dd-framework`. Assign owners from `masterData.team`. Show a timeline table anchored to today's date.

4. **Memo draft — always load `${CLAUDE_PLUGIN_ROOT}/skills/deal-due-diligence/templates/memo-template.md` and follow its structure exactly** (the O1 Framework format). An overlay at `~/.fund-os/templates/memo-template.md` wins if present.

   **Section order (O1 format):** Header (company, tagline, sector, Round/Ticket/Post-Money/Equity grid, HQ/Legal Entity/Website) — Analysis Status + Summary Findings — 1. Executive Summary — 2. O1 Framework Overall Scorecard — 3. Detailed Assessment by Dimension — 4. Competitive Analysis — 5. Valuation Analysis — 6. Opportunities & Risks — 7. Recommendation + Next Steps.

5. **O1 Scorecard (mandatory).** Score all 10 dimensions and compute the weighted total /100. Weights: Team 20%, Market Opportunity 15%, Problem–Solution Fit 15%, Technology & Product 10%, Business Model 10%, Traction & Validation 10%, Competition & Differentiation 5%, Go-to-Market 5%, Financial Planning & Use of Funds 5%, Exit Potential 5% — these sum to 100% (+ optional Storytelling & Design bonus, 0% weight). Bands: ≥90 Strong Conviction · 75–89 Investable — Minor Gaps · 60–74 Watchlist — Material Gaps · <60 Pass. Each dimension gets a two-column table: positive signals (+) vs. negative signals / risks (−).

6. **Follow-on mode** appends the follow-on rationale and a reserve simulation (pro-rata / super-pro-rata / pass).

7. **Citations.** Every number gets a source citation in brackets — e.g. `[deck p.7]`, `[Granola note 2026-05-12]`, `[Specter]`. Mark unverified items as `[OPEN: ...]`.

8. **SaaS benchmark validation.** For any SaaS business, validate key metrics against 2026 benchmarks before finalising — ARR growth (top quartile >70% at <$5M ARR), NRR (healthy >104%, best-in-class >115%), gross margin (healthy 70–75%, best-in-class 80%+), LTV:CAC (minimum 3:1, ideal 5–7:1), CAC payback (<12m SMB, <18m mid-market). Mark any metric below benchmark as `[BELOW BENCHMARK: ...]`.

9. **Red flags from evaluation criteria.** If any red flag defined in `evaluation-criteria` is present in the deal data, surface it prominently **before** the memo body — do not bury it in the Risks section.

10. **The Recommendation section is written by the partners.** Populate Status, Total Score and Recommended Next Steps, but leave the final invest/pass call to them. End the memo with the Open Questions list.

## Inputs

- Company file, deck, prior meeting notes, market scan
- Mode (DD plan / memo initial / memo follow-on / memo exit)

## Outputs

- **DD plan mode:** workstream table with owners + timeline + data room checklist
- **Memo mode:** IC memo draft in O1 Framework format with citations, benchmarks and open questions; follow-on addendum if applicable

## Required MCP capabilities

- Drive
- Meeting Intelligence
- CRM
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

Bundled in this plugin, overridable from `~/.fund-os/knowledge/` and from the Drive manifest:

- `evaluation-criteria` — hard filters, red flags, P-tag routing (source template at `${CLAUDE_PLUGIN_ROOT}/skills/deal-flow-triage/knowledge/evaluation-criteria.md`)
- `${CLAUDE_PLUGIN_ROOT}/skills/deal-flow-triage/knowledge/investment-thesis.md` — thesis alignment check for the market section (single source; overlay at `~/.fund-os/knowledge/investment-thesis.md` wins)
- `${CLAUDE_PLUGIN_ROOT}/skills/deal-due-diligence/knowledge/saas-benchmarks.md` — SaaS benchmarks for the Traction and Valuation sections
- `${CLAUDE_PLUGIN_ROOT}/skills/deal-due-diligence/knowledge/dd-framework.md` — workstreams, timeline, data room checklist, IC memo requirements
- `${CLAUDE_PLUGIN_ROOT}/skills/deal-due-diligence/templates/memo-template.md` — memo structure and section formatting

## Human-in-the-loop

The memo is always a draft. Partners write the recommendation and sign off before the IC meeting.

## Example output / template

The full O1 Framework structure lives in `templates/memo-template.md` — always load and follow it. Skeleton:

```
**INVESTMENT NOTE — [COMPANY]**
[tagline] | [sector]
[Fund Name] | [Month Year] | Confidential – Internal Use Only

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
- [`vercel-saas-financial-projections`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/financial_modeling/vercel-saas-financial-projections) — SaaS benchmarks (ARR growth, NRR, unit economics, valuation multiples) and three-scenario projection framework
- [`skillsmp-product-market-fit`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/skillsmp-product-market-fit) — PMF indicators for traction section assessment
- [`vc-skills-market-sizing`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/market_research/vc-skills-market-sizing) — Bottom-up TAM/SAM/SOM for market section validation
- [`alirezarezvani-financial-analyst`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/fund_operations/alirezarezvani-financial-analyst) — DCF/WACC/CAPM construction and ratio taxonomy for the financial analysis section

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-due-diligence@0.4.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · Phase 03 — Due Diligence. Merged from `deal-due-diligence` (v0.2.2: DD plan mode, evaluation-criteria gate, red-flag surfacing) and `deal-investment-memo-draft` (v0.3.7: O1 Framework memo structure, scorecard, 6 KB memo template).*
