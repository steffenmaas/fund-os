# Autopilot CLIs

The executable guardrails the `ops-*` skills call. A scheduled session is the model; these files are the arithmetic and the rules: scoring totals, bands and the action table, the pitch deck as untrusted evidence, the mail and invite checks, the switch and the daily gate, the stage and status moves an agent may make, the newsletter layout, the matching and checks of a meeting note, the ranking and checks of the Monday digest. No dependencies beyond Node 18 or later, no network, nothing about one fund inside them.

## Pointing them at your configuration

Every fund value (sender name, booking link, list and field slugs, stage and status names, allowed link hosts, thesis paragraph, deck link, partner addresses) comes from `~/.fund-os/user-config.json`, under the `autopilot.*` keys named in each skill's configuration table, plus `masterData.fundName` and `crmFields.*`. Which Inbox store a module reads and writes is resolved per module (`autopilot.stores.<module>`, else `autopilot.inboxStore`) by `deal-score-cli.mjs store-url`.

| To use a different file | How |
|---|---|
| Once | `--config <path>` on the command (where a command takes one) |
| For a shell or a Routine | `export FUND_OS_CONFIG=<path>` |
| Default | `~/.fund-os/user-config.json` |

`--config` wins over `FUND_OS_CONFIG`, which wins over the default. A missing file, or a missing `autopilot` section, stops the command with exit 1 and "run fund-os:setup first". `tools/ops/fixtures/user-config.example.json` shows every key with invented values.

The skills call the CLIs as `node "$OPS_CLI/<name>.mjs"`; set `OPS_CLI` to this directory of your Fund OS checkout, for example `export OPS_CLI=~/src/fund-os/tools/ops`. The plugin bundle does not carry `tools/`, so the checkout is the install.

## Subcommands

Exit codes: **0** the command ran and, for the checks, printed `OK`; **1** a check refused (one `FAIL:` reason per line on stdout, or one reason per line for `check-issue`) or an input or the configuration could not be read; **2** unknown subcommand in `deal-score-cli.mjs`, `investor-cli.mjs`, `notes-cli.mjs` and `digest-cli.mjs` (`newsletter-cli.mjs` uses exit 1 for that too).

