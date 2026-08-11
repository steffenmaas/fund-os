---
name: deal-watchlist-curate
description: Weekly digest of qualified deal-flow signals, ready for the team Monday morning and as a co-investor share. Use this skill when the user says "weekly deal digest", "startups to watch", "Monday digest" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Deal Watchlist Curate

Weekly digest of qualified deal-flow signals, ready for the team Monday morning and as a co-investor share.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "weekly deal digest"
- "startups to watch"
- "Monday digest"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `investment-thesis`, `evaluation-criteria`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Cap the digest at 7 startups per week - quality over volume.
2. Each entry: 1 line on company, 1 line on why now, 1 line on what we are doing next.
3. Produce three variants: internal team, co-investors, public LinkedIn (no confidential details).
4. Never include companies in 'In DD' or later stages in any external variant.

## Inputs

- Last 7 days of triaged deals
- market signals
- network activity

## Outputs

- Email digest (internal)
- co-investor digest variant
- LinkedIn carousel draft

## Required MCP capabilities

- Email
- CRM
- Wiki / DB

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Investment-Thesis`
- `Co-investor-Registry`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Co-investor share approved before send.

## Example output / template

```
# Monday Deal Digest - 2026-05-19

Internal:
1. Helios Sensors (pre-seed, Munich) - IoT, paid pilots. Next: founder call Thu.
2. Resolutee (seed, Berlin) - legal AI. Next: term-sheet discussion.
3. Nordwind (pre-seed, Lisbon) - climate data. Next: pass.

LinkedIn carousel draft:
Slide 1: 'Three companies we found this week'
Slide 2-4: blurbs (public-info only)
Slide 5: 'Reach out if your thesis overlaps'
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-watchlist-curate@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `deal-watchlist-curate`. This file is the source — edit it directly.*
