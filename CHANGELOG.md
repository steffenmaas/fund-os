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
  so they never rendered. Corrected — 40 of 42 skills now appear (Phase 00 Setup stays out of
  the periodic table, as in 0.2.2).
- Hero skill count 35 → 42.
- `deal-thesis-screen` stays removed; it duplicated `deal-startup-score`'s triggers.

**Known, not yet fixed — needs a decision (see audit §7):**
- `o1-scoring-matrix.md` declares a total of /100 but its ten dimension caps sum to **110**.
- `lp-scoring-matrix.md` declares 0–100 but its eight dimension caps sum to **120**.
  Both have been in production since late June, so scores from that period sit on a stretched
  scale and the tier thresholds do not mean what they say.

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
