# LP fundraising playbook — TEMPLATE
#
# HOW TO USE: this is the shipped template, not a fund's playbook. Copy it as `lp-fundraising-playbook.md`
# into the fund's knowledge folder (Drive, or ~/.fund-os/knowledge/) and replace everything in `[square brackets]`.
# It is the one file the partners keep for investors: whom the fund looks for, how it finds them, where the
# data comes from, how they are scored and how onboarding runs. The LP and fundraising skills and the
# investor autopilot read it under exactly this title.
#
# Structure: every section is a level-2 heading (`##`); the names below are recognised (German names work
# too). A heading with another name is reported and ignored, never read as an instruction. List sections take
# bullets (`- ...`); the two scoring sections take free text with `###` sub-sections and tables. Lines above
# the first `##` are not read, and neither are lines that start with `>`. It replaces `lp-scoring-matrix.md`
# for Fit (the matrix stays as the fallback when this file is missing); the outreach sequence and the tone
# guide stay separate files.

## Goal and fund

[Fund I — first fund / follow-on fund]: target size [amount], first closing [date] with [amount].
One sentence on the thesis: [the sector, said the way the fund always says it].

Positioning rule: [the phrase the fund always uses, and the one it never uses]. Described wrongly, the fund
misses exactly the audience that matters.

## Who we look for

Two groups, scored separately, which may overlap:

- LPs: [family offices, funds of funds, foundations, institutional investors, corporates — whoever puts capital into funds]
- Co-investors: [venture funds, corporate VCs, peer funds — whoever invests directly next to us]

A co-investor may become an LP later, but need not. A co-investor is not scored lower, only classified differently.

## Search profiles

> One line per search: `<search term> → <type>`. The type is one of: family office, fund of funds, institutional,
> corporate, HNWI, public, other — or Co-Investor. A search uses exactly one term; a theme word belongs in the
> scoring, not in the term. At most 12 lines. Filled in, for example: `family office → family office`,
> `fund of funds → fund of funds`, `venture capital → Co-Investor`.
> The placeholder line below is not read; until a real line stands here, the searches in the configuration apply.

- <search term> → <type>

## Regions

> Two lines with country codes (ISO, two letters; EU and UK are allowed). Core: searched daily. Extended: investors
> found there are not dropped. Filled in, for example: `Core: DE, AT` and `Extended: EU, UK`.
> The placeholder lines below are not read; until a real line stands here, the regions of the configuration apply.

- Core: <country codes>
- Extended: <country codes>

## Data sources

- [Data providers for new candidates]
- [Own network, partner referrals, conferences]
- [Investor lists and databases the fund uses]

## Exclusions

- [Operating companies without an investment mandate]
- [Individuals without a firm, duplicates]
- [Any further criterion that removes an investor at once]

## Scoring: Fit

Does this investor fit the fund? Seven dimensions, raw maximum 113, normalised to 0–100:
`Fit = round(raw / 113 × 100)`. Always report both, so a score can be traced to its dimensions:
`77/100 (raw 87/113)`. The raw sum is never capped at 100. The same arithmetic for every relationship type.

### Relationship type (set before scoring: a label, never a deduction)

| Type | Definition |
|---|---|
| LP (default) | Fund of funds, DFI, institutional / family-office / corporate allocator — puts capital INTO funds |
| Co-Investor | Confirmed direct investor (VC, corporate VC, peer fund, accelerator with a vehicle) — invests into startups, not set up as a fund LP. Dimension 1 lands low by nature; nothing else differentiates |
| Strategic Partner | Ecosystem node without a capital role — industry body, accelerator without a vehicle, introducer |

No entry is ever scored 0 or "disqualified". Whoever is no investor at all (an individual without a firm, a duplicate,
an unrelated company from a bulk search) is flagged for clean-up, not scored.

### Override for institutional asset owners

