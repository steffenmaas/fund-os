# Fund OS Plugin

42 Claude Skills for VC fund operations across 8 lifecycle phases.

## What it is

Fund OS turns the operating model of a small VC team into a portable Claude plugin: every recurring task — LP scouting, deal triage, DD, portfolio monitoring, LP reporting, compliance, ecosystem outreach, exit — becomes a triggerable skill with explicit instructions, inputs, outputs, knowledge references and a human-in-the-loop policy.

**Scope:** Fund-side operations only. Founder coaching / portfolio-company helper skills (GTM, hiring, founder finance) are out of scope here and will ship as a separate **Founder OS** bundle later.

## Dashboard

Open [`Fund_OS_Dashboard.html`](./Fund_OS_Dashboard.html) in any browser for an interactive view of all skills — periodic table, lifecycle flow and workflow map.

## Skill inventory

### Phase 00 — Setup

One-time welcome wizard and updater.

- [`setup`](./skills/setup/SKILL.md) — Fund OS Setup
- [`update`](./skills/update/SKILL.md) — Fund OS Update

### Phase 01 — Fundraising & LP

Identify potential LPs, find paths to them, reach out, prepare a data room, manage commitment and KYC.

- [`lp-database-scout`](./skills/lp-database-scout/SKILL.md) — LP Database Scout
- [`lp-network-intro-map`](./skills/lp-network-intro-map/SKILL.md) — LP Network Intro Map
- [`lp-outreach-draft`](./skills/lp-outreach-draft/SKILL.md) — LP Outreach Draft
- [`lp-data-room-build`](./skills/lp-data-room-build/SKILL.md) — LP Data Room Build
- [`lp-pipeline-manage`](./skills/lp-pipeline-manage/SKILL.md) — LP Pipeline Manage
- [`finance-grant-scout`](./skills/finance-grant-scout/SKILL.md) — Finance Grant Scout

### Phase 02 — Sourcing & Market Watch

Active scouting, inbound triage, thesis screening, market intelligence and co-investor sharing.

- [`deal-outbound-scout`](./skills/deal-outbound-scout/SKILL.md) — Deal Outbound Scout
- [`deal-flow-triage`](./skills/deal-flow-triage/SKILL.md) — Deal Flow Triage
- [`deal-startup-score`](./skills/deal-startup-score/SKILL.md) — Deal Startup Score
- [`market-intelligence-scan`](./skills/market-intelligence-scan/SKILL.md) — Market Intelligence Scan
- [`deal-watchlist-curate`](./skills/deal-watchlist-curate/SKILL.md) — Deal Watchlist Curate
- [`deal-co-investor-syndicate`](./skills/deal-co-investor-syndicate/SKILL.md) — Deal Co-Investor Syndicate

### Phase 03 — Due Diligence

Analyse opportunities, map markets, profile companies, model financials, take references, write memos, assemble the IC pack.

- [`deal-pitch-deck-analyze`](./skills/deal-pitch-deck-analyze/SKILL.md) — Deal Pitch Deck Analyze
- [`market-competitor-map`](./skills/market-competitor-map/SKILL.md) — Market Competitor Map
- [`deal-reference-check`](./skills/deal-reference-check/SKILL.md) — Deal Reference Check
- [`deal-due-diligence`](./skills/deal-due-diligence/SKILL.md) — Deal Due Diligence
- [`deal-ic-pack-build`](./skills/deal-ic-pack-build/SKILL.md) — Deal IC Pack Build
- [`deal-profile`](./skills/deal-profile/SKILL.md) — Deal Profile
- [`deal-financial-model`](./skills/deal-financial-model/SKILL.md) — Deal Financial Model
- [`deal-comps-analyze`](./skills/deal-comps-analyze/SKILL.md) — Deal Comps Analyze

### Phase 04 — Portfolio Monitoring

Collect KPIs, run health checks, aggregate to fund view, flag early warnings, analyse variances.

- [`portfolio-kpi-collect`](./skills/portfolio-kpi-collect/SKILL.md) — Portfolio KPI Collect
- [`portfolio-health-check`](./skills/portfolio-health-check/SKILL.md) — Portfolio Health Check
- [`portfolio-fund-view`](./skills/portfolio-fund-view/SKILL.md) — Portfolio Fund View
- [`portfolio-early-warning-alert`](./skills/portfolio-early-warning-alert/SKILL.md) — Portfolio Early Warning Alert
- [`portfolio-variance-analyze`](./skills/portfolio-variance-analyze/SKILL.md) — Portfolio Variance Analyze

