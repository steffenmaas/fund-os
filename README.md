# Fund OS

**43 Claude Skills for VC fund operations**, from first sourcing signal to wind-down, across eight
lifecycle phases. Built on the open [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md)
community convention. Fund-side scope only — founder coaching is a separate bundle.

---

## How it works — three layers

This separation is the point. Get it wrong and the plugin overwrites your fund's documents on
every update, which is exactly what used to happen.

| Layer | Where it lives | What belongs there | Who maintains it |
|---|---|---|---|
| **The plugin** | this repository, installed through the marketplace | skills, logic, **fund-neutral templates only** | released from `main`, built by CI |
| **Your documents** | your Google Drive knowledge folder | thesis, scoring matrices, memo template — your actual methodology | your team, edited directly in Drive |
| **The connection** | `~/.fund-os/user-config.json` on each machine | Drive folder ids, CRM field slugs, the knowledge manifest | set up once per person |

Every skill resolves knowledge in this order, first hit wins:

```
Drive manifest  →  ~/.fund-os/  →  ${CLAUDE_PLUGIN_ROOT}  →  stop and say it is unconfigured
```

**The plugin ships no fund's actual documents.** The scoring matrices, the memo format and the
thesis it contains are structured placeholders. Editing a document in your Drive folder changes
how the skills behave immediately — no update, no redeploy.

---

## Installation

### Marketplace (recommended)

In the Claude app: **Settings → Plugins → Add marketplace**

```
steffenmaas/fund-os
```

Then install **fund-os**. Updates arrive through the app from there on, and an installed version
always corresponds to a tagged commit.

In the Claude Code CLI:

```bash
claude plugin marketplace add steffenmaas/fund-os
claude plugin install fund-os@fund-os
```

### Release bundle (fallback)

For anyone who cannot use the marketplace. Every update is then a manual re-upload.

