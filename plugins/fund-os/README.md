# Fund OS Plugin

42 Claude Skills for VC fund operations across 8 lifecycle phases.

## What it is

Fund OS turns the operating model of a small VC team into a portable Claude plugin: every recurring task — LP scouting, deal triage, DD, portfolio monitoring, LP reporting, compliance, ecosystem outreach, exit — becomes a triggerable skill with explicit instructions, inputs, outputs, knowledge references and a human-in-the-loop policy.

**Scope:** Fund-side operations only. Founder coaching / portfolio-company helper skills (GTM, hiring, founder finance) are out of scope here and will ship as a separate **Founder OS** bundle later.

## Dashboard

Open [`Fund_OS_Dashboard.html`](./Fund_OS_Dashboard.html) in any browser for an interactive view of all skills — periodic table, lifecycle flow and workflow map.

## Skill inventory

### Phase 00 — Setup

One-time welcome wizard that configures tone, output paths and knowledge sources.

- **Su** [`setup`](./skills/setup/SKILL.md) — Fund OS Setup

### Phase 01 — Fundraising & LP

Identify potential LPs, find paths to them, reach out, prepare a data room, manage commitment and KYC.

- **Ld** [`lp-database-prospector`](./skills/lp-database-prospector/SKILL.md) — LP Database Prospector
- **Nm** [`network-intro-mapper`](./skills/network-intro-mapper/SKILL.md) — Network Intro Mapper
- **Lo** [`lp-outreach-composer`](./skills/lp-outreach-composer/SKILL.md) — LP Outreach Composer
- **Dr** [`data-room-builder`](./skills/data-room-builder/SKILL.md) — Data Room Builder
- **Lp** [`lp-pipeline-manager`](./skills/lp-pipeline-manager/SKILL.md) — LP Pipeline Manager
- **Gs** [`fund-grant-scout`](./skills/fund-grant-scout/SKILL.md) — Fund Grant Scout

### Phase 02 — Sourcing & Market Watch

Active scouting, inbound triage, thesis screening, market intelligence and co-investor sharing.

- **Os** [`outbound-startup-scout`](./skills/outbound-startup-scout/SKILL.md) — Outbound Startup Scout
- **Di** [`deal-flow-triage`](./skills/deal-flow-triage/SKILL.md) — Deal Flow Triage
- **Tm** [`thesis-fit-scorer`](./skills/thesis-fit-scorer/SKILL.md) — Thesis Fit Scorer
- **Mi** [`market-intelligence-scanner`](./skills/market-intelligence-scanner/SKILL.md) — Market Intelligence Scanner
- **Sw** [`startups-to-watch-curator`](./skills/startups-to-watch-curator/SKILL.md) — Startups-to-Watch Curator
- **Cy** [`co-investor-syndicator`](./skills/co-investor-syndicator/SKILL.md) — Co-Investor Syndicator
- **Ss** [`startup-scorecard`](./skills/startup-scorecard/SKILL.md) — Startup Scorecard

### Phase 03 — Due Diligence

Analyse opportunities, map markets, take references, write memos, assemble the IC pack.

- **Pa** [`pitch-deck-analyzer`](./skills/pitch-deck-analyzer/SKILL.md) — Pitch Deck Analyzer
- **Mc** [`market-and-competitor-mapper`](./skills/market-and-competitor-mapper/SKILL.md) — Market & Competitor Mapper
- **Rc** [`reference-check-orchestrator`](./skills/reference-check-orchestrator/SKILL.md) — Reference Check Orchestrator
- **Im** [`investment-memo-drafter`](./skills/investment-memo-drafter/SKILL.md) — Investment Memo Drafter
- **Ic** [`ic-pack-builder`](./skills/ic-pack-builder/SKILL.md) — IC Pack Builder
- **Mb** [`meeting-briefer`](./skills/meeting-briefer/SKILL.md) — Meeting Briefer
- **Cp** [`company-profiler`](./skills/company-profiler/SKILL.md) — Company Profiler
- **Fm** [`financial-modeler`](./skills/financial-modeler/SKILL.md) — Financial Modeler
- **Ca** [`comps-analyzer`](./skills/comps-analyzer/SKILL.md) — Comps Analyzer

