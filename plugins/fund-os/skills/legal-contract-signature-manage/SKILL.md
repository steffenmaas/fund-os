---
name: legal-contract-signature-manage
description: Track SPAs, SHAs, NDAs, side letters - version, watch deadlines, surface obligations - AND manage e-signature flows from send through receipt. Use this skill when the user says "contract", "NDA", "SHA" or any natural variant. Phase 06 (Legal & Compliance). Fund-side only.
---

# Legal Contract & Signature Manage

Track SPAs, SHAs, NDAs, side letters - version, watch deadlines, surface obligations - AND manage e-signature flows from send through receipt.

This skill is part of the **Fund OS** plugin, Phase 06 — Legal & Compliance.

## When to trigger

Run this skill when the user says any of:
- "contract"
- "NDA"
- "SHA"
- "side letter"
- "send for signature"
- "track signature"

## Key instructions

0. **User preferences:** Load preferences from the plugin: `~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json` (via Bash: `cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null`). Apply `tone` to all prose output, `outputStoragePath` as the default save location, and load any `knowledgeManifest` entries from Google Drive. If the file is absent, proceed normally — run `fund-os:setup` to create it.

1. Register schema: id, party_a, party_b, type, executed_date, term, deadlines[], owner.
2. For signature: send via the integrated e-signature MCP, track status, escalate at T+3d.
3. Auto-create calendar entries for every deadline at T-30 and T-7.
4. Never modify executed contract files - new versions become new register entries.
5. NDA triage: classify every incoming NDA as GREEN (standard, approve via delegation of authority), YELLOW (counsel review needed — one or more non-standard clauses present), or RED (full legal review required — embedded non-compete / exclusivity / overbroad residuals / wrong directionality). Never self-approve a RED-classified NDA.

## Inputs

- Contract files
- signing parties
- deadlines

## Outputs

- Versioned register
- obligation calendar
- alerts
- signature workflow status

## Required MCP capabilities

- Drive
- Calendar
- E-Signature (DocuSign, HelloSign, Adobe Sign)

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Contract-Register-Schema`
- `Signature-Workflow`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

All execution sign-offs require human; signatures auto-tracked but not auto-completed.

## Example output / template

```
# Contract register - 2026-05-19

EXECUTED (12 active):
  CT-2026-058  Side letter Aurora FO - Fund II   2026-04-12  Active
  CT-2026-052  SPA Resolutee - Fund II           2026-04-08  Active

IN SIGNATURE FLOW (3):
  CT-2026-061  SHA Helios          Sent 2026-05-15  2 of 3 signed
  CT-2026-060  Side letter Beta    Sent 2026-05-12  Pending Beta counsel (4d - alert)

DEADLINES (next 30d):
  2026-05-22  CT-2026-061 signature deadline
  2026-06-30  CT-2026-058 Aurora first MFN check
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`kwp-nda-triage`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/kwp-nda-triage) — GREEN/YELLOW/RED NDA classification with 10-point checklist (source: `anthropics/knowledge-work-plugins`)
- [`kwp-contract-review`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/kwp-contract-review) — Playbook-based clause analysis with severity classification
- [`kwp-legal-risk-assessment`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/kwp-legal-risk-assessment) — Legal risk scoring framework

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: legal-contract-signature-manage@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Generated from `skills-data.js` at version 0.2.0. Do not edit directly — edit the source and rebuild.*
