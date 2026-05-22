---
name: legal-document-drafter
description: Draft term sheets, SPAs, SHAs, NDAs and side letters from the fund's clause library, adapted to deal terms and jurisdiction. Use this skill when the user says "draft term sheet", "draft SPA", "draft NDA" or any natural variant. Phase 06 (Legal & Compliance). Fund-side only.
---

# Legal Document Drafter

Draft term sheets, SPAs, SHAs, NDAs and side letters from the fund's clause library, adapted to deal terms and jurisdiction.

This skill is part of the **Fund OS** plugin, Phase 06 — Legal & Compliance.

## When to trigger

Run this skill when the user says any of:
- "draft term sheet"
- "draft SPA"
- "draft NDA"
- "draft side letter"
- "draft SHA"

## Key instructions

1. Draft from the fund's clause library; never invent clauses.
2. Show a redline vs. fund standard for any deviation; flag deviations to the deal lead.
3. Jurisdiction rules drive: governing law, dispute resolution, language, signing requirements.
4. End with an [OPEN: counsel review] note - this is never the final document.

## Inputs

- Deal terms (ticket, valuation, founders, jurisdiction)
- document type

## Outputs

- Draft legal document with deal-specific clauses
- redline against fund standard
- flagged open items

## Required MCP capabilities

- Drive
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Clause-Library`
- `Legal-Templates`
- `Jurisdiction-Rules`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

All legal docs reviewed by external counsel; no execution by skill.

## Example output / template

```
# Term sheet draft - Resolutee Seed Round v0.1

Deal lead: Partner X. Jurisdiction: Germany.
Standard: Fund Standard Term Sheet v2026.03.

DEAL TERMS (filled):
- Round size:       EUR 3m
- Pre-money:        EUR 9m
- Investor:         Fund II
- Investment:       EUR 1.5m (50% of round)
- Liq pref:         1x non-participating (FUND STANDARD)

DEVIATIONS FROM STANDARD:
- ESOP top-up:      12% post-money (standard: 10%) - founder request
- Anti-dilution:    Broad-based weighted (no deviation)

[OPEN: counsel review for German market]
[OPEN: founder vesting acceleration on change of control]
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: legal-document-drafter@1.7.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.7.0. Do not edit directly — edit the source and rebuild.*
