---
name: secondary-market-scanner
description: Watch the secondary market - LP secondaries, direct secondaries, NAV bids - and flag opportunities for both fund and LPs. Use this skill when the user says "secondary market", "LP secondaries", "NAV bid" or any natural variant. Phase 08 (Exit & Wind-Down). Fund-side only.
---

# Secondary Market Scanner

Watch the secondary market - LP secondaries, direct secondaries, NAV bids - and flag opportunities for both fund and LPs.

This skill is part of the **Fund OS** plugin, Phase 08 — Exit & Wind-Down.

## When to trigger

Run this skill when the user says any of:
- "secondary market"
- "LP secondaries"
- "NAV bid"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

1. Two streams: LP-secondary (LP wants to sell interest) and direct-secondary (per-company bids).
2. Always show bid as % of NAV and as absolute EUR figure.
3. Recommend one of: accept, negotiate, decline, pass-through to LPs.
4. Never share LP-level information across LPs.

## Inputs

- Portfolio
- broker feeds
- public deals

## Outputs

- Opportunity list with bid range and recommended action

## Required MCP capabilities

- Web Search
- Email

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Secondary-Pricing-Reference`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

All offers reviewed by GP.

## Example output / template

```
# Secondary scan - 2026-05-19

Direct secondaries:
  Resolutee: brokered bid 80% NAV (EUR 2.0m for 1% from angel).
    Recommendation: decline - implied mark below recent primary.

LP secondaries:
  Beta Pension exploring partial sale of EUR 1.5m commitment.
    Recommendation: pass-through to two FOs in queue at par.
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: secondary-market-scanner@1.9.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.9.0. Do not edit directly — edit the source and rebuild.*
