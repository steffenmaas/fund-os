# Changelog

## Unreleased

Removes fund-specific data that survived the 0.5.0 template cleanup, and closes the gaps in
`validate.py` that let it survive. The repository went public on 11 August with its full
history; what follows is the part of the response that lives in the working tree. The history
rewrite and the release/tag cleanup are separate steps.

**What was still in the shipped tree:**

- `lp-investor-scoring` carried a named co-investor and its score range in Step 4, plus a
  reference range for institutional asset owners. Both are calibration data. They now point at
  the fund's own overlay under `~/.fund-os/knowledge/`, which is where the matrix template has
  said anchors belong all along.
- Four skills and the dashboard used **real firms** in their example outputs — a co-investor
  shortlist with fit scores, a partnership register with relationship status and priority, and
  one line naming a fund that had passed on a deal. Examples now use placeholders. An example
  is read as a claim by whoever finds it.
- The dashboard still pointed at the fund's own scoring matrix by its old filename and
  knowledge key.

**Removed from the repository:**

- `docs/version-audit-2026-08-11.md` and `docs/provenance.md`. Both were snapshots of a
  finished migration; what they still carried was an internal Drive path, local machine paths
  and session identifiers. The `docs/` directory is gone.
- The CHANGELOG's own references to the fund's matrix filename, CRM slugs and an internal
  knowledge-folder document.

**`validate.py` — the two rules that would have caught all of it:**

- **The fund-neutrality check now scans the whole tree.** It exempted `docs/` and
  `CHANGELOG.md`, and that is precisely where an internal Drive path and the CRM slugs
  survived. An exemption is a place where the rule stops being true. The term list gained the
  sector language, internal Drive folder names and a pattern for live CRM/Drive object ids.
- **New: no named investor beside a score.** Keys on shape, not on a blocklist — an entity name
  ending in Capital/Ventures/Partners/… within 60 characters of a score-shaped number. The
  blocklist approach is why the co-investor line sat in the tree for three months: the check
  knew the fund's own name and nothing else. Proximity rather than line, because the dashboard
  keeps all 43 skills on one minified line. Citations (`SaaS Capital 2025`) are exempt by
  shape, and name tokens may be numeric: a firm whose name carries a number was exactly the case
  the first draft of this rule missed, because it required every token to start with a capital
  letter. (This paragraph was itself rejected by the check on the first attempt, for naming the
  firm. That is the rule working.)
- **Individuals are matched by hash, not by name.** The check previously carried two names in
  plain text, which is a blocklist disclosing exactly what it exists to protect. Names are now
  stored as SHA-256 of the lowercased form, candidates on each line are hashed and compared, and
  a finding reports the location without echoing the name — otherwise the CI log becomes the
  new leak. Add one with `python3 tools/validate.py --hash-name "Firstname Lastname"`.
- A pre-commit hook runs both, so this fails before the commit rather than in CI.
- `.gitignore` now covers `*.plugin`. The rule already existed as a validator check; it did not
  exist as an ignore, which is the difference between catching a mistake and preventing it.

The version is deliberately **not** bumped: a bump is the release trigger, and a release cut
before the history rewrite would immediately re-publish a bundle built from the old tree.


## 0.8.2 - 2026-08-11

`check-knowledge.py` no longer assumes every knowledge document lives in the knowledge folder.

It does not have to, and usually should not. A fund's live documents already live somewhere — a
data room, a fundraising folder — and copying them into the knowledge folder means the copy
silently stops tracking its source. That had already happened once: the folder held a
duplicate of a thesis document, made in June from an original last edited in May, with nothing
saying which was authoritative.

The manifest is the index; documents can live anywhere on the shared drive. The check now
resolves an id across the whole drive and reports **where** each external document sits, so
pointing at an original reads as a deliberate choice rather than a broken pointer.

## 0.8.1 - 2026-08-11

