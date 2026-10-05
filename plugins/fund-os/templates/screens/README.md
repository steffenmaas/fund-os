# Operations screens

Six single-file HTML pages that give the partners one place to see the pipeline, approve what the autopilot proposes, and read the fund's own documents. They are published as **Claude artifacts** and call the viewer's own connectors (Attio, Gmail, Google Drive, Google Calendar) under the viewer's own login. Nothing here holds a secret, and nothing here names a fund: every fund-specific value sits in one `const CONFIG = { ... }` block at the top of each page's script.

They are the front end of the autopilot layer (`ops-*` skills, `tools/ops/`): the autopilot proposes, these screens are where a person approves, undoes and reads the feed.

| File | Screen | What it does | Connectors it calls |
|---|---|---|---|
| `deal-cockpit.html` | Deal Cockpit | Four tabs. **Deals:** the deal list ranked by score x urgency, with the three scores (Quality, Thesis Fit, Urgency), a scorecard drawer, and a "Score this deal" action; moves a deal to another stage and writes a note, each after a confirmation. **Aufgaben:** the open Attio tasks per deal, added and completed from the drawer. **Inbox** and **Autopilot:** the deal domain's approvals, the autopilot switch and the feed with undo, in the page itself on its own store (`db`), with the same checks as the Inbox screen. On a phone the side menu sits behind a burger. | Attio (read the deal list, write the six score fields, stage, notes, tasks); Google Drive (read the fund's thesis, criteria and scoring matrix); Gmail (drafts only); Claude `sample` for scoring; artifact `db` |
| `investors.html` | Investor Relations | The LP pipeline as a status board and a table, with LP fit tiers and a next action per investor. Changes an investor's status, writes a note and adds or completes a task, each after a confirmation. Full-screen drawer on a phone. | Attio |
| `inbox.html` | Inbox | Approvals (mails, deal stage, investor status, newsletter, task, note) with a drawer on the phone and a record filter (`#record=<id>`), Gmail intake, the autopilot switch per module (dealflow, investors, newsletter, notes) and the audit feed with undo. Keeps approvals and the audit trail in the artifact's own store (`db`). | Attio, Gmail (drafts only, never sends), artifact `db` |
| `knowledge.html` | Knowledge | Lists the documents in the fund's Drive knowledge folder, shows which scoring keys are the fund's own document and which fall back to the fund-neutral template, and renders any document. | Google Drive |
| `profile.html` | Profil | Who is signed in, which connectors this view reaches, the tool chosen per role and per module (dealflow, investors, newsletter, shared) with its live connection status and the alternatives, and what the agents may do without approval. | Attio, Gmail, Google Drive, Google Calendar, Granola (one harmless read tool each), artifact `db`, user |
| `newsletter.html` | Newsletter | The archive of issues (draft, approved, sent), an editor with a live preview, the fund's templates read from the Drive knowledge folder (`newsletter-template*.html`, with preview thumbnails) and the hand-over as a Gmail draft to the partners. Nothing is sent by the page. Issues are kept in the artifact's own store (`db`). | Google Drive, Gmail (drafts only), artifact `db` |

The page text is German, as in the source pages; change the strings if your partners prefer another language. Comments inside the pure code regions still point at the source project's specs; they are explanations, not links you need.

## Capabilities to declare at publish

Each artifact must be published with exactly the capabilities below, or the connector calls are refused (`not_in_manifest`). They are the header comment of each file, copied here.

| Screen | `sample` | `db.rules` | `user` | `mcp.servers` (server: tools) |
|---|---|---|---|---|
| Deal Cockpit | `{}` | `[{path: "", read: "interact", write: "admin"}]` | scopes `[profile]` | Attio: `list-records-in-list`, `get-records-by-ids`, `update-list-entry-by-id`, `create-note`, `list-tasks`, `create-task`, `update-task`, `list-workspace-members`. Google Drive: `search_files`, `download_file_content`. Gmail: `create_draft` |
| Investor Relations | none | none | scopes `[profile]` | Attio: `list-records-in-list`, `get-records-by-ids`, `update-list-entry-by-id`, `create-note`, `list-tasks`, `create-task`, `update-task`, `list-workspace-members` |
| Inbox | `{}` | `[{path: "", read: "interact", write: "admin"}]` | scopes `[profile]` | Attio: `list-records-in-list`, `update-list-entry-by-id`, `search-records`, `upsert-record`, `add-record-to-list`, `create-note`, `create-task`. Gmail: `search_threads`, `get_thread`, `create_draft` |
| Knowledge | `{}` | none | none | Google Drive: `search_files`, `download_file_content`, `read_file_content` |
| Profil | `{}` | `[{path: "", read: "interact", write: "admin"}]` | scopes `[profile]` | Attio: `whoami`. Gmail: `list_labels`. Google Drive: `search_files`. Google Calendar: `list_calendars`. Granola: `get_account_info` |
| Newsletter | `{}` | `[{path: "", read: "interact", write: "admin"}]` | scopes `[profile]` | Google Drive: `search_files`, `download_file_content`. Gmail: `create_draft` |

