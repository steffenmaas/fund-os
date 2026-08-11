---
name: lp-outreach-draft
description: Draft personalised first-touch and follow-up emails to LP prospects, calibrated to thesis fit and prior context. Use this skill when the user says "draft LP email", "follow up with LP", "LP outreach" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# LP Outreach Draft

Draft personalised first-touch and follow-up emails to LP prospects, calibrated to thesis fit and prior context.

This skill is part of the **Fund OS** plugin, Phase 01 — Fundraising & LP.

## When to trigger

Run this skill when the user says any of:
- "draft LP email"
- "follow up with LP"
- "LP outreach"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `tone-guide`, `lp-thesis`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Open with one concrete reason this LP fits, drawn from their public statements or prior thesis.
2. Maximum 130 words for first touch; maximum 80 words for follow-up.
3. Always include one specific ask (15-min call / forward to colleague / read the teaser).
4. Tone: peer-to-peer, no superlatives, no buzzwords. Cite numbers with sources.

## Inputs

- LP profile
- campaign goal
- previous touchpoints

## Outputs

- Draft email (subject + body)
- send recommendation (timing, channel)

## Required MCP capabilities

- CRM
- Email
- Meeting Intelligence

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `LP-Outreach-Playbook`
- `investment-thesis` — via knowledge manifest
These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Every outbound mail is reviewed before send - no auto-send under any circumstances.

## Example output / template

```
Subject: Fund II - thesis overlap with Aurora's impact mandate

Hi Anna,

I saw Aurora's recent commitment to <reference fund>. We are raising Fund II
on a similar thesis (<one-line thesis>) with EUR <X>m target and EUR <Y>m
already circled.

Would a 15-minute call next week make sense? Happy to send the teaser ahead.

Best,
<Sender>

Send: Tuesday 09:30 local. Follow-ups: D+7, D+14.
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: lp-outreach-draft@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `lp-outreach-draft`. This file is the source — edit it directly.*
