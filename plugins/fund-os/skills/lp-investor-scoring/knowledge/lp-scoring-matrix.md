# LP Investor Scoring Matrix — Ocean One Fund I
# Version: 8
# Last updated: 2026-07-08
#
# HOW TO USE: Edit this file to update scoring rules without re-deploying the skill.
# The lp-investor-scoring skill reads this at runtime via the knowledge manifest.

---

## Fund Context

Ocean One Fund I target size: **€15–30M**
Ideal LP ticket: **€250K–€3M**
Vehicle: First-time fund, Hamburg-based, Maritime LEISURE focus
Critical positioning: Ocean One is the ONLY VC fund focused on Maritime LEISURE — never describe as "maritime technology"

Scope note: this matrix scores the fund's full blue-economy relationship universe, not only fund-LP prospects. An investor can be valuable to Ocean One as a **Limited Partner** (writes a ticket into Fund I), a **Co-Investor** (invests directly alongside Fund I into portfolio companies, e.g. peer VCs and corporate VCs), or a **Strategic Partner** (accelerators, industry bodies, dealflow/ecosystem nodes). All three are worth tracking; none should be scored to zero.

---

## Investor Relationship Type

Classify every investor before scoring:

| Type | Definition | Scoring treatment |
|---|---|---|
| **LP** (default) | Fund-of-funds, DFI, institutional/family-office/corporate allocator — invests capital INTO funds as a Limited Partner | Score all 8 dimensions normally |
| **Co-Investor** | Confirmed direct/equity investor — VC, corporate VC, peer blue-economy or maritime fund, accelerator — invests directly into startups, not structured to commit as a fund LP | Score all 8 dimensions normally — no adjustment. Dimension 1 (Fund of Funds/LP Fit) naturally lands low since the entity doesn't invest in funds; that's the only differentiation needed |
| **Strategic Partner** | Ecosystem node with no direct capital-deployment role relevant to O1 — industry body, accelerator without an investing vehicle, dealflow/introducer relationship | Score all 8 dimensions normally — no adjustment |

Detection signals for Co-Investor / Strategic Partner: "equity-investor lead", "startup investor, not a fund lp", "not structured to be a fund lp", "Vehicle: Startups" (with no fund vehicle mentioned), "co-investor - NOT an LP", "accelerator", "advisor"/"introducer" framing.

Entities that are confirmed non-investors entirely (individuals with no firm, duplicate CRM entries, non-investor businesses caught in a lead-gen sweep) are a **data hygiene issue, not a scoring issue** — flag them for removal from the pipeline in the evaluation notes rather than scoring them at all. This is different from scoring a real Co-Investor low; it's declining to score a non-entity.

---

## Institutional Asset Owner Override

Applies to Investor Type = **Pension Fund**, **Insurance / Insurer**, **Sovereign Wealth Fund**, or **Endowment** with AuM > €1B, UNLESS there is confirmed evidence of a dedicated emerging-manager / first-time-fund program (e.g. an EMF-style facility, a named first-time-fund LP precedent, or a direct sub-€5M commitment on record).

Rationale: these institutions are near-universally governed by fiduciary or statutory mandates that require established multi-vintage track records before any direct fund commitment. Their overall market prominence (Dealroom rank, AuM scale) is real, but it is not evidence that they will write a €250K–3M ticket into a first-time €15–30M vehicle — if anything, scale and statutory constraint are why they won't. Absent confirmed EM evidence, apply all three of the following caps:

1. **Dimension 2 (Emerging Manager Fit) caps at 2/20** — "requires 2–3 fund vintages minimum" tier, not the 6-pt "neutral" default.
2. **Dimension 6 (Investor Strength)** — use the fund-count-vs-rank conflict rule below; do not award Tier 1/2 on raw Dealroom rank alone.
3. **Dimension 8 (Activity Signal) caps at 1/7** — the Dealroom-rank proxy is disabled for this group; see Dimension 8 below.

This override does not zero out the investor — some institutional asset owners do write direct emerging-manager tickets (usually via a named program), and confirmed evidence of that should unlock normal scoring. It only removes the default assumption that "large + prominent + active in general" implies "will invest in Fund I."

---

## Dimension 1 — Fund of Funds / LP Fit (0–20 pts)

Does this investor invest in funds at all?

