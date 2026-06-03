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

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

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

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
