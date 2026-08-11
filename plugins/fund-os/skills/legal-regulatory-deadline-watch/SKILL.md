---
name: legal-regulatory-deadline-watch
description: Watch the fund's regulatory deadlines (BaFin / AIFMD / SFDR / annual reports) and surface anything within 30 / 14 / 3 days. Use this skill when the user says "compliance deadline", "regulatory filing", "BaFin / AIFMD" or any natural variant. Phase 06 (Legal & Compliance). Fund-side only.
---

# Legal Regulatory Deadline Watch

Watch the fund's regulatory deadlines (BaFin / AIFMD / SFDR / annual reports) and surface anything within 30 / 14 / 3 days.

This skill is part of the **Fund OS** plugin, Phase 06 — Legal & Compliance.

## When to trigger

Run this skill when the user says any of:
- "compliance deadline"
- "regulatory filing"
- "BaFin / AIFMD"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `compliance-calendar`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Three tiers: T-30 (preparation), T-14 (escalation), T-3 (red).
2. Always link the alert to the filing template and the responsible officer.
3. Re-check the regulator's website weekly for date changes; surface diffs immediately.
4. Never auto-submit any filing - this skill produces alerts and prep packs only.
5. Data compliance calendar: include GDPR/CCPA/UK GDPR events alongside fund-specific deadlines — 72-hour breach notification window, data subject request deadlines (GDPR: 30 days; CCPA: 45 days), DPA review triggers when onboarding a new processor. Tag each item with responsible officer and applicable regulation.

## Inputs

- Deadline calendar
- regulatory updates

## Outputs

- Tiered alerts
- suggested filing pack

## Required MCP capabilities

- Calendar
- Web Search

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Regulatory-Deadlines`
- `Filing-Templates`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Filings always reviewed by compliance officer.

## Example output / template

```
# Compliance watch - 2026-05-19

T-3 (RED):
  BaFin half-yearly AIF report due 2026-05-22. Owner: <CompO>.
  Pack: /Compliance/2026-H1/BaFin/.

T-14:
  SFDR Article 8 periodic disclosure due 2026-06-02.

T-30:
  Annual ESMA reporting due 2026-06-18 - start data pull now.
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`kwp-compliance`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/kwp-compliance) — GDPR / CCPA / LGPD obligation timelines, DPA review checklist, data subject request handling (source: `anthropics/knowledge-work-plugins`)
- [`kwp-audit-support`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/kwp-audit-support) — Audit preparation and compliance support framework

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: legal-regulatory-deadline-watch@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `legal-regulatory-deadline-watch`. This file is the source — edit it directly.*
