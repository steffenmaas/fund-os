---
name: deal-startup-score
description: Score an early-stage startup on three independent axes - Quality (10 dimensions), Thesis Fit and Urgency (distance to the close of the next round), each 0-100 with a written evaluation. Outputs a scored card and a recommended action from Quality x Thesis Fit. Use this skill when the user says "score this startup", "startup scorecard", "go/no-go", "first screen", "quick screen", "thesis fit", "how urgent is this" or "when does this round close". Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Deal Startup Score

Score an early-stage startup on three independent axes, each 0–100 and each stored with the reasoning behind it:

| Score | Question |
|---|---|
| **Quality** | Is this a good company? — 10 weighted dimensions |
| **Thesis Fit** | Is this *our* company? — sector, stage, geography, model, ticket |
| **Urgency** | How soon must we decide? — distance to the close of the next round |

Keeping them apart is the point. A company can be excellent and not ours; the fund needs to see both at once rather than one blended number that describes neither. Urgency sets the clock and never the verdict.

Produces the standard scoring card used across all screening depths — from first screening to full due diligence.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "score this startup"
- "startup scorecard"
- "go/no-go"
- "first screen"
- "quick screen"
- "validate this idea"
- "thesis fit"
- "score startup"
- "how urgent is this"
- "when does this round close"

## Key instructions

0. **Load knowledge.** The scoring matrix is mandatory and must be used verbatim — it carries all three rubrics (Quality, Thesis Fit, Urgency), the signal→score tables, the Quality × Thesis Fit action table, the output format and the CRM field mapping. An overlay in `~/.fund-os/knowledge/` wins over the bundled copy:

   ```bash
   cat ~/.fund-os/knowledge/startup-scoring-matrix.md 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/skills/deal-startup-score/knowledge/startup-scoring-matrix.md"
   cat ~/.fund-os/knowledge/investment-thesis.md 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/skills/deal-flow-triage/knowledge/investment-thesis.md"
   ```

   If the matrix cannot be read, stop — do not score from memory.

1. **Determine screening depth** from context:
   - **First screening** — name + website/LinkedIn only → expect 4–6 dimensions as "No information available" (score 0)
   - **Pitch deck screening** — full deck reviewed → most dimensions scoreable
   - **Due diligence screening** — data room + founder calls + references → all 10 dimensions must be scored

2. **Score ALL 10 quality dimensions** on actual evidence — ALWAYS, regardless of thesis fit. Do NOT zero out a dimension because of geography, stage or model: those belong to the Thesis Fit score, which is computed separately in step 5. Weights:
   - Team & Founder-Market Fit: /20
   - Market Opportunity: /15
   - Problem–Solution Fit: /15
   - Technology & Product: /10  ← always /10, never /15
   - Business Model: /10
   - Traction & Validation: /10
   - Competition & Differentiation: /5
   - Go-to-Market Strategy: /5
   - Financial Planning & Use of Funds: /5
   - Exit Potential: /5
   - **TOTAL: /100**

3. **Compute the quality score** = exact arithmetic sum of all 10 dimension numerators. Do NOT manually set the total. Do NOT round the sum. Example: if dimensions sum to 73, total = 73. This must be computed AFTER scoring all dimensions, never before.

4. **Apply the quality band** from the matrix (90–100 Strong → 0–39 Poor). The band describes the
   company, not the decision.

5. **Score Thesis Fit 0–100** using the five-dimension rubric in the matrix — Sector /30, Stage /25,
   Geography /20, Business model /15, Ticket & ownership /10. Score it against `investment-thesis`,
   independently of quality. Never let a strong company raise its thesis fit, or a weak one lower it:
   they answer different questions.

   Check the **hard filters** listed in the matrix separately. A failed hard filter does **not**
   force the score to 0 — the number still records how close the company is, which is what makes a
   re-score meaningful when the blocking fact changes. Name the failed filter in the evaluation and
   in the recommended action.

   Write a `Why:` block of 2–4 sentences: what makes this ours or puts it outside, and the single
   fact that would most change the score.

6. **Score Urgency 0–100** — the distance to the close of the next funding round. Five dimensions
   per the matrix: Round status /35, Time to close /25, Allocation remaining /15, Runway pressure /10,
   Competitive tension /15. Use every source available: the deck, the founder's own words, the CRM
   history, filings, funding databases, press, the date of the last round.

   Three rules, all of which the matrix states in full:

   - **Label the basis.** `observed` when round status and close date come from the founder, the deck
     or a filing; `inferred` when estimated from stage, last-round date and sector cadence. An
     `inferred` urgency above 60 is an instruction to go and ask — not a basis for acting.
   - **Unknown is not the same as not urgent.** Do not apply the zero-information rule here. Scoring
     an unasked-about round as 0 buries deals the fund has simply not chased yet.
   - **Stamp it and expire it.** Record the as-of date; the score is void after 30 days, or
     immediately when round status changes. A stale urgency score is re-scored, never reused.

   Write a `Why:` block: when this closes, how that is known, and what the fund would have to do this
   week. If inferred, say what has not been asked.

