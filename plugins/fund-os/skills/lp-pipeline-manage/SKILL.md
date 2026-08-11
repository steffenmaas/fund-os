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

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `lp-thesis`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

*Fund OS v0.4.0 · skill `lp-pipeline-manage`. This file is the source — edit it directly.*