Resolves the reference gaps the knowledge map surfaced in 0.8.0. Five of the twelve missing
documents were not missing at all — the skill asked for them under a name nobody had used.

- **`lp-evaluation-criteria` → `lp-scoring-matrix`.** The same thing: `lp-database-scout` wanted
  "ticket fit, thesis overlap, prior commitments to comparable funds", which is what the matrix
  scores. The scout was written before `lp-investor-scoring` existed and invented its own key.
  It now ranks roughly and hands the shortlist to `lp-investor-scoring` for the real score —
  the same relationship `deal-flow-triage` has with `deal-startup-score`. Two scoring schemes for
  one entity is how scores stop being comparable.
- **`content-guidelines` → `writing-style-guide`.** One document, two names, connected to nothing.
- **`investment-note-template` → `memo-template`** in `deal-pitch-deck-analyze`.
- **Nine legacy `Some-Doc-Name` references** resolved where a manifest key already existed.

Two manifest entries added: `lp-thesis` (points at the scoring matrix, whose *Fund Context*
section is the LP thesis today — a separate key so a future standalone document only needs the
pointer moved) and `fund-overview`.

## 0.8.0 - 2026-08-11

Adds `tools/knowledge-map.py`. The knowledge folder was a flat list of documents with nothing
saying what reads them — and since editing one changes live behaviour, "which skill does this
affect?" needed an answer that did not involve opening 43 skills.

It is **generated, never hand-written**. A hand-maintained map is a second source of truth, and
this project already knows how those end: the README's skill inventory sat two months out of date
because nothing compared it to reality.

`_KNOWLEDGE-MAP.md` lands in the knowledge folder with three views:

- **Document → skills**, plus where the document actually comes from at runtime (Drive manifest,
  bundled plugin template, or nowhere).
- **Skill → documents**, so the effect of a change is visible from either direction.
- **Gaps.** Documents skills expect that exist in neither place, and manifest entries no skill
  reads.

Generating it against the current tree immediately surfaced 12 documents that skills ask for and
that exist nowhere — `lp-thesis` alone is expected by five LP skills — plus nine legacy
`Some-Doc-Name` references in the pre-0.4.0 style that resolve to nothing, two of which have a
perfectly good manifest key sitting behind a different spelling.

`check-knowledge.py` warns when the map was generated for an older plugin version.

## 0.7.1 - 2026-08-11

`check-knowledge.py` now separates warnings from failures. A dangling manifest pointer breaks a
skill and fails the run; a document nobody points at breaks nothing — it is simply invisible.
Reporting both the same way produces a permanently red check, which teaches people to ignore it.

The distinction surfaced immediately: a completed, confidential investment note had been placed in
the knowledge folder because its filename ended in `_TEMPLATE`. Nothing was broken, but every
memo-drafting run would have loaded a specific live deal as the structural example to follow.

## 0.7.0 - 2026-08-11

Documentation consolidated and corrected. Three files described installation, and they had drifted
apart; two of them still described a model the plugin abandoned in 0.5.0.

**One README.** `plugins/fund-os/README.md` is merged into the root `README.md` — 480 lines with
heavy duplication become 288. `build-plugin.sh` copies the README into the bundle at build time, so
the upload install path still ships documentation without a second file to keep in sync.

**Corrected, because it actively misled:**
- The user guide told people to edit skill files directly. Those files are replaced on every
  update, and a change made there is invisible to colleagues — which is why customisations kept
  disappearing. Replaced with a table of where a change actually belongs.
- It described "vanilla" and "customised" bundle flavours. There is one plugin; what makes it
  yours is the Drive knowledge folder and `~/.fund-os/user-config.json`.
- It said `fund-os:update` "applies only the new and changed skill files". It applies nothing —
  it reports, and deliberately never writes into the plugin directory.

**`lp-investor-scoring` was missing from the README inventory** since June, so the documented
roster and the real one disagreed for two months. `validate.py` now compares them on every push,
and the quick reference gained the four skills it was missing.

