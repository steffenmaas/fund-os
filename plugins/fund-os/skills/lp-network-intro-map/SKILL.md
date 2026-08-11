---
name: lp-network-intro-map
description: Find the warmest path from the team's network to a target LP or person - who knows whom, last contact, suggested asker, intro template. Use this skill when the user says "warm intro to", "who knows", "network path" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# LP Network Intro Map

Find the warmest path from the team's network to a target LP or person - who knows whom, last contact, suggested asker, intro template.

This skill is part of the **Fund OS** plugin, Phase 01 — Fundraising & LP.

## When to trigger

Run this skill when the user says any of:
- "warm intro to"
- "who knows"
- "network path"
- "intro mapping"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `lp-thesis`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Rank paths by: connection strength (1-5), recency of contact, role seniority of the asker.
2. Never expose 1st-degree contacts of direct competitors to each other in the suggestion list.
3. Always include a one-sentence value proposition the intro can repeat.
4. Default to a single best path; surface the next two only if the user asks.

## Inputs

- Target name
- target organisation

## Outputs

- Ranked intro paths with strength score
- suggested asker
- intro request draft

## Required MCP capabilities

- CRM
- Email
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Team-Network-Graph`
- `LP-Database`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

All intro requests reviewed by the named asker before send.

## Example output / template

```
# Intro paths to Aurora FO

1. Top: Asker = Partner X, strength 5/5, last contact 12d ago.
   Ask: 'Would you intro me to Aurora FO for a 15-min Fund II call?
   Thesis overlap with their impact mandate.'

2. Fallback: Asker = Advisor Y, strength 3/5, last contact 90d ago.

Draft DM filed at /Drafts/Intros/aurora-fo.md
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: lp-network-intro-map@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `lp-network-intro-map`. This file is the source — edit it directly.*
