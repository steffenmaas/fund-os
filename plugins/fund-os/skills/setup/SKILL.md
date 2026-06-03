---
name: setup
description: Welcome wizard — configure Fund OS for your fund on first run. Collects tone of voice, output storage path and Google Drive knowledge folder ID, scans the folder to build a knowledge manifest, then writes all preferences to ~/.fund-os-prefs.json. Run this once before using any other Fund OS skill. Trigger with "set up fund OS", "fund OS setup" or "/fund-os:setup". Phase 00 (Setup). Fund-side only.
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

Also run automatically if any other Fund OS skill detects that `~/.fund-os-prefs.json` does not exist and the user confirms they want to set up now.

## Key instructions

1. **Check for existing config.** Look for `~/.fund-os-prefs.json`. If it exists, read it and show the current settings, then ask whether the user wants to reconfigure or update a specific field only.

2. **Welcome message.** Greet the user and explain in one short paragraph what Fund OS does and what this wizard configures.

3. **Collect preferences interactively — one question at a time:**

   **a. Tone of voice**
   Present four options (user can pick a number or type their own):
   1. Professional & direct — concise, fact-first, minimal filler
   2. Friendly & conversational — warm, plain language, light structure
   3. Formal & regulatory — precise, compliance-safe, footnote-style citations
   4. Custom — ask for a one-sentence description of the fund's voice

   **b. Output storage path**
   Ask for the Drive/Notion folder path or name where generated files should be saved (e.g. `Fund-Portfolio/`, `O1 Fund OS/Outputs/`). Default: `Fund-Portfolio/`.

   **c. Google Drive knowledge folder ID**
   Ask: "Paste the Google Drive folder ID that contains your shared knowledge documents (evaluation criteria, tone guide, category framework, etc.). Leave blank to skip — you can add it later."
   If provided, proceed to step 4.

4. **Scan knowledge folder (if folder ID provided).**
   - Use the Google Drive MCP to list all files in the folder.
   - Build a manifest: `{ "document_name": "file_id", ... }` for each document found.
   - Show the user the discovered documents and confirm.
   - If Drive MCP is not available, ask the user to paste file IDs manually and note which documents they correspond to.

5. **Write preferences file.**
   Write `~/.fund-os-prefs.json` with the collected values (see template below).
   - If Bash is available: write the file directly.
   - If not: display the JSON and instruct the user to save it to `~/.fund-os-prefs.json` manually (provide the exact `echo` command).

6. **Confirm setup complete.** Show a summary of all settings and tell the user which skill to run first. Suggest `fund-os:deal-flow-triage` or `fund-os:portfolio-health-check` as a starting point.

## Inputs

- User's answers to the wizard questions (interactive)
- Google Drive knowledge folder ID (optional)

## Outputs

- `~/.fund-os-prefs.json` written to disk
- Confirmation summary shown to user

## Required MCP capabilities

- Drive (optional — for knowledge folder scanning)

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

None — this skill creates the knowledge mapping for all other skills.

## Human-in-the-loop

User reviews and confirms all settings before the file is written.

## Preferences file template

```json
{
  "_note": "Fund OS user preferences — edit manually or re-run fund-os:setup to regenerate.",
  "version": "1.0",
  "tone": "professional",
  "toneCustom": "",
  "outputStoragePath": "Fund-Portfolio/",
  "driveKnowledgeFolderId": "",
  "knowledgeManifest": {
    "_comment": "Auto-populated by fund-os:setup. Keys are document names, values are Drive file IDs."
  },
  "configured": true,
  "configuredAt": "<ISO-8601 timestamp>"
}
```

## Example output / template

```
# Fund OS Setup Complete

Settings saved to ~/.fund-os-prefs.json

Tone:           Professional & direct
Output path:    Fund-Portfolio/
Knowledge folder: 1aBcDeFgHiJkLmNoPqRsTuVwXyZ (4 documents found)

Knowledge manifest:
  evaluation-criteria  →  1xK9...
  tone-guide           →  1mP2...
  category-framework   →  1nQ7...
  deal-scoring-rubric  →  1rL4...

All Fund OS skills will now use these settings automatically.
Suggested first skill: /fund-os:deal-flow-triage
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: setup@1.8.0
output_ref:    ~/.fund-os-prefs.json
rationale:     Fund OS preferences configured for this user
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
