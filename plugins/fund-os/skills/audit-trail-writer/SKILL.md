---
name: audit-trail-writer
description: Capture every regulated action (decision, communication, KYC step) with timestamp, actor, rationale into an immutable log. Called from every other regulated skill. Use this skill when the user says "log decision", "audit trail", "compliance log" or any natural variant. Phase 06 (Legal & Compliance). Fund-side only.
---

# Audit Trail Writer

Capture every regulated action (decision, communication, KYC step) with timestamp, actor, rationale into an immutable log. Called from every other regulated skill.

This skill is part of the **Fund OS** plugin, Phase 06 — Legal & Compliance.

## When to trigger

Run this skill when the user says any of:
- "log decision"
- "audit trail"
- "compliance log"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

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

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: audit-trail-writer@1.9.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.9.0. Do not edit directly — edit the source and rebuild.*
