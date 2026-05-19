# Fund OS

Fund OS is the operating system that lets a small fund team run a complete venture-capital fund at the operational depth of a much larger institution — built on Claude Skills, MCP and the Claude Agent SDK.

## How it works

Each recurring fund task is a **Claude Skill**: a small, version-controlled unit of methodology with explicit instructions, inputs, outputs, knowledge references and a human-in-the-loop policy. Skills are grouped into **8 lifecycle phases** (fundraising to wind-down) and compose into **18 cross-skill workflows** that cover the recurring rhythms — weekly deal digest, monthly portfolio health check, quarterly LP report, capital calls.

Skills connect to the fund's actual tools through **MCP capabilities** (CRM, fund administration, meeting intelligence, productivity suite, wiki, calendar, email, web search, market data). The capability names are vendor-neutral; the fund maps each one to the actual MCP server in its `.mcp.json`.

**Human-in-the-loop is a design property, not a setting.** Every regulated artefact (LP reports, capital calls, legal documents, audit-trail entries) requires explicit human sign-off before delivery. Claude prepares, drafts and aggregates — the GP signs off.

The same skill bundle runs in Claude Desktop (Cowork), Claude Code, and the Claude Agent SDK for scheduled or headless runs. No re-implementation when switching hosts.

## Installation

### Prerequisites

- **Claude Desktop** (Mac or Windows) with the **Cowork** plugin enabled, **or** **Claude Code** (CLI). Both support plugins and MCP.
- A GitHub account that has been granted access to this private repo. Ask Ocean One Ventures to add you as a collaborator if you haven't been already.

---

### Step 1 — Authenticate to GitHub

The plugin installer pulls skill files directly from this private GitHub repo, so Claude needs a valid GitHub credential.

**Option A — GitHub CLI (recommended)**

```bash
gh auth login
```

Follow the prompts (browser-based OAuth). Once done, `gh auth status` should show your account.

**Option B — Personal Access Token**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Create a token with **Contents: Read** access scoped to this repo (`steffenmaas/fund-os`)
3. Set it in your environment:

```bash
export GITHUB_TOKEN=your_token_here
```

Add that line to your `~/.zshrc` or `~/.bashrc` so it persists across sessions.

---

### Step 2 — Add the marketplace

Open Claude (Desktop/Cowork or Code) and type in the chat:

```
/plugin marketplace add steffenmaas/fund-os
```

This registers the marketplace so Claude knows where to find Fund OS. You only need to do this once per machine.

---

### Step 3 — Install the plugin

```
/plugin install fund-os
```

Claude will download all 35 skill files. You should see a confirmation listing the skills. To verify:

```
/plugin list
```

`fund-os` should appear with version `1.5.0`.

---

### Step 4 — Configure MCP servers (optional but recommended)

MCP servers give skills live access to your fund's tools. Skills work without MCP — they'll ask you to paste data manually — but MCP enables full automation.

Copy the example config to your project root:

```bash
cp plugins/fund-os/.mcp.json.example .mcp.json
```

Then edit `.mcp.json` and replace the placeholder values with your actual servers and API keys:

```json
{
  "mcpServers": {
    "crm": {
      "command": "npx",
      "args": ["-y", "@attio/mcp-server"],
      "env": { "ATTIO_API_KEY": "your-key-here" }
    },
    "fund-admin": {
      "command": "npx",
      "args": ["-y", "@bunch/mcp-server"],
      "env": { "BUNCH_API_KEY": "your-key-here" },
      "_note": "Read-only access only — never give write access to fund admin."
    },
    "meeting-intelligence": {
      "command": "npx",
      "args": ["-y", "@granola/mcp-server"],
      "env": { "GRANOLA_API_KEY": "your-key-here" }
    }
  }
}
```

Full capability list and alternative vendors are documented in [`plugins/fund-os/.mcp.json.example`](./plugins/fund-os/.mcp.json.example). You only need to configure the servers relevant to the skills you use — leave out anything you don't have.

---

### Step 5 — Set up knowledge folders

Skills read from four folders in your fund's drive or wiki. Create them and add the path to your Claude project context (Claude Desktop → Project Settings → Knowledge, or add them as context files in Claude Code):

| Folder | What goes in here |
|---|---|
| `Fund-Framework/` | Investment thesis, scoring rubric, DD framework, impact framework |
| `Fund-Templates/` | Memo template, health-check template, LP report template, capital-call template |
| `Fund-Portfolio/` | One subfolder per portfolio company with KPIs, updates, cap table |
| `Fund-Market/` | External market intel, competitor maps, sector reports |

These folders are written to by skills as well as read from — the portfolio health check updates `Fund-Portfolio/`, the market scanner keeps `Fund-Market/` fresh.

---

### Step 6 — Run your first skill

Type a trigger phrase in Claude:

```
/deal-flow-triage
```

or naturally:

```
Triage this inbound pitch deck against our thesis
```

Claude will activate the matching skill, ask for any missing inputs, and walk you through the human-in-the-loop steps before producing output.

## What's in this repo

| Path | Contents |
|---|---|
| [`plugins/fund-os/`](./plugins/fund-os/) | Plugin root — 35 SKILL.md files across 8 phases, plugin manifest, MCP config example |
| [`plugins/fund-os/README.md`](./plugins/fund-os/README.md) | Full skill inventory, 18 workflows, installation details |
| [`plugins/fund-os/Fund_OS_Dashboard.html`](./plugins/fund-os/Fund_OS_Dashboard.html) | Interactive periodic table of all skills — open in any browser |
| [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json) | Marketplace manifest |

## Dashboard

[![Fund OS Dashboard](./plugins/fund-os/dashboard-preview.png)](./plugins/fund-os/Fund_OS_Dashboard.html)

Open [`plugins/fund-os/Fund_OS_Dashboard.html`](./plugins/fund-os/Fund_OS_Dashboard.html) in any browser. No server required.

Three views: **Periodic Table** (skills by phase, colour-coded), **Lifecycle Flow** (skills along the fund lifecycle), **Workflows** (the 18 orchestrated flows). A search panel lets you filter by skill name, slug, MCP capability or trigger phrase.

## Versioning

Single source of truth: [`plugins/fund-os/.claude-plugin/plugin.json`](./plugins/fund-os/.claude-plugin/plugin.json). Bump the version on every change and push to `main`. Clients with `autoUpdate: true` in their marketplace settings pick up changes automatically.

## How this repo is built

Skill files are generated from a single `skills-data.js` in the Fund OS upstream repo. Do not edit `SKILL.md` files directly — they are regenerated by `build-marketplace.js`.

## License

Proprietary. © Ocean One Ventures.
