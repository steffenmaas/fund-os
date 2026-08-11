---
name: lp-capital-call-draft
description: Compute the call quota per LP, draft the call notices and chase open commitments through to receipt. Use this skill when the user says "capital call", "draw down", "call notice" or any natural variant. Phase 05 (Reporting & Impact). Fund-side only.
---

# LP Capital Call Draft

Compute the call quota per LP, draft the call notices and chase open commitments through to receipt.

This skill is part of the **Fund OS** plugin, Phase 05 — Reporting & Impact.

## When to trigger

Run this skill when the user says any of:
- "capital call"
- "draw down"
- "call notice"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `capital-call-template`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Compute quota strictly from the subscription agreement - never derive a quota from anywhere else.
2. Each notice carries: call number, percent of commitment, EUR amount, due date, bank details, fund admin contact.
3. Always send via the registered LP email of record - cross-check against the fund admin contact register.
4. Track receipts daily until 100%; escalate to GP on day 5 after due date.

## Inputs

- Fund plan
- LP commitments
- NAV

## Outputs

- Call notices per LP
- payment tracker

## Required MCP capabilities

- Fund Admin (read)
- Email
- Drive

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Capital-Call-Template`
- `Subscription-Workflow`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

All capital calls signed off by GP.

## Example output / template

```
# Capital Call #4 - Fund II

Call: 8% of commitments. Due: 2026-06-02.

| LP            | Commit       | Call (8%)   | Status       |
| Aurora FO     | EUR 2.0m     | EUR 160k    | Notice sent  |
| Beta Pension  | EUR 5.0m     | EUR 400k    | Notice sent  |
| Gamma Capital | EUR 1.5m     | EUR 120k    | Notice sent  |

Bank: <fund admin masters this>; Ref: Fund-II-CC04-<LP-id>.
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: lp-capital-call-draft@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `lp-capital-call-draft`. This file is the source — edit it directly.*
