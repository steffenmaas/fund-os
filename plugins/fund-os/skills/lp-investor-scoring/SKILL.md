---
name: lp-investor-scoring
description: Score LP, co-investor and strategic-partner prospects against the fund's LP thesis on eight dimensions, with relationship-type classification and the institutional asset owner override. Use this skill whenever the user wants to score investors, evaluate LP fit, rate a new investor, screen a prospect list, add scores to a CSV, or assess whether an investor is a good LP candidate. Also use proactively when working with investor CSVs, CRM LP lists, or database exports where the investor-fit field is missing. Trigger on phrases like "score these investors", "LP fit", "add scoring", "evaluate this investor", "who should we approach". Phase 01 (Fundraising & LP). Fund-side only.
---

# LP Investor Scoring

Score investor and co-investor prospects against the fund's LP thesis. This covers the fund's full relationship universe: LPs who might invest into the fund, and Co-Investors and Strategic Partners the fund might work alongside.

The fund's identity, sector and positioning come from the **Fund Context** section of the scoring matrix and from `investment-thesis` — never from memory. In particular, apply the matrix's **positioning rule** verbatim: every fund has a phrase it always uses and one it never uses, and LP-facing output is exactly where getting it wrong costs the most.

**No entity is ever scored 0 or disqualified.** Every scored entity is a potential relationship of some kind — see Investor Relationship Type below. All relationship types are scored on the same 8 dimensions with no separate multiplier or adjustment; Dimension 1 (Fund of Funds/LP Fit) naturally differentiates LPs from Co-Investors on its own.

---

## Step 0 — Load preferences and scoring matrix

```bash
cat ~/.fund-os/user-config.json
```

If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults.

Then load the scoring matrix:

```bash
cat ~/.fund-os/knowledge/lp-scoring-matrix.md 2>/dev/null \
  || cat "${CLAUDE_PLUGIN_ROOT}/skills/lp-investor-scoring/knowledge/lp-scoring-matrix.md"
```

The matrix is mandatory. If it cannot be read, stop — do not score from memory.

Apply `brandGuidelines.tone` to all prose output if present.

The scoring matrix in `knowledge/lp-scoring-matrix.md` is the authoritative source for:
- Investor Relationship Type classification (LP / Co-Investor / Strategic Partner) — a labeling and routing step only, not a scoring adjustment
- Institutional Asset Owner Override (Pension Fund / Insurance / Sovereign Wealth Fund / large Endowment dampening)
- All 8 dimension point tables
- Score tier thresholds and recommended actions (separate action wording for LP vs. Co-Investor, same score thresholds)
- Validation reference scores
- Misclassification warnings — the adjacent categories this fund is regularly mistaken for

---

## Step 1 — Identify input

| Input type | Action |
|---|---|
| Single investor name / description | Score inline; output full evaluation block |
| CSV file path | Run batch workflow (Step 3) |
| Attio LP list | Pull unscored rows; run batch workflow |
| Free-text description | Parse fields; score inline |

---

## Step 2 — Score a single investor

Apply in order:

1. **Investor Relationship Type check** — classify as LP (default), Co-Investor, or Strategic Partner using the signals in the scoring matrix (e.g. "Vehicle: Startups" with no fund vehicle, "co-investor - NOT an LP", accelerator/advisor framing → Co-Investor or Strategic Partner). This only affects the label on the output and the Dimension 1 rationale — not the math. If the entity turns out not to be an investor at all (individual, duplicate CRM entry, unrelated business), flag it for removal in the evaluation notes instead of scoring it.
2. **Institutional Asset Owner Override check** — if Investor Type = Pension Fund / Insurance / Sovereign Wealth Fund / Endowment >€1B AuM and there is no confirmed emerging-manager program evidence, apply the Dimension 2 / 6 / 8 caps from the scoring matrix before proceeding
3. **Apply all 8 dimensions** — award points per scoring matrix tables, identical tables and identical math regardless of Relationship Type
4. **Sum the eight dimensions (raw, 0–120), then normalise:** `final = round(raw / 120 × 100)`. Never cap — capping at 100 is what hid the scale defect before v8. Report both numbers.
5. **Output evaluation block** (format below)

### Evaluation output format

Use this exact structure and alignment — labels padded so all `+` signs line up in one column:

```
LP Fit Score: [SCORE]/100  (raw [RAW]/120)
[🤝 Co-Investor / Strategic Partner — [1-line reason for classification]  ← only if not LP]
[🏛 Institutional Asset Owner Override applied — [reason]  ← only if override applies]

Scoring breakdown:
• Fund of Funds Fit:    +[pts]/20 — [1-line rationale]
• Emerging Manager Fit: +[pts]/20 — [1-line rationale]
• Thesis Fit:           +[pts]/20 — [1-line rationale]
• Geography:            +[pts]/15 — [1-line rationale]
• AuM / Ticket Size:    +[pts]/8  — [1-line rationale]
• Investor Strength:    +[pts]/15 — [1-line rationale]
• Network Proximity:    +[pts]/15 — [1-line rationale]
• Activity Signal:      +[pts]/7  — [1-line rationale]

Fund of Funds Fit: [★★★★★] — [1-sentence summary]
Thesis Fit: [★★★★★] — [1-sentence summary]

Recommended action: [emoji + tier label, LP or Co-Investor wording per Relationship Type]
Evaluated: [YYYY-MM-DD] | [Fund] LP scoring v1
```

