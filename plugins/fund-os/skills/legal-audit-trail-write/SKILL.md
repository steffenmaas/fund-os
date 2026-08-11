---
name: legal-audit-trail-write
description: Capture every regulated action (decision, communication, KYC step) with timestamp, actor, rationale into an immutable log. Called from every other regulated skill. Use this skill when the user says "log decision", "audit trail", "compliance log" or any natural variant. Phase 06 (Legal & Compliance). Fund-side only.
---

# Legal Audit Trail Write

Capture every regulated action (decision, communication, KYC step) with timestamp, actor, rationale into an immutable log. Called from every other regulated skill.

This skill is part of the **Fund OS** plugin, Phase 06 — Legal & Compliance.

## When to trigger

Run this skill when the user says any of:
- "log decision"
- "audit trail"
- "compliance log"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. Check `knowledge.manifest` for any relevant knowledge documents and load them from Google Drive. A document found via the Drive manifest always wins over the bundled copy.

1. Schema: timestamp_utc, actor, actor_type (human/skill), skill_version, action, input_hash, output_ref, rationale.
2. Append-only. Never overwrite. New corrections create a new entry referencing the old one.
3. Reject entries missing any required field - prefer 'unknown' to silence.
4. Daily summary: count entries by skill, by actor, by category - export to /audit/daily/.

## Inputs

- Event source (skill output or human action)

## Outputs

- Append-only log entry referenced by all other skills

## Required MCP capabilities

- Drive
- Wiki / DB
- Audit-Log store

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Audit-Trail-Schema`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

System-of-record; humans cannot edit, only annotate.

## Example output / template

```
# Audit log entry

timestamp_utc:  2026-05-19T11:32:18Z
actor:          partner.x@<fund>
actor_type:     human
skill_version:  investment-memo-drafter@1.3.0
action:         memo_draft_approved
input_hash:     sha256:8e2a...4b
output_ref:     /Deals/Resolutee/IC_Pack_v1.0.pdf
rationale:      'IC approved EUR 1.5m at EUR 12m post. Reserves EUR 0.5m.'
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: legal-audit-trail-write@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `legal-audit-trail-write`. This file is the source — edit it directly.*