With `write: "admin"`, only an editor of the artifact can write approvals and the audit trail: every partner who approves in the Inbox (or in the Deal Cockpit's Inbox tab), changes the tool choice in the Profil or edits an issue in the Newsletter needs edit rights on that artifact, not just view rights.

## How to fill CONFIG

Open the page's script; the first thing in it is the `CONFIG` block, with a comment on every key. Edit nothing else. The keys the pages share:

| Key | What to put | Where to find it |
|---|---|---|
| `fundName` | The name shown in the side menu | Your `masterData.fundName` |
| `attioWorkspace` | The slug in your Attio URLs | `https://app.attio.com/<slug>/...` |
| `dealList`, `investorList` | The list slugs | `crmFields.dealList`, `crmFields.investorList` in `~/.fund-os/user-config.json`; or the Attio list settings |
| `fields.*`, `dealStageField`, `dealSourceField`, `investorStatusField` | List-entry attribute slugs | `crmFields.*`; or Attio, list settings, attribute, API slug |
| `stages`, `statuses`, `liveStages`, `passedStages`, `forbiddenStages`, ... | Stage and status titles, in pipeline order | The Attio status options of your lists. They must match **exactly**; a stage that is not in the list is shown but cannot be chosen |
| `companiesObjectId` (Inbox, Deal Cockpit) | The id of the Attio `companies` object | Ask the Attio connector once for the `companies` object and copy its id |
| `driveFolderId`, `driveFolderName` | The Drive folder with the fund's thesis, criteria, scoring matrix and newsletter templates, and its name for the connection line | The id at the end of the folder URL. Name the files `investment-thesis`, `evaluation-criteria`, `startup-scoring-matrix`, `newsletter-template.html`, ... |
| `fundDescription`, `scoringLabel` (Deal Cockpit) | One clause for the scoring prompt, and the footer line of a written scorecard | Your own words, e.g. "a pre-seed/seed fund in <region> for <sector> software" |
| `scoreFields`, `investorFitFields`, `archivedFields`, `routines`, `locale` (Profil) | Display-only lists for the rules table, the Routine ids per module (the tools catalogue of the page reads them), and the default language and time zone | `crmFields`, and the ids from the Routines view if you run the autopilot as Routines |
| `newsletterFooter` (Newsletter) | The sender line in the footer of an issue and of its text version; `fundName` also names the header band of the built-in template | Your own words, e.g. the fund's name |
| `intakeStage`, `intakeSource`, `ackReplyDays`, `gmailQuery` (Inbox) | The stage and source a mail taken from Gmail gets, the working days promised in the acknowledgement draft, the default Gmail search | Your own pipeline |
| `links` | The six side-menu URLs | See the next section; leave empty until every screen is published |

The stage and status names the examples ship with are common ones, not a recommendation. If a key is left empty the page loads but the Attio call for it fails with a visible error in the Diagnose panel.

## Order to publish

The side menu links the six screens to each other, and each URL exists only after its screen has been published once. So:

1. Fill `CONFIG` in all six pages **except** `links`.
2. Publish all six as new artifacts, each with its capabilities from the table above. Note the six URLs.
3. Paste the six URLs into `CONFIG.links` of **every** page (deals, investors, inbox, knowledge, newsletter, profile), then republish each page to its own URL (read the artifact first, then update it).
4. Open the Profil screen and press "Neu prüfen" on each connector; approve the connector permissions once per partner.

An empty link renders as a disabled entry marked "folgt" in the Profil screen and a dead link in the side menu; nothing breaks.

## What must not drift

Keep the pure code regions identical to this folder's copies when you edit: `parseAttioText` (Attio answers in a YAML-like text, not JSON), the scoring mirror (`// ==== scoring-mirror:begin`, the same arithmetic as `tools/ops/lib/scoring.mjs`), the knowledge and scorecard regions, the rank region (`// region:rank`, mirrored byte for byte in `tools/ops/digest-cli.mjs`), the task region (`// region:tasks`, the same in the Deal Cockpit and Investor Relations), the Inbox `guards` region (the same in the Inbox and the Deal Cockpit) and `autopilot` regions, the Newsletter render grammar (`// ==== newsletter-render:begin`) and the Profil `tools` region. A few lines inside them read `CONFIG` instead of a literal (the folder id, the fund line of the prompt, the footer label, the six score slugs, the rank region's field slugs and rejected stage, the forbidden stages and statuses, the routine ids, the newsletter footer and header band); everything else is the source text, unchanged.

`bash tools/check-screen-templates.sh` checks the folder:

- each page: the script parses (`node --check`), `CONFIG` is declared exactly once, and the page names no fund;
- the scoring mirror against `tools/ops/lib/scoring.mjs` (`tools/check-scoring-mirror.mjs`);
- the rank region against `tools/ops/digest-cli.mjs`, and both on the digest fixtures (`tools/check-digest-mirror.mjs`);
- the Inbox `guards` region byte-identical in `inbox.html` and `deal-cockpit.html`, and the `region:tasks` region byte-identical in `deal-cockpit.html` and `investors.html`: fix a copy, fix them all;
- that exactly these six pages are in the folder.
