---
name: learn
description: Capture a learning about how Fund OS behaved, and push the generalisable ones upstream to the Fund OS repository as a pull request. Use this skill when the user says "write that down", "we learned something", "capture this learning", "send learnings upstream", or after any skill produced the wrong output, needed manual rework, or surprised someone. Phase 00 (Setup). Fund-side only.
---

# Capture a learning

This skill is part of the **Fund OS** plugin, Phase 00 — Setup.

> This is the feedback loop that keeps Fund OS honest. Without it, every fund relearns the same
> lesson, the same skill goes wrong the same way next quarter, and the fix lives only in someone's
> head. The audit of 2026-08-11 found defects that had been silently producing wrong output for
> six weeks precisely because nobody had a place to write "this keeps going wrong".

## When to trigger

Run this skill when the user says any of:

- "write that down"
- "we learned something"
- "capture this learning"
- "send learnings upstream"
- `fund-os:learn`
- `fund-os:learn --upstream`

Also run it **on your own initiative** after:

- a skill produced output that had to be reworked by hand
- a skill did not fire when it should have, or fired when it should not have
- a number, score or template came out wrong
- the fund's own knowledge document turned out to be missing, stale or contradictory
- something took far longer than it should have

## Where learnings live

`~/.fund-os/learnings/YYYY-MM-DD-<slug>.md` — in the fund's own directory, not in the plugin.

Learnings arise in deal and LP sessions, not in a checkout of the plugin repository, so they must
be writable from wherever the work happens. Anything written inside the plugin is lost on the next
install.

---

## Mode A — capture (default)

### 1. Decide: learning or configuration?

The distinction people get wrong most often.

| | Learning | Configuration |
|---|---|---|
| Is | An observation about how the tooling behaved | A fact about this fund |
| Belongs in | `~/.fund-os/learnings/` | `~/.fund-os/user-config.json` or `~/.fund-os/knowledge/` |
| Example | "deal-startup-score kept scoring above 100" | "our ticket range is €250K–€1M" |

If it is a fact about the fund rather than about the tooling, stop — update the config or the
knowledge document instead, and say so.

### 2. Write it

`~/.fund-os/learnings/YYYY-MM-DD-<slug>.md`, from
`${CLAUDE_PLUGIN_ROOT}/templates/learning.md`.

Front matter, all fields required:

```yaml
scope:    fund | upstream
area:     sourcing | diligence | lp | portfolio | legal | reporting | tooling
severity: low | medium | high
```

### 3. Set the scope honestly

- **`fund`** — specific to this fund: our thesis, our CRM fields, our Drive layout, our process.
  It stays here as context for the next person working in this fund.
- **`upstream`** — this would happen to **any** fund using Fund OS. It belongs in the plugin.

When `scope: upstream`, the *What should change* section is mandatory and must name:

1. **Which file should change** — concretely enough to be pasted in.
2. **At which level:**

| Level | When |
|---|---|
| SKILL.md | The instruction was wrong, missing or ambiguous |
| Knowledge file | The methodology itself was wrong |
| Template | The output shape was wrong |
| `tools/validate.py` | The defect could have been caught mechanically before release |

Rule of thumb: if a validator check could have caught it, propose the check — a rule that a
machine enforces survives staff turnover; one that lives in a document does not.

---

## Mode B — upstream (`--upstream`)

Run at a version cut, or whenever upstream learnings have accumulated.

### 0. Consent — check before collecting anything

Read `learnings.contributeUpstream` from `~/.fund-os/user-config.json`:

- **`yes`** — proceed.
- **`ask`** *(default)* — show exactly what would be sent, then get explicit approval for this
  batch before anything leaves the fund.
- **`no`** — stop. Say that this fund keeps its learnings local and where the setting lives, so it
  can be changed deliberately rather than by accident.
- **missing** — treat as `ask`, and note that setup never recorded a choice.