7. **Derive the recommended action** from the **Quality × Thesis Fit** table in the matrix — not from
   quality alone. Note the Refer-out cell: a strong company outside the thesis is worth passing to a
   co-investor and logging, rather than rejecting silently. Urgency sets the **Next step by** date and
   nothing else; it never moves the verdict.

8. **Append Impact Fit ★/5** only if the fund has an impact mandate. If it has none, omit the line
   rather than leaving it blank.

9. **Output the standard scorecard format** exactly as defined in `startup-scoring-matrix.md` — the
   three score headers, the per-dimension contributions, the three `Why:` blocks, the recommended
   action and the Next-step-by date.

10. **Write to the CRM** (if connected). Field slugs come from `crmFields` in the configuration —
    never hardcode them, and never guess a slug. Each score is written **with its evaluation**; a
    number whose reasoning lives only in a chat log is one nobody can check later.

    | Value | Slug |
    |---|---|
    | List to search with `list-records-in-list` | `crmFields.dealList` |
    | Quality score (integer) | `crmFields.startupScore` |
    | Full scorecard block | `crmFields.startupSummary` |
    | Thesis Fit score (integer) | `crmFields.thesisFit` |
    | Thesis Fit `Why:` block | `crmFields.thesisFitEvaluation` |
    | Urgency score (integer) | `crmFields.urgency` |
    | Urgency `Why:` block | `crmFields.urgencyEvaluation` |
    | Urgency as-of date | `crmFields.urgencyAsOf` |

    - Write at the **list-entry** level using `update-list-entry-by-id`. Scores live on the list
      entry, not on the record.
    - An **empty slug means the fund has not created that field** — skip that write silently and say
      so once in the output. Never fall back to writing the value into a different field.
    - If `crmFields.urgencyAsOf` is empty, the urgency evaluation text must begin with
      `as of YYYY-MM-DD (observed|inferred)` so the date survives anyway and a human sorting the
      list can see the age without opening the record.
    - `crmFields.archivedSlugs` names slugs that must never be written to. If a slug you are about to
      use appears there, stop and report it.

11. **Every scored dimension requires a one-line citation** — deck slide, URL, founder statement, or "No information available". Never guess. On Quality, thin evidence is a 0 with the zero-information label. On Urgency it is not: there the honest answer is a score labelled `inferred`, with the gap named in the `Why:` block.

## Inputs

- Company name + website or LinkedIn (minimum for first screening)
- Pitch deck or description (required for pitch deck screening)
- Founder profile / LinkedIn (recommended)
- Data room access (required for due diligence screening)

## Outputs

- Startup scoring card (standard format) — three scores, three evaluations, one recommended action
- CRM list-entry update, using the slugs from `crmFields`: quality, thesis fit and urgency each
  written together with their evaluation text

## Required MCP capabilities

- CRM (Attio)
- Web search
- Drive (for data room access at DD depth)

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `${CLAUDE_PLUGIN_ROOT}/skills/deal-startup-score/knowledge/startup-scoring-matrix.md` — all three rubrics, signal tables, the Quality × Thesis Fit action table, output format, CRM mapping
- `${CLAUDE_PLUGIN_ROOT}/skills/deal-flow-triage/knowledge/investment-thesis.md` — fund thesis, hard filters, sector archetypes

## Human-in-the-loop

Scores are advisory. IC decides on all invest/pass calls. A Watchlist or Monitor verdict requires GP review before advancing to an IC pack, and an **Exception review** — strong company, adjacent thesis fit — requires a GP to argue the stretch in writing before any work proceeds.

A high urgency score never substitutes for that review. It shortens the time available to do it, which is a reason to start sooner, not to skip a step.

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-startup-score@1.0.0
output_ref:    <Attio record ID or file path>
rationale:     <company name, quality/100, thesis fit/100, urgency/100 (observed|inferred), recommended action>
```

---

*Updated 2026-06-26 — Removed pre-scoring hard-pass KO filter (all 10 dims always scored on evidence); hard-pass criteria moved out of the dimension scores. Fixed Technology & Product weight to /10 (never /15). Total score = arithmetic sum of dimension numerators, computed after scoring — never set manually. Updated 2026-08-11 — CRM field slugs now come from `crmFields` in the configuration rather than being hardcoded, so the skill is not bound to one fund's CRM schema. Updated 2026-10-01 — Three independent scores replace one score plus a star rating: Thesis Fit becomes a 0–100 rubric of its own, and Urgency (distance to the close of the next round) is added as a third. Each is stored with a written evaluation. The recommended action now comes from a Quality × Thesis Fit table, so a strong company outside the thesis reads as "refer out" rather than disappearing into an averaged number. Urgency carries an observed/inferred label and an expiry, because it is the only score that goes wrong simply because time passed.*
