# Changelog

## 0.4.0 - 2026-08-11

Consolidation release. Between 25 June and 10 July the plugin was iterated only through
Claude Desktop `.plugin` uploads, which never write back to git. That produced two lines:
git stopped at 0.2.2 (4 June), while the Desktop line ran on to 0.3.7 — and existed in
exactly one copy, inside the Desktop app's own cache. This release merges both into one
tree. See `docs/version-audit-2026-08-11.md` for the full audit.

**Merged in from the Desktop line (0.2.3 – 0.3.7), never previously in git:**
- `lp-investor-scoring` — 8-dimension LP / co-investor / strategic-partner scoring, matrix v7
  with relationship-type classification and the institutional asset owner override.
- `deal-startup-score/knowledge/o1-scoring-matrix.md` — the 10-dimension O1 rubric.
- `investment-thesis.md` — placeholders replaced by real fund data (2.3 KB → 6.8 KB).
- `deal-pitch-deck-analyze` substantially expanded (4.5 KB → 8.9 KB).
- `memo-template.md` 1.8 KB → 6.2 KB; `outreach-content-draft/knowledge/writing-style-guide.md`.

**Merged in from the git line, which the Desktop line never received:**
- `deal-investment-memo-draft` → `deal-due-diligence`, now carrying both the DD plan mode and
  the O1 Framework memo structure. The evaluation-criteria gate and red-flag surfacing are back.
- Dashboard: 456 raw newlines inside JS string literals were breaking the whole `<script>`
  block with a `SyntaxError` — the dashboard rendered nothing. Repaired, plus the name-first
  card design from 0.2.2.

**Fixed along the way:**
- Dashboard data had drifted badly from the skill roster: `deal-thesis-screen` was still listed
  (removed in 0.2.5), `lp-investor-scoring` was missing entirely, and `deal-startup-score` was
  still described as the old 9-dimension GO/NO-GO model. All three corrected.
- Four `outreach-*` skills carried phase id `outreach` while the dashboard defines `ecosystem`,
  so they never rendered. Corrected — 40 of 43 skills now appear (the three Phase 00 Setup
  skills stay out of the periodic table, as in 0.2.2).
- Hero skill count 35 → 43.
- `deal-thesis-screen` stays removed; it duplicated `deal-startup-score`'s triggers.

**Scoring matrices — both were arithmetically broken, both fixed:**

Each declared a total of /100 while its dimension caps summed to something else, so every score
since late June sat on a stretched scale and the tier thresholds did not mean what they said.

- `o1-scoring-matrix.md` — caps summed to **110**. Competition & Differentiation and
  Go-to-Market Strategy go from 10 to 5, which brings the total to exactly 100 **and** makes it
  agree with the weights `deal-due-diligence` already used in the IC memo. The two skills now
  score the same company the same way. Past scores: subtract the points awarded above 5 on
  those two dimensions.
- `lp-scoring-matrix.md` v7 → **v8** — caps sum to **120** and the skill "capped at 100", which
  hid the defect. The raw sum is now explicitly 0–120 and normalised with
  `round(raw / 120 × 100)`; the tier thresholds (80/60/40/20) are unchanged and now apply to the
  normalised score. All eight point tables are untouched. Past scores are raw sums — convert
  them before comparing; several will move down one tier. Output now reports both, e.g.
  `77/100 (raw 92/120)`, so any score can be audited back to its dimensions.

**New skill — `fund-os:learn`, the loop that was missing:**

The defects fixed in this release had been producing wrong output for six weeks. Nobody had a
place to write "this keeps going wrong", so nothing accumulated into a fix. `learn` is that place,
modelled on `founder-os:dev-learn` and adapted to fund work:

- **Capture** to `~/.fund-os/learnings/YYYY-MM-DD-<slug>.md` — in the fund's own directory, because
  learnings arise in deal and LP sessions, not in a checkout of this repository.
- **Upstream** (`--upstream`) groups the open `scope: upstream` learnings, builds the concrete
  change, and opens a pull request here.
- **Consent** is checked first, from `learnings.contributeUpstream` (`ask` by default, and a
  missing value is treated as `ask` — consent is never assumed). Added to the setup wizard.
- **Scrub** before anything leaves the fund: no company names, no LP names tied to a score, no
  Drive or CRM ids, no fund internals. This repository is private but shared with other funds, and
  a real company attached to a real score is the most sensitive artefact the system produces.
- If a `validate.py` check could have caught the defect, proposing that check is part of the
  change — a rule a machine enforces outlives the person who wrote it.
- And the rule about rules: a rule is created after an incident, never preventively.

**Release pipeline — so this cannot happen again:**
- `tools/validate.py` — checks JSON, skill front matter, that every `${CLAUDE_PLUGIN_ROOT}`
  reference resolves to a file that exists, that no dead plugin-cache path returns, that the
  dashboard parses and matches the skill roster, that versions agree across `plugin.json`,
  `marketplace.json` and this changelog, that no Drive id or credential is committed, and that
  the scoring matrices add up. Every check exists because that exact defect shipped.
- `tools/build-plugin.sh` — the only supported way to build a `.plugin`. Runs the validator
  first and refuses to produce a bundle that fails it; excludes any real fund config and then
  verifies the exclusion held.
- `.github/workflows/validate.yml` runs on every push and PR;
  `.github/workflows/release.yml` makes a version bump in `plugin.json` the release trigger —
  it tags `fund-os/v<version>`, builds the bundle and attaches it to a GitHub Release.
- `merge-plugin.sh` removed. It existed to merge preferences across hand-built `.plugin` files;
  preferences now live outside the plugin, so there is nothing to merge.
- The README's version-bump checklist told maintainers to copy files into
  `~/.claude/plugins/cache/` and rebuild the bundle by hand. That checklist *was* the bug.
  Replaced with the CI process.

## 0.2.2 - 2026-06-03

- Rename `deal-investment-memo-draft` → `deal-due-diligence` — skill now covers the full DD workflow (plan, data room, reference checks, financial benchmarks, IC memo) not just memo drafting.
- Wire `evaluation-criteria` as the first document loaded — deal must pass hard filters and hold a P1/P2 tag before DD proceeds; red flags surface before the memo body.
- Add DD plan mode: outputs workstream table, timeline and data room checklist from `dd-framework`.

## 0.2.1 - 2026-06-03

- Fix: move `suggested_prompts` and `featured_skills` inside `cowork_fusion_metadata` object in `plugin.json` — this is the correct nesting the Claude Desktop parser reads, restoring the "Customize" and quick-action buttons in the plugin detail page.

## 0.2.0 - 2026-05-19

- 42 skills across 8 domains: deal flow, LP management, portfolio, finance, legal, market intel, outreach, exit.
- Skill naming convention: `[domain]-[context]-[action]`.
- Per-skill `knowledge/`, `templates/`, `preferences/` folder structure.
- Setup wizard: master data, brand guidelines, systems, storage paths, Drive knowledge scan.
- Starter knowledge and templates for top 10 documents.
- `fund-os:update` skill and `merge-plugin.sh` for safe updates.
- `.plugin` file upload install (no CLI required).
- `USER_GUIDE.md` for end users.