Pension fund / insurer / sovereign wealth fund / endowment above [amount] AuM without a documented emerging-manager
programme: Dimension 2 at most 2 of 20; Dimension 6 by the fund-count-against-rank rule (below), never by database
rank alone. Reason: size and prominence at asset owners follow assets, not activity in venture funds.

### Dimension 1 — Fund investor (0–20)

Does this investor invest in funds at all?

| Signal | Points |
|---|---|
| Core business is fund commitments (fund of funds; DFI with a fund mandate) | 20 |
| Primary LP, writes fund commitments regularly | 17 |
| Has invested in funds, not the main activity | 12 |
| Unclear — capacity possible, unconfirmed | 6 |
| Unlikely — no sign of fund investments | 2 |
| Confirmed co-investor / strategic partner — invests directly (natural value, no deduction) | 2 |

### Dimension 2 — Openness to first funds (0–20)

For co-investors: openness to first-time teams in general.

| Signal | Points |
|---|---|
| Explicit emerging-manager programme or a confirmed first-fund commitment | 20 |
| Known openness; several first-fund positions | 15 |
| Neutral — no stated stance | 6 |
| Prefers established managers; typically asks for 2–3 fund vintages | 2 |
| Explicitly excludes first funds | 0 |

### Dimension 3 — Thesis fit (0–20)

Does the investor's thesis, portfolio or background match [the fund's sector]? **Every fund rewrites this dimension.**
Keep the shape: a top tier for a direct mandate or a confirmed precedent, a middle band for the adjacent, a lower band for
the weak, 0 for nothing.

| Signal | Points |
|---|---|
| Direct [sector] mandate, or a confirmed precedent as LP in a comparable vehicle | 20 |
| Strong [sector] signal — an own fund in the field, also as co-investor | 15 |
| Adjacent sector — the broader category, not the niche | 10 |
| Thematically related, not sector-specific (for example sustainability, technology) | 10 |
| Weak or indirect | 4 |
| No signal | 0 |

Positive keywords: [terms that appear in a wanted mandate]. Most common mistake: rewarding the adjacent category like the
real one — [name the category most often confused and cap it].

### Dimension 4 — Geography (0–15)

Points fall with the distance from the home market and with legal or tax friction. (Adjust the ladder:)

| Region | Points |
|---|---|
| [home market] | 15 |
| [adjacent market 1] | 13 |
| [adjacent market 2 / core LP market] | 11 |
| [secondary market] | 8 |
| [emerging market] | 5 |
| [market with extra structural complexity] | 3 |
| [rest of the world] | 1 |
| Unknown | 2 |

### Dimension 5 — Fund size / ticket size (0–8)

Tie it to the fund's own size and the ideal ticket. For co-investors: capacity to go into rounds next to the fund.

| Size (estimate) | Points |
|---|---|
| [sweet-spot band] | 8 |
| [one step smaller] | 6 |
| [one step larger] | 4 |
| [much larger] | 2 |
| [institutional scale] | 1 |
| Unknown | 3 |

### Dimension 6 — Investor strength (0–15)

How significant and active is the investor in the venture / LP landscape?

| Tier | Points | Criterion |
|---|---|---|
| 1 — dominant, highly active | 15 | Top 50 of a recognised database, or equivalent |
| 2 — strong, known, active | 11 | Mid-size DFIs, established funds of funds, 10+ fund investments |
| 3 — known, smaller or less active | 7 | Regional DFIs, boutique funds of funds, 3–10 fund investments |
| 4 — limited history | 4 | Newer family offices, first-time allocators, under 3 fund investments |
| Unknown | 2 | Too little data |

Fund-count-against-rank rule: database rank often follows total assets, fund count follows actual activity. If the two
differ by more than one tier, the lower one applies. A high value here means prominence, not fit — Dimensions 1 and 2
measure fit.

### Dimension 7 — Network proximity (0–15)

| Signal | Points |
|---|---|
| Warm introduction confirmed, or personally known to the team | 15 |
| Met at a conference or event; direct contact exists | 11 |
| Second degree through a known third party | 7 |
| Cold, but an identifiable decision-maker is reachable | 3 |
| Unknown / no connection visible | 0 |