| CLI | Subcommand | What it guards | Exit |
|---|---|---|---|
| `deal-score-cli.mjs` | `prompt` | Builds the scoring prompt: the fund's documents (cut to fit 60 kB, the first line names the cut), the fixed rubrics, the CRM record fenced as data; with `--deck` the deck text in a second fenced block (`DECK (untrusted, ...)`, cut at 60 000 characters, which cannot close its own fence); an image-only deck is refused | 0, or 1 on unreadable input |
| | `assemble` | Pins the model's points to the caps, sums the totals, derives bands, the action and the urgency expiry; writes `entry_values.json` under the `crmFields` slugs (an empty slug disables that write, an archived slug stops the command); "Pitch deck screening" stands only with `--deck`, else it is downgraded to "First screening" and `result.json` says so | 0, or 1 on a wrong number of dimensions |
| | `reply-prompt` | Builds the reply prompt for a founder mail (with `--deck` the same fenced block); refuses a purpose outside `autopilot.purposes.dealflow`; scores never reach the mail | 0, or 1 |
| | `extract-deck` | Decodes the base64url `raw` field of a Gmail RAW answer, walks the MIME parts and writes every PDF or PPTX of 50 kB or more (file names reduced to `[A-Za-z0-9._-]`, inline images ignored); malformed base64url writes nothing | 0 prints the files, 1 |
| | `deck-text` | `pdftotext -layout` on a PDF (no shell), cut at 60 000 characters, `deck.txt` plus a sidecar with pages, characters and `imageOnly`; refuses a file that is no PDF, a missing `pdftotext`, a PDF without any text | 0 prints the counts, 1 |
| | `store-url` | The Inbox store of one module: `autopilot.stores.<module>`, else `autopilot.inboxStore` (the older `autopilot.inboxStoreUrl` is still read); a placeholder counts as unset | 0 prints the URL, 1 |
| | `check-mail` | One expected recipient, no cc/bcc, purpose allowed, no repeat inside `autopilot.noRepeatDays`, sender name and booking link present, no score quoted, every link host on `autopilot.allowedUrlHosts`, a decline needs evidence, a form lead is draft only | 0 `OK`, 1 `FAIL:` lines |
| | `extract-recipient` | The reply address is the From header of the newest inbound message (never Reply-To, never the body); a form notification yields the address in its subject | 0 prints JSON, 1 |
| | `switch` | Reads `settings/autopilot` the way the Inbox store does: unknown mode or module is `off`, a missing cap is `autopilot.defaultCap`; `--require-pinned` refuses `on` on a branch when `autopilot.onRequiresPinnedSha` is true | 0 prints JSON, 1 |
| | `gate` | Mode `on`, the daily cap, one reply per thread per 24 h, the no-repeat window, all read from the audit export; `--token-out` writes the one-send token | 0 `OK`, 1 `FAIL:` lines |
| | `check-write` | Which stage and status moves an agent may make: `stages.new` to `stages.screening`; `statuses.target` to `statuses.outreach`; `target` or `outreach` to `statuses.callBooked`; never into a committed stage or status; the passive status only as an approval; scores only on entries still in the first two stages | 0 `OK`, 1 `FAIL:` lines |
| `investor-cli.mjs` | `lp-prompt` | Builds the LP scoring prompt; the LP matrix is required | 0, or 1 |
| | `lp-assemble` | Pins eight dimensions, sums to the raw total, normalises over 120, derives tier and action; a non-investor gets a flag and no `entry_values.json` | 0, or 1 on a wrong number of dimensions |
| | `next-step` | The daily decision per investor: no mail on do-not-contact, committed or passive status, or a missing follow-up count; a decline reply stops outreach; first touch above `fitThreshold`; follow-ups after `quietDays`; the last bump after `maxFollowUps` | 0 prints JSON, 1 |
| | `outreach-prompt` | Builds the outreach prompt; a first touch is refused while `autopilot.investors.deckLink` is empty or a placeholder | 0, or 1 |
| | `check-mail` | The `deal-score-cli.mjs check-mail` rules, plus the booking link and the deck link in a first touch | 0 `OK`, 1 `FAIL:` lines |
| | `check-invite` | A calendar invite has exactly the expected attendee, a short title, allowed link hosts, and starts 1 to 30 days out | 0 `OK`, 1 `FAIL:` lines |
| | `classify` | Organisation type and geography fit (`core`, `adjacent`, `out-of-scope`) from `autopilot.investors.geographies`; extra signals from the optional `autopilot.investors.signalKeywords` | 0 prints JSON, 1 |
| `notes-cli.mjs` | `parse-granola` | Turns a Granola `list_meetings` / `get_meetings` answer into meetings; a summary that forges markup (text between blocks, an unclosed block, a duplicate id or attribute, `<`, `>` or `id=` in an attribute, more blocks than declared) empties the answer and says why | 0 prints `{meetings, skipped, suspicious?}` |
| | `match` | A meeting against the CRM records already searched: `domain`, `attendee`, `title` (name overlap of 0.6 or more) or `none`; the fund's own domains are never matched; `ownParticipant` says someone of the fund besides the note creator was in the room | 0 prints JSON, 1 |
| | `note-prompt` | Builds the drafting prompt; the meeting is fenced as data | 0, or 1 |
| | `check-note` | Summary 40 to 1 500 characters, at most 8 next steps, 12 decisions, 12 questions, dues 1 to 60 days out, no email address, URL, markdown link or image, HTML tag or phone number (after folding look-alike characters), the same for the meeting title (`--meeting`), a proposed status only from `autopilot.crm.stageList` / `statusList` and never a committed one | 0 `OK`, 1 `FAIL:` lines |
| | `note-body`, `note-title` | The Markdown body and the note title (`<title> — <Mon D, YYYY>`); the link to the meeting notes only on `granola.ai` or an allowed host; a title carrying an address, link, number or markup is refused | 0, or 1 |
| | `tasks` | One create-task payload per next step; `--record` and `--assignee` must be lower-case uuids, `--object` companies or people | 0 prints JSON, 1 |
| | `recheck` | The switch read twice: `SAME <mode>`, or `CHANGED: <why>` when the mode or `updatedAt` differs (the run continues as `off`) | 0, or 1 |
| `digest-cli.mjs` | `rank` | Ranks the deal list as the Deal Cockpit does (score x urgency, thesis fit standing in for a missing quality, passes never rank, attention first); the arithmetic is the cockpit template's `// region:rank`, byte for byte | 0 prints JSON, 1 |
| | `digest-prompt` | Builds the drafting prompt; the deal briefs are fenced as data | 0, or 1 |
| | `check-digest` | At most `autopilot.digest.maxPicks` picks, each a ranked name, no score number, stage name or valuation in the co-investor text, no company in a confidential stage on LinkedIn, no email address, every link host allowed | 0 `OK`, 1 `FAIL:` lines |
| `newsletter-cli.mjs` | `collect-prompt` | Builds the drafting prompt from `autopilot.newsletter.themes`, `windowDays` and `language`; collected items fenced as data | 0, or 1 |
| | `check-issue` | 3 to 5 items (1 to 2 only with `--allow-thin`), every item inside the date window, https links only, no score, address or phone number in the text, one call to action whose host is allowed (with `--config`), item links only from `--items` | 0 `OK`, 1 reasons |
| | `render` | Escapes every string, takes only https links, keeps `{{unsubscribeUrl}}` and `{{postalAddress}}` for the newsletter service; writes `issue.html` and `issue.txt` | 0, or 1 |

Keys beyond the ones the skills name, all optional and listed in the skills' configuration tables: `autopilot.allowedUrlHosts` (the link allowlist; the booking-link and deck-link hosts are added automatically), `autopilot.onRequiresPinnedSha`, `autopilot.investors.signalKeywords`, `autopilot.notes.timezone`, `autopilot.digest.confidentialStages`.

## Checking them

```bash
bash tools/check-ops-tools.sh
bash tools/check-screen-templates.sh   # includes tools/check-digest-mirror.mjs
```

The first runs `node --check` on every file, the scoring arithmetic, one happy-path invocation per subcommand against `tools/ops/fixtures/` with `FUND_OS_CONFIG` pointing at the example configuration, and the invocations that must be refused with exit 1 (a forged meeting tag, an address, number or link in a note, a task for a record that is no uuid, a digest with too many picks, a company in diligence on LinkedIn or a score number, a malformed deck). `deck-text` runs on the fixture PDF when `pdftotext` (poppler-utils) is installed and otherwise checks that it refuses with its reason. It reads no real fund configuration and writes only to a temporary directory. The fixtures are invented: no real company, person or address.
