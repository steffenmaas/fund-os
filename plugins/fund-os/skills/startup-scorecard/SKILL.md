---
name: startup-scorecard
description: Run a structured 9-dimension GO/NO-GO scoring of an early-stage startup against the fund's thesis — problem severity, market size, timing, competitive moat, unit economics, founder-market fit, technical feasibility, GTM clarity, risk profile. Use this skill when the user says "score this startup", "startup scorecard", "go/no-go", "first screen" or "validate this idea". Phase 02 (Sourcing & Market Watch). Fund-side only.
---

# Startup Scorecard

Run a structured 9-dimension GO/NO-GO scoring of an early-stage startup against the fund's thesis — problem severity, market size, timing, competitive moat, unit economics, founder-market fit, technical feasibility, GTM clarity, risk profile.

This skill is part of the **Fund OS** plugin, Phase 02 — Sourcing & Market Watch.

## When to trigger

Run this skill when the user says any of:
- "score this startup"
- "startup scorecard"
- "go/no-go"
- "first screen"
- "validate this idea"
- "quick screen"

## Key instructions

0. **User preferences:** Check for `~/.fund-os-prefs.json`. If it exists, apply `tone` to all prose output, use `outputStoragePath` as the default save location, and load knowledge artefacts listed in `knowledgeManifest` from Google Drive instead of asking the user to paste content. If the file is absent, proceed normally — the user can run `fund-os:setup` to create it.

1. Collect minimum viable data: pitch deck or description, founder LinkedIn, company website. Do not proceed without at least one of these.
2. Score each of 9 dimensions on 0–10; apply the weight table below. Flag 'DATA INSUFFICIENT' for any dimension where evidence is too thin to score reliably.
3. Compute weighted total and apply verdict: 80–100 = GO (proceed to full DD); 60–79 = CONDITIONAL GO (specify conditions); 40–59 = PIVOT (identify specific concerns); <40 = NO-GO (log reason in CRM and notify GP).
4. Apply YC fundamentals checklist as a secondary filter: team has 2–4 co-founders; ≥50% engineers; all full-time; ≥1 year runway; clear Frequency Filter result (daily > weekly > monthly use cases preferred); MVP timeline ≤2 months if not yet built.
5. Identify the Riskiest Assumption (the single assumption that, if wrong, kills the business) and propose a Riskiest Assumption Test (RAT): the cheapest experiment to validate or invalidate it.
6. Append a Validation Ladder recommendation: (i) Customer interviews → (ii) Smoke test / landing page → (iii) Concierge / Wizard-of-Oz → (iv) Paid pilot — specify which rung is appropriate given current evidence.
7. Cross-reference against fund thesis: if the company falls outside the fund's stated investment criteria, flag it immediately and ask the GP before continuing the screen.

| Dimension             | Weight |
|-----------------------|--------|
| Problem severity      | 15%    |
| Market size           | 12%    |
| Timing                | 10%    |
| Competitive moat      | 12%    |
| Unit economics        | 15%    |
| Founder-market fit    | 8%     |
| Technical feasibility | 10%    |
| GTM clarity           | 10%    |
| Risk profile          | 8%     |

## Inputs

- Pitch deck or company description (required)
- Founder profile / LinkedIn (recommended)
- Fund investment thesis (pulled from `Fund-Framework/`)

## Outputs

- 9-dimension scorecard with weighted total
- GO / CONDITIONAL GO / PIVOT / NO-GO verdict
- Top 3 risks and the single Riskiest Assumption
- RAT recommendation (cheapest validation experiment)
- Validation Ladder rung recommendation
- CRM log entry (for NO-GO or CONDITIONAL verdicts)

## Required MCP capabilities

- CRM
- Web search
- Wiki / DB

The fund configures which actual MCP server backs each capability via `.mcp.json`. Skills always call capabilities, never vendors.

## Knowledge references

- `Fund-Framework/` — investment thesis and scoring rubric
- `Fund-Market/` — sector benchmarks for market size cross-check

These live in the fund's knowledge folders (`Fund-Framework/`, `Fund-Templates/`, `Fund-Portfolio/`, `Fund-Market/`). The skill expects the host to provide them as context.

## Human-in-the-loop

CONDITIONAL GO verdicts require GP review before advancing to `deal-flow-triage` or `thesis-fit-scorer`. NO-GO verdicts are logged automatically; GP notified by summary digest.

## Example output / template

```
# Startup Scorecard — Resolutee
Scored: 2026-05-22  |  Scorer: Fund OS

## Scorecard
| Dimension             | Weight | Score | Weighted |
|-----------------------|--------|-------|----------|
| Problem severity      | 15%    | 8     | 1.20     |
| Market size           | 12%    | 7     | 0.84     |
| Timing                | 10%    | 9     | 0.90     |
| Competitive moat      | 12%    | 7     | 0.84     |
| Unit economics        | 15%    | 8     | 1.20     |
| Founder-market fit    | 8%     | 9     | 0.72     |
| Technical feasibility | 10%    | 8     | 0.80     |
| GTM clarity           | 10%    | 6     | 0.60     |
| Risk profile          | 8%     | 7     | 0.56     |
| TOTAL                 |        |       | 7.66/10  |

## Verdict: CONDITIONAL GO (76.6 / 100)
Conditions:
  1. Validate GTM motion with 3 new reference customers (non-warm intros).
  2. First sales hire plan confirmed with timeline and job spec.

## YC Fundamentals check
✓ Co-founders: 2  |  ✓ Engineers: 100%  |  ✓ Full-time  |  ✓ Runway: 16m
✓ Frequency: daily use (HR pulse surveys)  |  ✓ MVP: live

## Riskiest Assumption
Sales-led motion works without a dedicated sales hire at €1k–€5k ACV.

## RAT
Run 5 cold outbound deals with the founder as AE; track conversion rate vs inbound.
Target: ≥20% conversion to confirm hypothesis.

## Validation Ladder
Currently at rung (iii) — Concierge.
Recommend advancing to (iv) Paid pilot for 3 new cold-outbound customers.
```

## Community skill references

Built on methodology from the [VC-Skills.md](https://github.com/luisschmitzheadline/vc-skills.md) community knowledge base (375 skills, curator: Luis Schmitz):
- [`vasilyu-startup-idea-validation`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/vasilyu-startup-idea-validation) — 9-dimension weighted scorecard (GO/CONDITIONAL/PIVOT/NO-GO), Riskiest Assumption Test framework, Validation Ladder methodology
- [`skillsmp-yc-startup-fundamentals`](https://github.com/luisschmitzheadline/vc-skills.md/tree/main/knowledge_skills/due_diligence/skillsmp-yc-startup-fundamentals) — YC team/idea/MVP checklist, Frequency Filter for idea evaluation, co-founder and runway criteria

## Audit trail

After successful execution, emit an entry via the `audit-trail-writer` skill:

```yaml
skill_version: startup-scorecard@1.8.0
output_ref:    <path or record id of the produced artefact>
rationale:     <one-line summary of company, verdict and key conditions>
```

---

*Generated from `skills-data.js` at version 1.8.0. Do not edit directly — edit the source and rebuild.*
