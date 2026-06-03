---
name: lp-database-prospector
description: Scan closed databases and news for new potential LPs matching the fund's LP thesis - family offices, fund-of-funds, DFIs, public news of impact-oriented investors. Use this skill when the user says "find LPs", "scout LPs", "new family offices" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# LP Database Prospector

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

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

1. Pull from at least three independent sources per run (PitchBook LP-side + news + B2B database).
2. Reject anyone already in the LP-Database with status 'Passed' in the last 12 months.
3. Score each candidate against the LP thesis: ticket fit, thesis overlap, prior commitments to comparable funds.
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

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: lp-database-prospector@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