### Phase 04 — Portfolio Monitoring

Collect KPIs, run health checks, aggregate to fund view, flag early warnings.

- **Kc** [`portfolio-kpi-collector`](./skills/portfolio-kpi-collector/SKILL.md) — Portfolio KPI Collector
- **Hc** [`portfolio-health-check`](./skills/portfolio-health-check/SKILL.md) — Portfolio Health Check
- **Fv** [`fund-view-aggregator`](./skills/fund-view-aggregator/SKILL.md) — Fund View Aggregator
- **Ew** [`early-warning-signaler`](./skills/early-warning-signaler/SKILL.md) — Early Warning Signaler
- **Va** [`variance-analyzer`](./skills/variance-analyzer/SKILL.md) — Variance Analyzer

### Phase 05 — Reporting & Impact

Capital calls, impact assessments, quarterly LP reporting.

- **Cc** [`capital-call-generator`](./skills/capital-call-generator/SKILL.md) — Capital Call Generator
- **Ia** [`impact-assessor`](./skills/impact-assessor/SKILL.md) — Impact Assessor
- **Qr** [`lp-quarterly-reporter`](./skills/lp-quarterly-reporter/SKILL.md) — LP Quarterly Reporter

### Phase 06 — Legal & Compliance

Draft legal documents, model cap tables, manage contracts and signatures, watch regulatory deadlines, write the audit trail.

- **Lg** [`legal-document-drafter`](./skills/legal-document-drafter/SKILL.md) — Legal Document Drafter
- **Ct** [`cap-table-modeler`](./skills/cap-table-modeler/SKILL.md) — Cap Table Modeler
- **Cm** [`contract-and-signature-manager`](./skills/contract-and-signature-manager/SKILL.md) — Contract & Signature Manager
- **Rd** [`regulatory-deadline-watcher`](./skills/regulatory-deadline-watcher/SKILL.md) — Regulatory Deadline Watcher
- **At** [`audit-trail-writer`](./skills/audit-trail-writer/SKILL.md) — Audit Trail Writer

### Phase 07 — Ecosystem & Outreach

LP newsletter, public content, events, partnerships.

- **Nl** [`lp-newsletter-composer`](./skills/lp-newsletter-composer/SKILL.md) — LP Newsletter Composer
- **Pc** [`public-content-composer`](./skills/public-content-composer/SKILL.md) — Public Content Composer
- **Ev** [`event-orchestrator`](./skills/event-orchestrator/SKILL.md) — Event Orchestrator
- **Pn** [`partnership-manager`](./skills/partnership-manager/SKILL.md) — Partnership Manager

### Phase 08 — Exit & Wind-Down

Model exit scenarios and watch the secondary market.

- **Es** [`exit-scenario-modeler`](./skills/exit-scenario-modeler/SKILL.md) — Exit Scenario Modeler
- **Sm** [`secondary-market-scanner`](./skills/secondary-market-scanner/SKILL.md) — Secondary Market Scanner

## Workflows

The skills compose into 18 cross-skill workflows you can wire up (cron / Agent SDK / form trigger):

