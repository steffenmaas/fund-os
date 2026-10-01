# Startup Scoring Matrix — TEMPLATE
# Version: 2.0

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

## Three scores, three questions, never mixed

A deal carries **three independent scores**. Each answers a different question, and collapsing any
two of them into one number is how a fund loses the ability to tell them apart.

| Score | Question | Range |
|---|---|---|
| **Quality** | Is this a good company? | 0–100 |
| **Thesis Fit** | Is this *our* company? | 0–100 |
| **Urgency** | How soon must we decide? | 0–100 |

An excellent company that is outside the thesis scores high on Quality and low on Thesis Fit —
and that is the correct, useful answer, not a contradiction. A mediocre company squarely inside
the thesis is the inverse. Averaging the two would hide both.

**Urgency never moves the other two.** A round closing on Friday does not make a company better
or a better fit; it only changes what the fund must do this week. It sets timing, never verdict.

Each score is stored with its own written evaluation explaining how it was reached. A number
without its reasoning cannot be audited, challenged, or corrected later.

---

## Quality — 0–100

Scores an early-stage startup across 10 weighted dimensions.

**Scoring methodology rules — these are the part that must not drift:**

1. **Score every dimension on evidence, always.** Never zero one out because of a thesis mismatch
   in geography, stage or model. Thesis fit is its own score, never expressed by suppressing a
   quality dimension.
2. **Total score = exact arithmetic sum of all 10 dimension numerators.** Do not set it manually.
   Compute it after scoring all dimensions. Example: 14+12+13+9+8+9+4+4+4+5 = 82, so total = 82.
3. **The caps below sum to exactly 100.** If you re-weight, they must still sum to 100 —
   `tools/validate.py` enforces this, because a matrix that declares /100 while its caps sum to
   110 puts every score on a stretched scale and silently breaks the band thresholds.
4. **Bands reflect company quality on the merits.** A company can score in the top band and still
   receive a Pass — a company two stages later than the fund invests can score 91 on quality and
   still be out of reach. That verdict comes from the Quality × Thesis Fit table, not from the
   quality band, and it is why the two are scored apart.

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

## Quality Bands

| Quality | Band |
|---|---|
| 90–100 | Strong — exceptional on the merits |
| 75–89 | Investable — minor gaps |
| 60–74 | Possible — material gaps |
| 40–59 | Weak — major concerns |
| 0–39 | Poor |

A band describes the **company**, not the decision. The decision comes from the next table.

---

## Recommended Action — Quality × Thesis Fit

The verdict is a function of both scores. Read down for quality, across for thesis fit.

| Quality ↓ / Thesis Fit → | 70–100 (core) | 40–69 (adjacent) | 0–39 (outside) |
|---|---|---|---|
| **75–100** | ✅ **Pursue** — IC pack | 🔵 **Exception review** — a GP must argue the thesis stretch in writing | 🟣 **Refer out** — good company, not ours; offer to a co-investor and log the referral |
| **60–74** | 🟡 **Watchlist** — name the gaps that would move it | 🟠 **Monitor** — revisit on a trigger, not on a date | ❌ **Pass** |
| **0–59** | 🟠 **Monitor** — right space, not yet a company | ❌ **Pass** | ❌ **Pass** |

**Refer out is a real outcome, not a polite pass.** A strong company outside the thesis is worth
more as a favour to a co-investor than as a silent rejection, and the referral is worth logging.

**A failed hard filter overrides this table.** Hard filters live in the Thesis Fit section below;
when one fails, the action is Pass or Refer out regardless of quality, and the failed filter is
named explicitly in the output.

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

## Thesis Fit — 0–100

Answers one question: **is this our company?** It is scored independently of quality and never
borrows from it. Five dimensions, capped so they sum to exactly 100.

| Dimension | Cap | What it measures |
|---|---|---|
| Sector fit | 30 | How squarely the company sits in the sectors named in `investment-thesis` |
| Stage fit | 25 | Round and maturity against the stage the fund invests at |
| Geography fit | 20 | Domicile and primary market against the fund's geography |
| Business model fit | 15 | Revenue model, margin shape and capital intensity against the thesis |
| Ticket & ownership fit | 10 | Whether the round allows the fund's cheque and target ownership |

### Sector fit — 30

| Pts | Signal |
|---|---|
| 30 | Core sector, exactly as `investment-thesis` defines it |
| 22 | Named sub-sector, slightly different customer or wedge |
| 14 | Adjacent — shares buyer or infrastructure with a core sector |
| 6 | Same broad category, different problem |
| 0 | Outside the thesis sectors |

### Stage fit — 25

| Pts | Signal |
|---|---|
| 25 | Exactly the fund's stage, raising now |
| 18 | Half a stage early or late; cheque still works |
| 10 | One full stage off; entry price likely wrong |
| 4 | Two stages off |
| 0 | Pre-idea, or past the stage the fund can enter |

