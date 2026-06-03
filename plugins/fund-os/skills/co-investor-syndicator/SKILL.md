---
name: co-investor-syndicator
description: Manage co-investor relationships, match deals to right co-investors, build syndicates, share thesis-aligned deal flow with personalised notes. Use this skill when the user says "share with co-investors", "find co-investors", "syndicate deal" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Co-Investor Syndicator

Manage co-investor relationships, match deals to right co-investors, build syndicates, share thesis-aligned deal flow with personalised notes.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "share with co-investors"
- "find co-investors"
- "syndicate deal"
- "co-investor for X"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

1. Match by thesis overlap, stage focus, geography, prior co-investment history.
2. Maintain a 'do-not-share' list per deal (conflicts, prior pass).
3. Personalise the share note: 1 line on the deal, 1 line on why this co-investor specifically.
4. Track who saw the deal and outcome (pass / interested / committed) for the registry.

## Inputs

- Deal
- target syndicate size
- co-investor registry

## Outputs

- Co-investor shortlist
- personalised share notes
- syndicate proposal
- share-tracking log

## Required MCP capabilities

- CRM
- Email
- Wiki / DB

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Co-Investor-Registry`
- `Sharing-Playbook`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

All shares reviewed before send.

## Example output / template

```
# Co-investor share - Resolutee (legal AI seed)

Round:      EUR 3m at EUR 12m post. We lead with EUR 1.5m.
Available:  EUR 1.5m (split into 2-4 tickets).

Shortlist (ranked by thesis fit):
| Co-investor      | Fit  | Last co-invest    | Why now                |
| [Co-Investor A]  | 5/5  | 2025 Berlin SaaS  | Lead-on-lead history   |
| [Co-Inv. B]      | 4/5  | 2024 DACH B2B     | Stage + geography fit  |
| EIF              | 4/5  | -                 | Female-founder mandate |

3 personalised notes drafted, all in review.
Do-not-share: [Fund C] (passed similar deal 2025).
```

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: co-investor-syndicator@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
