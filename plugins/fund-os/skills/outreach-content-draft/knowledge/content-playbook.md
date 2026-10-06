# Content playbook — TEMPLATE
#
# HOW TO USE: this is the shipped template, not a fund's playbook. Copy it as `content-playbook.md` into the fund's
# knowledge folder (Drive, or ~/.fund-os/knowledge/) and replace everything in `[square brackets]`. It is the one file
# the partners keep for content: who the fund writes for, which topics and formats on which channels. Every
# content-writing prompt (newsletter, digest, channel texts) reads that strategy part as a brief. The part under the
# level-1 heading "Newsletter" (search terms, press sources, settings) is NOT read by Fund OS yet: the CLIs only check
# its headings and nothing in it reaches a prompt or a search; the newsletter's themes and settings stay in the user
# configuration (`autopilot.newsletter.*`). Keep it only as a place for those notes; a later release may read it.
#
# Structure: every section is a level-2 heading (`##`); the names below are recognised (German names work too). A heading
# with another name is reported and ignored, never read as an instruction. List sections take bullets (`- ...`). Under
# Formats, every `###` heading is one format with `- key: value` bullets (Frequency, Channels, Audiences, Goal, Scope;
# any other key is kept as an extra). Lines above the first `##` are not read. The level-1 heading `# Newsletter: ...`
# starts the newsletter's part; everything above it is the strategy. An entry or value that is still nothing but
# `[square brackets]` is a placeholder and is ignored (it never becomes a theme, an audience, a principle or a format),
# so the unmodified template contributes nothing to a prompt.

## Goal

[One or two sentences: what the fund's content achieves, and for whom.]

## Audiences

- [Audience 1]: [what it needs from the fund's content]
- [Audience 2]: [what it needs]
- [Audience 3]

## Content pillars

- [Topic 1]
- [Topic 2]
- [Topic 3]

## Formats

### [Newsletter]

- Frequency: [for example every two weeks, Thursday]
- Channels: [Newsletter, company page, ...]
- Audiences: [which of the audiences above]
- Goal: [what one issue achieves]
- Scope: [for example editorial and 4 to 5 items]

### [Another format]

- Frequency: [...]
- Channels: [for example LinkedIn personal]
- Audiences: [...]
- Goal: [...]
- Scope: [...]

## Principles

- [Every number with a source and a date.]
- [No scores, no valuations, no names of companies in diligence in public texts.]
- [Tone and voice: see the tone guide.]

## KPIs

- [Newsletter: open rate]
- [LinkedIn: reach per post]

# Newsletter: sources and settings

NOT READ by Fund OS yet: this part is kept for a later release. Today the newsletter run takes its search, sources and
settings from the user configuration (`autopilot.newsletter.*`), and only the strategy above reaches a prompt.

## Editorial notes

[Free text for the editor: what to include, what to leave out.]

- [A rule, for example: no lifestyle topics.]

## Search terms

- [A web search query]
- [Another query]

## Press sources

- [https://news.example.org/section]

## Blocked domains

- [domain whose items are never collected]

## LinkedIn keywords

- [#keyword]

## Settings

- Language: [en]
- Window in days: [10]
