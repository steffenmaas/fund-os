# LP Investor Scoring Matrix — TEMPLATE
# Version: 1.0
#
# HOW TO USE: this is the shipped template, not a fund's actual matrix. The structure, the
# dimensions, the override rules and the normalisation are the methodology and are meant to be
# used as-is. The *signals* — sector fit, geography, fund size — carry `[placeholders]` where
# your thesis goes.
#
# Fill it in and save as ~/.fund-os/knowledge/lp-scoring-matrix.md, or put it in your Drive
# knowledge folder under the key `lp-scoring-matrix`. Either overlay wins over this file, and
# editing the overlay changes scoring without redeploying the plugin.

---

## Fund Context

Fill these in from `investment-thesis` — every dimension below is scored relative to them.

| Parameter | Value |
|---|---|
| Fund name and vehicle | `[Fund I — first-time fund / follow-on vehicle]` |
| Target size | `[€XX–XXM]` |
| Ideal LP ticket | `[€XXXK–€XM]` |
| Thesis in one phrase | `[the sector, stated the way the fund always states it]` |
| Home geography | `[beachhead market]` |

**Positioning rule:** `[the phrase the fund always uses, and the one it never uses]`. Getting this
wrong in LP-facing output misdescribes the fund to exactly the audience that matters most.

---

## Investor Relationship Type

Classify every investor before scoring. This scores the fund's **full relationship universe**, not
only LP prospects.

| Type | Definition | Scoring treatment |
|---|---|---|
| **LP** (default) | Fund-of-funds, DFI, institutional / family-office / corporate allocator — invests capital INTO funds | Score all 8 dimensions normally |
| **Co-Investor** | Confirmed direct investor — VC, corporate VC, peer fund, accelerator with a vehicle — invests into startups, not structured to commit as a fund LP | Score all 8 dimensions normally. Dimension 1 naturally lands low; that is the only differentiation needed |
| **Strategic Partner** | Ecosystem node with no direct capital-deployment role — industry body, accelerator without a vehicle, introducer | Score all 8 dimensions normally |

Detection signals for Co-Investor / Strategic Partner: "equity-investor lead", "startup investor,
not a fund LP", "not structured to be a fund LP", a startup-only vehicle with no fund vehicle
mentioned, accelerator or advisor framing.

**No entity is ever scored 0 or disqualified.** An entity that turns out not to be an investor at
all — an individual with no firm, a duplicate CRM record, an unrelated business caught in a
lead-gen sweep — is a **data-hygiene removal, not a score of 0**. Flag it for removal in the
evaluation notes rather than scoring it. That is a different thing from scoring a real
Co-Investor low.

---

## Institutional Asset Owner Override

For Investor Type = Pension Fund / Insurance / Sovereign Wealth Fund / Endowment above
`[€1B]` AuM, with no confirmed emerging-manager programme evidence:

1. **Dimension 2 (Emerging Manager Fit) caps at 2/20** — the "requires an established track
   record" tier, not the neutral default.
2. **Dimension 6 (Investor Strength)** — apply the fund-count-vs-rank conflict rule below. Do not
   award a top tier on raw database rank alone.
3. **Dimension 8 (Activity Signal) caps at 1/7** — the rank proxy is disabled for this group.

**Why this exists:** Dimensions 6 and 8 both draw on the same "how big and prominent is this
institution" signal, which for asset owners tracks AUM rather than fund-investment activity.
Without the override, a statutory pension fund that has never written a cheque into a first-time
niche vehicle scores like an active emerging-manager backer.

---

## Dimension 1 — Fund of Funds / LP Fit (0–20 pts)

Does this investor invest in funds at all?

| Signal | Pts | Examples |
|---|---|---|
| Core business IS investing in funds | 20 | Fund-of-funds; DFI with an explicit fund mandate |
| Primary LP investor — regularly writes fund commitments | 17 | Institutional family office with a PE/VC allocation |
| Known to have invested in funds, not the primary activity | 12 | Corporate with a CVC arm and selective fund LP positions |
| Unclear — may have fund LP capacity, unconfirmed | 6 | Large family office, endowment, VC |
| Unlikely — no evidence of fund LP activity | 2 | Angel, pure equity investor |
| Confirmed Co-Investor / Strategic Partner — invests directly, not into funds | 2 | Peer VC, corporate VC, accelerator. This is the natural score for a real non-LP entity, not a penalty — other dimensions still let it score well overall |