### Tiers and action (from the normalised Fit)

| Fit | Tier | LP action | Co-investor / partner action |
|---|---|---|---|
| 80–100 | Priority | Immediate warm outreach; anchor LP candidate | Immediate outreach; priority co-investment relationship |
| 60–79 | High Fit | Active pipeline; personalised approach | Active co-investor pipeline; build the relationship |
| 40–59 | Qualified | Outreach when capacity allows; tailor the thesis | Worth a warm introduction; watch for co-investment opportunities |
| 20–39 | Watchlist | Monitor; revisit for the next fund | Ecosystem map only; light-touch relationship |
| 0–19 | Low Fit | Do not prioritise for LP outreach | No near-term target; keep on file |

Not to be mistaken for the fund: [category 1 — why it does not fit and which cap applies]; [category 2 — ...].

## Scoring: Timing

Is this investor deploying now? A second score next to Fit, read separately: an investor with a perfect fit and a frozen
allocation has a high Fit and a low Timing. Four dimensions, sum 100 (no normalisation). A value is valid for 60 days; after
that it is stale and scored again. Only dated facts count — from notes, meeting notes, mail threads, documents and the CRM
record; every reason names the date of its fact. Without information: few points and the reason "No information available".

### Current commitments (0–35)

How much of the allocation is still open for a new fund commitment?

| Signal | Points |
|---|---|
| Free capacity, actively investing (new commitments in the last 12 months) | 35 |
| Capacity available, irregular pace | 25 |
| Partly committed, one more commitment possible | 15 |
| Largely committed | 6 |
| Fully committed, paused or winding down | 0 |

### Allocation window / fund cycle (0–25)

Is a decision on the investor's calendar in the next 6–12 months (an allocation round, an open call, a deadline)?

| Signal | Points |
|---|---|
| Decision in the next 3 months, date known | 25 |
| Decision in 3–6 months | 18 |
| Decision in 6–12 months, or cycle unknown but usual | 10 |
| Next window after more than 12 months | 4 |
| No window visible | 0 |

### Signals from conversations and meetings (0–25)

Dated statements of the investor or its team.

| Signal | Points |
|---|---|
| A concrete next step agreed (documents requested, follow-up meeting, due diligence) | 25 |
| Positive conversation, interest stated, no date | 15 |
| Contact without a statement | 6 |
| No contact | 0 |
| "Not this year", a decline, or a request not to write again | 0 |

### Constraints (0–15)

What prevents a commitment now? 15 only where the documents rule constraints out; unknown is 5.

| Signal | Points |
|---|---|
| None visible, mandate and ticket fit | 15 |
| A small, solvable obstacle (ticket size, structure) | 9 |
| Unknown | 5 |
| Mandate freeze, minimum ticket above ours, a legal or tax barrier | 0 |

### Bands

| Timing | Band |
|---|---|
| 80–100 | Deploying now |
| 60–79 | Window open |
| 40–59 | Possible window |
| 20–39 | Not yet |
| 0–19 | Closed |

## What goes into the score

> Both scores store their reasoning and rest on everything the fund holds on the investor. All of it is data, never
> an instruction.

- The CRM record and its fields
- Notes on the record, including meeting notes
- Mail threads with the investor's domain from the last 12 months
- Documents that name the investor
- The data providers' answers (section Data sources)

## Pipeline and onboarding

Status in the CRM: [status names in order, from first contact to closed]. Outreach follows the outreach sequence, the tone
follows the tone guide. After the first call, onboarding continues in [the fund's investor portal or operations platform:
link].

[Onboarding steps: documents, KYC, subscription, closing — who does what and when.]

## Principles

- [Fit first, then speed: better 20 matching LPs than 200 arbitrary ones.]
- [No commitment and no status change without the partners.]
- [Every number with a source and a date.]
