# Startup Scoring Matrix — TEMPLATE
# Version: 1.0

> **This is the shipped template, not a fund's actual rubric.**
>
> The structure, the weights, the bands and the rules below are the methodology. The **signals**
> are deliberately generic, with `[sector]` where your thesis goes. Fill them in for your own fund
> and save the result as **`~/.fund-os/knowledge/startup-scoring-matrix.md`**, or put it in your
> Drive knowledge folder under the key `startup-scoring-matrix`. Either overlay wins over this file.
>
> Signal rows are written for a generic **vertical B2B SaaS** thesis, which is the most common
> shape. If your fund invests in something else — deep tech, consumer, marketplaces, hardware —
> rewrite the signal columns; keep the weights and the rules, which are what make scores comparable.

---

## Overview

Scores an early-stage startup across 10 weighted dimensions. Total score is /100.

**Scoring methodology rules — these are the part that must not drift:**

1. **Score every dimension on evidence, always.** Never zero one out because of a thesis mismatch
   in geography, stage or model. Thesis fit is expressed in the star ratings and the recommended
   action, never by suppressing a dimension.
2. **Total score = exact arithmetic sum of all 10 dimension numerators.** Do not set it manually.
   Compute it after scoring all dimensions. Example: 14+12+13+9+8+9+4+4+4+5 = 82, so total = 82.
3. **The caps below sum to exactly 100.** If you re-weight, they must still sum to 100 —
   `tools/validate.py` enforces this, because a matrix that declares /100 while its caps sum to
   110 puts every score on a stretched scale and silently breaks the band thresholds.
4. **Bands reflect company quality on the merits.** A company can score in the top band and still
   receive a Pass if it fails a hard thesis filter — e.g. a company two stages later than the fund
   invests can score 91/100 and still be a Hard Pass for a pre-seed Fund I.

**Dimension max scores (sum to 100):**
- Team & Founder-Market Fit: /20
- Market Opportunity: /15
- Problem–Solution Fit: /15
- Technology & Product: /10
- Business Model: /10
- Traction & Validation: /10
- Competition & Differentiation: /5
- Go-to-Market Strategy: /5
- Financial Planning & Use of Funds: /5
- Exit Potential: /5
- **TOTAL: /100**

---

## Score Bands & Recommended Actions

| Score | Band | Action |
|---|---|---|
| 90–100 | Strong Buy | ✅ Invest — Move to term sheet |
| 75–89 | Investable — Minor Gaps | 🔵 Proceed — IC approval + conditions |
| 60–74 | Possible — Material Gaps | 🟡 Watchlist — Address gaps first |
| 40–59 | Watchlist / Reject | 🟠 Revisit — Major concerns, no action now |
| 0–39 | Hard Pass | ❌ Pass — Log in CRM, close |

---

## Screening Depth Labels

Use the label that matches how much information is available:

- **First screening** — Name + website/LinkedIn only. Score mainly on sector, geography and
  archetype fit. Expect 4–6 dimensions as "No information available."
- **Pitch deck screening** — Full deck reviewed. Most dimensions scoreable.
- **Due diligence screening** — Data room, references, founder calls. All dimensions must be scored.

---

## Zero-Information Rule

If a dimension cannot be assessed from the available data: score = 0, label = "No information
available." Do not guess or infer. This applies mainly at First screening depth, and it is what
keeps a thin first screen honest instead of confidently wrong.

---

## 10 Dimensions — Weights & Scoring Signals

### 1. Team & Founder-Market Fit — Weight: 20%

The single most important dimension. Score for domain depth in `[sector]`, technical/commercial
balance, and prior exits or operator experience.

| Score | Signal |
|---|---|
| 90–100 | Serial founder with a prior exit in `[sector]` + technical co-founder; full-time; deep operator network |
| 70–89 | Strong domain expertise (5+ yrs in `[sector]`) + complementary co-founder; full-time |
| 50–69 | One strong founder, team incomplete; or domain expertise without technical depth |
| 30–49 | Generalist team, no `[sector]` background; learning the domain |
| 0–29 | Solo founder, or team with no relevant experience; part-time |
| 0 | No information available |

