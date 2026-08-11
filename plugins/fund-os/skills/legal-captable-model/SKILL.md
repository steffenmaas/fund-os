---
name: legal-captable-model
description: Model cap tables across rounds, run dilution scenarios, calculate waterfall outcomes. Use this skill when the user says "model cap table", "calculate dilution", "waterfall" or any natural variant. Phase 06 (Legal & Compliance). Fund-side only.
---

# Legal Cap Table Model

Model cap tables across rounds, run dilution scenarios, calculate waterfall outcomes.

This skill is part of the **Fund OS** plugin, Phase 06 — Legal & Compliance.

## When to trigger

Run this skill when the user says any of:
- "model cap table"
- "calculate dilution"
- "waterfall"
- "cap table for X"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `cap-table-template`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Always show pre-round, post-round, and post-ESOP-replenishment states.
2. Waterfall: clearly model liquidation preferences (1x non-part vs participating vs senior to other prefs).
3. Anti-dilution: state the formula used (broad-based weighted is default; flag any other).
4. Save the XLSX into Drive at /Fund-Portfolio/[Company]/CapTable/ with version.

## Inputs

- Current cap table
- planned round terms
- exit assumption

## Outputs

- Cap table file (XLSX)
- dilution table
- waterfall scenarios

## Required MCP capabilities

- Spreadsheet
- Drive

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Cap-Table-Schema`
- `Waterfall-Standards`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Numbers checked by GP before circulation to founder.

## Example output / template

```
# Cap table - Resolutee (post-seed)

Pre-seed:
  Founders         85.00%   (Anna 45%, Bjorn 40%)
  ESOP             10.00%
  Angels            5.00%

Seed (EUR 3m @ EUR 12m post):
  Investors enter at 25% (Fund II 12.5%, co-invs 12.5%).
  ESOP topped up to 12% post-round.

POST-SEED:
  Founders         60.00%
  ESOP             12.00%
  Angels            3.75%
  Investors        25.00%

Exit at 5x: Fund II nets EUR 7.5m on EUR 1.5m.
File: /Fund-Portfolio/Resolutee/CapTable/v2026.05_seed.xlsx
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`vercel-saas-financial-projections`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/financial_modeling/vercel-saas-financial-projections) — SaaS unit economics formulas (LTV, CAC, CAC payback, MRR projection model) as reference for exit assumption calibration

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: legal-captable-model@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `legal-captable-model`. This file is the source — edit it directly.*