| Signal | Pts | Examples |
|---|---|---|
| Core business IS investing in funds (FoF, DFI with fund mandate) | 20 | EIF, KfW Capital, Allocator One |
| Primary LP investor — regularly writes fund commitments | 17 | Institutional family office with PE/VC allocation |
| Known to have invested in funds, not primary activity | 12 | Corporate with CVC + selective fund LP |
| Unclear — may have fund LP capacity, unconfirmed | 6 | Large family office, endowment, VC |
| Unlikely — no evidence of fund LP activity | 2 | Angel, pure equity investor |
| Confirmed Co-Investor / Strategic Partner — invests directly, not into funds | 2 | Peer VC, corporate VC, accelerator — this is the natural score for a real non-LP entity, not a penalty; other dimensions (esp. Maritime Leisure Fit) still let it score well overall |

Type mapping: `FoF` → 20 | `Single Family Office` → 6 | `VC` → 6 | `Corporate` → 2 | `BA` → 2 | `Pension Fund` / `Insurance` / `Sovereign Wealth Fund` (unconfirmed) → 6

---

## Dimension 2 — Emerging Manager Fit (0–20 pts)

Is this investor open to first-time funds? (For Co-Investor / Strategic Partner types, this dimension reflects openness to backing/partnering with first-time teams generally, not fund-LP-specific EM programs.)

| Signal | Pts |
|---|---|
| Explicit emerging manager mandate / first-time fund programme | 20 |
| Known anchor LP in first-time funds (track record confirms) | 16 |
| Flexible — relationship-driven, open to right team | 12 |
| Neutral — no programme, evaluates case by case | 6 |
| Requires 2–3 fund vintages minimum | 2 |
| Hard track-record requirement / no realistic path to backing a first-time fund or team | 1 |

Keywords: emerging manager, first-time fund, fund i, new manager, anchor lp, seed lp, manager development, erp-eif, vc eif

**Rule**: For Investor Type = Pension Fund / Insurance / Sovereign Wealth Fund / large Endowment, default to the **2-pt tier**, not the 6-pt "neutral" tier — see Institutional Asset Owner Override above. Only use 6+ if there is a specific, named signal of fund-LP flexibility.

---

## Dimension 3 — Maritime Leisure Thesis Fit (0–20 pts)

Does the investor's thesis, portfolio or heritage align with maritime leisure or the broader blue economy?

| Signal | Pts |
|---|---|
| Direct maritime leisure mandate or confirmed LP precedent (e.g. Ocean 14 as an LP relationship) | 20 |
| Strong maritime / blue economy signal (e.g. a dedicated blue-economy fund, even as a Co-Investor) | 15 |
| Maritime signal (shipping/general, not leisure) | 10 |
| Ocean/coastal sustainability — ocean climate, blue carbon, coastal conservation | 10 |
| Lifestyle / luxury / premium consumer / superyacht / sailing / charter | 10 |
| Weak/indirect signal — general consumer, travel, outdoor, sport | 4 |
| No maritime or leisure signal | 0 |

Positive keywords: ocean 14, maritime leisure, sailing fund, superyacht fund, charter fund, blue economy, blueinvest, maritime, superyacht, yacht, charter, marina, sailing, regatta, luxury, lifestyle, leisure, ocean climate, blue carbon, coastal

Negative note: "Maritime technology" (shipping software, autonomous vessels, port logistics) = max 4 pts unless clear leisure crossover.

---

## Dimension 4 — Geography (0–15 pts)

| Geography | Pts | Rationale |
|---|---|---|
| DACH (Germany, Austria, Switzerland) | 15 | Home market; Hamburg maritime culture |
| Nordics (Denmark, Sweden, Norway, Finland) | 13 | Deep sailing culture; active LP market |
| Benelux / France / Luxembourg | 11 | Core EU LP market |
| UK / Ireland / Channel Islands | 11 | Major LP market; sailing culture |
| Southern Europe (Italy, Spain, Portugal, Greece) | 8 | Mediterranean leisure heartland |
| CEE / Baltics | 5 | Baltic Sea angle; emerging LP market |
| Israel | 5 | Active FoF/institutional LP market |
| North America | 3 | Adds legal/tax complexity for Fund I |
| Asia / MENA / Rest of World | 1 | Very unlikely for Fund I |
| Unknown | 2 | Insufficient data |

