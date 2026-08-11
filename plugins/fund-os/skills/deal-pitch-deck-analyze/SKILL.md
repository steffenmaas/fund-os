---
name: deal-pitch-deck-analyze
description: Score a pitch deck across 10 dimensions, output structured feedback for the IC and the founder. Use this skill when the user says "analyse deck", "deck score", "pitch deck review" or any natural variant. Phase 03 (Due Diligence). Fund-side only.
---

# Deal Pitch Deck Analyze

Score a pitch deck across 10 dimensions, output structured feedback for the IC and the founder.

This skill is part of the **Fund OS** plugin, Phase 03 — Due Diligence.

## When to trigger

Run this skill when the user says any of:
- "analyse deck"
- "deck score"
- "pitch deck review"

## Key instructions

### 0. Load configuration
Resolve in this order, first hit wins:
```bash
cat ~/.fund-os/user-config.json
```
If neither exists, stop and say: *"Fund OS is not configured — run `fund-os:setup` first."* Do not continue with defaults.
Apply `brandGuidelines.tone` to all prose output. Note `storagePaths.rootFolderId`, `storagePaths.deals`, and `systems.crm` — these are used in later steps. From `knowledge.manifest`, load: `investment-hypothesis`, `investment-criteria`, `memo-template`. A document found via the Drive manifest always wins over the bundled copy.

---

### 1. Extract the full deck — MANDATORY binary extraction

**Never rely on Drive's text layer (`read_file_content`, `contentSnippet`, or search result snippets) to read a PPTX or PDF.** Drive's text extraction silently omits graphic-heavy slides (team slides, visual comparison slides) without warning or error. This produces scoring errors.

**Always extract via binary download + python-pptx:**

```bash
pip install python-pptx --break-system-packages -q
```

```python
import json, base64
from pptx import Presentation

# 1. Decode the binary from the Drive MCP download_file_content tool result
with open('<tool_result_path_from_drive_mcp>') as f:
    data = json.load(f)
raw = base64.b64decode(data['content'])
with open('/tmp/deck.pptx', 'wb') as f:
    f.write(raw)

# 2. Extract ALL slides — no slide is skipped
prs = Presentation('/tmp/deck.pptx')
print(f'Total slides: {len(prs.slides)}')
for i, slide in enumerate(prs.slides, 1):
    texts = []
    for shape in slide.shapes:
        if shape.has_text_frame:
            for para in shape.text_frame.paragraphs:
                t = para.text.strip()
                if t:
                    texts.append(t)
    if texts:
        print(f'\n=== SLIDE {i} / {len(prs.slides)} ===')
        print('\n'.join(texts))
```

**Slide count verification:** After extraction, confirm the slide count matches the deck's stated count (e.g. "22/22" visible on slides). If the extracted count is lower, explicitly flag missing slides in the Analysis Status section of the output.

**For PDF decks:** use `pdfplumber` or `pdftotext -layout` instead of python-pptx.

**Fallback only:** If the tool result file is inaccessible from the container, use `read_file_content` as a last resort — but then manually verify the slide count and note any gaps in the Analysis Status box.

---

### 2. Load knowledge documents
From `knowledge.manifest`, download and read:
- `investment-criteria` — O1 10-dimension scoring rubric, positive/negative signals, score interpretation table
- `investment-hypothesis` — O1 thesis, conviction pillars, geography mandate, dual-use rationale
- `memo-template` — blank DOCX output template (download binary, save to `/tmp/template.docx`)

---

### 3. Score the deck
Apply the O1 Venture Investmentkriterien (10 fixed dimensions):

| Dim | Category | Weight |
|---|---|---|
| 2.1 | Team | 20% |
| 2.2 | Market Opportunity | 15% |
| 2.3 | Problem–Solution Fit | 15% |
| 2.4 | Technology & Product | 15% |
| 2.5 | Business Model | 10% |
| 2.6 | Traction & Validation | 10% |
| 2.7 | Competition & Differentiation | 10% |
| 2.8 | Go-to-Market | 10% |
| 2.9 | Financial Planning & Use of Funds | 5% |
| 2.10 | Exit Potential | 5% |

Score each 0–10; cite the slide number(s). End with a numeric overall (0–100) and a recommendation: **INVEST / CONDITIONAL / WATCHLIST / REJECTED**.

Fill the `memo-template` DOCX with all scores and commentary.

---

### 4. Founder feedback
Priority-ranked, with [CRITICAL] / [HIGH] / [MEDIUM] tags.

---

### 5. Save output to the startup's deal folder in Google Drive

