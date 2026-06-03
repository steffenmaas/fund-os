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

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `lp-thesis`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. If the preferences file is absent, proceed normally — run `fund-os:setup` to create it.

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

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