Type mapping: `FoF` → 20 | `Single Family Office` → 6 | `VC` → 6 | `Corporate` → 2 | `BA` → 2 |
`Pension Fund` / `Insurance` / `Sovereign Wealth Fund` (unconfirmed) → 6

---

## Dimension 2 — Emerging Manager Fit (0–20 pts)

Is this investor open to first-time funds? For Co-Investor and Strategic Partner types, read it as
openness to backing first-time teams generally.

| Signal | Pts |
|---|---|
| Explicit emerging-manager programme, or a confirmed first-time-fund commitment | 20 |
| Known appetite for emerging managers; several first-time positions | 15 |
| Neutral — no stated policy either way | 6 |
| Prefers established managers; typically requires 2–3 fund vintages | 2 |
| Explicitly excludes first-time funds | 0 |

---

## Dimension 3 — Thesis Fit (0–20 pts)

Does the investor's thesis, portfolio or heritage align with `[the fund's sector]`?

> **This is the dimension you must rewrite for your own fund.** Replace the sector ladder and the
> keyword lists below. Keep the shape: one top tier for a direct mandate or a confirmed precedent,
> a middle band for adjacent mandates, a low band for weak or generic overlap, and 0 for none.

| Signal | Pts |
|---|---|
| Direct `[sector]` mandate, or a confirmed precedent as an LP in a comparable vehicle | 20 |
| Strong `[sector]` signal — a dedicated fund in the space, even as a Co-Investor | 15 |
| Adjacent-sector signal — the broader category, not the specific niche | 10 |
| Thematically aligned but not sector-specific — e.g. a shared sustainability or technology angle | 10 |
| Weak or indirect — general consumer, general B2B, generic technology | 4 |
| No signal | 0 |

**Positive keywords:** `[list the terms that appear in a mandate you would want]`

**Negative note:** `[name the adjacent category most often confused with your sector, and cap it]`.
The most common scoring error on this dimension is rewarding the adjacent category as if it were
the target one.

---

## Dimension 4 — Geography (0–15 pts)

Rewrite this ladder for your own fund. Points fall with distance from the home market and with
the legal or tax friction the investor's jurisdiction adds.

| Geography | Pts | Rationale |
|---|---|---|
| `[home market]` | 15 | Home market |
| `[adjacent market 1]` | 13 | `[why]` |
| `[adjacent market 2]` | 11 | `[why]` |
| `[core regional LP market]` | 11 | `[why]` |
| `[secondary market]` | 8 | `[why]` |
| `[emerging market]` | 5 | `[why]` |
| `[market adding legal/tax complexity]` | 3 | Adds structuring complexity for a first vehicle |
| `[rest of world]` | 1 | Unlikely for this vehicle |
| Unknown | 2 | Insufficient data |

---

## Dimension 5 — AuM / Ticket Size Fit (0–8 pts)

Anchor these bands to the fund's own size and ideal ticket. For Co-Investor types, read the
dimension as deployment capacity for co-investing alongside the fund's rounds.

| AuM Estimate | Pts | Rationale |
|---|---|---|
| `[sweet spot band]` | 8 | Can write the ideal ticket without over-concentrating |
| `[one band smaller]` | 6 | Smaller but flexible |
| `[one band larger]` | 4 | Ticket may be borderline; needs tailoring |
| `[much larger]` | 2 | Minimum ticket likely too large; possible via co-invest |
| `[institutional scale]` | 1 | The fund is below the minimum threshold for most programmes |
| Unknown | 3 | Assume possible; flag for research |

---

## Dimension 6 — Investor Strength (0–15 pts)

How significant and active is this investor in the relevant VC/LP ecosystem?

| Tier | Pts | Criteria |
|---|---|---|
| Tier 1 — dominant, highly active | 15 | Top-50 by a recognised database, or equivalent standing |
| Tier 2 — strong, well known, active | 11 | Mid-size DFIs, established FoFs, 10+ fund investments |
| Tier 3 — known but smaller or less active | 7 | Regional DFIs, boutique FoFs, 3–10 fund investments |
| Tier 4 — limited track record | 4 | Newer family offices, first-time allocators, <3 fund investments |
| Unknown / no data | 2 | Insufficient data |

Use all available signals: database rank, funds backed, recent commitments.

**Rule — fund-count-vs-rank conflict:** database rank and fund-investment count are different
signals. Rank often reflects total AUM and scale; fund count reflects actual VC-market activity.
When the two disagree by more than one tier (using the fund-count thresholds in the table above),
**use the lower, more conservative tier.** This matters most for pension funds, insurers and
sovereign wealth funds, whose rank is driven by AUM rather than VC activity.

**Note for output clarity:** a high score here reflects general market prominence, not
fund-of-funds or emerging-manager fit. A "Tier 1" tag is not an indicator that the institution is
likely to invest — that is what Dimensions 1, 2 and 8 are for.

---

## Dimension 7 — Network / Relationship Proximity (0–15 pts)

| Signal | Pts |
|---|---|
| Warm intro confirmed, or known to the team personally | 15 |
| Met at a conference or event; direct contact exists | 11 |
| Second-degree connection via a known mutual | 7 |
| Cold, but an identifiable decision-maker is reachable | 3 |
| Unknown / no connection visible | 0 |

---

## Dimension 8 — Activity Signal (0–7 pts)

Is this investor actively deploying? Into funds for LPs; into deals for Co-Investors.

| Signal | Pts |
|---|---|
| Active — new commitments or deals in the last 12 months | 7 |
| Recent — commitments or deals in the last 2–3 years | 5 |
| Moderate — some recent moves, irregular | 3 |
| Low — last known activity 3–5 years ago | 1 |
| Dormant / wind-down / harvest mode | 0 |

Database-rank proxy (default, LPs only): rank ≤150 → 7 | rank ≤300 → 5 | rank 300+ → 3

**Rule:** the rank proxy is **disabled** for Pension Fund / Insurance / Sovereign Wealth Fund /
Endowment. Rank measures prominence, not confirmed fund-commitment cadence. For these types
default to **1 pt**, unless there is confirmed evidence of a *direct* fund commitment — not routed
via a consultant, FoF or platform — within the last three years.

---

## Score Tiers & Recommended Actions

The eight dimension caps sum to a **raw maximum of 120** (20+20+20+15+8+15+15+7). The final score
is that raw sum normalised to a 0–100 scale:

```
final = round(raw / 120 × 100)
```

Always report both, so a score can be audited back to its dimensions: `77/100 (raw 92/120)`.

Never cap the raw sum at 100. Capping hides a scale defect instead of fixing it — that is exactly
how the declared range and the actual range drifted apart in the first place.

Same math for every Relationship Type. Tier and recommended action are assigned off the
**normalised** score, with the action label reflecting the relationship type.

| Score | Tier | LP Action | Co-Investor / Strategic Partner Action |
|---|---|---|---|
| 80–100 | 🔥 Priority | Immediate warm outreach; anchor LP candidate | Immediate outreach; priority co-investment relationship |
| 60–79 | ⭐ High Fit | Active pipeline; personalised approach | Active co-investor pipeline; build the relationship |
| 40–59 | 👍 Qualified | Outreach when capacity allows; thesis tailoring needed | Worth a warm intro; monitor for co-investment opportunities |
| 20–39 | 👁 Watchlist | Monitor; revisit for the next fund | Ecosystem-map only; light-touch relationship |
| 1–19 | ❌ Low Fit | Do not prioritise for LP outreach | Not a near-term priority; keep on file |

No score is ever 0 or "disqualified" by policy — the floor across all 8 dimensions
(2+1+0+1+1+2+0+0 = 7 raw → 6/100) means even a weak-fit entity lands with a nonzero score.

---

## Validation — Reference Scores

Keep three or four scored entities here as calibration anchors, chosen to span the tiers, and
re-score them whenever the matrix version changes. If an anchor moves tier unexpectedly, the
change had a wider effect than intended.

| Entity | Type | Expected raw | Expected final | Tier |
|---|---|---|---|---|
| `[anchor 1]` | `[LP]` | `[raw]` | `[final]` | `[tier]` |
| `[anchor 2]` | `[Co-Investor]` | `[raw]` | `[final]` | `[tier]` |
| `[anchor 3]` | `[institutional, override applied]` | `[raw]` | `[final]` | `[tier]` |

Anchors belong in your own overlay copy, never in the shipped template — a named investor with a
score is exactly the kind of content that must not be shared.

---

## What This Fund Is NOT (Avoid Misclassification)

List the categories your fund is regularly mistaken for, and what each one means for scoring.
This section prevents the most common false positives in bulk scoring.

- `[adjacent category 1]` — `[why it is not us, and the cap that applies]`
- `[adjacent category 2]` — `[why it is not us, and the cap that applies]`
