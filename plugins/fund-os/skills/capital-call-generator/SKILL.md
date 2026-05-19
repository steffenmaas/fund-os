---
name: capital-call-generator
description: Compute the call quota per LP, draft the call notices and chase open commitments through to receipt. Use this skill when the user says "capital call", "draw down", "call notice" or any natural variant. Phase 05 (Reporting & Impact). Fund-side only.
---

# Capital Call Generator

Compute the call quota per LP, draft the call notices and chase open commitments through to receipt.

This skill is part of the **Fund OS** plugin, Phase 05 — Reporting & Impact.

## When to trigger

Run this skill when the user says any of:
- "capital call"
- "draw down"
- "call notice"

## Key instructions

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

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: capital-call-generator@1.5.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.5.0. Do not edit directly — edit the source and rebuild.*