## 0.6.2 - 2026-08-11

Renames the marketplace from `fund-os-marketplace` to **`fund-os`**, so it matches the repository
name the way founder-os does.

Adding the marketplace in the Claude app kept reporting "already added" while no plugin appeared.
Making the repository public removed the access problem but not this one: a stale registration
from 3 June was still sitting in the CLI registry under a name that did not match the repository,
and the dialog dedupes on the repository URL. Plugin ids therefore change from
`fund-os@fund-os-marketplace` to **`fund-os@fund-os`**.

Nothing had to be migrated — the plugin was not installed from a marketplace at the time, so this
was the last moment the rename was free.

## 0.6.1 - 2026-08-11

Removes two leftovers from the manual era that became visible the moment the repository went
public.

- **`fund-os.plugin` deleted from the repository root.** It was a hand-built v0.2.2 bundle from
  June, still carrying the fund-specific content and partner names that had since been removed
  from the tree — and the README offered it as the primary download while the releases held
  something entirely different. `validate.py` now fails on any committed `.plugin`: bundles come
  from CI, attached to a release, or they do not exist.
- **`install.sh` deleted.** It created `~/.claude/plugins/cache/fund-os-marketplace/fund-os/` —
  the very path the 0.2.0–0.3.7 skills read their configuration from, and the reason that path
  looked plausible for months while existing nowhere. With the marketplace working, nothing needs
  it.
- Installation docs rewritten around the marketplace, with the release bundle as the documented
  fallback.

## 0.6.0 - 2026-08-11

Prepares the repository to be public, which is what makes marketplace installs work at all.

The Claude app cannot load a marketplace from a private repository. It fetches the definition
without local git credentials, so `raw.githubusercontent.com` returns 404 — measured: 200 for the
public founder-os, 404 for fund-os. The marketplace record is still created, which is why the
dialog reports it as already added while no plugin ever appears, and there is no token mechanism
for git marketplaces anywhere in the app's configuration.

Going public is a business decision, not a security one, because since 0.5.0 the repository holds
nothing fund-private: verified 0 fund-specific matches in the tree and 0 in the history, and
`validate.py` enforces it on every push. The concrete matrices, thesis and documents live in the
fund's Drive folder.

- **LICENSE / NOTICE** — PolyForm Noncommercial 1.0.0, the same terms as founder-os. The `license`
  field said `Proprietary`, which would have been both wrong and legally confusing on a public
  repository.
- `.claude-plugin/marketplace.json` aligned with the schema that demonstrably works: `description`
  and `version` inside `metadata{}`, a `category` on the plugin entry, `owner.url`. This would
  have been the next obstacle once access was solved.
- The version-audit document depersonalised — an individual's name and the Desktop session
  identifiers removed.
- The support section named a personal work address. Replaced with `fund-os:learn` for
  fund-internal problems and the issue tracker for plugin bugs, matching how founder-os already
  handles this in public.

## 0.5.2 - 2026-08-11

Adds `tools/check-knowledge.py`. `validate.py` checks the plugin; this checks the *content* the
plugin loads — the fund's Drive knowledge folder and the manifest pointing at it.

It exists because of what a review of one fund's folder turned up: four documents defined the
same 10-dimension framework with three different weightings, two of which did not sum to 100;
the manifest pointed at a shipped placeholder for the document that gates due diligence, so DD
would have run against empty filters; the strategy document excluded a sector outright while the
LP-facing document promoted it as the growth path; and three superseded copies of the memo
template sat alongside each other with no indication which was current.

Checks: every manifest key resolves to a live document, and every document is reachable through
some key; no load-bearing document is still a shipped placeholder; the scoring matrices add up
and the LP matrix states its normalisation; the thesis and the hypothesis do not contradict each
other on scope; no duplicates in the working set. It tolerates a file whose Drive id has not
finished syncing rather than reporting it as missing, and it names the Google Docs it cannot
inspect instead of passing silently over them.

