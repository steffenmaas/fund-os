# Operations screens

Five single-file HTML pages that give the partners one place to see the pipeline, approve what the autopilot proposes, and read the fund's own documents. They are published as **Claude artifacts** and call the viewer's own connectors (Attio, Gmail, Google Drive, Google Calendar) under the viewer's own login. Nothing here holds a secret, and nothing here names a fund: every fund-specific value sits in one `const CONFIG = { ... }` block at the top of each page's script.

They are the front end of the autopilot layer (`ops-*` skills, `tools/ops/`): the autopilot proposes, these screens are where a person approves, undoes and reads the feed.

| File | Screen | What it does | Connectors it calls |
|---|---|---|---|
| `deal-cockpit.html` | Deal Cockpit | The deal list ranked by score x urgency, with the three scores (Quality, Thesis Fit, Urgency), a scorecard drawer, and a "Score this deal" action. Moves a deal to another stage and writes a note, each after a confirmation, under the viewer's account. | Attio (read the deal list, write the six score fields, stage, notes); Google Drive (read the fund's thesis, criteria and scoring matrix); Claude `sample` for scoring |
| `investors.html` | Investor Relations | The LP pipeline as a status board and a table, with LP fit tiers and a next action per investor. Changes an investor's status and writes a note, each after a confirmation. | Attio |
| `inbox.html` | Inbox | Approvals (proposed mails, stage and status moves), Gmail intake, the autopilot switch per module, and the audit feed with undo. Keeps approvals and the audit trail in the artifact's own store (`db`). | Attio, Gmail (drafts only, never sends), artifact `db` |
| `knowledge.html` | Knowledge | Lists the documents in the fund's Drive knowledge folder, shows which scoring keys are the fund's own document and which fall back to the fund-neutral template, and renders any document. | Google Drive |
| `profile.html` | Profil | Who is signed in, which connectors this view reaches, the tool chosen per role and module, and what the agents may do without approval. | Attio, Gmail, Google Drive, Google Calendar, Granola (one harmless read tool each), artifact `db`, user |
| `newsletter.html` | Newsletter | **Follows.** The sixth screen (archive, editor, templates) is still being built and is not in this folder yet. When it lands it uses the same `CONFIG` and the same `LINKS`. |  |

The page text is German, as in the source pages; change the strings if your partners prefer another language. Comments inside the pure code regions still point at the source project's specs; they are explanations, not links you need.

## Capabilities to declare at publish

Each artifact must be published with exactly the capabilities below, or the connector calls are refused (`not_in_manifest`). They are the header comment of each file, copied here.

| Screen | `sample` | `db.rules` | `user` | `mcp.servers` (server: tools) |
|---|---|---|---|---|
| Deal Cockpit | `{}` | none | none | Attio: `list-records-in-list`, `get-records-by-ids`, `update-list-entry-by-id`, `create-note`. Google Drive: `search_files`, `download_file_content` |
| Investor Relations | `{}` | none | none | Attio: `list-records-in-list`, `get-records-by-ids`, `update-list-entry-by-id`, `create-note` |
| Inbox | `{}` | `[{path: "", read: "interact", write: "admin"}]` | scopes `[profile]` | Attio: `list-records-in-list`, `update-list-entry-by-id`, `search-records`, `upsert-record`, `add-record-to-list`. Gmail: `search_threads`, `get_thread`, `create_draft` |
| Knowledge | `{}` | none | none | Google Drive: `search_files`, `download_file_content`, `read_file_content` |
| Profil | `{}` | `[{path: "", read: "interact", write: "admin"}]` | scopes `[profile]` | Attio: `whoami`. Gmail: `list_labels`. Google Drive: `search_files`. Google Calendar: `list_calendars`. Granola: `get_account_info` |

With `write: "admin"`, only an editor of the artifact can write approvals and the audit trail: every partner who approves in the Inbox needs edit rights on that artifact, not just view rights.

## How to fill CONFIG

Open the page's script; the first thing in it is the `CONFIG` block, with a comment on every key. Edit nothing else. The keys the pages share:

| Key | What to put | Where to find it |
|---|---|---|
| `fundName` | The name shown in the side menu | Your `masterData.fundName` |
| `attioWorkspace` | The slug in your Attio URLs | `https://app.attio.com/<slug>/...` |
| `dealList`, `investorList` | The list slugs | `crmFields.dealList`, `crmFields.investorList` in `~/.fund-os/user-config.json`; or the Attio list settings |
| `fields.*`, `dealStageField`, `dealSourceField`, `investorStatusField` | List-entry attribute slugs | `crmFields.*`; or Attio, list settings, attribute, API slug |
| `stages`, `statuses`, `liveStages`, `passedStages`, `forbiddenStages`, ... | Stage and status titles, in pipeline order | The Attio status options of your lists. They must match **exactly**; a stage that is not in the list is shown but cannot be chosen |
| `companiesObjectId` (Inbox) | The id of the Attio `companies` object | Ask the Attio connector once for the `companies` object and copy its id |
| `driveFolderId` | The Drive folder with the fund's thesis, criteria and scoring matrix | The id at the end of the folder URL. Name the files `investment-thesis`, `evaluation-criteria`, `startup-scoring-matrix`, ... |
| `fundDescription`, `scoringLabel` (Deal Cockpit) | One clause for the scoring prompt, and the footer line of a written scorecard | Your own words, e.g. "a pre-seed/seed fund in <region> for <sector> software" |
| `scoreFields`, `investorFitFields`, `archivedFields`, `routines` (Profil) | Display-only lists for the rules table, and the Routine ids per module | `crmFields`, and the ids from the Routines view if you run the autopilot as Routines |
| `links` | The five side-menu URLs | See the next section; leave empty until every screen is published |

The stage and status names the examples ship with are common ones, not a recommendation. If a key is left empty the page loads but the Attio call for it fails with a visible error in the Diagnose panel.

## Order to publish

The side menu links the five screens to each other, and each URL exists only after its screen has been published once. So:

1. Fill `CONFIG` in all five pages **except** `links`.
2. Publish all five as new artifacts, each with its capabilities from the table above. Note the five URLs.
3. Paste the five URLs into `CONFIG.links` of **every** page (deals, investors, inbox, knowledge, profile), then republish each page to its own URL (read the artifact first, then update it).
4. Open the Profil screen and press "Neu prüfen" on each connector; approve the connector permissions once per partner.

An empty link renders as a disabled entry marked "folgt" in the Profil screen and a dead link in the side menu; nothing breaks.

## What must not drift

Keep the pure code regions identical to this folder's copies when you edit: `parseAttioText` (Attio answers in a YAML-like text, not JSON), the scoring mirror (`// ==== scoring-mirror:begin`, the same arithmetic as `tools/ops/deal-score-cli.mjs`), the knowledge and scorecard regions, the Inbox `guards` and `autopilot` regions, and the Profil `tools` region. A few lines inside them read `CONFIG` instead of a literal (the folder id, the fund line of the prompt, the footer label, the six score slugs, the forbidden stages and statuses, the routine ids); everything else is the source text, unchanged.

`bash tools/check-screen-templates.sh` checks each page: the script parses (`node --check`), `CONFIG` is declared exactly once, and the page names no fund.
