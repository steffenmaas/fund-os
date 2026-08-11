---
name: finance-grant-scout
description: Scout public funding programmes relevant to the FUND itself - regional fund-development grants (IFB, KfW), public LP / DFI programmes, FinTech / VC innovation funding the fund can apply to as a business. Use this skill when the user says "find fund grants", "public funding for fund", "IFB" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# Finance Grant Scout

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

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `fund-overview`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

Fund profile: [City]-domiciled, registered [vehicle type], AuM target EUR 50m,
[sector] focus.

| Programme                | Type             | Ticket          | Deadline    | Match |
| [Regional dev. bank]     | Non-repayable    | up to EUR 200k  | rolling     | YES   |
| KfW ERP Innovation       | Soft loan        | up to EUR 5m    | rolling     | YES   |
| EIF AMUF                 | DFI commitment   | EUR 5-25m       | rolling     | YES   |
| Horizon EIC Accelerator  | Equity + grant   | EUR 2.5m+       | 2026-06-15  | NO    |

Application skeleton: 6 pages, 4x [OPEN: ...] - ready for GP review.
Filed: /Fund-Capital/Public-Funding/2026-05-scan.md
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: finance-grant-scout@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `finance-grant-scout`. This file is the source — edit it directly.*
