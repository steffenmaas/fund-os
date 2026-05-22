---
name: early-warning-signaler
description: Continuously scan portfolio for negative signals - missed KPI, runway shrinking, founder churn, press risk - and surface follow-on triggers (round signal, mark-up, milestone). Use this skill when the user says "early warning", "portfolio risk", "alert me if" or any natural variant. Phase 04 (Portfolio Monitoring). Fund-side only.
---

# Early Warning Signaler

Continuously scan portfolio for negative signals - missed KPI, runway shrinking, founder churn, press risk - and surface follow-on triggers (round signal, mark-up, milestone).

This skill is part of the **Fund OS** plugin, Phase 04 — Portfolio Monitoring.

## When to trigger

Run this skill when the user says any of:
- "early warning"
- "portfolio risk"
- "alert me if"
- "follow-on trigger"

## Key instructions

1. Negative-signal rules: runway < 6m, NRR < 80%, founder departure, negative press, regulatory action.
2. Follow-on trigger rules: 2x ARR in 12m, new lead investor at higher mark, regulatory milestone hit.
3. Alert priority: P1 (within hours), P2 (within 24h), P3 (weekly digest).
4. On follow-on trigger, prepare a brief and hand off to investment-memo-drafter in follow-on mode.

## Inputs

- KPI tracker
- news feeds
- meeting notes
- reserve plan

## Outputs

- Prioritised alerts with intervention recommendation
- follow-on trigger shortlist (hands off to investment-memo-drafter)

## Required MCP capabilities

- Web Search
- Meeting Intelligence
- Chat
- Spreadsheet

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Risk-Signal-Library`
- `Reserve-Strategy`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Critical alerts go to humans, not to founders.

## Example output / template

```
# Alerts - 2026-05-19

P1 (within hours):
  Cobalt AI - press article 6h ago re CEO conflict. Action: call founder today.

P2 (24h):
  Helios - cash runway dropped 9m -> 6m. Bridge financing convo by EOW.

FOLLOW-ON TRIGGER:
  Resolutee - new Tier-1 lead at EUR 35m post (2.9x mark-up).
  Handed off to investment-memo-drafter (follow-on mode).

P3 weekly:
  Three companies with NRR softening.
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`skillsmp-product-market-fit`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/skillsmp-product-market-fit) — Leading indicators (organic growth rate, DAU/MAU ratio, NPS trend) and lagging indicators (NRR, LTV:CAC, churn trajectory) as systematic early warning signals

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: early-warning-signaler@1.7.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.7.0. Do not edit directly — edit the source and rebuild.*
