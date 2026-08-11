---
name: exit-scenario-model
description: Model exit scenarios per company and at fund level - IPO, M&A, secondary, write-off - with NAV / TVPI impact. Use this skill when the user says "exit scenario", "exit model", "TVPI sensitivity" or any natural variant. Phase 08 (Exit & Wind-Down). Fund-side only.
---

# Exit Scenario Model

Model exit scenarios per company and at fund level - IPO, M&A, secondary, write-off - with NAV / TVPI impact.

This skill is part of the **Fund OS** plugin, Phase 08 — Exit & Wind-Down.

## When to trigger

Run this skill when the user says any of:
- "exit scenario"
- "exit model"
- "TVPI sensitivity"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `saas-benchmarks`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Four scenarios: bear / base / bull / write-off - always all four.
2. Reference at least two comparable transactions per scenario; cite source and date.
3. Show fund-level impact: NAV change, TVPI delta, DPI delta.
4. Never pick a winning scenario - present the math, let the GP decide.
5. Valuation multiple reference (SaaS, 2025): median 6–7× ARR; high-growth >40% YoY commands 7–10×; NRR >120% commands 11–12×; NRR <90% falls to 1–2×. Rule of 40 achievers add ~1.1× per 10 points above 40. State explicitly which bucket the company falls in and whether current metrics support or discount the applied multiple.

## Inputs

- Cap table
- fund model
- market comps

## Outputs

- Scenario table with NAV / TVPI / DPI deltas

## Required MCP capabilities

- Spreadsheet
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Exit-Comps`
- `Fund-Model`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Scenarios are advisory; GP decides on action.

## Example output / template

```
# Exit scenarios - Resolutee

Holding: 5% post EUR 12m post-money.

| Scenario   | Trigger              | Multiple | NAV   | TVPI delta |
| Write-off  | Failed Series A      | 0x       | 0     | -0.07x     |
| Bear       | Strategic acq EUR 25m| 1.5x     | 1.25m | +0.01x     |
| Base       | Series B EUR 80m     | 3.3x     | 2.5m  | +0.07x     |
| Bull       | IPO EUR 300m         | 12.5x    | 8.0m  | +0.32x     |

Comps cited: ContractPodAI (acq 2024), Harvey (Series C 2025).
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`vercel-saas-financial-projections`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/financial_modeling/vercel-saas-financial-projections) — 2025/26 valuation multiples by growth rate and NRR tier, Rule of 40 premium, exit scenario framework

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: exit-scenario-model@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `exit-scenario-model`. This file is the source — edit it directly.*
