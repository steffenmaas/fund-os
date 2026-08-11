---
name: portfolio-impact-assess
description: Run a 5-dimension impact assessment, produce IC slides, deep dive and one-pager from a single data source. Use this skill when the user says "impact assessment", "5 dimensions", "IRL level" or any natural variant. Phase 05 (Reporting & Impact). Fund-side only.
---

# Portfolio Impact Assess

Run a 5-dimension impact assessment, produce IC slides, deep dive and one-pager from a single data source.

This skill is part of the **Fund OS** plugin, Phase 05 — Reporting & Impact.

## When to trigger

Run this skill when the user says any of:
- "impact assessment"
- "5 dimensions"
- "IRL level"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `impact-framework`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Dimensions (5): What, Who, How much, Contribution, Risk - the IMP convention.
2. Score each dimension 1-5; require source evidence per score.
3. IRL level: derive from the framework; do not invent levels.
4. Always produce the same three outputs from one data source - never re-state numbers differently.

## Inputs

- DD data
- health check
- founder interview

## Outputs

- Impact scorecard
- IC slides
- deep dive
- one-pager

## Required MCP capabilities

- Drive
- Canvas

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Impact-Framework`
- `IRL-Levels`
- `IC-Templates`

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

Impact lead reviews before publication.

## Example output / template

```
# Impact assessment - Nordwind (climate data)

Dimensions (IMP):
  WHAT         5/5  emissions visibility for SMEs
  WHO          4/5  underserved SME segment, EU
  HOW MUCH     3/5  240 SMEs, EUR 4M CO2 tracked
  CONTRIBUTION 4/5  no equivalent at this tier
  RISK         3/5  data-quality risk

IRL: 3 of 5 ('Initial outcomes documented')

Outputs: IC slides v1 + deep dive v1 + one-pager v1.
```

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: portfolio-impact-assess@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of what changed>
```

---

*Fund OS v0.4.0 · skill `portfolio-impact-assess`. This file is the source — edit it directly.*