**Worked example** (follow this formatting exactly — same label padding, same line breaks, same level of detail per rationale):

```
LP Fit Score: 77/100  (raw 92/120)

Scoring breakdown:
• Fund of Funds Fit:    +20/20 — fund-of-funds
• Emerging Manager Fit: +18/20 — explicit/known emerging-manager appetite
• Thesis Fit:           +20/20 — dedicated mandate in the fund's sector
• Geography:            +15/15 — home market
• AuM / Ticket Size:    +4/8  — ticket fit estimated from profile
• Investor Strength:    +7/15 — Tier 3
• Network Proximity:    +3/15 — identifiable decision-maker
• Activity Signal:      +5/7  — recent activity

Fund of Funds Fit: ★★★★★ — fund-of-funds (Dim 1 = 20/20)
Thesis Fit: ★★★★★ — dedicated mandate in the fund's sector

Recommended action: ⭐ High Fit — active pipeline; personalised approach
Evaluated: 2026-08-11 | [Fund] LP scoring v1
```

Note the padding: each dimension label plus its trailing spaces totals 22 characters before the `+`, so every point value and every em dash lines up down the block. Rationales stay short — a few words is enough (see "fund-of-funds", "Tier 3", "recent activity" above); reserve longer explanations for cases that genuinely need them (e.g. Institutional Asset Owner Override applying).

Star ratings: ★★★★★ = perfect, ★★★★☆ = strong, ★★★☆☆ = moderate, ★★☆☆☆ = weak, ★☆☆☆☆ = none/unknown

---

## Step 3 — Batch workflow (CSV)

Use when scoring a list. Output columns: `Name`, `Domain`, and the two slugs from `crmFields` — `crmFields.investorFit` and `crmFields.investorFitEvaluation`.

```
1. Investor Relationship Type check — classify LP / Co-Investor / Strategic Partner per row for
   labeling purposes only; flag confirmed non-investors for removal instead of scoring them
2. Parse each row — extract Name, Investor Type, HQ Country, AuM, thesis/description
3. Institutional Asset Owner Override check — Pension Fund / Insurance / Sovereign Wealth Fund /
   Endowment >€1B without confirmed EM program evidence → apply Dimension 2/6/8 caps
4. Apply all 8 dimensions — award points, note rationale per dimension. Same math for every row.
5. Write `crmFields.investorFit` (integer, never 0) and `crmFields.investorFitEvaluation` (full text). Slugs come from the configuration — never hardcode them.
6. Sort descending by score
7. Save checkpoint after every 300 rows — partial results are never lost
8. Output a CRM-ready update CSV: Name, Domain, and the two `crmFields` slugs
```

**Attio import**: match on `Name` or `Domain`. Include only score fields + match key to avoid overwriting other fields.

**Re-scoring note**: any row whose evaluation text cites an older matrix version than the one just loaded is on a different scale — re-score it before comparing. Legacy note: rows citing "v6" was scored under a prior matrix version — re-score under v7 before comparing or using in a ranked/exported list. v6 introduced a 0.75x Co-Investor multiplier that v7 removed; any v6-scored Co-Investor rows should be re-scored to drop that adjustment.

### Dealroom thesis string parsing

When `Investment thesis` contains a Dealroom longlist string, extract:
- `rank N` → Dimension 6 (Investor Strength) and Dimension 8 (Activity proxy) — subject to the fund-count-vs-rank conflict rule and Institutional Asset Owner Override
- `AuM: $XM/B` → Dimension 5 (AuM/Ticket Size)
- `VC AuM: $XM/B` → fallback for Dimension 5
- `VC firms backed: N` → fallback for Dimension 6, and the primary signal used against `rank N` in the conflict rule
- `Type: [type]` → input for Dimension 1 (Fund of Funds Fit) and for triggering the Institutional Asset Owner Override
- `HQ: [country]` → input for Dimension 4 (Geography)

Relationship Type routing: if thesis contains `"EQUITY-INVESTOR LEAD"`, `"startup investor, NOT a fund LP"`, or `"co-investor - NOT an LP"` → classify as Co-Investor and label the output accordingly, but score all 8 dimensions exactly as for any other entity. Do not zero the score, and do not apply any multiplier.

---

## Step 4 — Validation

After scoring a batch, validate against the reference ranges recorded in `knowledge/lp-scoring-matrix.md` — one per investor type, filled in by the fund from its own calibration. If any reference investor scores outside its expected range, review the dimension assignments for that investor type before proceeding.

Reference investors and their ranges are fund-specific calibration data: keep them in the matrix overlay under `~/.fund-os/knowledge/` or the Drive knowledge folder, never in this skill and never in this repository. A named investor next to a score is the single artefact that must not be shared.

---

## Required MCP capabilities

- Bash (file read/write for CSV processing)
- Google Drive MCP (optional — for reading/writing CSVs from Drive)
- Attio MCP (optional — for direct CRM updates)
