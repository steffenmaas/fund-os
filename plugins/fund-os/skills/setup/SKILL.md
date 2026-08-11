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

1. **Check for existing config.** Resolve in this order, first hit wins:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null
   ```

   If found: display current values grouped as below, ask: "Your preferences are already configured. Update a specific section or reconfigure everything?"

   If an old `user-config.json` is still sitting inside the plugin's own `preferences/` directory (where versions before 0.4.0 wrote it), offer to migrate it to `~/.fund-os/` — a config inside the plugin is overwritten whenever the plugin is reinstalled or re-uploaded.

2. **Welcome message.** One short paragraph: explain Fund OS, what this wizard sets up, and that preferences live in `~/.fund-os/` outside the plugin, so they survive every update and re-upload.

3. **Collect preferences in six sections — complete one section before moving to the next.**

---

### Section 1 — Master data

Ask these questions, collecting multiple answers in one prompt per sub-group:

**Fund identity:**
"Fund name (and abbreviation if any), currency, stage focus, ticket range?"
Example: Meridian Ventures (MV) · EUR · Pre-Seed & Seed · €100K–€500K initial, €1.5M reserve

**Sectors:**
"List your target sectors, comma-separated."
Example: Charter & Fleet Ops, Marina & Infrastructure, Crew & Service Tech, Maritime Data & SaaS

**Team:**
"Who are the team members and their roles?"
Example: A. Beck – Managing Partner, C. Duval – Partner

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
| Outputs (general) | `Fund OS/Outputs/` |
| Deal folders | `Fund OS/Deals/` |
| Portfolio folders | `Fund OS/Portfolio/` |
| LP records | `Fund OS/LPs/` |
| Drafts (pre-sign-off) | `Fund OS/Drafts/` |

---

### Section 5 — Knowledge repository (optional)

"Paste the Google Drive folder ID containing your shared knowledge documents (investment thesis, evaluation criteria, scoring rubric, etc.). Leave blank to skip — you can add it later."

If provided:
- Use the Drive MCP to list all files in the folder
- Build manifest: `{ "document-name": "file-id", ... }`
- Show discovered documents and confirm
- If Drive MCP unavailable: ask for file IDs manually

---

---

### Section 6 — Learnings (optional)

"When a Fund OS skill goes wrong and we work out the fix, may that fix be sent upstream to the Fund OS repository as a pull request? Company names, LP names and identifiers are always stripped first."

1. **Ask each time** *(default)* — you see exactly what would be sent and approve the batch
2. **Yes** — send without asking
3. **No** — keep every learning local to this fund

Store under `learnings.contributeUpstream` as `ask` / `yes` / `no`. Never assume consent: `fund-os:learn --upstream` treats a missing value as `ask`.

---

4. **Show confirmation summary before writing:**

```
┌──────────────────────────────────────────────────────────────┐
│  Fund OS Setup — please confirm                              │
├──────────────────────────────────────────────────────────────┤
│  MASTER DATA                                                 │
│  Fund        : Meridian Ventures (MV)                        │
│  Currency    : EUR  |  Stage: Pre-Seed & Seed                │
│  Ticket      : €100K–€500K initial, €1.5M reserve            │
│  Sectors     : Charter & Fleet Ops, Marina & Infrastructure  │
│                Crew & Service Tech, Maritime Data & SaaS     │
│  Team        : A. Beck, C. Duval                             │
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
│  Outputs     : Fund OS/Outputs/                              │
│  Deals       : Fund OS/Deals/                                │
│  Portfolio   : Fund OS/Portfolio/                            │
│  LPs         : Fund OS/LPs/                                  │
│  Drafts      : Fund OS/Drafts/                               │
│                                                              │
│  KNOWLEDGE                                                   │
│  Drive folder: [ID or "not configured"]                      │
│  Documents   : [N found or "none"]                           │
│                                                              │
│  LEARNINGS                                                   │
│  Upstream    : Ask each time                                 │
└──────────────────────────────────────────────────────────────┘
Type a section name to edit it, or press Enter to save.
```

Loop until confirmed.

5. **Write the preferences file outside the plugin**, so it survives updates and re-uploads:

   ```bash
   mkdir -p ~/.fund-os
   cat > ~/.fund-os/user-config.json <<'JSON'
   { ...the confirmed configuration... }
   JSON
   ```

   Never write it into the plugin directory — anything written there is lost on the next install. `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template` documents the shape of the file and is never read at runtime.

   If Bash is unavailable: display the JSON and tell the user to save it as `~/.fund-os/user-config.json` themselves.

6. **Verify the write** by reading the file back and confirming it parses as JSON. Report the path and the fund name you read back — not the values you intended to write.

7. **Confirm and suggest next step:**
   "Setup complete — configuration saved to `~/.fund-os/user-config.json`. Run `fund-os:deal-flow-triage` to triage your first deal, or ask Claude to show you your investment thesis starter template."

## Inputs

- User answers to wizard questions (interactive)
- Google Drive knowledge folder ID (optional)

## Outputs

- `~/.fund-os/user-config.json` — written outside the plugin, survives every update
- Grouped confirmation summary shown before writing

## Required MCP capabilities

- Drive (optional — for knowledge folder scanning)

## Human-in-the-loop

User reviews and confirms the grouped summary before any file is written.

## Audit trail

```yaml
skill_version: setup@0.4.0
output_ref:    preferences/user-config.json
rationale:     Fund OS preferences configured for this user
```

---

*Fund OS v0.4.0 · Phase 00 — Setup*
