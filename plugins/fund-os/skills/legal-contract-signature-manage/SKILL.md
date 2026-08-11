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

0. **Load configuration.** Resolve in this order, first hit wins — `~/.fund-os/user-config.json`, then `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json`:

   ```bash
   cat ~/.fund-os/user-config.json 2>/dev/null \
     || cat "${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json" 2>/dev/null
   ```

   If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `legal-templates`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

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

*Fund OS v0.4.0 · skill `legal-contract-signature-manage`. This file is the source — edit it directly.*
