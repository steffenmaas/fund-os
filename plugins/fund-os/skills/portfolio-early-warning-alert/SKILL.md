---
name: portfolio-early-warning-alert
description: Continuously scan portfolio for negative signals - missed KPI, runway shrinking, founder churn, press risk - and surface follow-on triggers (round signal, mark-up, milestone). Use this skill when the user says "early warning", "portfolio risk", "alert me if" or any natural variant. Phase 04 (Portfolio Monitoring). Fund-side only.
---

# Portfolio Early Warning Alert

Continuously scan portfolio for negative signals - missed KPI, runway shrinking, founder churn, press risk - and surface follow-on triggers (round signal, mark-up, milestone).

This skill is part of the **Fund OS** plugin, Phase 04 — Portfolio Monitoring.

## When to trigger

Run this skill when the user says any of:
- "early warning"
- "portfolio risk"
- "alert me if"
- "follow-on trigger"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `red-flag-rules`, `kpi-standards`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: portfolio-early-warning-alert@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `portfolio-early-warning-alert`. This file is the source — edit it directly.*
