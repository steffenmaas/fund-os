---
name: exit-secondary-market-scan
description: Watch the secondary market - LP secondaries, direct secondaries, NAV bids - and flag opportunities for both fund and LPs. Use this skill when the user says "secondary market", "LP secondaries", "NAV bid" or any natural variant. Phase 08 (Exit & Wind-Down). Fund-side only.
---

# Exit Secondary Market Scan

Watch the secondary market - LP secondaries, direct secondaries, NAV bids - and flag opportunities for both fund and LPs.

This skill is part of the **Fund OS** plugin, Phase 08 — Exit & Wind-Down.

## When to trigger

Run this skill when the user says any of:
- "secondary market"
- "LP secondaries"
- "NAV bid"

## Key instructions

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. Check `knowledge.manifest` for any relevant knowledge documents and load them from Google Drive. A document found via the Drive manifest always wins over the bundled copy.

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

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: exit-secondary-market-scan@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `exit-secondary-market-scan`. This file is the source — edit it directly.*
