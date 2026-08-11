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

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `health-check-template`, `kpi-standards`, `red-flag-rules`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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
- [`kwp-variance-analysis`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/fund_operations/kwp-variance-analysis) — Budget-vs-actual variance decomposition to surface KPI misses during health check reviews

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: portfolio-health-check@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `portfolio-health-check`. This file is the source — edit it directly.*
