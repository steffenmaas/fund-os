---
name: investment-memo-drafter
description: Generate the first draft of any investment memo - initial, follow-on, or exit - from deal data, deck, meeting notes and market research, in the fund's template. Use this skill when the user says "draft memo", "write IC memo", "investment memo" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Investment Memo Drafter

Generate the first draft of any investment memo - initial, follow-on, or exit - from deal data, deck, meeting notes and market research, in the fund's template.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "draft memo"
- "write IC memo"
- "investment memo"
- "draft follow-on memo"
- "exit memo"

## Key instructions

1. Modes (auto-detect from trigger and context): initial / follow-on / exit. Same template, different emphasis.
2. Initial: Snapshot - Team - Market - Product - Model - Traction - Risks - Terms - Open Questions.
3. Follow-on: appends 'Follow-on rationale' + reserve simulation (pro-rata / super-pro-rata / pass).
4. Every number gets a source citation in brackets. Mark unverified with [OPEN: ...].
5. Never write a recommendation. End the memo with the Open Questions list.

## Inputs

- Company file, deck, prior notes, market scan
- memo mode (initial / follow-on / exit)

## Outputs

- Memo draft with citations and clearly marked open fields
- follow-on rationale + reserve simulation in follow-on mode

## Required MCP capabilities

- Drive
- Meeting Intelligence
- CRM
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Memo-Template`
- `Investment-Thesis`
- `DD-Framework`
- `Reserve-Strategy`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Memo is a draft; partners write the recommendation.

## Example output / template

```
# Investment Memo - Resolutee (initial, draft v0.1)

## Snapshot
AI platform for commercial dispute resolution. Seed: EUR 3m @ EUR 12m post.

## Team
Anna B. (CEO), Bjorn K. (CTO).
[OPEN: commercial / head of sales hire]

(...sections...)

## Open Questions
1. Customer concentration - top customer % of MRR?
2. CAC and payback at current ARR.

# Follow-on mode addendum
## Follow-on rationale
New Tier-1 lead at EUR 35m post. Mark-up 2.9x.
## Reserve simulation
| Option        | Cheque   | Outcome                   |
| Pro-rata      | EUR 1.75m| Maintain 5% stake         |
| Super-pro-rata| EUR 2.80m| Move to 7%, signal        |
| Pass          | EUR 0    | Diluted to ~3.6%          |
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: investment-memo-drafter@1.5.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.5.0. Do not edit directly — edit the source and rebuild.*
