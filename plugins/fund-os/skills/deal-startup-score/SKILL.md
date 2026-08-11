---
name: deal-startup-score
description: Run a structured 10-dimension scoring of an early-stage startup against the fund's thesis. Outputs a scored card with per-dimension contributions, Thesis Fit and Impact Fit star ratings, and a recommended action — in the standard scoring format used across all screening depths. Use this skill when the user says "score this startup", "startup scorecard", "go/no-go", "first screen", "quick screen" or "validate this idea". Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Deal Startup Score

Run a structured 10-dimension scoring of an early-stage startup against the fund's investment thesis. Produces the standard scoring card used across all screening depths — from first screening to full due diligence.

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

## Key instructions

0. **Load knowledge.** The scoring matrix is mandatory and must be used verbatim — it carries the 10-dimension rubric, the signal→score tables, the output format, the score bands and the Attio field mapping. An overlay in `~/.fund-os/knowledge/` wins over the bundled copy:

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

2. **Score ALL 10 dimensions** on actual evidence — ALWAYS, regardless of thesis fit. Do NOT zero out dimensions because of geography, stage, or model mismatches. Hard-pass thesis filters belong ONLY in the Thesis Fit star rating and the Recommended action. Weights:
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

3. **Compute total score** = exact arithmetic sum of all 10 dimension numerators. Do NOT manually set the total. Do NOT round the sum. Example: if dimensions sum to 73, total = 73. This must be computed AFTER scoring all dimensions, never before.

4. **Apply score band** from the matrix (90–100 = Strong Buy → 0–39 = Hard Pass).

5. **Assess thesis fit** (from `investment-thesis`) in the star ratings:
   - Geography: DACH, UK, Mediterranean, Nordics (others = hard pass flag)
   - Stage: Pre-Seed or Seed (later = hard pass flag)
   - Model: SaaS / platform / marketplace (hardware-only or asset-heavy = flag)
   - Sector: as defined in `investment-thesis`
   If any hard filter fails, note it explicitly in Thesis Fit reason AND Recommended action. The score still reflects the company's quality on the merits.

6. **Append star ratings:**
   - Thesis Fit ★/5 — sector, geography, stage and model fit per `investment-thesis`. If hard-pass criteria apply (wrong geo, wrong stage, acquired/wound-down), state them here and in Recommended action.
   - Impact Fit ★/5 — impact against the fund's stated impact mandate. If the fund has none, omit this rating rather than leaving it blank.

7. **Output the standard scorecard format** exactly as defined in startup-scoring-matrix.md:
   ```
   Startup Score: X/100 — [Band]
   Screening depth: [label]

   [2–3 sentence company description]

   Scoring breakdown:
   • Team:                      +X/20   — [reason]
   • Market Opportunity:        +X/15   — [reason]
   • Problem–Solution Fit:      +X/15   — [reason]
   • Technology & Product:      +X/10   — [reason]
   • Business Model:            +X/10   — [reason]
   • Traction & Validation:     +X/10   — [reason]
   • Competition:               +X/5    — [reason]
   • Go-to-Market:              +X/5    — [reason]
   • Financial Planning:        +X/5    — [reason]
   • Exit Potential:            +X/5    — [reason]

   Thesis Fit:       ★★★☆☆ — [reason; state any hard-pass flags here]
   Impact Fit:       ★★★☆☆ — [reason]

   Recommended action: [emoji + label; state hard-pass reason if applicable]
   Evaluated: YYYY-MM-DD | [Fund] Startup Scoring v1
   ```

8. **Write to the CRM** (if connected). Field slugs come from `crmFields` in the configuration — never hardcode them, and never guess a slug:
   - `crmFields.dealList` — the list to search with `list-records-in-list`
   - `crmFields.startupScore` = integer total score
   - `crmFields.startupSummary` = full scorecard block text
   - Write at the **list-entry** level using `update-list-entry-by-id`. Scores live on the list entry, not on the record.
   - `crmFields.archivedSlugs` names slugs that must never be written to. If a slug you are about to use appears there, stop and report it.

9. Every scored dimension requires a one-line citation (deck slide, URL, founder statement, or "No information available"). Never guess — mark thin evidence as 0 with the zero-information label.

## Inputs

- Company name + website or LinkedIn (minimum for first screening)
- Pitch deck or description (required for pitch deck screening)
- Founder profile / LinkedIn (recommended)
- Data room access (required for due diligence screening)

## Outputs

- Startup scoring card (standard format)
- CRM list-entry update, using the slugs from `crmFields`

## Required MCP capabilities

- CRM (Attio)
- Web search
- Drive (for data room access at DD depth)

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `${CLAUDE_PLUGIN_ROOT}/skills/deal-startup-score/knowledge/startup-scoring-matrix.md` — 10-dimension rubric, signal tables, output format, score bands, Attio mapping
- `${CLAUDE_PLUGIN_ROOT}/skills/deal-flow-triage/knowledge/investment-thesis.md` — fund thesis, hard filters, sector archetypes

## Human-in-the-loop

Score is advisory. IC decides on all invest/pass calls. CONDITIONAL verdicts (60–74) require GP review before advancing to IC pack.

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-startup-score@1.0.0
output_ref:    <Attio record ID or file path>
rationale:     <company name, score/100, band, recommended action>
```

---

*Updated 2026-06-26 — Removed pre-scoring hard-pass KO filter (all 10 dims always scored on evidence); hard-pass criteria moved to Thesis Fit stars + Recommended action only. Fixed Technology & Product weight to /10 (never /15). Total score = arithmetic sum of dimension numerators, computed after scoring — never set manually. Updated 2026-08-11 — CRM field slugs now come from `crmFields` in the configuration rather than being hardcoded, so the skill is not bound to one fund's CRM schema.*