### Phase 05 — Reporting & Impact

Capital calls, impact assessments, quarterly LP reporting.

- [`lp-capital-call-draft`](./skills/lp-capital-call-draft/SKILL.md) — LP Capital Call Draft
- [`portfolio-impact-assess`](./skills/portfolio-impact-assess/SKILL.md) — Portfolio Impact Assess
- [`lp-quarterly-report`](./skills/lp-quarterly-report/SKILL.md) — LP Quarterly Report

### Phase 06 — Legal & Compliance

Draft legal documents, model cap tables, manage contracts and signatures, watch regulatory deadlines, write the audit trail.

- [`legal-document-draft`](./skills/legal-document-draft/SKILL.md) — Legal Document Draft
- [`legal-captable-model`](./skills/legal-captable-model/SKILL.md) — Legal Cap Table Model
- [`legal-contract-signature-manage`](./skills/legal-contract-signature-manage/SKILL.md) — Legal Contract & Signature Manage
- [`legal-regulatory-deadline-watch`](./skills/legal-regulatory-deadline-watch/SKILL.md) — Legal Regulatory Deadline Watch
- [`legal-audit-trail-write`](./skills/legal-audit-trail-write/SKILL.md) — Legal Audit Trail Write

### Phase 07 — Outreach & Ecosystem

LP newsletter, public content, events, partnerships.

- [`outreach-newsletter-draft`](./skills/outreach-newsletter-draft/SKILL.md) — Outreach Newsletter Draft
- [`outreach-content-draft`](./skills/outreach-content-draft/SKILL.md) — Outreach Content Draft
- [`outreach-event-manage`](./skills/outreach-event-manage/SKILL.md) — Outreach Event Manage
- [`outreach-partner-manage`](./skills/outreach-partner-manage/SKILL.md) — Outreach Partner Manage

### Phase 08 — Exit & Wind-Down

Model exit scenarios and scan the secondary market.

- [`exit-scenario-model`](./skills/exit-scenario-model/SKILL.md) — Exit Scenario Model
- [`exit-secondary-market-scan`](./skills/exit-secondary-market-scan/SKILL.md) — Exit Secondary Market Scan

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

## Installation

### Option A — Upload via Claude Desktop UI (easiest, no terminal)

1. [**Download `fund-os.plugin`**](https://github.com/steffenmaas/fund-os/raw/main/fund-os.plugin) from GitHub
2. Open **Claude Desktop** → click **Customize** in the left sidebar
3. Click the **+** button next to **Personal Plugins**
4. Hover over **Create plugin** → click **Upload plugin**
5. Select the `fund-os.plugin` file
6. Run the welcome wizard: type `fund-os:setup`

### Option B — Script install (no git required)

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/steffenmaas/fund-os/main/install.sh)
```

### Option C — Claude Code CLI

```
/plugin marketplace add steffenmaas/fund-os
/plugin install fund-os@fund-os-marketplace
```

After either install, run `/reload-plugins` then `fund-os:setup`.

## Customization

Every skill resolves preferences in this order, first hit wins: `~/.fund-os/user-config.json`, then the bundled fallback at `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`. Keep your real configuration in `~/.fund-os/` — it lives outside the plugin and therefore survives every update and re-upload. Run `setup` to create it.

To update without losing customisations: type `fund-os:update` in chat, or use `merge-plugin.sh` for `.plugin` file merges.

## Knowledge folders

- `Fund-Framework/` — investment thesis, scoring rubric, DD framework, impact framework
- `Fund-Templates/` — memo, health-check, LP report, capital-call templates
- `Fund-Portfolio/` — one subfolder per portfolio company, populated by skills
- `Fund-Market/` — market intel kept fresh by market-research skills

## Updates

Skill versions live in `plugin.json` (currently `0.2.0`). See the version bump checklist in the root README.

## VC-Skills.md Community Integration

Fund OS builds on the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) open community knowledge base — 375 VC-relevant skills curated by Luis Schmitz. Each integrated skill carries a `## Community skill references` section with direct links to the source.

## License

Proprietary. © Ocean One Ventures.