**Never send without an answer here.**

### 1. Collect

Every file in `~/.fund-os/learnings/` with `scope: upstream` and no `submitted:` value. If there
are none, say so and stop.

### 2. Group and dedupe

Several learnings often point at the same fix. Group them — one proposed change per group, citing
every incident behind it. A change backed by three incidents is far more persuasive than three
separate pull requests.

### 3. Scrub — the repository is shared with other funds

**Upstreaming is disclosure.** The Fund OS repository is private, but it is shared with funds
outside this one. Check every group and refuse rather than guess:

- [ ] **No company names.** Not portfolio companies, not deals screened, not deals passed. A real
      company attached to a real score is the single most sensitive artefact this system produces.
      Generalise to the mechanism: *"a US Series B company"*, not the name.
- [ ] **No LP or investor names** tied to a score, a tier or a pipeline stage.
- [ ] **No identifiers.** Google Drive folder or file ids, CRM record ids, API keys, internal URLs.
- [ ] **No fund internals** that are not already public: fund economics, LP commitments,
      reserve strategy, valuations, NAV, personal data.
- [ ] **Stands alone.** If the fix only makes sense with our internal context, it is not
      generalisable — keep it `scope: fund`.

Report what was scrubbed or held back. A learning sent with a company name in it is a disclosure,
not a contribution.

### 4. Build the change

For each group, produce the concrete diff against the plugin:

```
plugins/fund-os/skills/<skill>/SKILL.md
plugins/fund-os/skills/<skill>/knowledge/<file>.md
plugins/fund-os/skills/<skill>/templates/<file>.md
tools/validate.py                                   (a check, if one could have caught it)
```

**A methodology change without a matching check in `validate.py` is incomplete** whenever a check
was possible. Run `python3 tools/validate.py` before opening the pull request; it must be green.

### 5. Open the pull request

```bash
gh repo clone steffenmaas/fund-os /tmp/fund-os-upstream
# branch: learning/<area>-<slug>
# copy the scrubbed learnings to docs/learnings/incoming/
# apply the proposed changes, add a CHANGELOG entry
# run: python3 tools/validate.py
gh pr create --repo steffenmaas/fund-os --title "learning(<area>): <what changes>" --body-file <body>
```

Body structure:

```markdown
## Incident
<What happened, how often, in which skill. Scrubbed. Link the learning files.>

## Proposed change
<The concrete change, ready to paste.>

## Level and why
<SKILL.md / knowledge / template / validator — and why that level.>

## Cost
<What does this make harder, slower or more verbose? Every rule has a cost; name it.>

## Verification
<validate.py green; new check added, and it fails on the old content.>
```

### 6. Mark as submitted

Write `submitted: <PR URL>` into the front matter of every learning included, so nothing is sent
twice.

### 7. Report

Which learnings went up, grouped how, into which changes, what was scrubbed, and the PR link.

---

## The rule about rules

**A rule is created after an incident, never preventively.** Preventive rules inflate the skills
without preventing anything, and a skill nobody finishes reading stops working — at which point
the instructions that do matter stop working too.

If you cannot name the incident, do not propose the change.

## Inputs

- The incident, in the user's words, or your own observation from the session just run

## Outputs

- `~/.fund-os/learnings/YYYY-MM-DD-<slug>.md`
- In `--upstream` mode: a pull request against `steffenmaas/fund-os`, and `submitted:` written back

## Required MCP capabilities

- None. Uses the Bash tool and the `gh` CLI.

## Human-in-the-loop

Nothing leaves the fund without an explicit answer to the consent check, and the scrub list is
applied to every group before anything is sent.

## Audit trail

After an upstream submission, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: learn@0.4.0
output_ref:    <PR URL>
rationale:     <N learnings upstreamed, grouped into M changes; what was scrubbed>
```

---

*Fund OS v0.4.0 · skill `learn`. This file is the source — edit it directly.*
