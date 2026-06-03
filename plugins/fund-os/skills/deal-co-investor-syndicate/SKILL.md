---
name: deal-co-investor-syndicate
description: Manage co-investor relationships, match deals to right co-investors, build syndicates, share thesis-aligned deal flow with personalised notes. Use this skill when the user says "share with co-investors", "find co-investors", "syndicate deal" or any natural variant. Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Deal Co-Investor Syndicate

Manage co-investor relationships, match deals to right co-investors, build syndicates, share thesis-aligned deal flow with personalised notes.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "share with co-investors"
- "find co-investors"
- "syndicate deal"
- "co-investor for X"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

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
| Cherry Ventures  | 5/5  | 2025 Berlin SaaS  | Lead-on-lead history   |
| Speedinvest      | 4/5  | 2024 DACH B2B     | Stage + geography fit  |
| EIF              | 4/5  | -                 | Female-founder mandate |

3 personalised notes drafted, all in review.
Do-not-share: Atomico (passed similar deal 2025).
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-co-investor-syndicate@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
