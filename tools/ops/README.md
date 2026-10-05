# Autopilot CLIs

The executable guardrails the four `ops-*` skills call. A scheduled session is the model; these files are the arithmetic and the rules: scoring totals, bands and the action table, the mail and invite checks, the switch and the daily gate, the stage and status moves an agent may make, the newsletter layout. No dependencies beyond Node 18 or later, no network, nothing about one fund inside them.

## Pointing them at your configuration

Every fund value (sender name, booking link, list and field slugs, stage and status names, allowed link hosts, thesis paragraph, deck link, partner addresses) comes from `~/.fund-os/user-config.json`, under the `autopilot.*` keys named in each skill's configuration table, plus `masterData.fundName` and `crmFields.*`.

| To use a different file | How |
|---|---|
| Once | `--config <path>` on the command (where a command takes one) |
| For a shell or a Routine | `export FUND_OS_CONFIG=<path>` |
| Default | `~/.fund-os/user-config.json` |

`--config` wins over `FUND_OS_CONFIG`, which wins over the default. A missing file, or a missing `autopilot` section, stops the command with exit 1 and "run fund-os:setup first". `tools/ops/fixtures/user-config.example.json` shows every key with invented values.

The skills call the CLIs as `node "$OPS_CLI/<name>.mjs"`; set `OPS_CLI` to this directory of your Fund OS checkout, for example `export OPS_CLI=~/src/fund-os/tools/ops`. The plugin bundle does not carry `tools/`, so the checkout is the install.

## Subcommands

Exit codes: **0** the command ran and, for the checks, printed `OK`; **1** a check refused (one `FAIL:` reason per line on stdout, or one reason per line for `check-issue`) or an input or the configuration could not be read; **2** unknown subcommand in `deal-score-cli.mjs` and `investor-cli.mjs` (`newsletter-cli.mjs` uses exit 1 for that too).

| CLI | Subcommand | What it guards | Exit |
|---|---|---|---|
| `deal-score-cli.mjs` | `prompt` | Builds the scoring prompt: the fund's documents (cut to fit 60 kB, the first line names the cut), the fixed rubrics, the CRM record fenced as data | 0, or 1 on unreadable input |
| | `assemble` | Pins the model's points to the caps, sums the totals, derives bands, the action and the urgency expiry; writes `entry_values.json` under the `crmFields` slugs (an empty slug disables that write, an archived slug stops the command) | 0, or 1 on a wrong number of dimensions |
| | `reply-prompt` | Builds the reply prompt for a founder mail; refuses a purpose outside `autopilot.purposes.dealflow`; scores never reach the mail | 0, or 1 |
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
| `newsletter-cli.mjs` | `collect-prompt` | Builds the drafting prompt from `autopilot.newsletter.themes`, `windowDays` and `language`; collected items fenced as data | 0, or 1 |
| | `check-issue` | 3 to 5 items (1 to 2 only with `--allow-thin`), every item inside the date window, https links only, no score, address or phone number in the text, one call to action whose host is allowed (with `--config`), item links only from `--items` | 0 `OK`, 1 reasons |
| | `render` | Escapes every string, takes only https links, keeps `{{unsubscribeUrl}}` and `{{postalAddress}}` for the newsletter service; writes `issue.html` and `issue.txt` | 0, or 1 |

Keys beyond the ones the skills name, all optional and listed in the skills' configuration tables: `autopilot.allowedUrlHosts` (the link allowlist; the booking-link and deck-link hosts are added automatically), `autopilot.onRequiresPinnedSha`, `autopilot.investors.signalKeywords`.

## Checking them

```bash
bash tools/check-ops-tools.sh
```

Runs `node --check` on every file, the scoring arithmetic, one happy-path invocation per subcommand against `tools/ops/fixtures/` with `FUND_OS_CONFIG` pointing at the example configuration, and a few invocations that must be refused with exit 1. It reads no real fund configuration and writes only to a temporary directory. The fixtures are invented: no real company, person or address.