1. Download `fund-os-<version>.plugin` from the [latest release](https://github.com/steffenmaas/fund-os/releases/latest)
2. Claude Desktop → **Customize** → **+** next to **Personal Plugins** → **Create plugin** → **Upload plugin**

The bundle is built by CI from the tagged commit. Never build one by hand — a bundle with no
commit behind it is how this project's version history came apart once already.

---

## First run

```
fund-os:setup
```

A six-section wizard: master data, brand guidelines, systems, storage paths, the Drive knowledge
folder, and whether learnings may be contributed upstream. It writes `~/.fund-os/user-config.json`
— **outside** the plugin, so it survives every update and reinstall.

Adding a teammate later needs only that file plus the marketplace install; the knowledge itself
comes from Drive through the manifest.

---

## Skill inventory

### Phase 00 — Setup

One-time welcome wizard and updater.

- [`setup`](./plugins/fund-os/skills/setup/SKILL.md) — Fund OS Setup
- [`update`](./plugins/fund-os/skills/update/SKILL.md) — Fund OS Update
- [`learn`](./plugins/fund-os/skills/learn/SKILL.md) — Learn: capture what went wrong, upstream the generalisable fixes

### Phase 01 — Fundraising & LP

Identify potential LPs, find paths to them, reach out, prepare a data room, manage commitment and KYC.

- [`lp-database-scout`](./plugins/fund-os/skills/lp-database-scout/SKILL.md) — LP Database Scout
- [`lp-investor-scoring`](./plugins/fund-os/skills/lp-investor-scoring/SKILL.md) — LP Investor Scoring — 8-dimension LP / co-investor scoring
- [`lp-network-intro-map`](./plugins/fund-os/skills/lp-network-intro-map/SKILL.md) — LP Network Intro Map
- [`lp-outreach-draft`](./plugins/fund-os/skills/lp-outreach-draft/SKILL.md) — LP Outreach Draft
- [`lp-data-room-build`](./plugins/fund-os/skills/lp-data-room-build/SKILL.md) — LP Data Room Build
- [`lp-pipeline-manage`](./plugins/fund-os/skills/lp-pipeline-manage/SKILL.md) — LP Pipeline Manage
- [`finance-grant-scout`](./plugins/fund-os/skills/finance-grant-scout/SKILL.md) — Finance Grant Scout

### Phase 02 — Sourcing & Market Watch

Active scouting, inbound triage, thesis screening, market intelligence and co-investor sharing.

- [`deal-outbound-scout`](./plugins/fund-os/skills/deal-outbound-scout/SKILL.md) — Deal Outbound Scout
- [`deal-flow-triage`](./plugins/fund-os/skills/deal-flow-triage/SKILL.md) — Deal Flow Triage
- [`deal-startup-score`](./plugins/fund-os/skills/deal-startup-score/SKILL.md) — Deal Startup Score
- [`market-intelligence-scan`](./plugins/fund-os/skills/market-intelligence-scan/SKILL.md) — Market Intelligence Scan
- [`deal-watchlist-curate`](./plugins/fund-os/skills/deal-watchlist-curate/SKILL.md) — Deal Watchlist Curate
- [`deal-co-investor-syndicate`](./plugins/fund-os/skills/deal-co-investor-syndicate/SKILL.md) — Deal Co-Investor Syndicate

### Phase 03 — Due Diligence

Analyse opportunities, map markets, profile companies, model financials, take references, write memos, assemble the IC pack.

- [`deal-pitch-deck-analyze`](./plugins/fund-os/skills/deal-pitch-deck-analyze/SKILL.md) — Deal Pitch Deck Analyze
- [`market-competitor-map`](./plugins/fund-os/skills/market-competitor-map/SKILL.md) — Market Competitor Map
- [`deal-reference-check`](./plugins/fund-os/skills/deal-reference-check/SKILL.md) — Deal Reference Check
- [`deal-due-diligence`](./plugins/fund-os/skills/deal-due-diligence/SKILL.md) — Deal Due Diligence
- [`deal-ic-pack-build`](./plugins/fund-os/skills/deal-ic-pack-build/SKILL.md) — Deal IC Pack Build
- [`deal-profile`](./plugins/fund-os/skills/deal-profile/SKILL.md) — Deal Profile
- [`deal-financial-model`](./plugins/fund-os/skills/deal-financial-model/SKILL.md) — Deal Financial Model
- [`deal-comps-analyze`](./plugins/fund-os/skills/deal-comps-analyze/SKILL.md) — Deal Comps Analyze

### Phase 04 — Portfolio Monitoring

Collect KPIs, run health checks, aggregate to fund view, flag early warnings, analyse variances.

- [`portfolio-kpi-collect`](./plugins/fund-os/skills/portfolio-kpi-collect/SKILL.md) — Portfolio KPI Collect
- [`portfolio-health-check`](./plugins/fund-os/skills/portfolio-health-check/SKILL.md) — Portfolio Health Check
- [`portfolio-fund-view`](./plugins/fund-os/skills/portfolio-fund-view/SKILL.md) — Portfolio Fund View
- [`portfolio-early-warning-alert`](./plugins/fund-os/skills/portfolio-early-warning-alert/SKILL.md) — Portfolio Early Warning Alert
- [`portfolio-variance-analyze`](./plugins/fund-os/skills/portfolio-variance-analyze/SKILL.md) — Portfolio Variance Analyze

### Phase 05 — Reporting & Impact

Capital calls, impact assessments, quarterly LP reporting.

- [`lp-capital-call-draft`](./plugins/fund-os/skills/lp-capital-call-draft/SKILL.md) — LP Capital Call Draft
- [`portfolio-impact-assess`](./plugins/fund-os/skills/portfolio-impact-assess/SKILL.md) — Portfolio Impact Assess
- [`lp-quarterly-report`](./plugins/fund-os/skills/lp-quarterly-report/SKILL.md) — LP Quarterly Report

### Phase 06 — Legal & Compliance

Draft legal documents, model cap tables, manage contracts and signatures, watch regulatory deadlines, write the audit trail.

- [`legal-document-draft`](./plugins/fund-os/skills/legal-document-draft/SKILL.md) — Legal Document Draft
- [`legal-captable-model`](./plugins/fund-os/skills/legal-captable-model/SKILL.md) — Legal Cap Table Model
- [`legal-contract-signature-manage`](./plugins/fund-os/skills/legal-contract-signature-manage/SKILL.md) — Legal Contract & Signature Manage
- [`legal-regulatory-deadline-watch`](./plugins/fund-os/skills/legal-regulatory-deadline-watch/SKILL.md) — Legal Regulatory Deadline Watch
- [`legal-audit-trail-write`](./plugins/fund-os/skills/legal-audit-trail-write/SKILL.md) — Legal Audit Trail Write

### Phase 07 — Outreach & Ecosystem

LP newsletter, public content, events, partnerships.

- [`outreach-newsletter-draft`](./plugins/fund-os/skills/outreach-newsletter-draft/SKILL.md) — Outreach Newsletter Draft
- [`outreach-content-draft`](./plugins/fund-os/skills/outreach-content-draft/SKILL.md) — Outreach Content Draft
- [`outreach-event-manage`](./plugins/fund-os/skills/outreach-event-manage/SKILL.md) — Outreach Event Manage
- [`outreach-partner-manage`](./plugins/fund-os/skills/outreach-partner-manage/SKILL.md) — Outreach Partner Manage

### Phase 08 — Exit & Wind-Down

Model exit scenarios and scan the secondary market.

- [`exit-scenario-model`](./plugins/fund-os/skills/exit-scenario-model/SKILL.md) — Exit Scenario Model
- [`exit-secondary-market-scan`](./plugins/fund-os/skills/exit-secondary-market-scan/SKILL.md) — Exit Secondary Market Scan

---

## Workflows

The skills compose into 18 cross-skill workflows you can wire up (cron / Agent SDK / form trigger):

- **WF-01** Weekly Deal Flow Digest — `deal-outbound-scout, deal-flow-triage, deal-startup-score, market-intelligence-scan, deal-watchlist-curate` — Scout outbound, triage inbound, screen, layer in fresh market intel, ship the Monday digest.
- **WF-02** Co-Investor Share — `deal-watchlist-curate, deal-co-investor-syndicate` — After the Monday digest, share qualified deals with relevant co-investors with personalised notes.
- **WF-03** DD Kickoff — `deal-pitch-deck-analyze, market-competitor-map, deal-reference-check, deal-due-diligence, deal-ic-pack-build, legal-captable-model` — From qualified deal to IC pack: deck analysis, market map, references, memo draft, cap-table model, IC briefing.
- **WF-04** Deal Closing — `legal-document-draft, legal-captable-model, legal-contract-signature-manage, legal-audit-trail-write` — Draft term sheet & SPA/SHA, finalise cap table, send for e-signature, write audit-trail.
- **WF-05** Monthly Health Check — `portfolio-kpi-collect, portfolio-health-check, portfolio-fund-view, portfolio-early-warning-alert` — Collect KPIs, run health checks, aggregate to fund view, flag warnings.
- **WF-06** Quarterly LP Reporting — `portfolio-fund-view, portfolio-impact-assess, lp-quarterly-report, legal-audit-trail-write` — Aggregate performance, synthesise impact, compose report, write audit-trail entry, send personalised.
- **WF-07** Impact Assessment Pipeline — `portfolio-impact-assess` — 5-dimension assessment plus IC slides plus deep dive plus one-pager from a single data source.
- **WF-08** LP Onboarding — `lp-pipeline-manage, legal-audit-trail-write` — Drive KYC closure, welcome comms, system access, audit-trail entries.
- **WF-09** LP Outbound Sourcing — `lp-database-scout, lp-pipeline-manage, lp-network-intro-map` — Scout new LPs from closed databases, file new candidates into the pipeline, request intro paths.
- **WF-10** Quarterly Finance Review — `portfolio-kpi-collect, portfolio-health-check, portfolio-fund-view` — Pull financials, sense-check, benchmark against stage, update tracker, surface outliers.
- **WF-11** Market Intelligence Alert — `market-intelligence-scan, portfolio-early-warning-alert` — Continuous competitive / regulatory scan; immediate critical alerts; weekly digest.
- **WF-12** Follow-on Trigger — `portfolio-early-warning-alert, deal-due-diligence, legal-captable-model` — Early Warning catches a follow-on trigger, hands to Due Diligence (follow-on memo mode), cap-table updated.
- **WF-13** Capital Call — `lp-capital-call-draft, legal-audit-trail-write` — Compute call quotas per LP, draft notices, track receipts, log to audit trail.
- **WF-14** Compliance Watch — `legal-regulatory-deadline-watch, legal-contract-signature-manage, legal-audit-trail-write` — Deadline scan, contract obligations, audit-trail health-check.
- **WF-15** Fund Grant Pipeline — `finance-grant-scout` — Annual / quarterly scan of public funding programmes the fund qualifies for; draft application skeletons for review.
- **WF-16** Public Content Pipeline — `market-intelligence-scan, outreach-content-draft, outreach-newsletter-draft` — Turn the weekly market intel into a LinkedIn post or blog draft; queue the LP newsletter once per month.
- **WF-17** Event Cycle — `outreach-event-manage, outreach-partner-manage` — Plan an event, run attendee briefings, capture follow-ups, update partnership register.
- **WF-18** Exit Review — `exit-scenario-model, exit-secondary-market-scan` — Scenario modelling and secondary-market opportunity scan; output feeds the LPAC discussion.

---

## Customisation

Three ways, in increasing order of permanence:

1. **Ask in chat** — *"in `deal-flow-triage`, always flag deals without a technical co-founder"*.
   Claude edits the skill for you.
2. **Edit a Drive knowledge document** — changes methodology for the whole team at once. This is
   the right place for thesis, filters and scoring changes.
3. **Edit `~/.fund-os/user-config.json`** — fund identity, systems, storage paths, CRM field slugs.

Never edit files inside the plugin directory. They are replaced on the next update.

---

## Dashboard

`plugins/fund-os/Fund_OS_Dashboard.html` — a periodic table of all skills, grouped by lifecycle
phase, with triggers, inputs, outputs, required MCP capabilities and example output per skill.
Open it in a browser; no server needed.

---

## Updating

```
fund-os:update
```

Reports the installed version against the latest release, shows the changelog between them, and
explains the update path for the install method actually in use. It never writes into the plugin
directory.

Your configuration is never affected — it lives in `~/.fund-os/` and the knowledge comes from Drive.

---

## Development

```bash
python3 tools/validate.py          # the plugin: paths, front matter, dashboard, secrets, neutrality
python3 tools/check-knowledge.py   # your knowledge folder: manifest, placeholders, contradictions
python3 tools/knowledge-map.py     # regenerate the index of which document each skill uses
```

`knowledge-map.py` writes `_KNOWLEDGE-MAP.md` into the knowledge folder: document → skills,
skill → documents, plus the documents skills expect that do not exist anywhere. Run it after every
update; `check-knowledge.py` warns when the map was generated for an older version.

Every check in both scripts exists because that exact defect shipped once. `validate.py` runs in CI
on every push and pull request.

### Releasing

1. Edit skills in `plugins/fund-os/skills/`. The `SKILL.md` **is** the source — there is no generator.
2. Add a `## x.y.z` section to `CHANGELOG.md`.
3. Bump the version in `plugins/fund-os/.claude-plugin/plugin.json` **and** `.claude-plugin/marketplace.json`.
4. `python3 tools/validate.py` until green.
5. Commit and push to `main`.

Pushing a new version **is** the release trigger: CI validates, tags `fund-os/v<version>`, builds
`fund-os-<version>.plugin` and attaches it to a GitHub Release.

**Never build a bundle by hand, and never copy files into `~/.claude/plugins/` or the Desktop app's
session directories.** Bundles produced from a working copy that no commit captured are how the
running version once drifted nine weeks ahead of git.

### Repository layout

| Path | What |
|---|---|
| `.claude-plugin/marketplace.json` | marketplace definition — name must match the repository |
| `plugins/fund-os/` | the plugin: skills, knowledge templates, dashboard |
| `tools/` | `validate.py`, `check-knowledge.py`, `build-plugin.sh` |
| `docs/` | the version audit and the provenance index behind the current design |
| `USER_GUIDE.md` | end-user guide — day-to-day usage, skill reference, troubleshooting |

---

## VC-Skills.md community integration

Fund OS builds on the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) open
community knowledge base — 375 VC-relevant skills curated by
[Luis Schmitz](https://github.com/luisschmitzheadline). Where the community has deeper methodology
(market sizing, NDA triage, PMF assessment, SaaS benchmarks), skills reference and import it
rather than rebuilding it. Each such skill carries a `## Community skill references` section with
direct links.

---

## License

PolyForm Noncommercial License 1.0.0 — see [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

Free to use for funds, teams, non-profits, education and research. Commercial exploitation by
third parties requires a separate licence: https://ocean1.vc

© 2026 Ocean One Ventures.
