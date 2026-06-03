---
name: setup
description: Welcome wizard — configure Fund OS in four grouped sections covering master data, brand guidelines, systems and storage paths. Scans the Google Drive knowledge folder to build a manifest. Shows a confirmation summary before writing. Run once before using any other skill. Trigger with "set up fund OS", "fund OS setup" or "fund-os:setup". Phase 00 (Setup). Fund-side only.
---

# Fund OS Setup

Configure Fund OS for your fund — run this once before using any other skill.

This skill is part of the **Fund OS** plugin, Phase 00 — Setup.

## When to trigger

Run this skill when the user says any of:
- "set up fund OS"
- "fund OS setup"
- "configure fund OS"
- "first time setup"
- `fund-os:setup`

Also run if any other Fund OS skill detects no preferences file and the user confirms they want to set up now.

## Key instructions

1. **Check for existing config.** Locate the preferences file at:
   ```
   ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json
   ```
   Via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`

   If found: display current values grouped as below, ask: "Your preferences are already configured. Update a specific section or reconfigure everything?"

2. **Welcome message.** One short paragraph: explain Fund OS, what this wizard sets up, and that preferences survive all future updates.

3. **Collect preferences in four sections — complete one section before moving to the next.**

---

### Section 1 — Master data

Ask these questions, collecting multiple answers in one prompt per sub-group:

**Fund identity:**
"Fund name (and abbreviation if any), currency, stage focus, ticket range?"
Examples: Ocean One Ventures (O1) · EUR · Pre-Seed & Seed · €100K–€500K initial, €1.5M reserve

**Sectors:**
"List your target sectors, comma-separated."
Example: Charter & Fleet Ops, Marina & Infrastructure, Crew & Service Tech, Maritime Data & SaaS

**Team:**
"Who are the team members and their roles?"
Example: Steffen Maas – Managing Partner, Dietlind G. Wittig – Partner

**Market anchor:**
"One-line TAM description for reports and LP communications."
Example: €130B global leisure boating, 8% CAGR

---

### Section 2 — Brand guidelines

**Tone of voice** — present four options:
1. Professional & direct — concise, fact-first, no filler
2. Friendly & conversational — warm, plain language, light structure
3. Formal & regulatory — precise, compliance-safe, footnote-style citations
4. Custom — ask for a one-sentence description

Note: detailed voice rules (words to avoid, audience tone by type, signature format) belong in the `tone-guide` knowledge document — Fund OS applies them automatically once the knowledge folder is configured.

---

### Section 3 — Systems

Ask in a single prompt: "Which tools does the fund use for each of the following? Fund admin and e-signature are optional."

| Capability | Examples |
|---|---|
| CRM | Attio, Affinity, Salesforce, HubSpot |
| Meeting notes | Granola, Fireflies, Otter, Read.ai |
| Document storage | Google Drive, Notion, Confluence |
| Market data | Specter, Dealroom, PitchBook |
| People / LP search | Apollo, LinkedIn, Cognism |
| Fund admin (optional) | Bunch, Carta, Allvue |
| E-signature (optional) | BoldSign, DocuSign, HelloSign |

Store each tool name in `systems.*` — skills reference these names in instructions and audit trail entries.

---

### Section 4 — Storage paths

Ask in a single prompt: "Where within [documentStorage] should Fund OS save each type of file? You can provide a root folder and I'll derive the sub-paths, or specify each individually."

| Artefact type | Example |
|---|---|
| Outputs (general) | `O1 Fund OS/Outputs/` |
| Deal folders | `O1 Fund OS/Deals/` |
| Portfolio folders | `O1 Fund OS/Portfolio/` |
| LP records | `O1 Fund OS/LPs/` |
| Drafts (pre-sign-off) | `O1 Fund OS/Drafts/` |

---

### Section 5 — Knowledge repository (optional)

"Paste the Google Drive folder ID containing your shared knowledge documents (investment thesis, evaluation criteria, scoring rubric, etc.). Leave blank to skip — you can add it later."

If provided:
- Use the Drive MCP to list all files in the folder
- Build manifest: `{ "document-name": "file-id", ... }`
- Show discovered documents and confirm
- If Drive MCP unavailable: ask for file IDs manually

---

4. **Show confirmation summary before writing:**

```
┌──────────────────────────────────────────────────────────────┐
│  Fund OS Setup — please confirm                              │
├──────────────────────────────────────────────────────────────┤
│  MASTER DATA                                                 │
│  Fund        : Ocean One Ventures (O1)                       │
│  Currency    : EUR  |  Stage: Pre-Seed & Seed                │
│  Ticket      : €100K–€500K initial, €1.5M reserve            │
│  Sectors     : Charter & Fleet Ops, Marina & Infrastructure  │
│                Crew & Service Tech, Maritime Data & SaaS     │
│  Team        : Steffen Maas, Dietlind G. Wittig              │
│  Market      : €130B global leisure boating, 8% CAGR         │
│                                                              │
│  BRAND GUIDELINES                                            │
│  Tone        : Professional & direct                         │
│                                                              │
│  SYSTEMS                                                     │
│  CRM         : Attio         Meeting notes: Granola          │
│  Documents   : Google Drive  Market data  : Specter          │
│  People/LP   : Apollo        Fund admin   : —                │
│  E-signature : BoldSign                                      │
│                                                              │
│  STORAGE PATHS                                               │
│  Outputs     : O1 Fund OS/Outputs/                           │
│  Deals       : O1 Fund OS/Deals/                             │
│  Portfolio   : O1 Fund OS/Portfolio/                         │
│  LPs         : O1 Fund OS/LPs/                               │
│  Drafts      : O1 Fund OS/Drafts/                            │
│                                                              │
│  KNOWLEDGE                                                   │
│  Drive folder: [ID or "not configured"]                      │
│  Documents   : [N found or "none"]                           │
└──────────────────────────────────────────────────────────────┘
Type a section name to edit it, or press Enter to save.
```

Loop until confirmed.

5. **Write preferences file** to the plugin path:
   ```bash
   PREFS=$(ls -d ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/ | head -1)user-config.json
   ```
   If Bash is available: write directly. If not: display the JSON and instruct the user to save manually.

6. **Confirm and suggest next step:**
   "Setup complete. Run `fund-os:deal-flow-triage` to triage your first deal, or ask Claude to show you your investment thesis starter template."

## Inputs

- User answers to wizard questions (interactive)
- Google Drive knowledge folder ID (optional)

## Outputs

- `preferences/user-config.json` written inside the plugin
- Grouped confirmation summary shown before writing

## Required MCP capabilities

- Drive (optional — for knowledge folder scanning)

## Human-in-the-loop

User reviews and confirms the grouped summary before any file is written.

## Audit trail

```yaml
skill_version: setup@0.2.0
output_ref:    preferences/user-config.json
rationale:     Fund OS preferences configured for this user
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
