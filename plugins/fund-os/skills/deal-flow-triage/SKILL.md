---
name: deal-flow-triage
description: Continuously triage the deal-flow inbox - classify, enrich, dedupe, route, suggest a reply. Use this skill when the user says "triage inbox", "new deal", "process pitch email" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Deal Flow Triage

Continuously triage the deal-flow inbox — classify, enrich, dedupe, route, and suggest a reply. Produces a First Screening Card for every qualifying inbound and routes it to CRM or rejects with a logged reason.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "triage inbox"
- "new deal"
- "process pitch email"
- "inbound deal"
- "new pitch"

## Key instructions

0. **Load knowledge.** Both files are mandatory — they carry the hard filters, sector definition and routing criteria. An overlay in `~/.fund-os/knowledge/` wins over the bundled copy:

   ```bash
   for k in investment-thesis evaluation-criteria; do
     cat ~/.fund-os/knowledge/$k.md 2>/dev/null \
       || cat "${CLAUDE_PLUGIN_ROOT}/skills/deal-flow-triage/knowledge/$k.md"
   done
   ```

   If either file cannot be read, stop and say which one — triaging without the thesis produces confident, wrong routing.

1. **Apply hard filters first** (auto-Pass on any fail — log reason and stop):
   - Sector: Maritime LEISURE B2B software only (see investment-thesis.md for full definition)
   - Geography: DACH, UK, Mediterranean, Nordics
   - Stage: Pre-Seed or Seed
   - Model: asset-light — no hardware-only, no asset-heavy businesses
   - Cap table: clean (flag if undisclosed debt or unusual provisions mentioned)

2. **Dedupe:** Check last 18 months in CRM on company name, domain, and founder email. If duplicate, log "Already in pipeline" and close without creating a new record.

3. **If deck is missing:** Draft a polite reply requesting it. Do not score until you have at least the deck or a detailed company description.

4. **For qualifying deals, produce a First Screening Card:**

   ```
   # First Screening Card — [Company]
   Date: YYYY-MM-DD | Source: [Inbound/Event/Referral/Outbound]

   Company:     [Name]
   Domain:      [website]
   Sector:      [Maritime LEISURE sub-sector]
   Stage:       [Pre-Seed/Seed]
   Raise:       [€Xm at €Xm cap / €Xm post-money]
   Geography:   [City, Country]

   Thesis fit:  [PASS / CONDITIONAL / FAIL]
   Hard filters: Sector ✅/❌ | Stage ✅/❌ | Geo ✅/❌ | Model ✅/❌

   Priority:    [P1 / P2 / P3 / Pass]
   Routing:     [→ deal-startup-score | → watchlist | → Pass]

   Key signals:
   - [Traction/founder/market signal 1]
   - [Traction/founder/market signal 2]
   - [Red flag or open question if any]

   Suggested reply:
   "[Draft reply text]"

   Files: /Deal-Flow-Inbox/YYYY-MM/[Company]/[Deck filename]
   CRM: [Record created / updated / duplicate]
   ```

5. **Priority routing:**
   - **P1** — Strong thesis fit + traction signal + known founder/reference → schedule call immediately
   - **P2** — Thesis fit + some traction → request deck/financials, schedule in 2 weeks
   - **P3** — Thesis fit but early/thin → watchlist, follow up in 90 days
   - **Pass** — Fails hard filters or no maritime leisure angle → log and close

6. **File attachments:** Drop all deck/document attachments into Drive at `/Deal-Flow-Inbox/YYYY-MM/[Company]/` before tagging in CRM.

7. **Suggested replies** are drafted, never auto-sent. Always present for partner review.

## Inputs

- Incoming email + attachments (deck, one-pager, etc.)
- Founder name and company name (minimum)

## Outputs

- First Screening Card (standard format above)
- CRM record draft (Attio)
- Priority tag (P1/P2/P3/Pass)
- Suggested reply (draft only)

## Required MCP capabilities

- Email
- CRM (Attio)
- Drive

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `${CLAUDE_PLUGIN_ROOT}/skills/deal-flow-triage/knowledge/investment-thesis.md` — fund thesis, sector definition, hard filters, archetypes
- `${CLAUDE_PLUGIN_ROOT}/skills/deal-flow-triage/knowledge/evaluation-criteria.md` — soft filters, routing criteria, priority definitions

After scoring: hand off to `deal-startup-score` for O1 Startup Scoring (pitch deck screening depth).

## Human-in-the-loop

Replies drafted, never auto-sent. P1 routing requires partner acknowledgment before call is booked.

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-flow-triage@1.0.0
output_ref:    <Attio record ID or file path>
rationale:     <company name, priority tag, routing decision>
```

---

*Updated 2026-06-26 — First Screening Card format, O1 hard filters, investment-thesis.md knowledge reference.*
