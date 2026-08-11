---
scope:    fund | upstream
area:     sourcing | diligence | lp | portfolio | legal | reporting | tooling
severity: low | medium | high
date:     YYYY-MM-DD
skill:    <the fund-os skill involved, or "none">
---

# <One line: what went wrong, in plain words>

## What happened

<The incident. What was asked for, what came back, what had to be done by hand instead.
Be specific about the mechanism. If it happened more than once, say how often.>

## Why it happened

<The cause, as far as it is known. "Unknown" is an acceptable answer — a described symptom
with an honest "cause unclear" is more useful than a confident guess.>

## What we did instead

<The workaround, so the next person is not stuck for as long.>

## What should change

<Required when scope: upstream. Delete this section entirely when scope: fund.>

**File:** `plugins/fund-os/skills/<skill>/SKILL.md`
**Level:** SKILL.md | knowledge | template | validator

<The concrete change, written so it can be pasted in.>

**Could a check have caught this?** <yes/no. If yes, name the check — a rule a machine
enforces outlives the person who wrote it.>

**Cost:** <what this makes harder, slower or longer. Every rule has one.>

## Scrub check

<Required before this can be upstreamed. The repository is shared with other funds.>

- [ ] No company names — no portfolio companies, no deals screened or passed
- [ ] No LP or investor names tied to a score, tier or pipeline stage
- [ ] No identifiers — Drive ids, CRM record ids, keys, internal URLs
- [ ] No fund internals — economics, commitments, valuations, NAV, personal data
- [ ] Stands alone without our internal context

<!-- submitted: <PR URL>  — written by fund-os:learn --upstream, do not set by hand -->
