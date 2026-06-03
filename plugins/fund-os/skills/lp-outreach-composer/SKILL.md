---
name: lp-outreach-composer
description: Draft personalised first-touch and follow-up emails to LP prospects, calibrated to thesis fit and prior context. Use this skill when the user says "draft LP email", "follow up with LP", "LP outreach" or any natural variant. Phase 01 (Fundraising & LP). Fund-side only.
---

# LP Outreach Composer

Draft personalised first-touch and follow-up emails to LP prospects, calibrated to thesis fit and prior context.

This skill is part of the **Fund OS** plugin, Phase 01 — Fundraising & LP.

## When to trigger

Run this skill when the user says any of:
- "draft LP email"
- "follow up with LP"
- "LP outreach"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

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
- `Investment-Thesis`

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

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: lp-outreach-composer@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