- **WF-01** Weekly Deal Flow Digest — `Os, Di, Tm, Mi, Sw` — Scout outbound, triage inbound, score, layer in fresh market intel, ship the Monday digest.
- **WF-02** Co-Investor Share — `Sw, Cy` — After the Monday digest, share qualified deals with relevant co-investors with personalised notes.
- **WF-03** DD Kickoff — `Pa, Mc, Rc, Im, Ic, Ct` — From qualified deal to IC pack: deck analysis, market map, references, memo draft, cap-table model, IC briefing.
- **WF-04** Deal Closing — `Lg, Ct, Cm, At` — Draft term sheet & SPA/SHA, finalise cap table, send for e-signature, write audit-trail.
- **WF-05** Monthly Health Check — `Kc, Hc, Fv, Ew` — Collect KPIs, run health checks, aggregate to fund view, flag warnings.
- **WF-06** Quarterly LP Reporting — `Fv, Ia, Qr, At` — Aggregate performance, synthesise impact, compose report, write audit-trail entry, send personalised.
- **WF-07** Impact Assessment Pipeline — `Ia` — 5-dimension assessment plus IC slides plus deep dive plus one-pager from a single data source.
- **WF-08** LP Onboarding — `Lp, At` — Drive KYC closure, welcome comms, system access, audit-trail entries.
- **WF-09** LP Outbound Sourcing — `Ld, Lp, Nm` — Scout new LPs from closed databases, file new candidates into the pipeline, request intro paths.
- **WF-10** Quarterly Finance Review — `Kc, Hc, Fv` — Pull financials, sense-check, benchmark against stage, update tracker, surface outliers.
- **WF-11** Market Intelligence Alert — `Mi, Ew` — Continuous competitive / regulatory scan; immediate critical alerts; weekly digest.
- **WF-12** Follow-on Trigger — `Ew, Im, Ct` — Early Warning catches a follow-on trigger, hands to Investment Memo Drafter (follow-on mode), cap-table updated.
- **WF-13** Capital Call — `Cc, At` — Compute call quotas per LP, draft notices, track receipts, log to audit trail.
- **WF-14** Compliance Watch — `Rd, Cm, At` — Deadline scan, contract obligations, audit-trail health-check.
- **WF-15** Fund Grant Pipeline — `Gs` — Annual / quarterly scan of public funding programmes the fund qualifies for; draft application skeletons for review.
- **WF-16** Public Content Pipeline — `Mi, Pc, Nl` — Turn the weekly market intel into a LinkedIn post or blog draft; queue the LP newsletter once per month.
- **WF-17** Event Cycle — `Ev, Pn` — Plan an event, run attendee briefings, capture follow-ups, update partnership register.
- **WF-18** Exit Review — `Es, Sm` — Scenario modelling and secondary-market opportunity scan; output feeds the LPAC discussion.

## Installation

