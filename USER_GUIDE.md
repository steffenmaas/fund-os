# Fund OS — User Guide

Fund OS turns your Claude into a full VC fund operating system. Every recurring fund task — triaging deals, running due diligence, monitoring your portfolio, producing LP reports — becomes a skill you can trigger with a plain sentence.

This guide covers everything you need to get up and running in under 10 minutes.

---

## Contents

1. [Before you start](#1-before-you-start)
2. [Installation](#2-installation)
3. [First-time setup](#3-first-time-setup)
4. [Customising Fund OS](#4-customising-fund-os)
5. [Using Fund OS — day-to-day](#5-using-fund-os--day-to-day)
6. [Skill quick reference](#6-skill-quick-reference)
7. [Updating Fund OS](#7-updating-fund-os)
8. [Support](#8-support)

---

## 1. Before you start

You need one of:

- **Claude Desktop** (Cowork tab) — recommended for day-to-day use
- **Claude.ai** with a Teams or Enterprise plan
- **Claude Code** — for power users and developers

You need a **`fund-os.plugin` file**. Two versions exist:

| Version | What it contains | Where to get it |
|---|---|---|
| **Vanilla** | All 42 skills with generic starter templates — ready to use, configure after install | [Download from GitHub ↓](https://github.com/steffenmaas/fund-os/raw/main/fund-os.plugin) |
| **Customised** | Vanilla + your fund's investment thesis, evaluation criteria, scoring rubric and tone guide pre-loaded | Ask the key Fund OS user at your firm |

Start with the vanilla version if you're the first person at your fund to install Fund OS. Use the customised version if a colleague has already set up the knowledge documents — it saves you the knowledge configuration step.

---

## 2. Installation

### Upload via Claude Desktop (recommended — no terminal needed)

1. Get the `fund-os.plugin` file — vanilla version from the table above, or customised version from your colleague
2. Open **Claude Desktop** and click **Customize** in the left sidebar
3. Next to **Personal Plugins**, click the **+** button
4. Hover over **Create plugin**
5. Click **Upload plugin**
6. Select the `fund-os.plugin` file
7. **Fund OS** will appear in your Personal Plugins list

That's it. No terminal, no accounts, no technical setup required.

---

## 3. First-time setup

After installation, run the welcome wizard **once**. It takes about 2 minutes and only needs to be done once per device.

In Claude, type:

```
fund-os:setup
```

The wizard walks through four sections in about 5 minutes:

| Section | What it collects |
|---|---|
| **Master data** | Fund name, currency, stage focus, ticket range, sectors, team, market anchor (TAM summary) |
| **Brand guidelines** | Tone of voice — Professional & direct / Friendly / Formal / Custom |
| **Systems** | Which tool the fund uses for each capability: CRM, meeting notes, document storage, market data, people/LP search, fund admin, e-signature |
| **Storage paths** | Where files are saved within your document system — outputs, deals, portfolio, LP records, drafts |

A fifth optional step scans your Google Drive knowledge folder and maps your documents (investment thesis, scoring rubric, etc.) so every skill can load them automatically.

After all sections, the wizard shows a **grouped summary** — you can edit any section before confirming.

Your preferences are saved inside the plugin and **survive updates** — you will never have to reconfigure after an upgrade.

---

## 4. Customising Fund OS

Fund OS is designed to work out of the box, but gets significantly better when you personalise it. **All customisation can be done directly in the chat** — no file navigation, no hidden folders.

### Preferences

Run `fund-os:setup` at any time to update your tone, output path, fund name or Drive folder.

### Editing skill files in the chat

To view or change any skill's knowledge files or templates, just ask Claude:

```
Show me the evaluation criteria for deal-flow-triage
```

```
Update the scoring rubric — add a Regulatory Risk dimension worth 10%
```

```
What does my investment memo template look like?
```

```
Change the health check template to add a burn multiple row
```

Claude will read the file, show you the content, make your requested changes, and confirm. No navigating to hidden folders required.

### Central knowledge repository on Google Drive

The most powerful customisation is connecting your fund's shared knowledge folder on Google Drive. Once you provide the folder ID in `fund-os:setup`, every skill automatically loads the documents it needs before running.

**How to set it up:**

1. Create a dedicated Google Drive folder (e.g. `Fund OS Knowledge`)
2. Add your fund's key documents with the names below
3. Share the folder ID with `fund-os:setup`

Skills load documents by their **filename** (without extension). Name your documents to match the keys below — starter templates for each are included in the plugin and can be shown to you by asking Claude:

<table>
<thead>
<tr><th style="white-space:nowrap">Document name</th><th>What to put in it</th></tr>
</thead>
<tbody>
<tr><td><code>investment-thesis</code></td><td>Fund overview, thesis statement, target sectors, ideal company profile, conviction questions. Used by all deal and screening skills.</td></tr>
<tr><td><code>evaluation-criteria</code></td><td>Hard filters (auto-Pass), soft filters (routing), priority tags (P1/P2/P3), red flags, and response SLA. Used by deal sourcing and pitch analysis skills.</td></tr>
<tr><td><code>scoring-rubric</code></td><td>Thesis scoring dimensions with weights, 0–10 scale definitions, verdict thresholds (PROCEED / WATCHLIST / PASS). Used by screening and scoring skills.</td></tr>
<tr><td><code>dd-framework</code></td><td>DD workstreams and owners, timeline, data room checklist, IC memo requirements, reference check standard. Used by DD skills.</td></tr>
<tr><td><code>memo-template</code></td><td>Investment memo structure with all required sections pre-formatted. Used by the due diligence skill.</td></tr>
<tr><td><code>tone-guide</code></td><td>Fund voice principles, audience-specific tone (LP / founder / public), words to avoid, signature block. Used by all outreach and communications skills.</td></tr>
<tr><td><code>health-check-template</code></td><td>Health check format with KPI table, red-flag checklist, PMF pulse, and follow-up action section. Used by the portfolio health check skill.</td></tr>
<tr><td><code>kpi-standards</code></td><td>KPI definitions, stage benchmarks (pre-seed to Series A), red-flag thresholds, and collection cadence. Used by all portfolio monitoring skills.</td></tr>
<tr><td><code>lp-report-template</code></td><td>LP quarterly report structure with fund snapshot, portfolio table, NAV bridge, and narrative sections. Used by the LP reporting skill.</td></tr>
<tr><td><code>newsletter-template</code></td><td>LP newsletter format with opening, portfolio highlights, market observations, and team note. Used by the newsletter skill.</td></tr>
</tbody>
</table>

Add the ones your team maintains — documents not in your folder are simply skipped. Start with `investment-thesis` and `evaluation-criteria`; they unlock the most skills immediately.

**Both team members can edit source documents directly in Drive.** Changes take effect immediately — no re-deploy needed.

---

## 5. Using Fund OS — day-to-day

### How to trigger a skill

Just describe what you want in plain language. Examples:

```
Triage this inbound pitch deck
```

```
Run a health check on Resolutee
```

```
Draft an investment memo for the Helios Sensors deal
```

```
Show me the portfolio fund view
```

Claude matches your intent to the right skill, asks for any missing information, and walks you through the steps — including any human sign-off required before producing regulated output.

You can also trigger skills directly by name:

```
fund-os:deal-flow-triage
fund-os:portfolio-health-check
fund-os:lp-quarterly-report
```

### Human-in-the-loop

**Fund OS never sends or publishes anything without your explicit approval.** Every document that leaves the fund — LP reports, capital call notices, legal documents, audit trail entries — is produced as a **draft** and held for partner sign-off before delivery.

---

## 6. Skill quick reference

### I want to work a new inbound deal

| Task | Skill | What to say |
|---|---|---|
| Classify and route an inbound pitch | `deal-flow-triage` | "Triage this new deal" |
| Quick thesis fit check | `deal-thesis-screen` | "Screen this startup against our thesis" |
| Detailed weighted scoring | `deal-startup-score` | "Score this startup" / "Go/no-go on [Company]" |

### I'm in due diligence

| Task | Skill | What to say |
|---|---|---|
| Analyse a pitch deck | `deal-pitch-deck-analyze` | "Analyse this deck" |
| Build a one-page company profile | `deal-profile` | "Profile [Company]" |
| Map competitors and market | `market-competitor-map` | "Market map for [Company]" |
| Run a financial model | `deal-financial-model` | "Model the financials for [Company]" |
| Pull comparable company valuations | `deal-comps-analyze` | "Comps for [sector]" |
| Plan and run reference checks | `deal-reference-check` | "Reference check for [Company]" |
| Run DD and draft the IC memo | `deal-due-diligence` | "Run DD for [Company]" / "Draft the IC memo" |
| Build the IC pack | `deal-ic-pack-build` | "Assemble the IC pack for [Company]" |

### I'm closing a deal

| Task | Skill | What to say |
|---|---|---|
| Draft legal documents | `legal-document-draft` | "Draft a term sheet for [Company]" |
| Model the cap table | `legal-captable-model` | "Model the cap table" |
| Manage contracts and signatures | `legal-contract-signature-manage` | "Send the SHA for signature" |
| Write the audit trail entry | `legal-audit-trail-write` | "Log this IC decision" |

### I'm monitoring the portfolio

| Task | Skill | What to say |
|---|---|---|
| Collect monthly KPIs | `portfolio-kpi-collect` | "Collect KPIs for this month" |
| Run a company health check | `portfolio-health-check` | "Health check for [Company]" |
| Analyse a budget variance | `portfolio-variance-analyze` | "Explain the Q1 variance for [Company]" |
| Flag early warnings | `portfolio-early-warning-alert` | "Check for early warning signals" |
| Aggregate to fund view | `portfolio-fund-view` | "Show me the portfolio fund view" |
| Assess impact | `portfolio-impact-assess` | "Run an impact assessment for [Company]" |

### I'm preparing LP communications

| Task | Skill | What to say |
|---|---|---|
| Draft the quarterly LP report | `lp-quarterly-report` | "Draft the Q[N] LP report" |
| Issue a capital call | `lp-capital-call-draft` | "Draft the capital call for tranche [N]" |
| Draft the LP newsletter | `outreach-newsletter-draft` | "Draft the monthly LP newsletter" |

### I'm sourcing new LPs

| Task | Skill | What to say |
|---|---|---|
| Scout LP databases | `lp-database-scout` | "Find new LP prospects" |
| Find intro paths | `lp-network-intro-map` | "Who can intro me to [LP]?" |
| Draft outreach | `lp-outreach-draft` | "Draft an outreach email to [LP]" |
| Manage the LP pipeline | `lp-pipeline-manage` | "Update the LP pipeline" |
| Build the data room | `lp-data-room-build` | "Refresh the data room" |

### I'm watching the market

| Task | Skill | What to say |
|---|---|---|
| Scan for market intelligence | `market-intelligence-scan` | "What happened in [sector] this week?" |
| Share deals with co-investors | `deal-co-investor-syndicate` | "Match this deal with co-investors" |
| Curate the weekly watchlist | `deal-watchlist-curate` | "Curate this week's watchlist" |

### Other

| Task | Skill | What to say |
|---|---|---|
| Manage compliance deadlines | `legal-regulatory-deadline-watch` | "Check compliance deadlines" |
| Scout fund grants | `finance-grant-scout` | "Find grants for the fund" |
| Draft public content | `outreach-content-draft` | "Draft a LinkedIn post about [topic]" |
| Plan an event | `outreach-event-manage` | "Plan the LP dinner" |
| Model an exit scenario | `exit-scenario-model` | "Model an exit for [Company]" |
| Check the secondary market | `exit-secondary-market-scan` | "Any secondary opportunities for [Company]?" |

---

## 7. Updating Fund OS

When a new version of Fund OS is available, update directly from Claude:

```
fund-os:update
```

This will:
1. Check the latest version from GitHub
2. Show you what is new (new skills, updated methodology)
3. Ask for your confirmation before making any changes
4. Apply only the new and changed skill files

**Your preferences, customised knowledge files and edited templates are never touched by an update.**

---

## 8. Support

**Something not working?** Contact the Fund OS team:

📧 [steffen@ocean1.vc](mailto:steffen@ocean1.vc)

When you write in, please include:
- Which skill you were using (e.g. `deal-flow-triage`)
- What you typed / what you expected
- What Claude responded

**Common questions:**

| Issue | Solution |
|---|---|
| "I don't see Fund OS in my skills list" | Run `/reload-plugins` in Claude Code, or restart Claude Desktop |
| "A skill isn't picking up my tone / output path" | Run `fund-os:setup` to check and reconfirm your preferences |
| "The skill says it can't access my Drive folder" | Check your Drive MCP is configured in `.mcp.json` and your folder ID is correct in preferences |
| "I want to change my evaluation criteria" | Edit `skills/deal-flow-triage/knowledge/evaluation-criteria.md` in the plugin folder |
| "I need to update to the latest version" | Type `fund-os:update` in Claude |

---

*Fund OS v0.2.2 · © Ocean One Ventures · Built on Claude Skills, MCP and the Claude Agent SDK*
