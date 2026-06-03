---
name: startups-to-watch-curator
description: Weekly digest of qualified deal-flow signals, ready for the team Monday morning and as a co-investor share. Use this skill when the user says "weekly deal digest", "startups to watch", "Monday digest" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Startups-to-Watch Curator

Weekly digest of qualified deal-flow signals, ready for the team Monday morning and as a co-investor share.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "weekly deal digest"
- "startups to watch"
- "Monday digest"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

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
3. Nordwind (pre-seed, Hamburg) - climate data. Next: pass.

LinkedIn carousel draft:
Slide 1: 'Three companies we found this week'
Slide 2-4: blurbs (public-info only)
Slide 5: 'Reach out if your thesis overlaps'
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: startups-to-watch-curator@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