### Option A — Script install (no git required, recommended for teammates)

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/steffenmaas/fund-os/main/install.sh)
```

Downloads the latest release, places files in the correct Claude directory, and registers the plugin automatically. Requires `curl` (pre-installed on macOS and most Linux distros).

### Option B — Claude Code CLI

Inside a Claude Code session:

```
/plugin marketplace add steffenmaas/fund-os
/plugin install fund-os@fund-os-marketplace
```

Requires `gh auth login` (GitHub CLI) and access to the private repo.

### After either install

```
/reload-plugins
```

Then run the welcome wizard:

```
fund-os:setup
```

This collects your tone, output path and Google Drive knowledge folder — takes about 2 minutes and only needs to be done once.

### MCP servers

Copy `.mcp.json.example` to your project's `.mcp.json` and fill in credentials for the capabilities you use. See the full capability list in `.mcp.json.example`.

## Customization

Fund OS separates three layers so that plugin updates never overwrite personal or team settings:

| Layer | Lives where | Updated by | Survives plugin update |
|---|---|---|---|
| **Plugin** (skills, logic) | this repo, versioned | you, via push | n/a — this *is* the update |
| **User preferences** (tone, paths, Drive ID) | `~/.fund-os-prefs.json` | `fund-os:setup` wizard | ✅ yes |
| **Shared knowledge** (criteria, templates, guides) | central Google Drive folder | whole team, live | ✅ yes |

### Preferences (`~/.fund-os-prefs.json`)

Every skill reads this file at run-start and applies:

- `tone` — prose style (professional / friendly / formal / custom)
- `outputStoragePath` — default folder for saved files (e.g. `Fund-Portfolio/`)
- `driveKnowledgeFolderId` — your shared knowledge Drive folder
- `knowledgeManifest` — auto-built map of document name → Drive file ID

Run `fund-os:setup` to create or update this file. A template is at [`preferences/user-config.json.template`](./preferences/user-config.json.template).

### Shared knowledge on Google Drive

Store team documents (evaluation criteria, tone guide, scoring rubric, deal frameworks) in one shared Drive folder. During setup the skill scans the folder, builds a manifest, and saves it in your preferences. At runtime, skills load the *current* version of each document directly — no re-deploy needed when a document changes.

## Knowledge folders

Point the host at four folders in your fund's drive / wiki:

- `Fund-Framework/` — proprietary frameworks (thesis, scoring rubric, DD framework, impact framework).
- `Fund-Templates/` — memo template, health-check template, LP report template, capital-call template.
- `Fund-Portfolio/` — one subfolder per portfolio company, populated by skills.
- `Fund-Market/` — external market intel kept fresh by the market-research skills.

## Updates

Skill versions live in `plugin.json` (currently `1.8.0`). When you bump the version and push, installed clients will see an update prompt. Enable auto-update by setting `autoUpdate: true` in the marketplace entry of your `~/.claude/settings.json`.

Re-running `install.sh` also picks up the latest version. Preferences in `~/.fund-os-prefs.json` are never touched by updates.

## VC-Skills.md Community Integration

Fund OS builds on the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) open community knowledge base — a database of 375 VC-relevant skills curated by Luis Schmitz with contributions from the VC community. Where the community has developed deeper methodology in a specific area, Fund OS skills reference those community skills directly rather than rebuilding from scratch.

| Fund OS Skill | Community Source | What's Reused |
|---|---|---|
| `market-and-competitor-mapper` | `vc-skills-market-sizing` | ARPC bottom-up TAM/SAM/SOM with top-down sanity check |
| `contract-and-signature-manager` | `kwp-nda-triage` | GREEN/YELLOW/RED NDA classification (10-point checklist) |
| `portfolio-health-check` | `skillsmp-product-market-fit` | Sean Ellis 40% rule, Superhuman PMF Engine, retention curves |
| `investment-memo-drafter` | `vercel-saas-financial-projections` | 2025/26 SaaS benchmark tables (growth, NRR, LTV:CAC, margins) |
| `exit-scenario-modeler` | `vercel-saas-financial-projections` | Valuation multiples by growth rate and NRR tier |
| `thesis-fit-scorer` | `ailabs-startup-validator` | Systematic startup validation workflow |
| `regulatory-deadline-watcher` | `kwp-compliance` | GDPR/CCPA obligation timelines and DPA review checklist |
| `market-intelligence-scanner` | `skillsmp-analyzing-funding-landscape` | Investor landscape, M&A tracking, funding round benchmarks |
| `meeting-briefer` | `kwp-meeting-briefing` | 5-step briefing methodology, meeting-type classification, full briefing template |
| `variance-analyzer` | `kwp-variance-analysis` | Price/Volume decomposition, materiality thresholds, waterfall bridge narrative |
| `startup-scorecard` | `vasilyu-startup-idea-validation` | 9-dimension GO/NO-GO scorecard, Riskiest Assumption Test, Validation Ladder |
| `startup-scorecard` | `skillsmp-yc-startup-fundamentals` | YC team/idea/MVP checklist, Frequency Filter |
| `financial-modeler` | `alirezarezvani-financial-analyst` | DCF/WACC/CAPM, ratio taxonomy, materiality thresholds, SaaS adaptation |
| `comps-analyzer` | `vercel-saas-financial-projections` | Valuation multiples by growth rate, NRR tier and Rule of 40 premium |
| `company-profiler` | `antigravity-startup-analyst` | Structured team/product/traction/market analysis framework |

Each integrated skill carries a `## Community skill references` section with direct links to the source.

## License

Proprietary. © Ocean One Ventures.
