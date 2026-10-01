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
   - Sector: apply the sector definition and the exclusion list from `investment-thesis` verbatim — do not substitute your own reading of the sector
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
   Sector:      [sub-sector, per investment-thesis]
   Stage:       [Pre-Seed/Seed]
   Raise:       [€Xm at €Xm cap / €Xm post-money]
   Geography:   [City, Country]

   Thesis fit:  [Y]/100 — [band] — [one line: what makes it ours, or what puts it outside]
   Hard filters: Sector ✅/❌ | Stage ✅/❌ | Geo ✅/❌ | Model ✅/❌
   Urgency:     [Z]/100 — [band] — [observed|inferred] — [close date, stated or estimated]
                [one line: what we would have to do this week; if inferred, what we have not asked]

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

5. **Score Thesis Fit and Urgency using the shared rubric.** Both come from
   `startup-scoring-matrix.md` — the same rubric `deal-startup-score` uses, at first-screening
   depth. Do not invent a triage-specific scheme: two scoring schemes for one entity is how scores
   stop being comparable across the pipeline.

   ```bash
   cat ~/.fund-os/knowledge/startup-scoring-matrix.md 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/skills/deal-startup-score/knowledge/startup-scoring-matrix.md"
   ```

   - **Thesis Fit 0–100** — Sector /30, Stage /25, Geography /20, Business model /15,
     Ticket & ownership /10.
   - **Urgency 0–100** — Round status /35, Time to close /25, Allocation /15, Runway /10,
     Competitive tension /15. Label it `observed` or `inferred`, and stamp the as-of date.
     At triage depth most urgency scores are `inferred`; that is expected, and an inferred score
     above 60 is the reason to ask the founder about the timeline in the suggested reply.

   **Quality is not scored here.** The inbox does not have the evidence for it. Triage answers
   "is this ours, and how fast is the clock", and hands quality to `deal-startup-score`.

6. **Priority routing — Thesis Fit × Urgency.** Triage has no quality score yet, so priority is a
   function of the two scores it does have:

   | Thesis Fit ↓ / Urgency → | 60–100 | 30–59 | 0–29 |
   |---|---|---|---|
   | **70–100** | **P1** — call this week, before the round closes | **P1** — call within two weeks | **P2** — build the relationship ahead of the raise |
   | **40–69** | **P2** — worth a call, on a deadline | **P3** — watchlist with a trigger | **P3** — watchlist |
   | **0–39** | **P3** — only if a hard filter is merely borderline | **Pass** | **Pass** |

   **Pass** — any hard filter fails → log the failed filter and close.

   A P1 driven by urgency alone does not mean the deal is good. It means the window is short, so
   the decision to look or not look has to be made now rather than drifting.

7. **File attachments:** Drop all deck/document attachments into Drive at `/Deal-Flow-Inbox/YYYY-MM/[Company]/` before tagging in CRM.

8. **Suggested replies** are drafted, never auto-sent. Always present for partner review.

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

- `${CLAUDE_PLUGIN_ROOT}/skills/deal-startup-score/knowledge/startup-scoring-matrix.md` — the shared Thesis Fit and Urgency rubrics; triage uses them at first-screening depth

After triage: hand off to `deal-startup-score` (pitch deck screening depth), which adds the Quality
score and re-scores Thesis Fit and Urgency against the fuller evidence. The triage numbers are a
first read, not a verdict.

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

*Updated 2026-06-26 — First Screening Card format, hard filters, investment-thesis.md knowledge reference. Updated 2026-10-01 — The card now carries Thesis Fit and Urgency as 0–100 scores from the shared `startup-scoring-matrix`, instead of a PASS/CONDITIONAL/FAIL flag, and priority routing is a Thesis Fit × Urgency table. Quality is deliberately not scored at triage depth — the inbox lacks the evidence for it.*
