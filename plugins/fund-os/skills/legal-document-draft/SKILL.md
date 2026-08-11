---
name: legal-document-draft
description: Draft term sheets, SPAs, SHAs, NDAs and side letters from the fund's clause library, adapted to deal terms and jurisdiction. Use this skill when the user says "draft term sheet", "draft SPA", "draft NDA" or any natural variant. Phase 06 (Legal & Compliance). Fund-side only.
---

# Legal Document Draft

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

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `legal-templates`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: legal-document-draft@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `legal-document-draft`. This file is the source — edit it directly.*
