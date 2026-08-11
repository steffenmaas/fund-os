---
name: deal-outbound-scout
description: Source startups proactively from closed databases, accelerators, universities and events against the thesis filter. Use this skill when the user says "scout startups", "outbound sourcing", "find pre-seed in X" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Deal Outbound Scout

Source startups proactively from closed databases, accelerators, universities and events against the thesis filter.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "scout startups"
- "outbound sourcing"
- "find pre-seed in X"

## Key instructions

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `investment-thesis`, `evaluation-criteria`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-outbound-scout@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `deal-outbound-scout`. This file is the source — edit it directly.*
