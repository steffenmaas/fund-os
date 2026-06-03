---
name: fund-grant-scout
description: Scout public funding programmes relevant to the FUND itself - regional fund-development grants (IFB, KfW), public LP / DFI programmes, FinTech / VC innovation funding the fund can apply to as a business. Use this skill when the user says "find fund grants", "public funding for fund", "IFB" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# Fund Grant Scout

Scout public funding programmes relevant to the FUND itself - regional fund-development grants (IFB, KfW), public LP / DFI programmes, FinTech / VC innovation funding the fund can apply to as a business.

This skill is part of the **Fund OS** plugin, Phase 01 — Fundraising & LP.

## When to trigger

Run this skill when the user says any of:
- "find fund grants"
- "public funding for fund"
- "IFB"
- "KfW for fund"
- "EIF programme"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

1. Scope strictly: programmes the FUND can apply to as a business - never portfolio companies (those belong to a future Founder OS bundle).
2. Maintain the Public-Funding-Registry: programme, eligibility, ticket, deadline, success rate.
3. Filter strictly on fund eligibility (jurisdiction, KVG status, AuM bracket, focus area).
4. Application skeleton uses [OPEN: ...] placeholders for anything requiring GP / counsel input.

## Inputs

- Fund profile (jurisdiction, AuM, structure, registered KVG status)
- exclusion list

## Outputs

- Fund-level funding programme shortlist
- eligibility evidence
- application skeleton

## Required MCP capabilities

- Web Search
- Drive
- Market Data

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Public-Funding-Registry`
- `Fund-Profile`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Applications signed off by GP before submission.

## Example output / template

```
# Public funding scan - Fund II

Fund profile: Hamburg-domiciled, registered KVG, AuM target EUR 50m,
FinTech-tech focus.

| Programme                | Type             | Ticket          | Deadline    | Match |
| IFB Hamburg InnoFinTech  | Non-repayable    | up to EUR 200k  | rolling     | YES   |
| KfW ERP Innovation       | Soft loan        | up to EUR 5m    | rolling     | YES   |
| EIF AMUF                 | DFI commitment   | EUR 5-25m       | rolling     | YES   |
| Horizon EIC Accelerator  | Equity + grant   | EUR 2.5m+       | 2026-06-15  | NO    |

IFB InnoFinTech skeleton: 6 pages, 4x [OPEN: ...] - ready for GP review.
Filed: /Fund-Capital/Public-Funding/2026-05-scan.md
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: fund-grant-scout@1.9.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.9.0. Do not edit directly — edit the source and rebuild.*
