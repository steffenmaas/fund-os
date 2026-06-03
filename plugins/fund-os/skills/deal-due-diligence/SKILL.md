---
name: deal-due-diligence
description: Plan and run the full due diligence process for a deal — workstreams, data room checklist, reference checks, financial benchmarks, and IC memo draft — anchored to the fund's evaluation criteria and DD framework. Use this skill when the user says "run DD", "start due diligence", "draft memo", "IC memo", "DD plan" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Deal Due Diligence

Plan and run the full due diligence process — from data room to IC memo draft — anchored to the fund's own evaluation criteria and DD framework.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "run DD"
- "start due diligence"
- "due diligence plan"
- "draft memo"
- "draft the IC memo"
- "write IC memo"
- "investment memo"
- "draft follow-on memo"
- "exit memo"
- `fund-os:deal-due-diligence`

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.deals` as the default save location for DD artefacts; `storagePaths.drafts` for the memo draft. Reference `systems.crm`, `systems.documentStorage` and `systems.meetingNotes` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `evaluation-criteria`, `investment-thesis`, `dd-framework`, `memo-template`. Read each document before proceeding — this ensures you apply the fund's own criteria rather than generic defaults. If the preferences file is absent, proceed normally — run `fund-os:setup` to create it.

1. **Evaluation criteria check first.** Before opening any other document, load `evaluation-criteria`. Verify the deal has passed all hard filters and received a P1 or P2 priority tag from `deal-flow-triage`. If the deal is P3 or Pass, surface this prominently and ask the user to confirm DD is intentional before continuing.

2. **Detect mode from context:**
   - **DD plan** — user has just approved a deal for DD; output workstream table, data room checklist, and timeline anchored to today.
   - **Memo draft (initial)** — user has deal data and wants the IC memo. Sections: Snapshot · Team · Market · Product · Model · Traction · Risks · Terms · Open Questions.
   - **Memo draft (follow-on)** — same template, appends: Follow-on rationale + reserve simulation (pro-rata / super-pro-rata / pass).
   - **Memo draft (exit)** — same template, adapted for exit scenario.

3. **DD plan output:** Use the workstreams, timeline and data room checklist from `dd-framework`. Assign owners from `masterData.team` in preferences. Show a timeline table anchored to today's date.

4. **Memo draft rules:**
   - Every number gets a source citation in brackets — e.g. `[deck p.7]`, `[Granola note 2025-05-12]`, `[Specter]`.
   - Mark unverified items as `[OPEN: ...]`.
   - Never write a recommendation. End the memo with the Open Questions list.
   - SaaS benchmark validation: for any SaaS business validate key metrics against 2025 benchmarks before finalising — ARR growth (top quartile >70% at <$5M ARR), NRR (healthy >104%, best-in-class >115%), gross margin (healthy 70–75%, best-in-class 80%+), LTV:CAC (minimum 3:1, ideal 5–7:1), CAC payback (<12m SMB, <18m mid-market). Mark any metric below benchmark as `[BELOW BENCHMARK: ...]`.

5. **Red flags from evaluation criteria.** If any red flag defined in `evaluation-criteria` is present in the deal data, surface it prominently before the memo body — do not bury it in the Risks section.

## Inputs

- Company file, deck, prior meeting notes, market scan
- DD mode (plan / memo initial / memo follow-on / memo exit)

## Outputs

- **DD plan mode:** workstream table with owners + timeline + data room checklist
- **Memo mode:** IC memo draft with citations, benchmarks and open questions; follow-on addendum if applicable

## Required MCP capabilities

- Drive
- Meeting Intelligence
- CRM
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `evaluation-criteria` — hard filters, red flags, P-tag routing (loaded from Drive manifest; source template at `deal-flow-triage/knowledge/evaluation-criteria.md`)
- `investment-thesis` — thesis alignment check for the market section
- `dd-framework` — workstreams, timeline, data room checklist, IC memo requirements
- `memo-template` — memo structure and section formatting

## Human-in-the-loop

Memo is always a draft. Partners write the recommendation and sign off before the IC meeting.

## Example output / template

```
# Due Diligence — Resolutee
Mode: IC memo draft (initial) · v0.1

## Snapshot
AI platform for commercial dispute resolution. Seed: EUR 3m @ EUR 12m post.

## Team
Anna B. (CEO, 2× founder) · Bjorn K. (CTO, ex-Klarna)
[OPEN: commercial lead — hire timeline unclear]

## Market
TAM: €4.2B commercial dispute resolution (Europe) [Specter, 2025]
SAM: €800M addressable via SaaS (mid-market legal depts) [bottom-up estimate, deck p.5]

## Product
AI-assisted mediation workflow. Moat: proprietary dataset of 50K resolved cases.
[OPEN: IP assignment from founding institution confirmed?]

## Traction
ARR: €480K (+110% YoY) [data room 2025-04-01]
NRR: 118% [ABOVE BENCHMARK ✓]
Top-3 customers: 42% of ARR [OPEN: churn risk if one churns]

## Risks
1. Customer concentration — mitigant: 3 enterprise LOIs in pipeline
2. Regulatory risk (EU AI Act) — mitigant: legal opinion obtained [OPEN: share with us]
3. Key-person dependency on CEO — mitigant: CTO confirmed as equal co-founder

## Open Questions
1. IP ownership from founding university — formal assignment?
2. CAC and payback at current team size
3. EU AI Act legal opinion — can they share?

---
Follow-on addendum (if applicable):

## Follow-on rationale
New Tier-1 lead at EUR 35m post. Mark-up 2.9×.

## Reserve simulation
| Option         | Cheque    | Outcome                 |
|---|---|---|
| Pro-rata       | EUR 1.75m | Maintain 5% stake       |
| Super-pro-rata | EUR 2.80m | Move to 7%, send signal |
| Pass           | EUR 0     | Diluted to ~3.6%        |
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
skill_version: deal-due-diligence@0.2.2
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.2.2 · Phase 03 — Due Diligence*
