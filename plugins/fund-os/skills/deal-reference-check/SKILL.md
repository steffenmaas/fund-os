---
name: deal-reference-check
description: Plan, run and synthesise founder and customer reference calls - questions, scheduling, transcript synthesis. Use this skill when the user says "reference check", "schedule references", "synthesise refs" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Deal Reference Check

Plan, run and synthesise founder and customer reference calls - questions, scheduling, transcript synthesis.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "reference check"
- "schedule references"
- "synthesise refs"

## Key instructions

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `dd-framework`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-reference-check@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `deal-reference-check`. This file is the source — edit it directly.*