### Geography fit — 20

| Pts | Signal |
|---|---|
| 20 | `[home market]` — domiciled and operating |
| 15 | `[core region]` |
| 10 | `[extended region]` — workable with light structuring |
| 4 | Outside the region but EU/UK structurable |
| 0 | Jurisdiction the fund cannot or will not invest in |

### Business model fit — 15

| Pts | Signal |
|---|---|
| 15 | `[target model]` with the margin profile the thesis assumes |
| 10 | Target model with a services component under ~30% |
| 6 | Mixed model; path to the target model plausible but unproven |
| 2 | Services- or asset-heavy; no credible path |
| 0 | Model the thesis explicitly excludes |

### Ticket & ownership fit — 10

| Pts | Signal |
|---|---|
| 10 | Round size and allocation fit the fund's cheque and target ownership |
| 7 | Fits with a smaller cheque than preferred |
| 4 | Round too large or too small; ownership target unreachable |
| 1 | Allocation effectively closed to a fund this size |
| 0 | No round, and none expected |

### Thesis Fit bands

| Thesis Fit | Meaning |
|---|---|
| 85–100 | Core thesis — exactly what the fund was raised to back |
| 70–84 | Solidly inside |
| 40–69 | Adjacent — a stretch that needs an argument |
| 20–39 | Outside, with one point of contact |
| 0–19 | Outside the thesis |

### Hard filters

Hard filters are **separate from the score** and override the recommended action. List yours here:

- [ ] `[e.g. outside the fund's permitted jurisdictions]`
- [ ] `[e.g. sector the LPA excludes]`
- [ ] `[e.g. company already past the fund's entry stage]`

A failed hard filter does not force Thesis Fit to 0 — the number still describes how close the
company is, which is what makes a future re-score meaningful when the blocking fact changes. Name
the failed filter in the evaluation text and in the recommended action.

---

## Urgency — 0–100

Answers: **how soon must the fund decide?** In practice, the distance to the close of the next
funding round. It describes the *window*, never the company.

| Dimension | Cap | What it measures |
|---|---|---|
| Round status | 35 | How far the round has progressed toward being closed |
| Time to close | 25 | Distance to the stated or estimated close date |
| Allocation remaining | 15 | Whether there is still room for the fund's cheque |
| Runway pressure | 10 | How hard the company's cash position forces a close |
| Competitive tension | 15 | How contested the round is |

### Round status — 35

| Pts | Signal |
|---|---|
| 35 | Term sheet signed with a lead; syndicate filling now |
| 28 | Lead committed, no signed term sheet |
| 20 | Soft-circled past half the round |
| 12 | Actively raising, no lead |
| 6 | Preparing to raise — materials in progress, no outreach yet |
| 2 | Not raising; next round expected within 12 months |
| 0 | Not raising; no round in sight |

### Time to close — 25

Measured from today to the stated close. Where no date is stated, estimate from round status and
say so in the evaluation.

| Pts | Signal |
|---|---|
| 25 | Closing within 2 weeks |
| 20 | 2–4 weeks |
| 15 | 1–2 months |
| 10 | 2–4 months |
| 5 | 4–8 months |
| 0 | More than 8 months, or no round |

### Allocation remaining — 15

| Pts | Signal |
|---|---|
| 15 | Full allocation available for the fund's cheque |
| 10 | Room for a reduced cheque |
| 5 | Oversubscribed; allocation only via the lead or a warm push |
| 0 | Closed — no allocation at any size |

### Runway pressure — 10

| Pts | Signal |
|---|---|
| 10 | Under 3 months of runway |
| 7 | 3–6 months |
| 4 | 6–12 months |
| 1 | Over 12 months, or profitable |
| 0 | No information available |

### Competitive tension — 15

| Pts | Signal |
|---|---|
| 15 | Multiple term sheets, or a named tier-1 fund circling |
| 10 | Several funds in diligence; founder reports inbound |
| 6 | Some investor interest, nothing concrete |
| 2 | No visible competition |
| 0 | No information available |

### Urgency bands

| Urgency | Meaning | What it asks of the fund |
|---|---|---|
| 80–100 | Closing now | Decide this week or lose the allocation |
| 60–79 | Closing soon | Diligence on a deadline; book the founder call now |
| 40–59 | Open window | Normal process; no artificial deadline |
| 20–39 | Early | Build the relationship before the round opens |
| 0–19 | No window | Track only; revisit on a trigger |

### Two rules that keep urgency honest

**1. Unknown is not the same as not urgent.** The zero-information rule does *not* apply to
urgency the way it applies to quality. Scoring an unknown round as 0 buries a hot deal the fund
simply has not asked about yet. Instead, score from what the stage and sector make likely, and
label the score:

- `observed` — the round status and close date come from the founder, the deck or a filing
- `inferred` — estimated from stage, last round date and sector cadence

An `inferred` urgency above 60 is an instruction to go and ask, not a basis for acting.

**2. Urgency decays.** It is the only one of the three scores that is wrong simply because time
passed. Every urgency score carries the date it was made and is **void after 30 days** — or
immediately when the round status changes. A stale urgency score must be re-scored, never reused.
Quality and Thesis Fit have no such expiry; they change only when the company or the thesis does.

---

## Impact Fit — ★/5

If the fund has an impact mandate, rate it here; it is advisory and never enters the three scores
above. If the fund has no impact mandate, delete this section rather than leaving it unscored — an
always-blank rating trains people to skip the block.

---

## Standard Output Format

```
[Company] — Quality [X]/100 · Thesis Fit [Y]/100 · Urgency [Z]/100 ([observed|inferred])
Screening depth: [First screening | Pitch deck screening | Due diligence screening]

[2–3 sentence company description]

QUALITY — [X]/100 ([Band])
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

THESIS FIT — [Y]/100 ([Band])
• Sector fit:                +[X]/30   — [one-line reason]
• Stage fit:                 +[X]/25   — [one-line reason]
• Geography fit:             +[X]/20   — [one-line reason]
• Business model fit:        +[X]/15   — [one-line reason]
• Ticket & ownership fit:    +[X]/10   — [one-line reason]
Hard filters: [none failed | name each failed filter]
Why: [2–4 sentences. What makes this ours, or what puts it outside. Name the single
      fact that would most change this score.]

URGENCY — [Z]/100 ([Band]) · [observed|inferred] · as of [YYYY-MM-DD], void after [YYYY-MM-DD]
• Round status:              +[X]/35   — [one-line reason]
• Time to close:             +[X]/25   — [close date, stated or estimated]
• Allocation remaining:      +[X]/15   — [one-line reason]
• Runway pressure:           +[X]/10   — [one-line reason]
• Competitive tension:       +[X]/15   — [one-line reason]
Why: [2–4 sentences. When does this close, how do we know, and what would we have to do
      this week. If inferred, say what has not been asked yet.]

Impact Fit: ★★★☆☆ — [reason]   (omit entirely if the fund has no impact mandate)

Recommended action: [from the Quality × Thesis Fit table; state any failed hard filter]
Next step by: [date — driven by Urgency, not by the verdict]
Evaluated: YYYY-MM-DD | [Fund] Startup Scoring v2
```

The three `Why:` blocks are not decoration. They are what gets stored alongside each number, and
they are the only part a reader can argue with six months later.

---

## CRM Field Mapping

Fill in your own CRM's field slugs here, and record which ones are archived so nobody writes to a
dead field. Keep it in this file rather than in the skill, so a slug change is a knowledge edit
rather than a code change.

Every score is stored **with its evaluation**. A stored number whose reasoning lives only in a
chat log is a number nobody can check.

| What | Field slug | Type | Level | Note |
|---|---|---|---|---|
| Quality score | `[your_quality_slug]` | number 0–100 | `[record or list entry]` | |
| Full scorecard text | `[your_summary_slug]` | text | `[record or list entry]` | The whole block above |
| Thesis Fit score | `[your_thesis_fit_slug]` | number 0–100 | `[record or list entry]` | |
| Thesis Fit evaluation | `[your_thesis_fit_eval_slug]` | text | `[record or list entry]` | The `Why:` block |
| Urgency score | `[your_urgency_slug]` | number 0–100 | `[record or list entry]` | Perishable — see below |
| Urgency evaluation | `[your_urgency_eval_slug]` | text | `[record or list entry]` | Must open with `observed`/`inferred` and the as-of date |

**Urgency needs its date in the CRM, not only in the text.** If the CRM has a date field, write
the as-of date to it so the list can be filtered for stale scores. If it has none, the evaluation
text must begin with `as of YYYY-MM-DD (observed|inferred)` so a human sorting the list can see
the age without opening the record.

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
6. **Averaging quality and thesis fit.** They answer different questions. A 90-quality company
   outside the thesis and a 50-quality company inside it both average to 70, which describes
   neither and hides the only distinction that matters.
7. **Letting urgency raise a verdict.** A closing round shortens the clock; it does not improve
   the company. If a deal only looks attractive because it closes Friday, that is the deadline
   talking.
8. **Reusing a stale urgency score.** It is void after 30 days or on any change in round status.
   Re-score it; do not carry it forward.
9. **Scoring an unknown round as 0 urgency.** Unknown means nobody has asked. Score it `inferred`
   from stage and cadence, and treat anything above 60 as an instruction to go and find out.