---

## Dimension 5 — AuM / Ticket Size Fit (0–8 pts)

Fund I size: €15–30M. Ideal ticket: €250K–€3M. For Co-Investor types, read this dimension as fund-size/deployment-capacity fit for co-investing alongside O1's portfolio rounds rather than an LP ticket.

| AuM Estimate | Pts | Rationale |
|---|---|---|
| €20M–€500M | 8 | Sweet spot — can write €250K–€3M without over-concentration |
| €5M–€20M | 6 | Smaller but flexible; angels and small family offices |
| €500M–€5B | 4 | Ticket may be borderline; needs tailoring |
| €5B–€50B | 2 | Min ticket likely too large; possible via co-invest |
| €50B+ | 1 | Fund I below minimum threshold for most programmes |
| Unknown | 3 | Assume possible; flag for research |

---

## Dimension 6 — Investor Strength (0–15 pts)

How significant and active is this investor in the European VC/LP ecosystem?

| Tier | Pts | Criteria |
|---|---|---|
| Tier 1 — dominant, highly active (top 50 Dealroom or equivalent) | 15 | EIF, KfW, Ingka, HQ Capital, Tesi |
| Tier 2 — strong, well-known, active (rank 51–150) | 11 | Mid-size DFIs, established FoFs, 10+ fund investments |
| Tier 3 — known but smaller/less active (rank 151–300) | 7 | Regional DFIs, boutique FoFs, 3–10 fund investments |
| Tier 4 — limited track record (rank 300+ or <3 fund investments) | 4 | Newer family offices, first-time allocators |
| Unknown / no data | 2 | Insufficient data |

Use all signals: Dealroom rank, VC firms backed, power-law score, recent fund commitments.

**Rule — fund-count-vs-rank conflict**: Dealroom rank and "VC firms backed" (fund investment count) are two different signals — rank often reflects overall AUM/scale, while fund count reflects actual VC-market activity. When the two disagree by more than one tier (using the fund-count thresholds already in this table: 10+ → Tier 2, 3–10 → Tier 3, <3 → Tier 4), **use the lower (more conservative) of the two tiers.** This applies to all investor types, but matters most for Pension Fund / Insurance / Sovereign Wealth Fund / Endowment, whose Dealroom rank is typically driven by total AUM rather than VC-specific activity.

**Note for output clarity**: a high score here reflects general market prominence, not fund-of-funds/emerging-manager fit. Don't read a "Tier 1" tag as an indicator the institution is likely to invest in Fund I — that's what Dimensions 1, 2 and 8 are for.

---

## Dimension 7 — Network / Relationship Proximity (0–15 pts)

| Signal | Pts |
|---|---|
| Warm intro confirmed / known to team personally | 15 |
| Met at conference / event; direct contact exists | 11 |
| 2nd-degree connection via known mutual | 7 |
| Cold but identifiable decision-maker (LinkedIn reachable) | 3 |
| Unknown / no connection visible | 0 |

---

## Dimension 8 — Activity Signal (0–7 pts)

Is this investor actively deploying capital? (Into funds for LPs; into deals for Co-Investors.)

| Signal | Pts |
|---|---|
| Active — new commitments/deals in last 12 months | 7 |
| Recent — commitments/deals in last 2–3 years | 5 |
| Moderate — some recent moves, irregular | 3 |
| Low — last known activity 3–5 years ago | 1 |
| Dormant / wind-down / harvest mode | 0 |

Dealroom longlist proxy (default, LPs only): rank ≤150 → 7 pts | rank ≤300 → 5 pts | rank 300+ → 3 pts

**Rule**: The Dealroom-rank proxy above is **disabled** for Investor Type = Pension Fund / Insurance / Sovereign Wealth Fund / Endowment. Rank measures general prominence, not confirmed direct fund-commitment cadence. For these types, default to **1 pt ("Low")** unless there is confirmed evidence of a *direct* fund commitment (not routed via a consultant, FoF, or platform) within the last 3 years — in which case score normally per the table above.

---

## Score Tiers & Recommended Actions

The eight dimension caps sum to a **raw maximum of 120** (20+20+20+15+8+15+15+7). The final score is that raw sum normalised to a 0–100 scale:

