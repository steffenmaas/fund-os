---
name: lp-data-room-build
description: Assemble and refresh the LP data room (Teaser, IM, Track Record, Legal) and keep it consistent with the live fund status. Use this skill when the user says "build data room", "update data room", "prepare LP package" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# LP Data Room Build

Assemble and refresh the LP data room (Teaser, IM, Track Record, Legal) and keep it consistent with the live fund status.

This skill is part of the **Fund OS** plugin, Phase 01 — Fundraising & LP.

## When to trigger

Run this skill when the user says any of:
- "build data room"
- "update data room"
- "prepare LP package"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output and `outputStoragePath` as the default save location. From `knowledgeManifest`, load these keys from Google Drive if present: `lp-thesis`, `fund-pitch-deck`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. If the preferences file is absent, proceed normally — run `fund-os:setup` to create it.

1. Fixed folder structure: 01_Teaser, 02_IM, 03_Track_Record, 04_Legal, 05_References.
2. Stamp every document with the data-room version and date on first page.
3. Anchor tier gets additional folders: 06_Cap_Table, 07_LP_Reference_Calls.
4. Always create a per-LP access record (who, when, which version) for the audit trail.

## Inputs

- LP tier (anchor / standard / family office)
- fund version

## Outputs

- Drive folder with versioned documents
- data-room index
- access log entry

## Required MCP capabilities

- Drive
- Wiki / DB

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `LP-Document-Templates`
- `Fund-Master-Data`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Legal documents are read-only references; only humans publish new versions.

## Example output / template

```
/LP-Data-Rooms/Aurora-FO/v2026.05/
  01_Teaser/         Fund_II_Teaser_v2026.05.pdf
  02_IM/             Fund_II_IM_v2026.05.pdf
  03_Track_Record/   Fund_I_Track_Record_2026-Q1.xlsx
  04_Legal/          LPA_v2026.05.pdf
  05_References/     Founder_Reference_Letters/
  INDEX.md           auto-generated table of contents
  ACCESS.log         user, IP, timestamp per file view
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: lp-data-room-build@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