Save the completed investment note to the company's own subfolder under the Deals root, not to a generic output folder.

**Step A — Find or create the Deals root folder:**
```
search_files → query: "title = 'Deals' and parentId = '<storagePaths.rootFolderId>'"
```
- If found: note the Deals folder ID.
- If not found: create it:
  ```
  create_file → title: "Deals", mimeType: "application/vnd.google-apps.folder",
                parentId: <storagePaths.rootFolderId>
  ```

**Step B — Find or create the company subfolder:**
```
search_files → query: "title = '<CompanyName>' and parentId = '<DealsFolderID>'"
```
- If found: note the company folder ID.
- If not found: create it:
  ```
  create_file → title: "<CompanyName>", mimeType: "application/vnd.google-apps.folder",
                parentId: <DealsFolderID>
  ```

**Step C — Upload the investment note DOCX:**
```
create_file → title: "<CompanyName>_Investment_Note_EN_<YYYY-MM-DD>.docx"
              parentId: <CompanyFolderID>
              contentMimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disableConversionToGoogleType: true
              base64Content: <base64-encoded DOCX>
```

Note the returned file `viewUrl` — include it in the Attio evaluation entry and in the chat summary.

---

### 6. CRM — Attio

After scoring and saving, perform these steps using the Attio MCP (`systems.crm`). The Startups list slug is `vc_deal_flow` (object: `companies`).

**Step A — Look up company:**
```
search-records → object: "companies", query: <company name or domain>
```
- If found: note the `record_id`, skip to Step C.
- If not found: proceed to Step B.

**Step B — Create company record:**
```
create-record → object: "companies"
  values: { name: <company name>, domains: [<domain>], description: <one-line from deck> }
```

**Step C — Add to Startups list:**
```
add-record-to-list → list: "vc_deal_flow", parent_object: "companies", parent_record_id: <record_id>
```
If already in the list, catch the error and continue.

**Step D — Read existing evaluation (preserve history):**
Read the current `crmFields.startupSummary` value. If a prior evaluation exists, append it below the new one.

**Step E — Write score, evaluation, and stage:**
```
update-list-entry-by-record-id
  list: "vc_deal_flow"
  parent_object: "companies"
  parent_record_id: <record_id>
  entry_values:
    ai_investment_score: <total score as integer>
    crmFields.startupSummary: <formatted evaluation — see format below>
    deal_stage: "Screening"
```

**Evaluation text format:**
```
YYYY-MM-DD | Score: X / 100 | STATUS

<One-paragraph summary: thesis alignment, critical gaps, recommendation rationale.>
Drive: <viewUrl of the investment note DOCX>

--- Prior evaluations ---
<Prior content verbatim, if any>
```

**Step F:** Always set `deal_stage` to `"Screening"` after deck analysis.

---

## Inputs

- Deck PDF or PPTX (attached or from Google Drive — always use binary extraction)

## Outputs

| Artefact | Location |
|---|---|
| Investment Note DOCX | Google Drive: `rootFolder/Deals/<CompanyName>/<CompanyName>_Investment_Note_EN_<date>.docx` |
| Attio entry | `vc_deal_flow` list: score, evaluation, deal stage = Screening |

## Required MCP capabilities

- Drive (deck binary download; knowledge doc download; folder creation; DOCX upload)
- CRM / Attio (company lookup, create, list entry update)
- Web Search (market validation, competitive cross-check)
- Bash (python-pptx extraction, binary handling)

## Attio field reference (vc_deal_flow list)

| Field | API slug | Type | Notes |
|---|---|---|---|
| O1 Investment Score | `ai_investment_score` | number | Integer 0–100 |
| Investment evaluation | `crmFields.startupSummary` | text | Timestamped; append history; includes Drive link |
| Deal Stage | `deal_stage` | status | Set to `"Screening"` post-analysis |

## Knowledge references

- `investment-hypothesis` — O1 thesis, conviction pillars, dual-use rationale
- `investment-criteria` — O1 scoring rubric (10 dimensions, weights, signals)
- `memo-template` — blank DOCX in the O1 Investment Note format

## Human-in-the-loop

Analysis only — no investment decision. CRM and Drive writes are automatic after scoring.

## Audit trail

After successful execution, emit an entry via the `legal-audit-trail-write` skill:

```yaml
skill_version: deal-pitch-deck-analyze@0.5.0
output_ref:    <Drive viewUrl> | <Attio record ID>
rationale:     <company name> deck scored <score>/100 — <STATUS>; saved to Deals/<CompanyName>/ in Drive; Attio updated
```

---

*Fund OS v0.4.0 · Phase 03 — Due Diligence*
