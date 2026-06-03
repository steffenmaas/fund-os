---
name: setup
description: Welcome wizard — configure Fund OS on first run. Collects tone, output path and Google Drive knowledge folder ID, scans the folder to build a knowledge manifest, shows a confirmation summary, then writes preferences to the plugin's own preferences/user-config.json. Run once before using any other Fund OS skill. Trigger with "set up fund OS", "fund OS setup" or "fund-os:setup". Phase 00 (Setup). Fund-side only.
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

Also run automatically if any other Fund OS skill finds no preferences file and the user confirms they want to set up now.

## Key instructions

1. **Locate the preferences file.** Find it at:
   ```
   ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json
   ```
   Via Bash: `ls ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`

   If the file exists, read it and show the current settings. Ask: "Your preferences are already configured (shown above). Would you like to (1) keep them, (2) update a specific field, or (3) reconfigure everything?"

2. **Welcome message.** One short paragraph: explain Fund OS, what this wizard configures, and that preferences are stored inside the plugin and survive updates.

3. **Collect preferences interactively — one question at a time:**

   **a. Tone of voice**
   Present four numbered options:
   1. Professional & direct — concise, fact-first, no filler
   2. Friendly & conversational — warm, plain language, light structure
   3. Formal & regulatory — precise, compliance-safe, footnote-style citations
   4. Custom — ask for a one-sentence description

   **b. Output storage path**
   "Where should generated files be saved by default? (e.g. `Fund-Portfolio/`, `O1 Fund OS/Outputs/`)"
   Default if blank: `Fund-Portfolio/`

   **c. Google Drive knowledge folder ID**
   "Paste the Google Drive folder ID containing your shared knowledge documents (evaluation criteria, tone guide, frameworks). Leave blank to skip — you can add it later."

   **d. Fund name** (used in reports and memos)
   "What is your fund's name? (e.g. Ocean One Ventures)"

4. **Scan knowledge folder (if folder ID provided).**
   - Use the Google Drive MCP to list all files in the folder.
   - Build a manifest: `{ "document_name": "file_id", ... }` for each file found.
   - Show the discovered documents and ask: "Found [N] documents — does this look right? Type a number to remove any, or press Enter to continue."
   - If Drive MCP is unavailable, ask for file IDs manually.

5. **Show confirmation summary** before writing anything:

   ```
   ┌─────────────────────────────────────────────┐
   │  Fund OS Setup — please confirm             │
   ├─────────────────────────────────────────────┤
   │  Fund name    : [value]                     │
   │  Tone         : [value]                     │
   │  Output path  : [value]                     │
   │  Drive folder : [ID or "not configured"]    │
   │  Knowledge    : [N documents or "none"]     │
   │    • [doc name] → [file ID]                 │
   │    • ...                                    │
   └─────────────────────────────────────────────┘
   Type a field name to change it, or press Enter to save.
   ```

   Loop until the user confirms. Allow editing any field by name.

6. **Write preferences file.**
   Target path: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json`

   Resolve the exact path via Bash:
   ```bash
   PREFS_PATH=$(ls -d ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/ 2>/dev/null | head -1)user-config.json
   ```

   Write the JSON (see template below).

   - If Bash is available: write directly.
   - If not: display the full JSON and instruct the user to save it to the path shown above.

7. **Confirm and suggest next step.**
   "Setup complete. Preferences saved. Run `fund-os:deal-flow-triage` to triage your first deal, or `fund-os:portfolio-health-check` to start a health check."

## Inputs

- User answers to wizard questions (interactive)
- Google Drive knowledge folder ID (optional)

## Outputs

- `preferences/user-config.json` written inside the plugin directory
- Confirmation summary shown to user before writing

## Required MCP capabilities

- Drive (optional — for knowledge folder scanning)

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

None — this skill creates the knowledge mapping for all other skills.

## Human-in-the-loop

User reviews and confirms the summary in step 5 before any file is written.

## Preferences file template

```json
{
  "_note": "Fund OS preferences. Edit manually or re-run fund-os:setup. This file lives inside the plugin and survives updates — it is never overwritten by fund-os:update.",
  "version": "1.0",
  "fundName": "",
  "tone": "professional",
  "toneCustom": "",
  "outputStoragePath": "Fund-Portfolio/",
  "driveKnowledgeFolderId": "",
  "knowledgeManifest": {
    "_comment": "Auto-populated by fund-os:setup. Keys = document names, values = Drive file IDs."
  },
  "configured": true,
  "configuredAt": "<ISO-8601 timestamp>"
}
```

## Example interaction

```
Fund OS Setup Wizard
────────────────────

I'll configure Fund OS in 4 quick questions.

Q1 · Tone of voice
  1. Professional & direct
  2. Friendly & conversational
  3. Formal & regulatory
  4. Custom

Your choice: 1

Q2 · Output storage path
Default: Fund-Portfolio/
Your path (Enter for default):

Q3 · Google Drive knowledge folder ID
Folder ID (Enter to skip): 1aBcDeFgHiJkLmNoPqRsTuVwX

Scanning folder... found 4 documents:
  • evaluation-criteria    → 1xK9...
  • tone-guide             → 1mP2...
  • category-framework     → 1nQ7...
  • deal-scoring-rubric    → 1rL4...

Looks right? (Enter to continue / number to remove):

Q4 · Fund name: Ocean One Ventures

┌─────────────────────────────────────────────┐
│  Fund OS Setup — please confirm             │
├─────────────────────────────────────────────┤
│  Fund name    : Ocean One Ventures          │
│  Tone         : Professional & direct       │
│  Output path  : Fund-Portfolio/             │
│  Drive folder : 1aBcDeFgHiJkLmNoPqRsTuVwX  │
│  Knowledge    : 4 documents                 │
│    • evaluation-criteria  → 1xK9...         │
│    • tone-guide           → 1mP2...         │
│    • category-framework   → 1nQ7...         │
│    • deal-scoring-rubric  → 1rL4...         │
└─────────────────────────────────────────────┘
Type a field name to change it, or press Enter to save.

> (Enter)

✓ Preferences saved.
Suggested first skill: /fund-os:deal-flow-triage
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: setup@1.9.0
output_ref:    preferences/user-config.json
rationale:     Fund OS preferences configured for this user
```

---

*Generated from `skills-data.js` at version 1.9.0. Do not edit directly — edit the source and rebuild.*
