---
name: partnership-manager
description: Track partnerships with accelerators, universities, corporate VCs, other funds, and operations partners; maintain check-in cadence. Use this skill when the user says "partnership", "check-in with", "track partner" or any natural variant. Phase 07 (Ecosystem & Outreach). Fund-side only.
---

# Partnership Manager

Track partnerships with accelerators, universities, corporate VCs, other funds, and operations partners; maintain check-in cadence.

This skill is part of the **Fund OS** plugin, Phase 07 — Ecosystem & Outreach.

## When to trigger

Run this skill when the user says any of:
- "partnership"
- "check-in with"
- "track partner"
- "new partner"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

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
  Techstars Maritime    Last 2026-04-22  3 intros Q1     HIGH
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

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: partnership-manager@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
