---
name: deal-profile
description: Build a structured one-page company profile — founding team, product, traction, market, competitors and funding history — as a shareable IC snapshot or CRM record. Use this skill when the user says "company profile", "one-pager", "company snapshot" or "profile [company]". Phase 03 (Due Diligence). Fund-side only.
---

# Deal Profile

Build a structured one-page company profile — founding team, product, traction, market, competitors and funding history — as a shareable IC snapshot or CRM record.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "company profile"
- "one-pager"
- "company snapshot"
- "profile [company]"
- "research [company]"

## Key instructions

0. **Load configuration** from `~/.fund-os/user-config.json` — the fund's own config, kept outside the plugin so it survives every update, reinstall and re-upload:

   ```bash
   cat ~/.fund-os/user-config.json
   ```

   If it is missing, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults; an unconfigured run silently produces output with the wrong fund name, wrong ticket sizes and the wrong save location. The shape of the file is documented in `${CLAUDE_PLUGIN_ROOT}/preferences/user-config.json.template`.

   Apply `brandGuidelines.tone` to all prose output. Use `storagePaths.outputs` as the default save location (or `storagePaths.deals`, `storagePaths.portfolio`, `storagePaths.lps` where applicable). Reference `systems.crm` and `systems.documentStorage` by their configured names in instructions. From `knowledge.manifest`, load these keys from Google Drive if present: `investment-thesis`. Read the current document version before proceeding — this ensures you use the fund's own methodology rather than generic defaults. A document found via the Drive manifest always wins over the bundled copy.

1. Gather data from all available sources in order: CRM, pitch deck / data room, web search, LinkedIn, funding databases (Crunchbase, Dealroom, Apollo).
2. Structure the profile in five sections: (i) Company basics — name, founded, HQ, stage, sector, website; (ii) Founding team — bios, domain expertise, prior exits, team completeness; (iii) Product — one-sentence description, core value proposition, current stage (idea / MVP / growth), tech differentiation; (iv) Traction — ARR/MRR, growth rate, customer count, key logos, NRR, runway; (v) Market & competitive landscape — TAM/SAM/SOM, top 3–5 competitors with differentiators.
3. Add a funding history table: round, date, amount, lead investor, post-money valuation.
4. Append a 'Signal quality' block: rate each section Low / Medium / High confidence based on source recency and reliability.
5. Flag data that is unverifiable or self-reported without third-party confirmation.
6. Output as a clean markdown document; offer to push to CRM as a note on the company record.

## Inputs

- Company name (required)
- Company website or LinkedIn URL (optional — speeds up research)
- Pitch deck or data room link (optional)

## Outputs

- One-page company profile (markdown)
- Signal quality ratings per section
- Data gaps flagged for follow-up

## Required MCP capabilities

- CRM
- Web search
- Market data

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Fund-Framework/` — investment thesis (for thesis-fit positioning note)
- `Fund-Market/` — competitor maps and sector reports

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

GP reviews before sharing with co-investors or LPs. Internal use does not require sign-off.

## Example output / template

```
# Company Profile — Resolutee
Generated: 2026-05-22  |  Confidence: Medium

## Basics
Founded: 2023  |  HQ: Berlin, DE  |  Stage: Seed+  |  Sector: B2B SaaS / HR-tech
Website: resolutee.io

## Founding team
| Name       | Role | Background                              |
|------------|------|-----------------------------------------|
| Jan Müller | CEO  | Ex-Personio eng lead; 2nd-time founder  |
| Sarah Kroll| CTO  | PhD ML, ETH Zurich                      |
Team completeness: Eng/Product ✓  |  Sales: ✗ (open hire)

## Product
AI-assisted performance review and OKR tracking for SMB (10–200 employees).
Core VP: replaces manual review cycles with automated pulse surveys + LLM synthesis.
Stage: live product, paying customers.

## Traction (as of May 2026)
ARR: €1.2M  |  MoM growth: 38%  |  Customers: 47  |  NRR: 107%
Runway: 16 months  |  Key logos: [confidential]

## Market
TAM: €6.8B (EU performance management software, top-down)
SAM: €2.1B (EU SMB HR software, bottom-up)  ← USE THIS
Competitors: Lattice (US, enterprise), Leapsome (DE, SMB), Personio (DE, broad HR)
Differentiation: SMB price point + AI synthesis layer

## Funding history
| Round    | Date    | Amount | Lead       | Post-money |
|----------|---------|--------|------------|------------|
| Pre-seed | 2023-Q3 | €350K  | FFF        | €1.5M      |
| Seed     | 2024-Q2 | €1.8M  | Ocean One  | €8M        |

## Signal quality
| Section  | Confidence | Source                  |
|----------|------------|-------------------------|
| Team     | High       | LinkedIn + CRM notes    |
| Product  | High       | Live demo 2026-04-12    |
| Traction | Medium     | Founder-reported        |
| Market   | Medium     | Dealroom + bottom-up    |
| Funding  | High       | CRM + public records    |

Unverified: NRR figure (self-reported, no cohort data seen).
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`antigravity-startup-analyst`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/antigravity-startup-analyst) — structured startup analysis framework covering team, product, traction and market sections
- [`ailabs-startup-validator`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/ailabs-startup-validator) — signal quality assessment and data confidence rating methodology

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-profile@0.2.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of company and profile purpose>
```

---

*Fund OS v0.4.0 · skill `deal-profile`. This file is the source — edit it directly.*
