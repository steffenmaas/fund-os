---
name: portfolio-health-check
description: Run the monthly / quarterly health check per company - pre-load data, ask only about real gaps, populate the tracker. Use this skill when the user says "health check", "portfolio review", "company status" or any natural variant. Phase 04 (Portfolio Monitoring). Fund-side only.
---

# Portfolio Health Check

Run the monthly / quarterly health check per company - pre-load data, ask only about real gaps, populate the tracker.

This skill is part of the **Fund OS** plugin, Phase 04 — Portfolio Monitoring.

## When to trigger

Run this skill when the user says any of:
- "health check"
- "portfolio review"
- "company status"

## Key instructions

1. Pre-load: last 12 months of KPIs, last health-check, last board minutes, most recent investor update.
2. Ask the founder only about KPIs that are missing or stale (>30 days).
3. Always produce a 'changed since last review' summary at the top.
4. Flag any signal that meets a Red-Flag rule (cash runway < 6m, NRR < 80%, founder churn, customer concentration > 30%).
5. PMF pulse (consumer and SMB SaaS only): include a PMF health row — Sean Ellis score (target ≥ 40% "very disappointed"), NRR trend (leading indicator), DAU/MAU ratio. Flag any "Leaky Bucket" retention pattern (continuously declining cohort curve with no flattening) as a WARNING signal.

## Inputs

- Company folder
- last review
- current KPI tracker

## Outputs

- Updated tracker
- gap list
- warning signals
- follow-up tasks

## Required MCP capabilities

- Drive
- Wiki / DB
- Email
- Form Fields

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Health-Check-Template`
- `KPI-Standards`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Lead reviews findings before LP communication.

## Example output / template

```
# Health check - Resolutee - 2026-05-19

Since last review (60d ago):
+ MRR: EUR 32k -> EUR 41k (+28%)
+ Headcount: 6 -> 9
+ Cash runway: 14m -> 16m
~ NRR: 102% (stable)
- Top customer concentration: 24% -> 31% [WARNING]

Gaps asked of founder:
1. CAC trend last quarter?    pending
2. Sales hire ETA?            pending

Follow-up: 30-min call re. customer concentration.
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`skillsmp-product-market-fit`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/skillsmp-product-market-fit) — Sean Ellis 40% rule, Superhuman PMF Engine, retention curve analysis, leading and lagging indicators
- [`lenny-measuring-product-market-fit`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/lenny-measuring-product-market-fit) — PMF measurement and maintenance frameworks

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: portfolio-health-check@1.5.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.5.0. Do not edit directly — edit the source and rebuild.*