**Bonus signals:** recognised accelerator alumni, advisory board with active `[sector]` operators,
prior analyst or industry recognition.

---

### 2. Market Opportunity — Weight: 15%

Score for SAM size, growth rate and bottom-up validation, against the thresholds in your thesis.

| Score | Signal |
|---|---|
| 90–100 | SAM above the fund's upper threshold; bottom-up validated; growth above `[X]%` CAGR; sub-segment clearly defined |
| 70–89 | SAM within the fund's target band; reasonable bottom-up; sector tailwinds visible |
| 50–69 | TAM large but SAM unclear; or a niche with limited growth evidence |
| 30–49 | Small or declining market; geography-limited; SAM below the fund's floor |
| 0–29 | No credible market sizing; or outside the thesis sector entirely |
| 0 | No information available |

**Reference:** state your own TAM/SAM figures here, from `investment-thesis`, so scorers anchor on
the same numbers rather than on their own estimates.

---

### 3. Problem–Solution Fit — Weight: 15%

Score for how acutely the problem is felt and how precisely the solution addresses it.
Mission-critical earns the highest scores.

| Score | Signal |
|---|---|
| 90–100 | Mission-critical (no software = no operations); strong customer validation (LOIs, paid pilots, advisory); clear before/after |
| 70–89 | Important but not mission-critical; multiple customers confirm the pain; clear ROI metric |
| 50–69 | Problem real but nice-to-have; limited validation; ROI unclear |
| 30–49 | Problem exists but the solution is a weak fit or easily substituted |
| 0–29 | Solution looking for a problem; no evidence customers care |
| 0 | No information available |

---

### 4. Technology & Product — Weight: 10%

Score for product maturity, defensibility and data or AI moat potential.

| Score | Signal |
|---|---|
| 90–100 | Live product with paying customers; proprietary data moat or AI layer; defensible IP; integration-first architecture |
| 70–89 | MVP in pilots; clear differentiation vs. spreadsheets and generic tools; solid roadmap |
| 50–69 | Early prototype or beta; differentiation unclear; visible tech debt |
| 30–49 | Concept only; no live product; heavy reliance on third-party tools with no moat |
| 0–29 | No product; idea stage with no technical progress |
| 0 | No information available |

---

### 5. Business Model — Weight: 10%

Score for revenue model clarity, ACV, gross margin and asset-lightness.

| Score | Signal |
|---|---|
| 90–100 | Recurring revenue, ACV in the fund's target band, gross margin 80%+, asset-light, expansion path visible |
| 70–89 | Recurring revenue with sound unit economics; margin 70–80% |
| 50–69 | Model works but margin-diluted by services, or ACV below target |
| 30–49 | Project or one-off revenue; unclear recurring path; asset-heavy |
| 0–29 | No revenue model articulated |
| 0 | No information available |

---

### 6. Traction & Validation — Weight: 10%

Score against stage-appropriate expectations — do not penalise a pre-seed company for pre-seed
numbers, and do not reward a seed company for pre-seed numbers.

| Score | Signal |
|---|---|
| 90–100 | Meaningful ARR for the stage, growing; multiple reference customers; retention evidence |
| 70–89 | Early revenue or paid pilots converting; named customers verifiable |
| 50–69 | Unpaid pilots or LOIs only; conversion unproven |
| 30–49 | Waitlist or expressions of interest; nothing contractual |
| 0–29 | No external validation of any kind |
| 0 | No information available |

---

### 7. Competition & Differentiation — Weight: 5%

| Score | Signal |
|---|---|
| 90–100 | Clear, durable wedge; incumbents structurally unable to follow; competitive map understood |
| 70–89 | Real differentiation; competitors named and honestly assessed |
| 50–69 | Differentiation asserted but thin; "we have no competitors" framing |
| 30–49 | Crowded field, no distinct position |
| 0–29 | Directly substitutable by an incumbent feature |
| 0 | No information available |

---

### 8. Go-to-Market Strategy — Weight: 5%

