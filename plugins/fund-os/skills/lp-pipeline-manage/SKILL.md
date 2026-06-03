---
name: lp-pipeline-manage
description: Single skill for the entire LP record lifecycle: prospect -> engaged -> in DD -> committing -> onboarded. Maintains pipeline state, watches subscription / KYC / signature deadlines. Use this skill when the user says "track LP", "update LP pipeline", "LP status" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# LP Pipeline Manage

Single skill for the entire LP record lifecycle: prospect -> engaged -> in DD -> committing -> onboarded. Maintains pipeline state, watches subscription / KYC / signature deadlines.

This skill is part of the **Fund OS** plugin, Phase 01 — Fundraising & LP.

## When to trigger

Run this skill when the user says any of:
- "track LP"
- "update LP pipeline"
- "LP status"
- "KYC deadline"
- "commitment status"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `lp-thesis`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. If the preferences file is absent, proceed normally — run `fund-os:setup` to create it.

1. Modes (auto-detected from input): prospect / engaged / in-DD / committing / onboarded.
2. Pipeline stages (canonical): Identified, Engaged, Pitched, In DD, Committing, Closed, Passed.
3. Surface anything older than: 7d for ID checks, 14d for AML, 21d for full subscription pack.
4. Always write an audit-trail entry on stage transitions and on KYC state changes.

## Inputs

- LP record updates
- fund admin data (read-only)
- signed term sheets

## Outputs

- CRM record update
- stage transition log
- aging report on KYC / subscription
- escalation list

## Required MCP capabilities

- CRM
- Fund Admin (read-only)
- Drive
- Email

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `LP-Pipeline-Stages`
- `KYC-Checklist`
- `Subscription-Workflow`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Stage transition to 'Committed' or 'Closed' requires explicit human confirmation; never writes to fund admin.

## Example output / template

```
# LP pipeline snapshot - 2026-05-19

ENGAGED (5):     Aurora FO, Helios, Gamma, Delta, Theta
IN DD (3):       Beta Pension, Iota FO, Kappa Endowment
COMMITTING (2):  Lambda Wealth (EUR 1.5m, sig due 2026-05-22)
                 Mu Family (EUR 0.8m, AML pending 14d - escalate)
CLOSED Q2 (1):   Sigma FO (EUR 2.0m, onboarded 2026-05-18)

AGING: Mu Family AML 14d (escalate today).
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: lp-pipeline-manage@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
