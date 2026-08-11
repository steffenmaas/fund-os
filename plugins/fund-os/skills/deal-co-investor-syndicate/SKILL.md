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

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `investment-thesis`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-co-investor-syndicate@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `deal-co-investor-syndicate`. This file is the source — edit it directly.*