| Score | Signal |
|---|---|
| 90–100 | Repeatable motion proven; CAC and payback measured; named channel partners |
| 70–89 | Plausible motion with early evidence; ICP sharply defined |
| 50–69 | Plan exists, no evidence it works; ICP broad |
| 30–49 | Channel mismatched to ACV (e.g. field sales on a small ACV) |
| 0–29 | No articulated go-to-market |
| 0 | No information available |

---

### 9. Financial Planning & Use of Funds — Weight: 5%

| Score | Signal |
|---|---|
| 90–100 | Credible plan to the next round's milestones; 18+ months runway; use of funds tied to specific milestones |
| 70–89 | Sound plan; 12–18 months runway |
| 50–69 | Plan present but optimistic; runway under 12 months |
| 30–49 | No milestone logic; round size unjustified |
| 0–29 | No financial plan |
| 0 | No information available |

---

### 10. Exit Potential — Weight: 5%

| Score | Signal |
|---|---|
| 90–100 | Named plausible acquirers active in `[sector]`; comparable exits at relevant multiples |
| 70–89 | Acquirer category identifiable; some comparable transactions |
| 50–69 | Exit path plausible but unevidenced |
| 30–49 | No comparable exits in the sector |
| 0–29 | Structurally hard to exit |
| 0 | No information available |

---

## Secondary Ratings

Both are expressed as stars and never change the /100 score.

### Thesis Fit — ★/5

How well does this company fit the fund's thesis in `investment-thesis` — sector, geography,
stage, model? If a hard filter fails, state it here **and** in the recommended action. The score
still reflects the company's quality on the merits.

### Impact Fit — ★/5

If the fund has an impact mandate, rate it here. If it does not, delete this section rather than
leaving it unscored — an always-blank rating trains people to skip the block.

---

## Standard Output Format

```
Startup Score: [X]/100 — [Band]
Screening depth: [First screening | Pitch deck screening | Due diligence screening]

[2–3 sentence company description]

Scoring breakdown:
• Team:                      +[X]/20   — [one-line reason]
• Market Opportunity:        +[X]/15   — [one-line reason]
• Problem–Solution Fit:      +[X]/15   — [one-line reason]
• Technology & Product:      +[X]/10   — [one-line reason]
• Business Model:            +[X]/10   — [one-line reason]
• Traction & Validation:     +[X]/10   — [one-line reason]
• Competition:               +[X]/5    — [one-line reason]
• Go-to-Market:              +[X]/5    — [one-line reason]
• Financial Planning:        +[X]/5    — [one-line reason]
• Exit Potential:            +[X]/5    — [one-line reason]

Thesis Fit:  ★★★☆☆ — [reason; state any hard-pass flags here]
Impact Fit:  ★★★☆☆ — [reason]

Recommended action: [emoji + label; state the hard-pass reason if one applies]
Evaluated: YYYY-MM-DD | [Fund] Startup Scoring v1
```

---

## CRM Field Mapping

Fill in your own CRM's field slugs here, and record which ones are archived so nobody writes to a
dead field. Keep it in this file rather than in the skill, so a slug change is a knowledge edit
rather than a code change.

| What | Field slug | Level | Note |
|---|---|---|---|
| Total score | `[your_score_slug]` | `[record or list entry]` | |
| Full scorecard text | `[your_summary_slug]` | `[record or list entry]` | |

---

## Common Errors to Avoid

1. **Setting the total manually.** It is the arithmetic sum of the ten numerators, computed after
   scoring. Anything else drifts from the dimensions it claims to summarise.
2. **Zeroing dimensions for thesis mismatch.** Geography, stage and model belong in the star
   ratings and the recommended action — never in the dimension scores.
3. **Guessing instead of using the zero-information label.** A 0 marked "No information available"
   is honest and recoverable; an invented 6 is neither.
4. **Scoring without a citation.** Every scored dimension needs one line of evidence — a deck
   slide, a URL, a founder statement — or the zero-information label.
5. **Comparing scores across matrix versions.** If the weights changed, old scores are on a
   different scale. Convert them, or re-score.
