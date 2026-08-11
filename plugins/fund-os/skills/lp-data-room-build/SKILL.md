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

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `lp-thesis`, `fund-pitch-deck`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

*Fund OS v0.4.0 · skill `lp-data-room-build`. This file is the source — edit it directly.*
