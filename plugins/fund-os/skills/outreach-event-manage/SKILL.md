---
name: outreach-event-manage
description: Plan, run and follow up on fund-hosted events, conference presence, founder and LP dinners. Use this skill when the user says "plan event", "founder dinner", "prep for" or any natural variant. Phase 07 (Ecosystem & Outreach). Fund-side only.
---

# Outreach Event Manage

Plan, run and follow up on fund-hosted events, conference presence, founder and LP dinners.

This skill is part of the **Fund OS** plugin, Phase 07 — Ecosystem & Outreach.

## When to trigger

Run this skill when the user says any of:
- "plan event"
- "founder dinner"
- "prep for"
- "post-event follow-up"
- "AGM"

## Key instructions

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `tone-guide`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Event types: founder dinner, LP dinner, conference attendance, fund-hosted demo day, AGM.
2. Always produce four artefacts: attendee list, agenda, per-attendee briefing, follow-up plan.
3. Briefings: 1 paragraph per attendee, focused on relevance + one personal hook.
4. Follow-up: every external attendee gets a 1-line thank-you within 48h; tracked in CRM.

## Inputs

- Event type
- date
- attendee list
- agenda

## Outputs

- Event plan
- per-attendee briefing
- logistics checklist
- follow-up plan

## Required MCP capabilities

- Calendar
- Email
- CRM
- Drive

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Event-Templates`
- `Attendee-Briefing-Format`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

GP reviews invitee list and external comms.

## Example output / template

```
# Event plan - Founder Dinner, 2026-06-12 Berlin

Type:      Founder dinner (portfolio + select prospects)
Attendees: 8 portfolio founders + 4 deal-flow prospects + 2 GPs
Venue:     <restaurant>, private room, 19:00-22:00
Agenda:
  19:00 Drinks
  19:30 Three founder lightning shares (5 min each)
  20:15 Open discussion (topic: hiring senior talent 2026)
  21:30 Goodbye drink

Briefings: 12 written.
Logistics: dietary preferences, name cards, paid.
Follow-up: thank-you within 24h; prospects -> 1:1 within 1 week.
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: outreach-event-manage@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `outreach-event-manage`. This file is the source — edit it directly.*
