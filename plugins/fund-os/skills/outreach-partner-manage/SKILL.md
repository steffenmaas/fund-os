---
name: outreach-partner-manage
description: Track partnerships with accelerators, universities, corporate VCs, other funds, and operations partners; maintain check-in cadence. Use this skill when the user says "partnership", "check-in with", "track partner" or any natural variant. Phase 07 (Ecosystem & Outreach). Fund-side only.
---

# Outreach Partner Manage

Track partnerships with accelerators, universities, corporate VCs, other funds, and operations partners; maintain check-in cadence.

This skill is part of the **Fund OS** plugin, Phase 07 — Ecosystem & Outreach.

## When to trigger

Run this skill when the user says any of:
- "partnership"
- "check-in with"
- "track partner"
- "new partner"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. Check `knowledge.manifest` for any relevant knowledge documents and load them from Google Drive. A document found via the Drive manifest always wins over the bundled copy.

1. Partner types: accelerator, university, corporate VC, co-investing fund, operations partner (legal, accounting).
2. Cadence: monthly check-in for active deal-flow partners, quarterly for relationship-only.
3. Partnership health: low / medium / high based on touchpoint recency + deal-flow contribution.
4. Surface stale partnerships (>90d quiet) for partner attention.

## Inputs

- Partner profile
- partnership type
- last touchpoint

## Outputs

- Partnership register
- check-in plan
- partnership health score

## Required MCP capabilities

- CRM
- Calendar
- Email

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Partner-Registry`
- `Partnership-Cadence`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

New partnership commitments require partner sign-off.

## Example output / template

```
# Partnership register - 2026-05-19

ACCELERATORS (4 active):
  Techstars (vertical)   Last 2026-04-22  3 intros Q1     HIGH
  Lloyd's Lab           Last 2026-03-10  0 - STALE       LOW

UNIVERSITIES (2 active):
  TUM Venture Labs      Last 2026-05-02  2 intros Q1     MEDIUM

CO-INVESTING FUNDS (3 active):
  Cherry Ventures       Last 2026-05-15  2 deals         HIGH

CHECK-IN PLAN (next 30d):
  Lloyd's Lab    revive call, propose new collaboration angle
  TUM            invite to founder dinner 2026-06-12
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: outreach-partner-manage@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `outreach-partner-manage`. This file is the source — edit it directly.*
