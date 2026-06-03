# Deal Flow Evaluation Criteria

> **How to use:** Edit this file to reflect your fund's actual thesis. The `deal-flow-triage` skill reads this at runtime via the knowledge manifest — no re-deploy needed.

## Hard filters (any NO = automatic Pass)

| Criterion | Our threshold |
|---|---|
| Sector | [e.g. B2B SaaS, Climate Tech, Health Tech] |
| Stage | [e.g. Pre-Seed to Series A] |
| Geography | [e.g. DACH, EU] |
| Ticket size | [e.g. €150K – €1.5M] |
| Revenue | [e.g. ≥ €0 (pre-revenue OK) or ≥ €50K ARR] |

## Soft filters (inform P1/P2/P3 routing)

- Founder background: domain expertise + prior founding experience weighted positively
- Team completeness: technical co-founder required; commercial hire timeline flagged
- Market: TAM ≥ €1B SAM; bottom-up validation required for claims > €5B
- Traction signals: paying customers, LOIs, waitlist size, pilot pipeline

## Priority tags

| Tag | Criteria |
|---|---|
| **P1** | Passes all hard + soft filters; strong traction signal |
| **P2** | Passes hard filters; 1–2 soft flags; worth a call |
| **P3** | Passes hard filters; significant soft flags; monitor only |
| **Pass** | Any hard filter fails |

## Red flags (automatic Pass regardless of other scores)

Any single red flag below is an immediate Pass — do not route for further review.

- [ ] [e.g. B2C consumer with no clear monetisation path]
- [ ] [e.g. Solo founder, no co-founder plan within 3 months]
- [ ] [e.g. Deep-tech with >5 year commercial horizon]
- [ ] [e.g. Regulated sector requiring licence the team does not hold]
- [ ] [e.g. Existing investor conflict with our portfolio]
- [ ] [e.g. Deck is NDA-gated before first call]

## Response SLA

- P1: reply within 24h
- P2: reply within 72h
- P3: template reply within 1 week
- Pass: polite decline within 2 weeks