## 0.5.1 - 2026-08-11

- `update` now leads with the marketplace path and explains the one-time migration off the
  manual `.plugin` upload. The upload still works, but every update is a manual re-upload and
  nothing ties the bundle to a commit — which is how the version history came apart.
- `USER_GUIDE.md` installation rewritten the same way; the `.plugin` upload is now the
  documented fallback, and the bundle is taken from the CI-built release asset.
- Tightened the dead-path check in `validate.py`. It was flagging any mention of
  `~/.claude/plugins/`, including legitimate ones naming it as an install location. It now
  flags what actually broke: reading a fund *resource* from a hand-built path under it.
  Regression-tested against the original 0.2.0 line.

## 0.5.0 - 2026-08-11

The plugin now ships **templates, not one fund's filled-in documents**. Until now it carried
the publishing fund's own scoring matrices, memo format, sector language and CRM field slugs. A
fund receiving it got someone else's thesis as the default, and concrete rubrics that were never
meant to travel travelled with it.

**Concrete documents replaced by templates.** The originals move to `~/.fund-os/` and to the
fund's Drive knowledge folder, where the resolution chain already looks first:

- The fund-specific startup matrix → `startup-scoring-matrix.md`. The methodology is intact and
  shipped; the *signals* are now generic B2B SaaS with `[sector]` placeholders, and the sector
  ladder is marked as the part to rewrite.
- `lp-scoring-matrix.md` → template. The dimension structure, the relationship-type
  classification, the override rules and the normalisation are kept as methodology; the
  thesis-bearing bands carry placeholders. Named investors and calibration anchors are gone — a
  named investor with a score is exactly what must not be shared.
- `memo-template.md` → `[Fund]` throughout instead of a fixed fund name and framework name.
- Sector language removed from `deal-flow-triage` and `deal-startup-score`: both now apply the
  sector definition from `investment-thesis` rather than carrying one fund's sector in the
  skill body.

**CRM field slugs come from the configuration.** The fund's own field slugs were hardcoded,
binding the plugin to one fund's Attio schema. Skills now read
`crmFields` — including `archivedSlugs`, so a slug that must never be written to is declared
once rather than remembered.

**`validate.py` gained a fund-neutrality check.** It scans everything shipped under
`plugins/` for a fund's name, sector language, framework names, CRM slugs and individuals, and
fails the build if any appear. Attribution — the author field and the copyright line — is the
one allowed exception. This is what keeps the boundary from eroding on the next edit, rather
than relying on whoever is editing to remember it.

## 0.4.0 - 2026-08-11

Consolidation release. Between 25 June and 10 July the plugin was iterated only through
Claude Desktop `.plugin` uploads, which never write back to git. That produced two lines:
git stopped at 0.2.2 (4 June), while the Desktop line ran on to 0.3.7 — and existed in
exactly one copy, inside the Desktop app's own cache. This release merges both into one
tree.

**Merged in from the Desktop line (0.2.3 – 0.3.7), never previously in git:**
- `lp-investor-scoring` — 8-dimension LP / co-investor / strategic-partner scoring, matrix v7
  with relationship-type classification and the institutional asset owner override.
- The fund-specific startup scoring matrix under `deal-startup-score/knowledge/`.
- `investment-thesis.md` — placeholders replaced by fund data (2.3 KB → 6.8 KB).
- `deal-pitch-deck-analyze` substantially expanded (4.5 KB → 8.9 KB).
- `memo-template.md` 1.8 KB → 6.2 KB; `outreach-content-draft/knowledge/writing-style-guide.md`.

**Merged in from the git line, which the Desktop line never received:**
- `deal-investment-memo-draft` → `deal-due-diligence`, now carrying both the DD plan mode and
  the fund's memo structure. The evaluation-criteria gate and red-flag surfacing are back.
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

- The startup scoring matrix — caps summed to **110**. Competition & Differentiation and
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
