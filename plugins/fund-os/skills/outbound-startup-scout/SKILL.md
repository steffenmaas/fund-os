---
name: outbound-startup-scout
description: Source startups proactively from closed databases, accelerators, universities and events against the thesis filter. Use this skill when the user says "scout startups", "outbound sourcing", "find pre-seed in X" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Outbound Startup Scout

Source startups proactively from closed databases, accelerators, universities and events against the thesis filter.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "scout startups"
- "outbound sourcing"
- "find pre-seed in X"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

1. Pull from at least three independent sources per run (closed database + accelerator + university or events).
2. Reject any candidate already touched by the fund in the last 90 days - cross-check the CRM.
3. For each surfaced startup: 1-line thesis match, founder name, contact path, latest funding event.
4. Never auto-send outreach. Output is a list with a recommended asker for warm intro.

## Inputs

- Sector + stage + geography filter
- cadence

## Outputs

- Ranked candidate list with rationale and contact path

## Required MCP capabilities

- Market Data (Dealroom, Crunchbase, Specter, PitchBook)
- B2B Database (Apollo)
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Sector-Map`
- `Investment-Thesis`
- `Source-Registry`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

No outreach without approval - this skill only produces a shortlist.

## Example output / template

```
# Outbound shortlist - week of 2026-05-19

| Company    | Stage   | Why a fit                          | Path                |
| Helios     | Pre-S   | IoT + EU + EUR 4m cap = thesis     | Warm via TUM        |
| Resolutee  | Seed    | Legal AI, DACH, female co-founder  | Inbound likely      |
| Nordwind   | Pre-S   | Climate data, Hamburg              | Cold from network   |

Sources: Dealroom DACH/Climate, Specter signals, [University Lab], Slush 2026.
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: outbound-startup-scout@1.9.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.9.0. Do not edit directly — edit the source and rebuild.*
