---
name: meeting-briefer
description: Prepare a concise intelligence briefing before any fund meeting — IC sessions, LP calls, portfolio board meetings, reference calls, DD sessions. Use this skill when the user says "prep me for", "meeting brief", "briefing for", "board prep" or "IC prep". Phase 03 (Due Diligence). Fund-side only.
---

# Meeting Briefer

Prepare a concise intelligence briefing before any fund meeting — IC sessions, LP calls, portfolio board meetings, reference calls, DD sessions.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "prep me for [meeting]"
- "meeting brief"
- "briefing for"
- "prepare for [meeting]"
- "IC prep"
- "board prep"
- "LP call prep"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

1. Identify meeting type (Deal Review / IC / Board / LP Call / Reference / DD / Regulatory / Team Sync) and duration — this sets the appropriate depth of prep.
2. Assess prep needs: for regulated meetings (IC, board, LP) always produce a full briefing; for team syncs produce a condensed version.
3. Gather context from available sources in priority order: CRM notes, meeting intelligence transcripts, portfolio folder, recent emails, web search (public company/person data).
4. Synthesize into a structured briefing covering: participants and their context, agenda mapping, key background, open issues, talking points, questions to raise, decisions needed, and red lines.
5. Identify preparation gaps: flag any section where data was unavailable and suggest the fastest path to fill it (who to ask, what to search).
6. For IC/investment meetings: append a one-paragraph thesis reminder and highlight any open DD items from the `ic-pack-builder` or `investment-memo-drafter` output.
7. Cap the briefing at 1–2 pages unless the user requests a deep dive — brevity is a feature.

## Inputs

- Meeting title, date, time and duration
- Attendee names or roles
- Meeting agenda or purpose (if available)
- Relevant deal or company name (if applicable)

## Outputs

- Structured meeting briefing (participants, background, agenda, talking points, questions, decisions needed, red lines, prep gaps)
- Action item list from prior meeting (if transcript available)
- Open follow-up items to confirm during the meeting

## Required MCP capabilities

- CRM
- Meeting intelligence
- Email
- Wiki / DB
- Web search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Fund-Framework/` — investment thesis and scoring rubric (for IC meetings)
- `Fund-Portfolio/` — company folder and last board minutes (for portfolio meetings)

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

GP reviews briefing before regulated meetings (IC, LP, board). No sign-off required for internal prep.

## Example output / template

```
# Briefing — IC Review: Resolutee Series A
Date: 2026-05-22  |  Duration: 60 min  |  Type: Deal Review

## Participants
| Name          | Role               | Context                         |
|---------------|--------------------|---------------------------------|
| Anna Schmidt  | Partner (lead)     | Led DD; strong conviction       |
| Mark Jansen   | Partner            | Sceptical on market size        |
| Laura Bergs   | Associate          | Prepared financial model        |

## Agenda mapping
1. Market size debate (20 min) → see Talking Points #2
2. Cap table walk-through (15 min) → see Open Issues #1
3. Term sheet approval (15 min) → Decision needed
4. Follow-up actions (10 min)

## Key background
Founded 2023. B2B SaaS, HR-tech. €1.2M ARR, 38% MoM growth.
Last contact: reference call 2026-05-18 — all references positive on founder execution.

## Talking points
1. NRR 107% — above 104% threshold; comparable to top-quartile at this stage.
2. TAM: bottom-up gives €2.1B SAM (EU SMB HR software), top-down €6.8B — flag as
   'MARKET SIZE: OPEN', present both.
3. Founding team: both technical, no sales hire yet — flag as risk.

## Questions to raise
- When does the company plan its first sales hire?
- What is the pipeline conversion rate from trial to paid?

## Decisions needed
- Approve term sheet at €6M pre-money valuation?

## Red lines
- Do not commit above €6.5M pre-money without re-running cap table model.

## Prep gaps
- Q1 2026 board minutes not in portfolio folder — request from founder before meeting.
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`kwp-meeting-briefing`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/fund_operations/kwp-meeting-briefing) — 5-step briefing methodology, meeting-type classification, full briefing template with participants table, talking points, red lines and prep gap tracking

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: meeting-briefer@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of meeting purpose and key prep items>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
