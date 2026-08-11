---
name: lp-database-scout
description: Scan closed databases and news for new potential LPs matching the fund's LP thesis - family offices, fund-of-funds, DFIs, public news of impact-oriented investors. Use this skill when the user says "find LPs", "scout LPs", "new family offices" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# LP Database Scout

Scan closed databases and news for new potential LPs matching the fund's LP thesis - family offices, fund-of-funds, DFIs, public news of impact-oriented investors.

This skill is part of the **Fund OS** plugin, Phase 01 — Fundraising & LP.

## When to trigger

Run this skill when the user says any of:
- "find LPs"
- "scout LPs"
- "new family offices"
- "LP prospects"
- "match LP database"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `lp-thesis`, `lp-scoring-matrix`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Pull from at least three independent sources per run (PitchBook LP-side + news + B2B database).
2. Reject anyone already in the LP-Database with status 'Passed' in the last 12 months.
3. Do not invent a scoring scheme here. Rank candidates roughly on the `lp-scoring-matrix` dimensions — ticket fit, thesis overlap, prior fund commitments — and hand the shortlist to `lp-investor-scoring` for the actual 8-dimension score. Two scoring schemes for the same entity is how scores stop being comparable.
4. Always hand off to network-intro-mapper rather than suggesting cold outreach.

## Inputs

- LP thesis (ticket, geography, focus)
- exclusion list (passed / closed LPs)

## Outputs

- Ranked LP candidate list with rationale
- source citation per candidate
- handoff to network-intro-mapper

## Required MCP capabilities

- Market Data (PitchBook LP-side, Preqin)
- B2B Database (Apollo, Cognism)
- Web Search
- CRM

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `LP-Thesis`
- `LP-Database`
- `Family-Office-Registry`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Outreach decisions remain with humans; this skill only produces shortlists.

## Example output / template

```
# LP shortlist - week of 2026-05-19

| Candidate          | Type        | Ticket fit | Thesis match | Path             |
| Aurora Family Off. | Family Off  | EUR 0.5-2m | Strong (impact)| Warm via Partner X |
| Helios Foundation  | Endowment   | EUR 1-3m   | Strong (impact)| Cold - via news    |
| Beta Wealth GmbH   | Multi-FO    | EUR 0.5-1m | Medium         | Warm via Advisor Y |

Sources: PitchBook LP-side, EIF allocations Q1, LinkedIn news.
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: lp-database-scout@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `lp-database-scout`. This file is the source — edit it directly.*
