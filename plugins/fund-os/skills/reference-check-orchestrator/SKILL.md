---
name: reference-check-orchestrator
description: Plan, run and synthesise founder and customer reference calls - questions, scheduling, transcript synthesis. Use this skill when the user says "reference check", "schedule references", "synthesise refs" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Reference Check Orchestrator

Plan, run and synthesise founder and customer reference calls - questions, scheduling, transcript synthesis.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "reference check"
- "schedule references"
- "synthesise refs"

## Key instructions

1. Minimum 3 references: 1 customer, 1 ex-colleague, 1 prior investor (if any).
2. Tailor 5-7 questions per reference category; do not reuse generic question lists.
3. Synthesis must include: confirmed strengths, soft signals, red flags, things to verify elsewhere.
4. If a reference declines, log it explicitly - silence is a signal.

## Inputs

- Reference contacts
- deal context

## Outputs

- Question set
- calendar invites
- synthesis with signal strength

## Required MCP capabilities

- Calendar
- Email
- Meeting Intelligence

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Reference-Question-Bank`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Humans run the calls; agent only prepares and synthesises.

## Example output / template

```
# Reference synthesis - Resolutee

Calls completed: 3 / 3

Customer (DAX-30 GC): 'They saved us EUR 200k in litigation prep last quarter.'
  Signal: STRONG positive.

Ex-colleague (former head of legal): 'Anna is decisive; sometimes pushes
  too hard on speed.'  Signal: MIXED.

Prior investor (angel): No concerns. Clean cap table.  Signal: STRONG.

Red flags: None confirmed. To verify: founder vesting after seed.
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: reference-check-orchestrator@1.7.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.7.0. Do not edit directly — edit the source and rebuild.*
