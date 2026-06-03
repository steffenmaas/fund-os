---
name: deal-flow-triage
description: Continuously triage the deal-flow inbox - classify, enrich, dedupe, route, suggest a reply. Use this skill when the user says "triage inbox", "new deal", "process pitch email" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Deal Flow Triage

Continuously triage the deal-flow inbox - classify, enrich, dedupe, route, suggest a reply.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "triage inbox"
- "new deal"
- "process pitch email"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output and `outputStoragePath` as the default save location. From `knowledgeManifest`, load these keys from Google Drive if present: `investment-thesis`, `evaluation-criteria`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. If the preferences file is absent, proceed normally — run `fund-os:setup` to create it.

1. Run the thesis fit check first (sector / stage / geo / ticket); a 'No' on any hard filter is an automatic Pass.
2. Dedupe across the last 18 months on company name, domain and founder email.
3. If the deck is missing, draft a polite reply asking for it; do not score until you have it.
4. Drop attachments into Drive folder /Deal-Flow-Inbox/<YYYY-MM>/<Company>/ before tagging in CRM.

## Inputs

- Incoming email + attachments

## Outputs

- CRM record draft
- suggested reply
- priority tag (P1/P2/P3/Pass)

## Required MCP capabilities

- Email
- CRM

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Investment-Thesis`
- `Filing-Structure`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Replies drafted, never auto-sent.

## Example output / template

```
# Deal triage card

Company:    Helios Sensors GmbH
Source:     Inbound, 2026-05-19 08:14
Sector:     Industrial IoT
Stage:      Pre-seed (EUR 400k SAFE, EUR 4m cap)
Geo:        Munich
Thesis fit: PASS on hard filters
Priority:   P2 - moderate traction, technical team
Suggested reply:
  'Thanks - read it. Can you share latest financials and customer list
  before we schedule a 30-min call?'
Files:      /Deal-Flow-Inbox/2026-05/Helios/Deck_v3.pdf
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`kwp-nda-triage`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/kwp-nda-triage) — GREEN/YELLOW/RED NDA classification when inbound deal includes an NDA request
- [`skillsmp-analyzing-funding-landscape`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/investment_analysis/skillsmp-analyzing-funding-landscape) — Funding landscape context for deal routing (stage fit, active investors in sector)
- [`skillsmp-yc-startup-fundamentals`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/skillsmp-yc-startup-fundamentals) — YC team, idea and MVP checklist as a lightweight pre-filter before routing to full thesis-fit-scorer

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-flow-triage@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