```
final = round(raw / 120 × 100)
```

Always report both, so a score can be audited back to its dimensions: `77/100 (raw 92/120)`.

Same math for every Relationship Type. Tier and recommended action are assigned off the **normalised** score, with the action label reflecting the relationship type.

| Score | Tier | LP Action | Co-Investor / Strategic Partner Action |
|---|---|---|---|
| 80–100 | 🔥 Priority | Immediate warm outreach; anchor LP candidate | Immediate outreach; priority co-investment relationship |
| 60–79 | ⭐ High Fit | Active pipeline; personalised approach | Active co-investor pipeline; build the relationship |
| 40–59 | 👍 Qualified | Outreach when capacity allows; thesis tailoring needed | Worth a warm intro; monitor for co-investment opportunities |
| 20–39 | 👁 Watchlist | Monitor; revisit for Fund II | Ecosystem-map only; light-touch relationship |
| 1–19 | ❌ Low Fit | Do not prioritise for LP outreach | Not a near-term priority; keep on file |

No score is ever 0 or "disqualified" by policy — the floor across all 8 dimensions (2+1+0+1+1+2+0+0 = 7 raw → 6/100) means even a weak-fit entity lands with a nonzero score. An entity that turns out to be a non-investor (individual, duplicate, unrelated business) is a data-hygiene removal, not a score of 0 — flag it as such in the evaluation notes.

---

## Validation — Reference Scores

Use these to sanity-check scoring. If any score falls outside its expected range, review dimension assignments.

| Investor | Type | Expected Range | Key drivers |
|---|---|---|---|
| European Investment Fund (EIF) | LP | 90–100 | FoF + EM mandate + DACH + Tier 1 |
| HQ Capital | LP | 85–100 | FoF + Ocean 14 LP (maritime leisure precedent) + DACH + Tier 1 |
| Ingka Investments | LP | 85–95 | FoF + Ocean 14 LP + Nordics + Tier 1 |
| KfW Capital | LP | 82–92 | DFI FoF + EM mandate + DACH + Tier 1 |
| Allocator One | LP | 80–90 | EM specialist + FoF + niche focus |
| B-Flexion | LP | 72–84 | Bertarelli/Americas Cup sailing DNA + Switzerland |
| Oldendorff Overseas Investments | LP | 70–80 | Shipping family FO + Hamburg + maritime |
| Pantaenius | LP | 65–78 | Maritime insurer + Hamburg — high sector fit, not primary fund LP |
| Statutory pension fund / insurer, no confirmed EM program (e.g. Varma, Elo, Ilmarinen, Keva, Suva) | LP | 25–40 | Institutional Asset Owner Override — high geography/scale, near-zero FoF/EM/maritime fit |
| Ocean 14 Capital | Co-Investor | 50–65 | Peer blue-economy VC (EUR 201M fund), direct startup investor not a fund LP — Dimension 1 low (2/20, confirmed Co-Investor) offset by strong blue-economy thesis fit (15/20) and notable LPs (HQ Capital, Ingka) driving Investor Strength; no multiplier applied |

---

## What Ocean One Is NOT (Avoid Misclassification)

- **Not maritime technology** — autonomous shipping, port logistics, propulsion tech = separate sector, max 4 pts on Dimension 3
- **Ocean climate solutions are IN scope** — blue economy ESG, ocean conservation, ocean climate = 10 pts on Dimension 3
- **Not generalist consumer** — hospitality, travel, outdoor broadly do not qualify; maritime specificity required
- **Not shipping / freight** — bulk carriers, container lines, freight forwarders = industrial maritime, not leisure
- **Not "large and active" = "will invest"** — institutional scale (Dimension 6) and general market activity are distinct from fund-of-funds mandate (Dimension 1), emerging-manager appetite (Dimension 2), and confirmed direct commitment behaviour (Dimension 8). A Tier 1 institution can and often should still land in Watchlist if 1, 2 and 8 are all low.
- **Not "not an LP" = "worthless"** — a confirmed Co-Investor or Strategic Partner is scored on the exact same 8 dimensions as an LP, never zeroed. Dimension 1 naturally lands low for a non-LP entity; the other 7 dimensions still let a strong blue-economy peer fund, corporate VC, or accelerator score well overall.
