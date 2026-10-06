#!/usr/bin/env node
/**
 * Checks for tools/ops/contacts-cli.mjs, run by tools/check-ops-tools.sh (node tools/check-contacts-cli.mjs).
 *
 * Every command runs as a child process, the way a session runs it, against the invented fixtures in tools/ops/fixtures/contacts/
 * and the example configuration. The spreadsheet is built here at run time with a tiny zip writer (stored and deflated entries), so
 * no binary is committed, and the CRM record ids of the fixtures are @@tokens@@ made into uuids here, so no id-shaped value is kept
 * in the repository. Exit 0 when every check holds, 1 with one line per failed check.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as zlib from "node:zlib";
import * as CC from "./ops/contacts-cli.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CLI = resolve(ROOT, "tools/ops/contacts-cli.mjs");
const DEAL = resolve(ROOT, "tools/ops/deal-score-cli.mjs");
const FIX = resolve(ROOT, "tools/ops/fixtures/contacts");
const TONE = resolve(ROOT, "tools/ops/fixtures/docs/tone-guide.md");
const CFG = resolve(ROOT, "tools/ops/fixtures/user-config.example.json");
const real = JSON.parse(readFileSync(CFG, "utf8"));
const NOW = "2026-10-06T12:00:00Z";
const out = mkdtempSync(resolve(tmpdir(), "contacts-cli-"));
process.on("exit", () => { try { rmSync(out, { recursive: true, force: true }); } catch { /* temp directory */ } });

let checks = 0, failures = 0;
const fail = (msg) => { failures++; console.error(`  FAIL  ${msg}`); };
const eq = (got, want, what) => { checks++; if (JSON.stringify(got) !== JSON.stringify(want)) fail(`${what}\n        got:  ${JSON.stringify(got)?.slice(0, 400)}\n        want: ${JSON.stringify(want)?.slice(0, 400)}`); };

const run = (...args) => spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, env: { ...process.env, FUND_OS_CONFIG: CFG } });
const put = (name, value) => { const f = resolve(out, name); writeFileSync(f, typeof value === "string" || Buffer.isBuffer(value) ? value : JSON.stringify(value)); return f; };
const json = (r, what) => { eq(r.status, 0, `${what}: exit status (stderr: ${r.stderr.trim().slice(0, 300)})`); try { return JSON.parse(r.stdout); } catch { fail(`${what}: stdout is not JSON`); return {}; } };
const notIntact = (r, what) => eq([r.status, r.stderr.startsWith("FAIL: the saved answer is not intact ("), r.stdout], [1, true, ""], `${what}: exit 1, "FAIL: the saved answer is not intact (…)", nothing on stdout (stderr: ${r.stderr.trim().slice(0, 200)})`);
const failsWith = (r, text, what) => eq([r.status, r.stderr.startsWith("FAIL: ") && r.stderr.includes(text), r.stdout], [1, true, ""], `${what}: exit 1 and "FAIL: … ${text}" (stderr: ${r.stderr.trim().slice(0, 200)})`);

// The CRM answers of the fixtures carry @@name@@ for every record id; each becomes a uuid made from the name.
const uuidOf = (token) => { const h = createHash("sha1").update(`fixture:${token}`).digest("hex"); return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`; };
const render = (name) => put(name, readFileSync(resolve(FIX, name), "utf8").replace(/@@([\w-]+)@@/g, (_m, t) => uuidOf(t)));
const ID = (t) => uuidOf(t);

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const answerOf = (buf, mimeType = XLSX, title = "Participants.xlsx", id = "FileId_0123456789") => ({ content: buf.toString("base64"), id, mimeType, title });
const makeZip = (entries) => {
  const chunks = [], cds = [];
  let off = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name), raw = Buffer.from(e.data), crc = zlib.crc32(raw);
    const comp = e.method === 8 ? zlib.deflateRawSync(raw) : raw;
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(e.method, 8); lh.writeUInt16LE(0x21, 12);
    lh.writeUInt32LE(crc, 14); lh.writeUInt32LE(comp.length, 18); lh.writeUInt32LE(raw.length, 22); lh.writeUInt16LE(name.length, 26);
    chunks.push(lh, name, comp);
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(e.method, 10); cd.writeUInt16LE(0x21, 14);
    cd.writeUInt32LE(crc, 16); cd.writeUInt32LE(comp.length, 20); cd.writeUInt32LE(raw.length, 24); cd.writeUInt16LE(name.length, 28); cd.writeUInt32LE(off, 42);
    cds.push(cd, name);
    off += 30 + name.length + comp.length;
  }
  const cdBuf = Buffer.concat(cds), eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(entries.length, 8); eocd.writeUInt16LE(entries.length, 10); eocd.writeUInt32LE(cdBuf.length, 12); eocd.writeUInt32LE(off, 16);
  return Buffer.concat([...chunks, cdBuf, eocd]);
};
const NS = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const SHARED = `<?xml version="1.0"?><sst ${NS} count="10" uniqueCount="10">` + [
  "<si><t>Example Event 2026</t></si>", "<si><t>Participants Name</t></si>", "<si><t>Role / Organisation</t></si>", "<si><t>LinkedIn</t></si>", "<si><t>Email</t></si>",
  "<si><t>Tara Nolan</t></si>", "<si><t>Managing Partner at Bayview Capital (Springfield)</t></si>",
  '<si><r><t>Ines</t></r><r><rPr><b/></rPr><t xml:space="preserve"> Ravel</t></r></si>', "<si><t>Gründerin bei Ravel Drives</t></si>",
  '<si><t>Alex</t><rPh sb="0" eb="1"><t>ignored</t></rPh></si>',
].join("") + "</sst>";
const inl = (ref, text) => `<c r="${ref}" t="inlineStr"><is><t>${text}</t></is></c>`;
const shr = (ref, i) => `<c r="${ref}" t="s"><v>${i}</v></c>`;
const SHEET = `<?xml version="1.0"?><worksheet ${NS}><sheetData>` + [
  `<row r="1">${shr("A1", 0)}</row>`,
  `<row r="3">${shr("A3", 1)}${shr("B3", 2)}${shr("C3", 3)}${shr("D3", 4)}${inl("E3", "Bring guest")}</row>`,
  `<row r="4">${shr("A4", 5)}${shr("B4", 6)}${inl("C4", "https://www.linkedin.com/in/Tara-Nolan-Example/")}<c r="E4" t="b"><v>1</v></c>${inl("AA4", "far right")}</row>`,
  `<row r="5">${shr("A5", 7)}${shr("B5", 8)}${inl("D5", "ines.ravel@ravel.example.com")}</row>`,
  `<row r="6">${inl("A6", "Piet de Boer")}${inl("B6", "Fish &amp; Chips Ltd")}<c r="D6" t="str"><f>"x"</f><v>Piet.deBoer@fishchips.example.com</v></c></row>`,
  `<row r="7">${shr("A7", 9)}<c r="D7"><v>42</v></c></row>`,
  `<row r="9">${inl("A9", "Zoe Ash")}${inl("B9", "CTO at Examplo AB")}${inl("D9", "zoe.ash@examplo.example.net, ZOE@Examplo.example.net")}</row>`,
].join("") + "</sheetData></worksheet>";
const DECOY = `<?xml version="1.0"?><worksheet ${NS}><sheetData><row r="1">${inl("A1", "Name")}${inl("B1", "Foo")}</row><row r="2">${inl("A2", "Decoy Person")}${inl("B2", "x")}</row></sheetData></worksheet>`;
const WORKBOOK = `<?xml version="1.0"?><workbook ${NS}><sheets><sheet name="Lists" sheetId="1" state="hidden" r:id="rId2"/><sheet name="Participants" sheetId="2" r:id="rId1"/></sheets></workbook>`;
const RELS = '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="x" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="x" Target="/xl/worksheets/sheet2.xml"/></Relationships>';
const parts = [
  { name: "[Content_Types].xml", data: '<?xml version="1.0"?><Types xmlns="x"/>', method: 0 },
  { name: "xl/workbook.xml", data: WORKBOOK, method: 8 }, { name: "xl/_rels/workbook.xml.rels", data: RELS, method: 8 },
  { name: "xl/sharedStrings.xml", data: SHARED, method: 0 }, { name: "xl/worksheets/sheet1.xml", data: SHEET, method: 8 }, { name: "xl/worksheets/sheet2.xml", data: DECOY, method: 8 },
];
const xlsx = makeZip(parts);
const byRow = (r, n) => (r.rows ?? []).find((x) => x.row === n);

// ── The configuration ──
const cs = real.autopilot.contactSourcing ?? {};
eq([cs.eventsFolderId, cs.eventsLookbackDays, cs.lookbackDays, cs.maxNewPerRun, cs.partnersToInvestorsList], ["example-events-folder", 14, 2, 15, false], "config: autopilot.contactSourcing in the example configuration");
eq(real.autopilot.purposes.contacts, ["contact-follow-up", "task", "record"], "config: autopilot.purposes.contacts");

// ── event-rows: xlsx ──
const xr = json(run("event-rows", "--json", put("a.json", answerOf(xlsx))), "event-rows xlsx");
eq([xr.fileId, xr.title, xr.sheet, xr.headerRow], ["FileId_0123456789", "Participants.xlsx", "Participants", 3], "xlsx: the first visible sheet is read (the hidden one is not), header on row 3");
eq(xr.columns, { name: "Participants Name", roleOrg: "Role / Organisation", linkedin: "LinkedIn", email: "Email" }, "xlsx: the header names are mapped");
eq(xr.unknownHeaders, ["Bring guest"], "xlsx: an unknown header is listed");
eq([4, 5, 6, 7, 9].map((n) => byRow(xr, n)?.usable), [true, true, true, false, true], "xlsx: sheet row numbers are kept (row 8 does not exist), a first name only is unusable");
eq([byRow(xr, 4)?.name, byRow(xr, 4)?.role, byRow(xr, 4)?.company, byRow(xr, 4)?.linkedin, byRow(xr, 4)?.emails], ["Tara Nolan", "Managing Partner", "Bayview Capital", "https://www.linkedin.com/in/tara-nolan-example", []], "xlsx: 'X at Y (Place)' gives role and company without the location; a boolean in the Email column is no address; the LinkedIn link is normalised");
eq([byRow(xr, 5)?.name, byRow(xr, 5)?.role, byRow(xr, 5)?.company, byRow(xr, 5)?.emails], ["Ines Ravel", "Gründerin", "Ravel Drives", ["ines.ravel@ravel.example.com"]], "xlsx: rich-text runs join, 'X bei Y' splits");
eq([byRow(xr, 6)?.name, byRow(xr, 6)?.company, byRow(xr, 6)?.emails], ["Piet de Boer", "Fish & Chips Ltd", ["piet.deboer@fishchips.example.com"]], "xlsx: &amp; is decoded, a whole role/organisation cell without 'at' is the company, a str cell is read and the address is lower-cased");
eq([byRow(xr, 7)?.why, byRow(xr, 7)?.emails], ["first name only, no email", []], "xlsx: a number in the Email column is no address");
eq(byRow(xr, 9)?.emails, ["zoe.ash@examplo.example.net", "zoe@examplo.example.net"], "xlsx: one cell with two addresses keeps both");
eq(xr.skipped, 1, "xlsx: skipped counts the unusable rows");

// ── event-rows: hostile sheet XML. A 2 KB xlsx whose parts inflate to a long run of unclosed openings makes lazy regexes quadratic
// (minutes for repeated <si>). The reader scans with indexOf only: each case must finish (FAIL or rows) within 3 s, measured in-process
// through the exported eventRows, and a workbook that inflates past the total cap is refused. ──
{
  const HOSTILE_MS = 3000, N = 100000;
  const swap = (name, data) => parts.map((p) => (p.name === name ? { ...p, data, method: 8 } : p));
  const hostile = (what, buf, expect) => {
    const t0 = performance.now();
    let result = "rows";
    try { CC.eventRows({ answer: answerOf(buf) }); } catch (e) { result = e?.constructor?.name === "Refusal" ? "FAIL" : `crash: ${String(e?.message).slice(0, 80)}`; }
    const ms = Math.round(performance.now() - t0);
    console.log(`     hostile xlsx (${what}): ${result} in ${ms} ms, ${buf.length} bytes zipped`);
    eq([ms < HOSTILE_MS, expect === undefined || result === expect], [true, true], `hostile xlsx: ${what} returns in under ${HOSTILE_MS / 1000} s (${ms} ms) as ${expect ?? "FAIL or rows"} (was ${result})`);
  };
  hostile("100000 <si> openings, no closing", makeZip(swap("xl/sharedStrings.xml", `<sst ${NS}>${"<si>".repeat(N)}</sst>`)), "FAIL");
  hostile("100000 <si ...> openings with attributes, no closing", makeZip(swap("xl/sharedStrings.xml", `<sst ${NS}>${'<si a="1">'.repeat(N)}</sst>`)), "FAIL");
  hostile("100000 <t> openings inside one <si>", makeZip(swap("xl/sharedStrings.xml", `<sst ${NS}><si>${"<t>".repeat(N)}</si></sst>`)));
  hostile("100000 <rPh> openings inside one <si>", makeZip(swap("xl/sharedStrings.xml", `<sst ${NS}><si>${"<rPh>".repeat(N)}</si></sst>`)));
  hostile("100000 <c> openings, no closing", makeZip(swap("xl/worksheets/sheet1.xml", `<worksheet ${NS}><sheetData><row r="1">${"<c>".repeat(N)}</row></sheetData></worksheet>`)), "FAIL");
  hostile("100000 <row> openings, no closing", makeZip(swap("xl/worksheets/sheet1.xml", `<worksheet ${NS}><sheetData>${"<row>".repeat(N)}</sheetData></worksheet>`)), "FAIL");
  hostile("100000 <v> openings inside one cell", makeZip(swap("xl/worksheets/sheet1.xml", `<worksheet ${NS}><sheetData><row r="1"><c r="A1">${"<v>".repeat(N)}</c></row></sheetData></worksheet>`)));
  hostile("100000 <sheet openings, no '>'", makeZip(swap("xl/workbook.xml", `<workbook ${NS}><sheets>${"<sheet ".repeat(N)}</sheets></workbook>`)), "FAIL");
  hostile("a cell with a 5 MB attribute run", makeZip(swap("xl/worksheets/sheet1.xml", `<worksheet ${NS}><sheetData><row r="1"><c ${"a".repeat(5 * 1024 * 1024)}></c></row></sheetData></worksheet>`)));
  // The total of all inflated parts is capped (32 MB) besides the 64 MB per part: a valid workbook whose three parts read are 14 MB
  // each is refused (each part alone is fine), by the cap and not for any other reason.
  const pad = `<!--${"x".repeat(14 * 1024 * 1024)}-->`;
  const padded = makeZip(parts.map((p) => (["xl/sharedStrings.xml", "xl/worksheets/sheet1.xml", "xl/_rels/workbook.xml.rels"].includes(p.name) ? { ...p, data: `${p.data}${pad}`, method: 8 } : p)));
  hostile("a valid workbook whose parts inflate to 42 MB in total", padded, "FAIL");
  let capWhy = "";
  try { CC.eventRows({ answer: answerOf(padded) }); } catch (e) { capWhy = String(e?.message); }
  eq(/inflates to more than 32 MB/.test(capWhy), true, `hostile xlsx: the total cap is what refuses it (${capWhy.slice(0, 100)})`);
}

// ── event-rows: damaged answers are reported, never guessed ──
const flip = (buf, at) => { const b = Buffer.from(buf); b[at] ^= 0xff; return b; };
notIntact(run("event-rows", "--json", put("crc-stored.json", answerOf(flip(xlsx, xlsx.indexOf(Buffer.from(SHARED)) + 60)))), "a flipped byte in a stored entry (CRC mismatch)");
notIntact(run("event-rows", "--json", put("crc-deflate.json", answerOf(flip(xlsx, xlsx.indexOf(zlib.deflateRawSync(Buffer.from(SHEET))) + 20)))), "a flipped byte in a deflated entry");
const cdAt = xlsx.readUInt32LE(xlsx.length - 6);
const wrongCrc = Buffer.from(xlsx); const entryAt = cdAt + 46 + "[Content_Types].xml".length;
wrongCrc.writeUInt32LE((wrongCrc.readUInt32LE(entryAt + 16) + 1) >>> 0, entryAt + 16);
notIntact(run("event-rows", "--json", put("crc-dir.json", answerOf(wrongCrc))), "a wrong CRC in the directory");
const b64 = xlsx.toString("base64");
notIntact(run("event-rows", "--json", put("trunc.json", { ...answerOf(xlsx), content: b64.slice(0, Math.floor(b64.length / 2 / 4) * 4) })), "a truncated file (valid base64, no end record)");
notIntact(run("event-rows", "--json", put("trunc-b64.json", { ...answerOf(xlsx), content: b64.slice(0, b64.length - 3) })), "truncated base64");
notIntact(run("event-rows", "--json", put("bad-b64.json", { ...answerOf(xlsx), content: `${b64.slice(0, 40)}!${b64.slice(41)}` })), "a character that is no base64");
notIntact(run("event-rows", "--json", put("not-json.json", "{ nope")), "an answer that is not JSON");
notIntact(run("event-rows", "--json", put("no-content.json", { id: "x", title: "t", mimeType: XLSX })), "an answer without content");
notIntact(run("event-rows", "--json", put("not-zip.json", answerOf(Buffer.from("this is plain text, not a zip file at all")))), "a file that is not a zip");
notIntact(run("event-rows", "--json", put("no-sheet.json", answerOf(makeZip(parts.filter((p) => p.name !== "xl/worksheets/sheet1.xml"))))), "a workbook whose sheet part is missing");
failsWith(run("event-rows", "--json", put("big.json", { ...answerOf(xlsx), content: "A".repeat(3 * 1024 * 1024 + 4) })), "larger than 3 MB", "base64 over 3 MB");
failsWith(run("event-rows", "--json", put("md.json", answerOf(Buffer.from("# x"), "text/markdown", "n.md"))), "not an event list", "an unsupported mimeType");
failsWith(run("event-rows", "--csv", put("nohead.csv", "a,b\n1,2\n"), "--file-id", "f1"), "no header row", "a sheet without a Name column");
failsWith(run("event-rows", "--csv", put("one.csv", "Name,Company\nA B,C\n")), "--file-id", "--csv without a file id");
failsWith(run("event-rows", "--csv", put("rows.csv", `Name,Company\n${Array.from({ length: 5000 }, (_, i) => `Person${i} Example,Co${i}`).join("\n")}\n`), "--file-id", "f1"), "more than 5000 rows", "5001 sheet rows");
eq(json(run("event-rows", "--csv", put("rows-ok.csv", `Name,Company\n${Array.from({ length: 4999 }, (_, i) => `Person${i} Example,Co${i}`).join("\n")}\n`), "--file-id", "f1"), "5000 rows").rows.length, 4999, "5000 sheet rows are fine");
failsWith(run("event-rows", "--csv", put("cols.csv", `Name,${Array.from({ length: 60 }, (_, i) => `c${i}`).join(",")}\nA B,${Array.from({ length: 60 }, () => "x").join(",")}\n`), "--file-id", "f1"), "more than 60 columns", "61 columns");
notIntact(run("event-rows", "--csv", put("open-quote.csv", 'Name,Company\n"A B,C\n'), "--file-id", "f1"), "a CSV whose quote is never closed");

// ── event-rows: CSV (BOM, CRLF, a comma and a newline inside quotes) ──
const csvRaw = readFileSync(resolve(FIX, "events-participants.csv"));
eq([csvRaw[0], csvRaw[1], csvRaw[2], csvRaw.includes("\r\n")], [0xef, 0xbb, 0xbf, true], "events-participants.csv starts with a BOM and uses CRLF");
const cv = json(run("event-rows", "--csv", resolve(FIX, "events-participants.csv"), "--file-id", "evt1", "--title", "Example Evening"), "event-rows csv");
eq([cv.fileId, cv.title, cv.sheet, cv.headerRow, cv.unknownHeaders], ["evt1", "Example Evening", "csv", 3, []], "csv: the title row and the empty row above the header are skipped, the BOM does not spoil the first header");
eq(cv.columns, { name: "Participant", company: "Company", role: "Role", linkedin: "LinkedIn", email: "Contact", note: "Note" }, "csv: the header set is mapped");
const cr = (n) => byRow(cv, n);
eq([cr(4)?.note, cr(4)?.company, cr(4)?.linkedin, cr(4)?.emails], ["Interested in first funds, knows Kai Lindgren", "Weiss Family Office", "https://www.linkedin.com/in/greta-weiss-example", []], "csv: a quoted comma stays in the note, '(Springfield)' is cut from the company, a de. LinkedIn link with a query is normalised");
eq([cr(5)?.note, cr(5)?.emails], ["Question about the fund start: schedule?", ["kai.lindgren@eastwind.example.net", "k.lindgren@eastwind.example.net"]], "csv: a newline inside quotes stays in one row (as a space), a cell with two addresses keeps both, lower-cased");
eq([6, 7, 8].map((n) => [cr(n)?.usable, cr(n)?.why]), Array(3).fill([false, "first name only, no email"]), "csv: 'Alex', 'Jo (+1)' and 'Sam (+2)' without an address are unusable");
eq([cr(7)?.name, cr(8)?.name], ["Jo", "Sam"], "csv: the plus-one marker is dropped from the name");
eq([cr(9)?.linkedin, cr(9)?.usable], ["", true], "csv: a javascript: LinkedIn value is dropped");
eq([cr(10)?.kind, cr(10)?.company, cr(10)?.usable, cr(10)?.linkedin], ["company", "Seaside Ventures", true, "https://www.linkedin.com/company/seaside-ventures-example"], "csv: '(company)' makes a company row, its company page link is kept");
eq([cr(11)?.usable, cr(11)?.why], [false, "placeholder name"], "csv: '(no name)' is a placeholder");
eq([cr(12)?.usable, cr(12)?.why], [false, "empty row"], "csv: an empty row in the middle is reported");
eq([cr(14)?.kind, cr(14)?.company, cr(14)?.usable], ["company", "Quillstone Partners", true], "csv: a row whose name is its company is a company row");
eq([cv.rows.length, cv.skipped], [12, 5], "csv: twelve rows after the header, five unusable");
const viaDrive = json(run("event-rows", "--json", put("drive-csv.json", answerOf(csvRaw, "text/csv", "Participants", "evt1"))), "event-rows text/csv answer");
eq([viaDrive.fileId, viaDrive.rows.length, viaDrive.skipped], ["evt1", cv.rows.length, cv.skipped], "a document-store answer with mimeType text/csv gives the same rows");
eq(json(run("event-rows", "--json", put("wrapped.json", [{ type: "text", text: JSON.stringify(answerOf(csvRaw, "text/csv", "T", "evt1")) }])), "wrapped answer").rows.length, cv.rows.length, "the wrapped answer shape is read");
eq(CC.parseCsv('a;b\r\n"x;y";2\r\n').slice(0, 2), [["a", "b"], ["x;y", "2"]], "parseCsv: a semicolon separator is recognised from the first record");
eq(CC.parseCsv('"a ""quoted"" word",b\n').slice(0, 1), [['a "quoted" word', "b"]], "parseCsv: doubled quotes");

// ── Header variants ──
const grid = (...rows) => ({ sheet: "t", rows: rows.map((cells, i) => ({ n: i + 1, cells })) });
const g1 = CC.eventRowsFromGrid(grid(["Title"], ["First name", "Last name", "Organisation", "Position", "E-Mail", "Notes", "LinkedIn Profile", "Table"], ["Ida", "Strom", "Strom Drives GmbH (Springfield)", "CEO", "Ida.Strom@stromdrives.example.com", "Table 4", "https://www.linkedin.com/in/ida-strom", "4"]), { fileId: "g1", title: "t" });
eq([g1.headerRow, g1.rows[0]?.name, g1.rows[0]?.firstName, g1.rows[0]?.lastName, g1.rows[0]?.company, g1.rows[0]?.role, g1.rows[0]?.emails, g1.rows[0]?.note, g1.unknownHeaders], [2, "Ida Strom", "Ida", "Strom", "Strom Drives GmbH", "CEO", ["ida.strom@stromdrives.example.com"], "Table 4", ["Table"]], "headers: First name / Last name / Organisation / Position / E-Mail / Notes / LinkedIn Profile");
const g2 = CC.eventRowsFromGrid(grid(["  PARTICIPANT ", "Role / Company", "Contact", "Comment"], ["Kari Elm", "Head of Sourcing at Foo AG", "kari.elm@foo.example.com", "x"], ["Jon Alder", "Foo AG", "", ""]), { fileId: "g2", title: "t" });
eq([g2.rows[0]?.role, g2.rows[0]?.company, g2.rows[1]?.role, g2.rows[1]?.company, g2.rows[0]?.emails, g2.rows[0]?.note], ["Head of Sourcing", "Foo AG", "", "Foo AG", ["kari.elm@foo.example.com"], "x"], "headers: padded upper case, Role / Company ('at' splits, a plain value is the company), Contact, Comment");
const g3 = CC.eventRowsFromGrid(grid(["Vollständiger Name", "Organization", "Job Title", "LinkedIn URL", "Mail", "Table"], ["Eve Rowe", "Rowe Drives", "Founder", "https://uk.linkedin.com/in/eve-rowe/", "eve@rowe-drives.example.com", "3"]), { fileId: "g3", title: "t" });
eq([g3.columns, g3.unknownHeaders, g3.rows[0]?.linkedin], [{ name: "Vollständiger Name", company: "Organization", role: "Job Title", linkedin: "LinkedIn URL", email: "Mail" }, ["Table"], "https://www.linkedin.com/in/eve-rowe"], "headers: Vollständiger Name / Organization / Job Title / LinkedIn URL / Mail");
eq(CC.eventRowsFromGrid(grid(["Full Name", "Surname"], ["Fenn Ward", "x"]), { fileId: "g4", title: "t" }).columns, { name: "Full Name", lastName: "Surname" }, "headers: Full Name / Surname");
eq(CC.eventRowsFromGrid(grid(["Name", "Role / Organization"], ["Ole Strand", "Kai"]), { fileId: "g5", title: "t" }).rows[0]?.company, "Kai", "headers: a role/organisation cell without 'at' with no company column is the company");
const g6 = CC.eventRowsFromGrid(grid(["Name", "Role / Organisation"], ["Mossgate Ventures (company)", "VC firm"], ["Ira Kemp", "Chief of Staff, Marlow Capital"], ["Pia Dunn", "Quayside Partners (Per (Peter) Holm)"], ["Lia Bern", "Springfield based"], ["Ada Rask", "Fram, Noord & Co"]), { fileId: "g6", title: "t" });
eq(g6.rows.map((r) => [r.kind, r.company, r.role]), [["company", "Mossgate Ventures", ""], ["person", "Marlow Capital", "Chief of Staff"], ["person", "Quayside Partners", ""], ["person", "", ""], ["person", "Fram, Noord & Co", ""]], "rows: an organisation row is named by its Name cell; 'Role, Company' splits only on a role word; a nested parenthetical is dropped; a place is no company");

// ── LinkedIn filter ──
eq(["https://linkedin.com/in/foo-bar", "http://de.linkedin.com/in/foo?x=1", "https://www.linkedin.com/company/acme/", "HTTPS://WWW.LINKEDIN.COM/IN/Foo#top"].map(CC.linkedinOf), ["https://www.linkedin.com/in/foo-bar", "https://www.linkedin.com/in/foo", "https://www.linkedin.com/company/acme", "https://www.linkedin.com/in/foo"], "linkedin: https?://[xx.]linkedin.com/(in|company)/<slug> is normalised");
eq(["https://evil.example.com/in/x", "https://linkedin.com.evil.example.com/in/x", "https://www.linkedin.com/feed/", "javascript:alert(1)", "https://www.linkedin.com/in/", "linkedin.com/in/foo", "https://example.com/?u=https://www.linkedin.com/in/foo", "https://www.linkedin.com/in/a b", "ftp://www.linkedin.com/in/foo"].map(CC.linkedinOf), Array(9).fill(""), "linkedin: anything else is dropped");

// ── candidates ──
const evCsv = put("ev-csv.json", cv), evXlsx = put("ev-xlsx.json", xr);
const MEET = resolve(FIX, "granola-meetings.json"), MAIL = resolve(FIX, "gmail-threads.json");
const cand = json(run("candidates", "--meetings", MEET, "--threads", MAIL, "--events", evCsv, "--config", CFG, "--now", NOW), "candidates");
const C = cand.candidates ?? [];
const cOf = (key) => C.find((c) => c.key === key);
const LQ = "e:lotte.quist.fixture@gmail.example", KLIND = "e:k.lindgren@eastwind.example.net", IRIS = "e:iris.calder@fernlea.example.com", EMIL = "e:emil.fjord@lakeside-capital.example.net", PAVEL = "m:pavel orlov|orlov logistics services", QUILL = "c:quillstone partners";
eq(C.map((c) => c.key), [QUILL, "c:seaside ventures", KLIND, EMIL, IRIS, LQ, "n:greta weiss|weiss family office"].sort(), "candidates: the keys, sorted");
eq(cand.dropped, { internal: 11, bulk: 3, unusable: 5, handled: 0, deferred: 0 }, "candidates: own addresses and the note creator, bulk addresses and the promotions thread, unusable event rows are counted");
eq(C.flatMap((c) => c.emails).filter((e) => /@(mail\.)?example\.org$|noreply|promo\.example|depots\.example\.net/.test(e)), [], "candidates: no own-domain address (the creator, an associate, a subdomain) and no bulk address (noreply, info@, the promotions thread) is a candidate");
eq([cOf(IRIS)?.sources.map((s) => s.type), cOf(IRIS)?.role, cOf(IRIS)?.companyDomain], [["meeting", "event"], "Founder", "fernlea.example.com"], "candidates: a meeting participant and an event row of the same name and company are one candidate with both sources and the event's role");
eq(cOf(IRIS)?.sources[0], { type: "meeting", id: "meeting-a1", title: "Fernlea Robotics | Intro call", date: "2026-10-02T08:00:00.000Z" }, "candidates: a meeting source carries id, title and date");
eq(cOf(EMIL)?.sources.map((s) => `${s.type}:${s.id}`), ["meeting:meeting-a3", "mail:thread-0001"], "candidates: the same address in a meeting and in a mail thread is one candidate; the mail source is the thread id");
eq(cOf(EMIL)?.sources[1], { type: "mail", id: "thread-0001", subject: "Intro: Lakeside Capital and Example Fund", date: "2026-10-03T10:00:00Z" }, "candidates: a mail source carries thread id, subject and date");
eq([cOf(LQ)?.companyDomain, cOf(LQ)?.company, cOf(LQ)?.name, cOf(LQ)?.sources.map((s) => s.type)], [undefined, "Quillstone Partners", "Lotte Quist", ["mail", "event"]], "candidates: a free-mail domain is never the companyDomain; mail and event merge by email");
eq(cOf(KLIND)?.emails, ["kai.lindgren@eastwind.example.net", "k.lindgren@eastwind.example.net"], "candidates: both addresses of the contact cell are kept; the key uses the smallest");
eq(cOf(KLIND)?.sources[0], { type: "event", fileId: "evt1", title: "Example Evening", row: 5, note: "Question about the fund start: schedule?" }, "candidates: an event source carries fileId, title, row and the note");
eq([cOf("c:seaside ventures")?.kind, cOf("n:greta weiss|weiss family office")?.emails, cOf("n:greta weiss|weiss family office")?.email], ["company", [], undefined], "candidates: a company row keeps kind company; a row without an address keys on name and company");
const wide = json(run("candidates", "--meetings", MEET, "--threads", MAIL, "--events", evCsv, "--events", evXlsx, "--config", CFG), "candidates with two event lists").candidates;
const w = (key) => wide.find((c) => c.key === key);
eq(wide.length, 11, "candidates: the spreadsheet rows come through");
eq([w("e:zoe.ash@examplo.example.net")?.emails, w("e:piet.deboer@fishchips.example.com")?.company], [["zoe.ash@examplo.example.net", "zoe@examplo.example.net"], "Fish & Chips Ltd"], "candidates: two addresses of one cell and an ampersand company");
// --audit and --max-event-rows
const auditFile = put("cand-audit.json", [
  { module: "contacts", timestampUtc: "2026-10-05T10:00:00Z", rationale: `mail thread-0003: contact ${LQ} · record created` },
  { module: "contacts", timestampUtc: "2026-10-05T10:00:01Z", rationale: `event evt1 row 13: contact ${LQ}` },
  { module: "contacts", timestampUtc: "2026-10-05T10:00:02Z", rationale: `event evt1 row 5: contact ${KLIND}` },
  { module: "contacts", timestampUtc: "2026-10-05T10:00:03Z", rationale: `meeting meeting-a1: contact ${IRIS}` },
  { module: "dealflow", timestampUtc: "2026-10-05T10:00:04Z", rationale: "event evt1 row 4: contact n:greta weiss|weiss family office" },
]);
const au = json(run("candidates", "--meetings", MEET, "--threads", MAIL, "--events", evCsv, "--config", CFG, "--audit", auditFile), "candidates --audit");
eq(au.candidates.map((c) => c.key), C.map((c) => c.key).filter((k) => k !== LQ && k !== KLIND), "candidates --audit: a candidate whose every source is handled is dropped; another module's entry does not count");
eq([au.dropped.handled, au.dropped.deferred], [2, 0], "candidates --audit: dropped.handled counts them");
eq(au.candidates.find((c) => c.key === IRIS)?.sources.map((s) => s.type), ["event"], "candidates --audit: a handled meeting source is removed, the open event source stays");
const dfr = (...flags) => json(run("candidates", "--meetings", MEET, "--threads", MAIL, "--config", CFG, ...flags), "candidates --max-event-rows");
const d2 = dfr("--events", evCsv, "--max-event-rows", "2");
eq([d2.candidates.map((c) => c.key), d2.dropped.deferred], [[EMIL, IRIS, KLIND, LQ, "n:greta weiss|weiss family office"].sort(), 2], "candidates --max-event-rows 2: the first two event-only candidates in sheet order stay, the rest is deferred; meeting and mail candidates are never deferred");
const d0 = dfr("--events", evCsv, "--max-event-rows", "0");
eq([d0.candidates.map((c) => c.key), d0.dropped.deferred], [[EMIL, IRIS, LQ].sort(), 4], "candidates --max-event-rows 0: only meeting and mail candidates remain");
eq(dfr("--events", evCsv).dropped.deferred, 0, "candidates: the default limit is autopilot.contactSourcing.maxNewPerRun x 2, nothing is deferred here");
const capCfg = put("cfg-cap1.json", { ...real, autopilot: { ...real.autopilot, contactSourcing: { ...cs, maxNewPerRun: 1 } } });
eq(json(run("candidates", "--meetings", MEET, "--threads", MAIL, "--events", evCsv, "--config", capCfg), "candidates cap 1").dropped.deferred, 2, "candidates: the default follows the configuration (maxNewPerRun 1 keeps two event-only candidates)");
eq(run("candidates", "--config", CFG, "--max-event-rows", "x").status, 1, "candidates: --max-event-rows must be a whole number");
const two = CC.buildCandidates({ cfg: real, meetings: [{ id: "m1", title: "t", date: null, participants: [{ name: "Ida Fenn", email: "ida@fenn-capital.example.net", company: "Fenn Capital GmbH" }] }], events: [{ fileId: "e1", title: "E", rows: [{ row: 2, kind: "person", name: "ida  FENN", firstName: "", lastName: "", company: "Fenn Capital", role: "Partner", linkedin: "", emails: [], note: "", usable: true }, { row: 3, kind: "person", name: "Ida Fenn", company: "Somewhere Else", emails: [], usable: true }] }] }).candidates;
eq(two.map((c) => [c.key, c.sources.length, c.role]), [["e:ida@fenn-capital.example.net", 2, "Partner"], ["n:ida fenn|somewhere else", 1, ""]], "candidates: 'Fenn Capital GmbH' and 'Fenn Capital' are one company; the same name at another company is another person");
eq(CC.buildCandidates({ cfg: real, threads: [{ id: "t9", messages: [{ sender: "Nina Hale <nina@hale-drives.example.com>", toRecipients: ["a@example.org"], labelIds: ["CATEGORY_UPDATES"], subject: "x" }, { sender: "a@example.org", toRecipients: ["b@x.example.com"], labelIds: ["CATEGORY_FORUMS"] }] }, { id: "t10", messages: [{ sender: "a@example.org", toRecipients: ["Mailer-Daemon@x.example.com", "notifications@x.example.com", "Newsletter <newsletter@x.example.com>", "newsletters@x.example.com", "postmaster@x.example.com", "do-not-reply@x.example.com"], subject: "bounce" }] }] }).candidates, [], "candidates: CATEGORY_UPDATES and _FORUMS threads and mailer-daemon, notifications, newsletter, postmaster and do-not-reply addresses are never candidates");

// ── dedupe ──
const cfile = put("cand.json", cand);
const dd = json(run("dedupe", "--candidates", cfile, "--people", render("crm-people.txt"), "--companies", render("crm-companies.txt"), "--entries", render("crm-entries.txt")), "dedupe");
const D = (key) => (dd.results ?? []).find((r) => r.key === key);
eq([D(EMIL)?.status, D(EMIL)?.personId, D(EMIL)?.companyId], ["known", ID("pe-emil"), ID("co-lakeside")], "dedupe: an address on a person record is known (a) and carries the company id from the record's reference table");
eq([D(IRIS)?.status, D(IRIS)?.personId, D(IRIS)?.companyId], ["partial", undefined, ID("co-fernlea")], "dedupe: the company's domain matches a company record (b): the company is known, the person is new → partial");
eq(D(IRIS)?.entries, [{ entryId: ID("en-fernlea"), list: null }], "dedupe: the list entry of the matched company is reported");
eq([D("n:greta weiss|weiss family office")?.status, D("n:greta weiss|weiss family office")?.personId], ["known", ID("pe-greta")], "dedupe: the exact name and the same company name is known (c)");
eq([D(KLIND)?.status, D(KLIND)?.ambiguous, D(KLIND)?.personId], ["new", "name only", undefined], "dedupe: the same name at another company is never a match (ambiguous: name only)");
eq([D(LQ)?.status, D("c:seaside ventures")?.status, D("c:seaside ventures")?.companyId, D(QUILL)?.status], ["new", "known", ID("co-seaside"), "new"], "dedupe: a free-mail address has no domain rule; a company-only row matches by exact name");
eq(dd.counts, { new: 3, known: 3, partial: 1 }, "dedupe: counts");
const nameRecs = { people: [], companies: [{ record_id: "c-exact", attributes: { name: "Marlow Capital", domains: ["marlow.example.com"] } }, { record_id: "c-near", attributes: { name: "1st Kestrel Partners", domains: ["1stkestrel.example.com"] } }, { record_id: "c-gen", attributes: { name: "North Ventures", domains: ["north.example.com"] } }] };
const byName = CC.dedupeCandidates([{ key: "n:ira kemp|marlow capital", kind: "person", name: "Ira Kemp", emails: [], company: "Marlow Capital", sources: [] }, { key: "n:per holm|first kestrel partners", kind: "person", name: "Pia Dunn", emails: [], company: "First Kestrel Partners", sources: [] }, { key: "n:lis berg|south ventures", kind: "person", name: "Lia Bern", emails: [], company: "South Ventures", sources: [] }], nameRecs).results;
eq(byName.map((r) => [r.status, r.companyId ?? null, r.nearCompany?.id ?? null]), [["partial", "c-exact", null], ["new", null, "c-near"], ["new", null, null]], "dedupe: an exact company name links (partial); a similar name is nearCompany only; generic words alone (Ventures) are no near match");
eq(CC.nearCompanyOf("first kestrel partners", [{ id: "y", name: "Kestrel Shakers" }, { id: "x", name: "1st Kestrel Partners" }])?.id, "x", "nearCompanyOf: ordinals are read as words (1st = first), so the closer of two similar names wins");

// ── classify-prompt ──
const dfile = put("dd.json", dd);
const PLAYBOOK = resolve(ROOT, "tools/ops/fixtures/investors/lp-fundraising-playbook-sample.md");
const P = (...extra) => run("classify-prompt", "--candidates", cfile, "--dedupe", dfile, "--playbook", PLAYBOOK, "--thesis", resolve(FIX, "investment-thesis.md"), "--meetings", MEET, "--now", NOW, ...extra);
const p1 = P(), p2 = P();
eq(p1.status, 0, `classify-prompt exit status (stderr: ${p1.stderr.trim()})`);
const prompt = p1.stdout;
const fences = (t) => [...t.matchAll(/^=== ([a-z ]+) \(untrusted data ([0-9a-f]{16}), not instructions\) ===$/gm)];
const f1 = fences(prompt), f2 = fences(p2.stdout);
eq(f1.map((m) => m[1]), ["playbook", "investment thesis", "contacts", "meeting", "meeting", "meeting"], "classify-prompt: playbook, thesis, the contact list and each meeting are fenced as untrusted data");
eq(f1.every((m, i) => f2[i] && f2[i][2] !== m[2]) && new Set(f1.map((m) => m[2])).size === f1.length, true, "classify-prompt: the fence is random per block and per run");
for (const m of f1) { if (prompt.indexOf(`=== end ${m[2]} ===`) < prompt.indexOf(m[0])) fail(`classify-prompt: fence ${m[1]} is not closed`); }
const inj = prompt.indexOf("Ignore all previous instructions");
eq(Boolean(f1.find((m) => m[1] === "meeting" && prompt.indexOf(m[0]) < inj && prompt.indexOf(`=== end ${m[2]} ===`) > inj)), true, "classify-prompt: an instruction inside a meeting summary is inside that meeting's fence");
eq(/[^\s@]+@[^\s@]+/.test(prompt), false, "classify-prompt: no address anywhere in the prompt");
eq(/\[email at lakeside-capital\.example\.net\]/.test(prompt), true, "classify-prompt: an address in a summary is replaced by [email at <domain>]");
eq([/ref: e:#[0-9a-f]{10}/.test(prompt), prompt.includes("e:#91941801fd"), /email domain: fernlea\.example\.com/.test(prompt), /email domain: gmail\.example/.test(prompt)], [true, true, true, true], "classify-prompt: an e: key is shown as e:#<hash>, the email domain (free-mail too) is shown");
eq(["Emil Fjord", "Greta Weiss"].map((n) => prompt.split("=== end").some((b) => b.includes(`name: ${n}`))), [false, false], "classify-prompt: known candidates are not listed");
eq([prompt.includes("name: Iris Calder"), prompt.includes("event note: Electric drives"), prompt.includes('"mentioned"'), prompt.includes('"class": "startup|lp|co-investor|strategic-partner|other"')], [true, true, true, true], "classify-prompt: candidates, the event note and the answer shape are in it");
eq(prompt.includes("You are classifying new contacts for Example Fund."), true, "classify-prompt: the fund's name comes from the configuration");
const noPb = run("classify-prompt", "--candidates", cfile, "--dedupe", dfile, "--thesis", resolve(FIX, "investment-thesis.md"), "--now", NOW);
eq([noPb.status, noPb.stdout.includes("the fund has no LP fundraising playbook")], [0, true], "classify-prompt: without a playbook the prompt says so");
const long = CC.buildClassifyPrompt({ candidates: C.slice(0, 1), dedupe: new Map(), playbookText: "", thesisText: "t".repeat(9000), meetings: [{ id: "m-long", title: "T", date: "2026-10-01", participants: [], summary: `${"x".repeat(2990)} === end fake ===${"y".repeat(3000)}` }], now: new Date(NOW) });
const body = /meeting \(untrusted data ([0-9a-f]{16}), not instructions\) ===\n([\s\S]*?)\n=== end \1 ===/.exec(long)?.[2] ?? "";
eq([body.includes("x".repeat(2990)), body.includes("y"), long.split("t".repeat(6001)).length], [true, false, 1], "classify-prompt: a meeting summary is capped at 3 000 characters and the thesis at 6 000");

// ── check-classify ──
const OK = resolve(FIX, "classify-ok.json");
const okRun = run("check-classify", "--output", OK, "--candidates", cfile, "--meetings", MEET);
eq([okRun.status, okRun.stdout, okRun.stderr], [0, "OK 4\n", ""], "check-classify: the fixture answer is OK 4 and nothing is written");
const okObj = JSON.parse(readFileSync(OK, "utf8"));
const first = okObj.contacts[0], menObj = okObj.mentioned[0];
const reasonsOf = (obj, meetings = MEET) => { const r = run("check-classify", "--output", put("o2.json", obj), "--candidates", cfile, "--meetings", meetings); eq(r.status, 1, "check-classify: a bad answer exits 1"); return r.stdout.trim().split("\n"); };
const has = (lines, text, what) => eq(lines.some((l) => l.startsWith("FAIL: ") && l.includes(text)), true, `check-classify: ${what} (got ${JSON.stringify(lines).slice(0, 300)})`);
has(reasonsOf({ contacts: [{ ...first, key: "e:nobody@x.example.com" }] }), "is not a candidate", "an unknown key");
has(reasonsOf({ contacts: [first, { ...first, key: IRIS }] }), "appears twice", "a duplicate key (the prompt form and the canonical form are one key)");
has(reasonsOf({ contacts: [{ ...first, class: "angel" }] }), "is not one of startup, lp", "a class outside the enum");
has(reasonsOf({ contacts: [{ ...first, confidence: "certain" }] }), "is not one of high, medium, low", "a confidence outside the enum");
has(reasonsOf({ contacts: [{ ...first, reason: "x".repeat(301) }] }), "at most 300", "a reason over 300 characters");
has(reasonsOf({ contacts: [{ ...first, reason: "write to jo@example.com" }] }), "email address appears in contacts[0].reason", "an email in the reason");
has(reasonsOf({ contacts: [{ ...first, reason: "see https://example.com/x" }] }), "URL appears", "a URL in the reason");
has(reasonsOf({ contacts: [{ ...first, role: "CEO +1 555 0100 1234" }] }), "phone number appears in contacts[0].role", "a phone number in the role");
has(reasonsOf({ contacts: [{ ...first, company: "<b>Acme</b>" }] }), "HTML tag appears in contacts[0].company", "markup in the company");
has(reasonsOf({ contacts: [{ ...first, reason: "[click](x)" }] }), "markdown link", "a markdown link in the reason");
has(reasonsOf({ contacts: [{ ...first, reason: "" }] }), "reason is missing", "an empty reason");
has(reasonsOf({ contacts: [first], mentioned: Array.from({ length: 11 }, () => menObj) }), "11 mentioned; at most 10", "more than 10 mentioned");
has(reasonsOf({ contacts: [first], mentioned: [{ ...menObj, meetingId: "meeting-zz" }] }), "is not in --meetings", "a meetingId that is not in --meetings");
has(reasonsOf({ contacts: [first], mentioned: [{ ...menObj, name: "Pavel" }] }), "is not a full name", "a mentioned name of one word");
has(reasonsOf({ contacts: [first], mentioned: [{ ...menObj, name: "Pavel Orlov pavel@x.example.com" }] }), "email address appears in mentioned[0].name", "an email in a mentioned name");
eq(reasonsOf({ contacts: [{ ...first, key: "nope", class: "x", reason: "a@b.example.com" }] }).length >= 3, true, "check-classify: one FAIL line per problem");
eq(run("check-classify", "--output", OK, "--candidates", cfile).status, 1, "check-classify: without --meetings a mentioned meetingId is unknown");

// ── plan ──
const cls = (patch) => { const o = JSON.parse(readFileSync(OK, "utf8")); return patch ? patch(o) ?? o : o; };
const plan = (mode, { classify = cls(), cfg = real, audit, extra = [], dedupe = dfile } = {}) => json(run("plan", "--candidates", cfile, "--dedupe", dedupe, "--classify", put("cls.json", classify), "--mode", mode, "--config", put("cfg.json", cfg), ...(audit ? ["--audit", put("audit.json", audit)] : []), "--now", NOW, ...extra), `plan ${mode}`);
// The CLI refuses a classification that check-classify would refuse (the planner's own per-entry filter is exercised in-process).
const planIn = (classify, { mode = "review-first", dedupe = dd.results, cfg = real, audit = [] } = {}) => CC.planContacts({ candidates: cand.candidates, dedupe: new Map(dedupe.map((r) => [r.key, r])), classify, mode, cfg, audit, now: new Date(NOW) });
const kindsOf = (p, key) => p.acts.filter((a) => a.key === key).map((a) => a.kind);
const withCs = (patch) => ({ ...real, autopilot: { ...real.autopilot, contactSourcing: { ...cs, ...patch } } });
const off = plan("off"), rf = plan("review-first"), on = plan("on");
eq(off.acts.every((a) => a.kind === "link" || a.kind === "task" || (a.writable === false && a.approval === true)), true, "plan off: every act is an approval, nothing is writable (the task has no approval at off, see below)");
eq(off.acts.filter((a) => a.kind !== "link").length > 10, true, "plan off: the acts are still proposed");
const flags = (p, key) => Object.fromEntries(p.acts.filter((a) => a.key === key).map((a) => [a.kind, `${a.writable ? "w" : "-"}${a.approval ? "a" : "-"}`]));
eq(flags(rf, LQ), { "create-company": "w-", "create-person": "w-", "add-entry": "w-", score: "w-", note: "w-", "follow-up-draft": "-a", task: "-a" }, "plan review-first: records, entry, score and note writable; draft and task approvals");
eq(flags(on, LQ), { "create-company": "w-", "create-person": "w-", "add-entry": "w-", score: "w-", note: "w-", "follow-up-draft": "-a", task: "w-" }, "plan on: the task is writable too, the draft is still an approval");
eq(flags(rf, PAVEL), { "create-company": "-a", "create-person": "-a", note: "-a" }, "plan: a mentioned person that was not deduped is approvals only, even at review-first");
eq([rf.acts.find((a) => a.key === EMIL)?.kind, rf.acts.find((a) => a.key === EMIL)?.writable, rf.acts.find((a) => a.key === EMIL)?.approval, kindsOf(rf, EMIL)], ["link", false, false, ["link"]], "plan: a known candidate with a meeting or mail source gets one link act and nothing is written");
eq(rf.skipped.filter((s) => s.why.startsWith("known")).map((s) => s.key).sort(), ["c:seaside ventures", "n:greta weiss|weiss family office"], "plan: known candidates of an event row only are reported, not linked");
eq(kindsOf(rf, IRIS), ["create-person", "note", "follow-up-draft", "task"], "plan: the partial candidate gets only a person (the company is known), no second entry on the list it is already on, a note, draft and task");
eq(rf.acts.find((a) => a.key === IRIS && a.kind === "create-person")?.payload.companyId, ID("co-fernlea"), "plan: the new person is created at the known company");
eq(rf.notes.some((n) => n.key === IRIS && /already has an entry/.test(n.why)), true, "plan: the existing entry is reported");
const pp = rf.acts.find((a) => a.key === IRIS && a.kind === "create-person")?.payload;
eq([pp?.role, pp?.name, pp?.email, pp?.company], ["Founder", "Iris Calder", "iris.calder@fernlea.example.com", "Fernlea Robotics"], "plan: create-person carries the candidate's own values");
eq(rf.acts.find((a) => a.key === LQ && a.kind === "create-company")?.payload, { name: "Quillstone Partners" }, "plan: create-company carries the name (and a domain when there is one) only");
eq(rf.acts.filter((a) => a.kind === "create-company" && a.payload.name === "Quillstone Partners").length, 1, "plan: a company named by a person and by an organisation row is created once");
eq(rf.notes.some((n) => n.key === QUILL && /already planned/.test(n.why)), true, "plan: the second list entry for the same company is not planned");
const entry = (p, key) => p.acts.find((a) => a.key === key && a.kind === "add-entry")?.payload;
const asStartup = plan("review-first", { classify: cls((o) => { o.contacts[2].class = "startup"; }) });
eq([entry(asStartup, KLIND), asStartup.acts.find((a) => a.key === KLIND && a.kind === "score")?.payload.kind], [{ list: "example_deal_list", parent: "company", company: "Eastwind Capital", stage: "New" }, "deal"], "plan: a startup goes on the deal list at autopilot.crm.stages.new with a deal score");
eq([entry(rf, KLIND), rf.acts.find((a) => a.key === KLIND && a.kind === "score")?.payload.kind], [{ list: "example_investor_list", parent: "company", company: "Eastwind Capital", status: "Target" }, "lp"], "plan: a co-investor goes on the investor list at autopilot.crm.statuses.target with an lp score");
for (const p of [off, rf, on, asStartup]) eq(p.acts.filter((a) => a.kind === "add-entry").map((a) => a.payload.stage ?? a.payload.status).every((t) => t === "New" || t === "Target"), true, "plan: no entry target other than the new stage or the target status");
for (const bad of ["Invested", "Term sheet", "Commitment", "Closed", "Passive", "Screening", "Call booked", ""]) {
  let threw = false;
  try { CC.assertEntryTarget(bad, real); } catch { threw = true; }
  if (!threw) fail(`assertEntryTarget accepted "${bad}"`);
}
eq([CC.assertEntryTarget("New", real), CC.assertEntryTarget("Target", real)], ["New", "Target"], "assertEntryTarget: the new stage and the target status pass");
const sp = plan("review-first", { classify: cls((o) => { o.contacts[1].class = "strategic-partner"; }) });
eq([kindsOf(sp, LQ), sp.notes.some((n) => n.key === LQ && /records only/.test(n.why))], [["create-company", "create-person", "note", "follow-up-draft", "task"], true], "plan: a strategic partner gets records but no list entry and no score while partnersToInvestorsList is false");
const spOn = plan("review-first", { classify: cls((o) => { o.contacts[1].class = "strategic-partner"; }), cfg: withCs({ partnersToInvestorsList: true }) });
eq([entry(spOn, LQ)?.list, entry(spOn, LQ)?.status], ["example_investor_list", "Target"], "plan: partnersToInvestorsList true puts a strategic partner on the investor list at the target status");
const lowOther = plan("review-first", { classify: cls((o) => { o.contacts[1].confidence = "low"; o.contacts[2].class = "other"; o.mentioned[0].confidence = "low"; o.contacts.pop(); }) });
eq([kindsOf(lowOther, LQ), kindsOf(lowOther, KLIND), kindsOf(lowOther, PAVEL), kindsOf(lowOther, QUILL)], [[], [], [], []], "plan: low confidence, class other, a low mentioned person and an unclassified candidate create nothing");
eq([lowOther.skipped.find((s) => s.key === LQ)?.why, lowOther.skipped.find((s) => s.key === KLIND)?.why, lowOther.skipped.find((s) => s.key === QUILL)?.why, lowOther.skipped.some((s) => s.key === PAVEL && /low/.test(s.why))], ["confidence low (lp)", "class other: kept out of the CRM", "not classified", true], "plan: each skip says why");
const cap3 = plan("review-first", { cfg: withCs({ maxNewPerRun: 3 }) });
eq([cap3.maxNewPerRun, [...new Set(cap3.acts.filter((a) => a.kind !== "link").map((a) => a.key))], cap3.capped], [3, [IRIS, PAVEL], [LQ, KLIND, QUILL]], "plan: maxNewPerRun 3 keeps the meeting sources and caps mail, then event candidates in order");
const cap1 = plan("review-first", { cfg: withCs({ maxNewPerRun: 1 }) });
eq([[...new Set(cap1.acts.filter((a) => a.kind !== "link").map((a) => a.key))], cap1.capped], [[IRIS], [PAVEL, LQ, KLIND, QUILL]], "plan: maxNewPerRun 1");
eq(plan("review-first", { cfg: { ...real, autopilot: { ...real.autopilot, contactSourcing: undefined } } }).maxNewPerRun, 15, "plan: without a configuration section the cap is 15");
const audit = [
  { module: "contacts", timestampUtc: "2026-10-05T10:00:00Z", rationale: `mail thread-0003: contact ${LQ} · record created`, act: { kind: "create-person" } },
  { module: "contacts", timestampUtc: "2026-10-05T10:00:01Z", rationale: `event evt1 row 13: contact ${LQ}`, act: { kind: "create-person" } },
  { module: "contacts", timestampUtc: "2026-10-05T10:00:02Z", rationale: `meeting meeting-a1: contact ${IRIS}`, act: { kind: "create-person" } },
  { module: "dealflow", timestampUtc: "2026-10-05T10:00:03Z", rationale: `event evt1 row 5: contact ${KLIND}` },
  { module: "contacts", timestampUtc: "2026-10-05T10:00:04Z", rationale: `event evt1 row 5: contact ${KLIND}extra` },
];
const aud = plan("review-first", { audit });
eq([kindsOf(aud, LQ), aud.skipped.find((s) => s.key === LQ)?.why], [[], "every source is already handled in the audit"], "plan: a candidate whose every source is in the audit is skipped");
eq(kindsOf(aud, IRIS).includes("create-person"), true, "plan: a candidate with one handled and one open source is still planned");
eq(kindsOf(aud, KLIND).includes("create-person"), true, "plan: another module's audit entry and a longer key do not count as handled");
eq([CC.rationaleOf({ type: "meeting", id: "abc" }, "e:x@y.example.com"), CC.rationaleOf({ type: "mail", id: "t1" }, "n:a b|c"), CC.rationaleOf({ type: "event", fileId: "F1", row: 7 }, "c:foo")], ["meeting abc: contact e:x@y.example.com", "mail t1: contact n:a b|c", "event F1 row 7: contact c:foo"], "rationaleOf: the one format");

// A skip is final (a decision: known, other, low) or not (nothing decided: it comes again, nothing is recorded as handled).
const finalOf = (p, key) => p.skipped.find((x) => x.key === key)?.final;
eq([finalOf(lowOther, LQ), finalOf(lowOther, KLIND), finalOf(lowOther, PAVEL), finalOf(lowOther, QUILL)], [true, true, true, false], "plan: confidence low, class other and a low mentioned person are final; not classified is not");
eq(rf.skipped.filter((x) => x.why.startsWith("known")).every((x) => x.final === true), true, "plan: a known candidate of an event row only is final");
eq([finalOf(aud, LQ), rf.skipped.every((x) => typeof x.final === "boolean")], [false, true], "plan: a source the audit already holds is not final again; every skipped entry carries a boolean final");
const noLq = put("dd-no-lq.json", { results: dd.results.filter((r) => r.key !== LQ) });
const missing = plan("review-first", { dedupe: noLq });
eq([kindsOf(missing, LQ), missing.skipped.find((x) => x.key === LQ)], [[], { key: LQ, why: "no dedupe result", final: false }], "plan: a candidate without a dedupe result is skipped with final false");
// The planner re-checks each classifier entry (the skill runs check-classify, but the planner does not rely on it); the CLI goes further
// and refuses the whole answer, so the planner is exercised in-process here.
const invalidCls = cls((o) => { o.contacts[1].class = "angel"; o.contacts[2].confidence = "certain"; });
const invalid = planIn(invalidCls);
eq(run("plan", "--candidates", cfile, "--dedupe", dfile, "--classify", put("cls-invalid.json", invalidCls), "--mode", "review-first", "--config", CFG, "--now", NOW).status, 1, "plan: the CLI refuses a classification with a class or confidence outside the enums");
eq([kindsOf(invalid, LQ), kindsOf(invalid, KLIND), finalOf(invalid, LQ), finalOf(invalid, KLIND)], [[], [], false, false], "plan: the classifier answer is re-checked: a class or confidence outside the lists writes nothing and is not final");
// A failed CRM search: --failed on dedupe gives status failed (never new), the prompt leaves it out, the plan does not record it.
const dFail = json(run("dedupe", "--candidates", cfile, "--people", render("crm-people.txt"), "--companies", render("crm-companies.txt"), "--entries", render("crm-entries.txt"), "--failed", put("failed.json", [LQ])), "dedupe --failed");
eq([dFail.results.find((r) => r.key === LQ)?.status, dFail.counts, dFail.results.filter((r) => r.key !== LQ).map((r) => r.status).join()], ["failed", { new: 2, known: 3, partial: 1, failed: 1 }, dd.results.filter((r) => r.key !== LQ).map((r) => r.status).join()], "dedupe --failed: the candidate is failed (not new), the others are unchanged");
const dFailFile = put("dd-failed.json", dFail);
const pFail = run("classify-prompt", "--candidates", cfile, "--dedupe", dFailFile, "--playbook", PLAYBOOK, "--thesis", resolve(FIX, "investment-thesis.md"), "--meetings", MEET, "--now", NOW).stdout;
eq([pFail.includes("name: Lotte Quist"), prompt.includes("name: Lotte Quist")], [false, true], "classify-prompt: a candidate whose CRM search failed is not sent to the classifier");
const failedPlan = plan("review-first", { dedupe: dFailFile });
eq([kindsOf(failedPlan, LQ), failedPlan.skipped.find((x) => x.key === LQ)?.final, kindsOf(failedPlan, IRIS).includes("create-person")], [[], false, true], "plan: a failed search is skipped with final false and the others are planned");
eq(run("dedupe", "--candidates", cfile, "--failed", put("failed-bad.json", { nope: 1 })).status, 1, "dedupe: --failed that is not an array of keys exits 1");
// Mentioned persons are always approvals (a dedupe holding their key changes nothing), their text is filtered again, a name twice counts once.
// (in-process: the CLI refuses such an answer outright, the planner's own filter is what is tested here)
const pavel = (patch) => planIn(cls((o) => { Object.assign(o.mentioned[0], patch); }));
const viaDedupe = plan("review-first", { dedupe: put("dd-m.json", { results: [...dd.results, { key: PAVEL, status: "known", personId: "p-x", why: "x" }] }) });
eq([flags(viaDedupe, PAVEL), kindsOf(viaDedupe, PAVEL).includes("link")], [flags(rf, PAVEL), false], "plan: a mentioned person is never linked or written, even when the dedupe file holds its key");
for (const [what, patch] of [["a company with markup", { company: "Orlov <b>Logistics</b>" }], ["a role with a phone number", { role: "Operator +1 555 0100 1234" }], ["a company over 200 characters", { company: "x".repeat(201) }], ["a name with an address", { name: "Pavel Orlov pavel@x.example.com" }], ["a meetingId that is no id", { meetingId: "../x y" }], ["a name of one word", { name: "Pavel" }]]) {
  const pm = pavel(patch), mk = pm.skipped.find((x) => /^mentioned person: /.test(x.why));
  eq([pm.acts.some((a) => a.key.startsWith("m:")), mk?.final], [false, false], `plan: a mentioned person with ${what} writes nothing and is not final`);
}
const dupMentioned = cls((o) => { o.mentioned.push({ ...o.mentioned[0], name: o.mentioned[0].name.toUpperCase(), company: "Other Co" }); });
const mCount = (p) => p.acts.filter((a) => a.key.startsWith("m:")).length;
eq(mCount(planIn(dupMentioned)), mCount(rf), "plan: the same mentioned name twice (case differs) is planned once");
const dupCheck = run("check-classify", "--output", put("o-dup.json", dupMentioned), "--candidates", cfile, "--meetings", MEET);
eq([dupCheck.status, /mentioned\[1\]\.name .* appears twice/.test(dupCheck.stdout)], [1, true], "check-classify: a mentioned name that appears twice (normalised) fails");
// The task links a record; while the record waits for a person there is no task approval.
eq([off.acts.filter((a) => a.kind === "task").every((a) => a.writable === false && a.approval === false && a.dependsOn.includes("create-person")), off.acts.some((a) => a.kind === "task")], [true, true], "plan off: the task act exists but is no approval and no write (no record to link), and says what it depends on");
eq([rf.acts.find((a) => a.key === LQ && a.kind === "task")?.dependsOn, rf.acts.find((a) => a.key === IRIS && a.kind === "task")?.dependsOn, on.acts.find((a) => a.key === IRIS && a.kind === "task")?.dependsOn], [["create-company", "create-person"], ["create-person"], ["create-person"]], "plan: a task act names the record acts of its candidate it depends on");
eq(rf.acts.find((a) => a.key === LQ && a.kind === "task")?.payload.deadline_at, "2026-10-13T00:00:00.000Z", "plan: the task deadline is now + 7 days");
const nearDedupe = put("dd-near.json", { results: dd.results.map((r) => (r.key === LQ ? { ...r, nearCompany: { id: "c-near", name: "Quill Mark Partners" } } : r)) });
const nearPlan = plan("review-first", { dedupe: nearDedupe });
eq([flags(nearPlan, LQ), nearPlan.acts.find((a) => a.key === LQ && a.kind === "task")?.dependsOn], [{ "create-company": "-a", "create-person": "-a", "add-entry": "-a", score: "-a", note: "-a", "follow-up-draft": "-a", task: "--" }, ["create-company", "create-person"]], "plan: a similar company turns every record act into an approval and creates no task approval (the record does not exist yet)");
eq(run("plan", "--candidates", cfile, "--dedupe", dfile, "--classify", OK, "--mode", "sometimes", "--config", CFG).status, 1, "plan: an unknown mode exits 1");
eq(run("plan", "--candidates", cfile, "--dedupe", dfile, "--classify", OK, "--mode", "off", "--config", put("cfg-nolist.json", { ...real, crmFields: { ...real.crmFields, dealList: "" } })).status, 1, "plan: without crmFields.dealList exits 1");

// maxNewPerRun is a whole number from 1 to 100; anything else (0, a fraction, 101, a string) is the default 15.
eq([100, 101, 0, 2.5, "7", -3].map((n) => plan("review-first", { cfg: withCs({ maxNewPerRun: n }) }).maxNewPerRun), [100, 15, 15, 15, 15, 15], "plan: maxNewPerRun above 100 (and 0, a fraction, a string, a negative number) is the default 15; 100 is kept");
eq(plan("review-first", { cfg: withCs({ maxNewPerRun: 1 }) }).maxNewPerRun, 1, "plan: maxNewPerRun 1 is the lower bound");

// Classification re-check: plan, source-note and followup-prompt check the classification again; a URL or a phone number in a reason
// (or in company or role) never reaches the CRM note, and a session that skipped check-classify gets FAIL lines and exit 1.
{
  const dirty = (patch) => put("cls-dirty.json", cls((o) => { patch(o); }));
  const refused = (r, what) => eq([r.status, r.stdout, /^FAIL: classification: contacts\[\d+\]\.\w+/m.test(r.stderr)], [1, "", true], `${what}: exits 1 with a FAIL line on a classification that check-classify would refuse (stderr: ${r.stderr.trim().slice(0, 160)})`);
  const withUrl = dirty((o) => { o.contacts[1].reason = "Investor relations at a fund, see https://evil.example.com/pitch for the deck."; });
  const withPhone = dirty((o) => { o.contacts[0].reason = "Founder of a drives company, call +49 170 1234567 to reach them."; });
  const withRole = dirty((o) => { o.contacts[2].role = "Partner (www.example.com/me)"; });
  const noReason = dirty((o) => { delete o.contacts[1].reason; });
  const planWith = (file) => run("plan", "--candidates", cfile, "--dedupe", dfile, "--classify", file, "--mode", "review-first", "--config", CFG, "--now", NOW);
  refused(planWith(withUrl), "plan: a reason with a URL");
  refused(planWith(withPhone), "plan: a reason with a phone number");
  refused(planWith(withRole), "plan: a role with a link");
  refused(planWith(noReason), "plan: a missing reason");
  refused(run("source-note", "--candidate", LQ, "--candidates", cfile, "--classify", withUrl), "source-note: a reason with a URL");
  refused(run("source-note", "--candidate", IRIS, "--candidates", cfile, "--classify", withPhone), "source-note: a reason with a phone number");
  refused(run("followup-prompt", "--candidate", LQ, "--candidates", cfile, "--classify", withUrl, "--tone", TONE, "--config", CFG), "followup-prompt: a reason with a URL");
  eq(run("source-note", "--candidate", LQ, "--candidates", cfile, "--classify", OK).status, 0, "source-note: the clean fixture classification still passes the second check");
}

// Own domains: without them the fund's own people would be contacts; candidates and plan refuse (exit 1, a FAIL line, nothing on stdout).
{
  const noOwn = put("cfg-no-own.json", { ...real, autopilot: { ...real.autopilot, notes: { ...real.autopilot.notes, internalDomains: [] }, inbound: { ...real.autopilot.inbound, ownDomains: [] } } });
  const noKeys = (() => { const ap = { ...real.autopilot }; delete ap.notes; delete ap.inbound; return put("cfg-no-keys.json", { ...real, autopilot: ap }); })();
  const emptyStrings = put("cfg-blank-own.json", { ...real, autopilot: { ...real.autopilot, notes: { ...real.autopilot.notes, internalDomains: ["", "  "] }, inbound: { ...real.autopilot.inbound, ownDomains: [] } } });
  for (const [file, what] of [[noOwn, "both lists empty"], [noKeys, "both keys missing"], [emptyStrings, "only blank entries"]]) {
    const c = run("candidates", "--meetings", MEET, "--threads", MAIL, "--config", file, "--now", NOW);
    eq([c.status, c.stdout, c.stderr.startsWith("FAIL: no own domains")], [1, "", true], `candidates: ${what} exits 1 with a FAIL line (stderr: ${c.stderr.trim().slice(0, 120)})`);
    const pl = run("plan", "--candidates", cfile, "--dedupe", dfile, "--classify", OK, "--mode", "review-first", "--config", file, "--now", NOW);
    eq([pl.status, pl.stdout, pl.stderr.startsWith("FAIL: no own domains")], [1, "", true], `plan: ${what} exits 1 with a FAIL line (stderr: ${pl.stderr.trim().slice(0, 120)})`);
  }
  eq(run("candidates", "--meetings", MEET, "--threads", MAIL, "--config", put("cfg-one-own.json", { ...real, autopilot: { ...real.autopilot, notes: { ...real.autopilot.notes, internalDomains: [] } } }), "--now", NOW).status, 0, "candidates: inbound.ownDomains alone is enough");
}

// The address splitter reads "quoted, display; names" as one address. The check must fail when that branch is removed: the same function,
// loaded from a copy of the CLI without the two quote lines, splits them wrongly.
{
  const QUOTED = [
    ['"Falk; Ida" <ida.falk@fernlea.example.com>, kai@eastwind.example.net', ['"Falk; Ida" <ida.falk@fernlea.example.com>', "kai@eastwind.example.net"]],
    ['"Ng \\"Lee; Q\\"" <lee.ng@fernlea.example.com>; "Moss, Per" <per.moss@eastwind.example.net>', ['"Ng \\"Lee; Q\\"" <lee.ng@fernlea.example.com>', '"Moss, Per" <per.moss@eastwind.example.net>']],
    ["Falk, Ida <ida.falk@fernlea.example.com>", ["Falk, Ida <ida.falk@fernlea.example.com>"]],
  ];
  for (const [text, want] of QUOTED) eq(CC.splitAddressList(text), want, `splitAddressList: ${text.slice(0, 50)}`);
  const src = readFileSync(CLI, "utf8");
  const quoteLines = /^ {4}if \(quote\) \{.*\n {4}if \(ch === '"' && !angle\) \{.*\n/m;
  eq(quoteLines.test(src), true, "splitAddressList: the quote branch is found in the source (the mutation below has something to remove)");
  const mutantFile = resolve(out, "contacts-cli-no-quote.mjs");
  writeFileSync(mutantFile, src.replace(quoteLines, "").replace(/from "\.\//g, `from "${pathToFileURL(resolve(ROOT, "tools/ops")).href}/`));
  const Mutant = await import(pathToFileURL(mutantFile).href);
  eq(QUOTED.slice(0, 2).map(([text, want]) => JSON.stringify(Mutant.splitAddressList(text)) === JSON.stringify(want)), [false, false], "splitAddressList: without the quote branch the quoted cases above split wrongly, so they do fail when it is removed");
}

// ── source-note ──
const note = (key, ...extra) => run("source-note", "--candidate", key, "--candidates", cfile, "--classify", OK, ...extra);
const n1 = note(IRIS);
eq(n1.status, 0, `source-note exit status (stderr: ${n1.stderr.trim()})`);
eq([/[^\s@]+@[^\s@]+/.test(n1.stdout), n1.stdout.includes('Meeting "Fernlea Robotics | Intro call" (Oct 2, 2026)'), n1.stdout.includes('Event list "Example Evening", row 9'), n1.stdout.includes("- Class: startup (high)"), n1.stdout.includes("- Why: Founder of an electric drive")], [false, true, true, true, true], "source-note: who, where met (meeting title and date, event file and row), class and reason, no address");
eq(n1.stdout.includes("LinkedIn"), false, "source-note: no LinkedIn line when there is no link");
eq(note(KLIND).stdout.includes("- LinkedIn: https://www.linkedin.com/in/kai-lindgren-example"), true, "source-note: the filtered LinkedIn link is shown");
eq(note("e:#91941801fd").stdout, n1.stdout, "source-note: the prompt form of the key finds the same candidate");
eq(note(LQ).stdout.includes('Mail thread "Quillstone Partners: next steps" (Oct 4, 2026)'), true, "source-note: a mail source shows subject and date");
eq(note(EMIL).stdout.includes("not classified"), true, "source-note: an unclassified candidate says so");
eq(CC.sourceNote({ name: "A B <x>", company: "Foo", role: "", kind: "person", linkedin: "https://evil.example.com/in/x", sources: [{ type: "event", title: "a@b.example.com [x](y)", row: 2 }] }, { class: "other", confidence: "low", reason: "see `a@b.example.com`" }).match(/[^\s@]+@[^\s@]+|\]\(|evil/), null, "sourceNote: an address, markdown link characters and an unfiltered link never reach the note");
eq(note("e:nobody@x.example.com").status, 1, "source-note: an unknown candidate exits 1");
eq(note(PAVEL).stdout.includes("Pavel Orlov, Operator, Orlov Logistics Services"), true, "source-note: a mentioned person is found in the classifier answer");
eq(note(IRIS, "--tz", "Pacific/Auckland").stdout.includes("(Oct 2, 2026)"), true, "source-note: --tz picks the zone of the date");

// ── followup-prompt, followup-mail, recent, check-mail ──
const fp = (key, ...extra) => run("followup-prompt", "--candidate", key, "--candidates", cfile, "--classify", OK, "--tone", TONE, "--config", CFG, ...extra);
const f = fp(LQ);
eq(f.status, 0, `followup-prompt exit status (stderr: ${f.stderr.trim()})`);
eq([/[^\s@]+@[^\s@]+/.test(f.stdout), fences(f.stdout).map((m) => m[1]), f.stdout.includes("Purpose: contact-follow-up"), f.stdout.includes('Sign exactly as "Sam Partner, Example Fund"'), /NN\/100/.test(f.stdout)], [false, ["contact facts"], true, true, true], "followup-prompt: purpose, signature and score guardrail stated, the facts fenced, no address");
eq(f.stdout.includes("verbatim: https://calendar.example.org/book/sam"), true, "followup-prompt: a real booking link is offered verbatim");
const noLink = { ...real, autopilot: { ...real.autopilot, fund: { ...real.autopilot.fund, bookingLink: "<booking link>" } } };
eq(run("followup-prompt", "--candidate", LQ, "--candidates", cfile, "--classify", OK, "--tone", TONE, "--config", put("cfg-nolink.json", noLink)).stdout.includes("No links of any kind"), true, "followup-prompt: while the booking link is a placeholder no link is offered");
eq([/Language hint: English/.test(f.stdout), /Language hint: German/.test(fp(EMIL, "--language", "German").stdout), CC.languageHint(["Kaffee mit Emil Fjord und der Termin"]), CC.languageHint(["Fernlea Robotics | Intro call"]), CC.languageHint(["???"], "German")], [true, true, "German", "English", "German"], "followup-prompt: the language hint follows the source titles, --language overrides");
eq(fp(KLIND).status, 1, "followup-prompt: a candidate with an event source only (no meeting or mail) exits 1");
eq(run("followup-prompt", "--candidate", LQ, "--candidates", cfile, "--classify", OK, "--tone", TONE, "--config", put("cfg-nopurpose.json", { ...real, autopilot: { ...real.autopilot, purposes: { dealflow: [] } } })).status, 1, "followup-prompt: without autopilot.purposes.contacts exits 1");
const mailOut = resolve(out, "sub", "mail.json");
const BODY = "Hello Lotte, thank you for the exchange about the next steps at Quillstone Partners. We would gladly take a moment to find out whether a conversation makes sense. Please suggest a time that suits you.\n\nBest regards\nSam Partner, Example Fund";
const fm = (draft, key = LQ) => run("followup-mail", "--candidate", key, "--candidates", cfile, "--draft", put("draft.json", draft), "--out", mailOut);
const fmOk = fm({ subject: "  Thanks for the exchange ", body: `${BODY}\n` });
eq([fmOk.status, fmOk.stdout.startsWith("OK ")], [0, true], `followup-mail: a good draft is written (stderr: ${fmOk.stderr.trim()})`);
const mail = JSON.parse(readFileSync(mailOut, "utf8"));
eq([mail.to, mail.purpose, mail.subject, mail.body, Object.keys(mail)], ["lotte.quist.fixture@gmail.example", "contact-follow-up", "Thanks for the exchange", BODY, ["to", "purpose", "subject", "body"]], "followup-mail: the recipient is the candidate's address, subject and body are trimmed");
eq(fm({ subject: "s", body: BODY, to: ["attacker@example.com"] }).status, 1, "followup-mail: a draft with a 'to' key is refused");
eq(JSON.parse(readFileSync(mailOut, "utf8")).to, "lotte.quist.fixture@gmail.example", "followup-mail: a refused draft writes nothing new");
for (const [what, draft] of [["an extra key", { subject: "s", body: BODY, purpose: "x" }], ["no subject", { body: BODY }], ["an empty subject", { subject: "  ", body: BODY }], ["no body", { subject: "s" }], ["a body that is not a string", { subject: "s", body: 5 }], ["a subject over 150 characters", { subject: "s".repeat(151), body: BODY }], ["a body over 3000 characters", { subject: "s", body: "b".repeat(3001) }]]) {
  const r = fm(draft);
  eq([r.status, r.stdout.startsWith("FAIL: ")], [1, true], `followup-mail: ${what} exits 1 with FAIL`);
}
eq(fm({ subject: "s".repeat(150), body: "b".repeat(3000) }).status, 0, "followup-mail: exactly 150 and 3000 characters are fine");
eq(fm({ subject: "s", body: BODY }, "n:greta weiss|weiss family office").stdout.startsWith("FAIL: the candidate has no address"), true, "followup-mail: a candidate without an address exits 1");
{
  const ans = /nothing before or after it[^\n]*\n(\{.*\})\n/.exec(f.stdout)?.[1];
  let shape = null;
  try { shape = JSON.parse(ans ?? ""); } catch { /* reported below */ }
  eq(shape && Object.keys(shape), ["subject", "body"], "followup-prompt: the answer shape the prompt states is exactly {subject, body}");
  const built = Object.fromEntries(Object.keys(shape ?? {}).map((k) => [k, k === "subject" ? "Thanks for the exchange" : BODY]));
  const viaPrompt = fm(built);
  eq([viaPrompt.status, viaPrompt.stdout.startsWith("OK ")], [0, true], `followup-mail: a draft in the shape the prompt states is accepted (${viaPrompt.stdout.trim().slice(0, 160)})`);
}
fm({ subject: "Thanks for the exchange", body: BODY });
const recentOut = resolve(out, "recent.json");
const draftAudit = [
  { module: "contacts", timestampUtc: "2026-10-05T09:00:00Z", act: { kind: "mail-draft", target: { to: "lotte.quist.fixture@gmail.example", threadId: "x" } } },
  { module: "contacts", timestampUtc: "2026-10-05T09:05:00Z", act: { kind: "task", target: { to: "other@example.com" } } },
  { module: "dealflow", timestampUtc: "2026-10-05T09:06:00Z", act: { kind: "mail-draft", target: { to: "foreign@example.com" } } },
];
const rc = run("recent", "--audit", put("audit-recent.json", draftAudit), "--out", recentOut);
eq([rc.status, rc.stdout.trim(), JSON.parse(readFileSync(recentOut, "utf8"))], [0, "OK 1", [{ to: "lotte.quist.fixture@gmail.example", sentAt: "2026-10-05T09:00:00Z", answered: false }]], "recent: only the contacts module's mail-draft acts, in check-mail's --recent shape");
eq(run("recent", "--audit", put("audit-bad.json", { nope: 1 }), "--out", recentOut).status, 1, "recent: an audit export that is no array exits 1");
// The mail is held by the shared check-mail rules under module contacts.
const mailFile = put("mail-ok.json", { to: ["lotte.quist.fixture@gmail.example"], purpose: "contact-follow-up", subject: "Thanks for the exchange", body: BODY });
const cm = (mailPath, recent, ...extra) => spawnSync(process.execPath, [DEAL, "check-mail", "--mail", mailPath, "--purpose-list", "contacts", "--config", CFG, "--recent", recent, "--now", NOW, ...extra], { encoding: "utf8", env: { ...process.env, FUND_OS_CONFIG: CFG } });
const emptyRecent = put("recent-empty.json", []);
eq([cm(mailFile, emptyRecent, "--expect-to", "lotte.quist.fixture@gmail.example").status, cm(mailFile, emptyRecent, "--expect-to", "lotte.quist.fixture@gmail.example").stdout.trim()], [0, "OK"], "check-mail --purpose-list contacts: the follow-up passes");
eq(cm(mailFile, emptyRecent).stdout.includes("--expect-to is required for contacts"), true, "check-mail: the recipient binding is required for contacts");
eq(cm(mailFile, recentOut, "--expect-to", "lotte.quist.fixture@gmail.example").stdout.includes("already wrote to lotte.quist.fixture@gmail.example"), true, "check-mail: a second draft inside the no-repeat window is refused");
eq(cm(put("mail-other.json", { to: ["other@example.com"], purpose: "contact-follow-up", subject: "x", body: BODY }), emptyRecent, "--expect-to", "lotte.quist.fixture@gmail.example").status, 1, "check-mail: the recipient must be the expected address");
eq(cm(put("mail-purpose.json", { to: ["lotte.quist.fixture@gmail.example"], purpose: "pass", subject: "x", body: BODY }), emptyRecent, "--expect-to", "lotte.quist.fixture@gmail.example").stdout.includes("is not allowed for contacts"), true, "check-mail: a purpose outside autopilot.purposes.contacts is refused");


// ── approved-acts: what an approved contact-record may execute, checked again before a session writes ──
{
  const recActs = rf.acts.filter((a) => a.key === LQ && ["create-company", "create-person", "add-entry", "score", "note"].includes(a.kind)).map((a) => ({ key: a.key, kind: a.kind, writable: a.writable, approval: a.approval, payload: a.payload }));
  const lqSources = cOf(LQ).sources;
  const appr = (patch = {}) => ({ id: "appr-1", version: 3, kind: "contact-record", module: "contacts", title: "Lotte Quist · lp", target: { name: "Lotte Quist" }, acts: recActs, source: lqSources, status: "approved", rationale: "r", createdAt: "2026-10-05T10:00:00Z", createdBy: "agent · contacts autopilot", decidedAt: "2026-10-06T08:00:00Z", decidedBy: "p", note: null, ...patch });
  const aa = (docs) => json(run("approved-acts", "--approvals", put("approvals.json", docs), "--config", CFG), "approved-acts");
  const okAA = aa([appr(), appr({ id: "appr-2", status: "pending" }), appr({ id: "appr-3", status: "rejected" }), { kind: "task", module: "contacts", status: "approved", id: "t1" }, { kind: "contact-record", module: "notes", status: "approved", id: "n1", acts: [] }]);
  const ex = okAA.executable[0];
  eq([okAA.executable.length, okAA.refused, okAA.ignored.map((x) => x.approvalId)], [1, [], ["appr-2", "appr-3"]], "approved-acts: one approved, unexecuted contact-record is executable; pending and rejected are ignored; another kind or module is not listed");
  eq([ex?.approvalId, ex?.version, ex?.key, ex?.class, ex?.acts.map((a) => a.kind), ex?.acts.every((a) => Object.keys(a).join() === "kind,payload")], ["appr-1", 3, LQ, "lp", ["create-company", "create-person", "add-entry", "score", "note"], true], "approved-acts: the executable acts are the stored kinds and payloads, in order, with the approval's id, version and key");
  eq([ex?.rationales, /[^\s@]+@[^\s@]+/.test(ex?.noteBody ?? "@"), (ex?.noteBody ?? "").includes("Class: lp"), (ex?.noteBody ?? "").includes('Mail thread "Quillstone Partners: next steps"')], [[`mail thread-0003: contact ${LQ} · approved proposal appr-1`, `event evt1 row 13: contact ${LQ} · approved proposal appr-1`], false, true, true], "approved-acts: one audit rationale per source in the plan's format, and a source note from the stored data without an address");
  eq(aa({ entries: [{ id: "appr-w", version: 7, data: { ...appr(), id: undefined, version: undefined } }] }).executable.map((x) => [x.approvalId, x.version]), [["appr-w", 7]], "approved-acts: a document wrapped as {id, version, data} is read");
  const refusedWhy = (patch, what, re) => { const r = aa([appr(patch)]); eq([r.executable.length, r.refused.length, re.test(r.refused[0]?.why ?? "")], [0, 1, true], `approved-acts: ${what} is refused (${(r.refused[0]?.why ?? "no refusal").slice(0, 120)})`); };
  const withAct = (kind, patchPayload) => ({ acts: recActs.map((a) => (a.kind === kind ? { ...a, payload: { ...a.payload, ...patchPayload } } : a)) });
  const stageActs = (payload) => ({ acts: recActs.map((a) => (a.kind === "add-entry" ? { ...a, payload } : a)) });
  const inv = { list: "example_investor_list", parent: "company", company: "Quillstone Partners" }, deal = { list: "example_deal_list", parent: "company", company: "Quillstone Partners" };
  for (const bad of ["Invested", "Term sheet", "Commitment", "Closed", "Passive", "Screening"]) refusedWhy(stageActs({ ...inv, status: bad }), `an entry at "${bad}"`, /not a stage or status|committed or passive/);
  refusedWhy(stageActs({ ...deal, stage: "Invested" }), "a forged stage Invested on the deal list", /committed or passive/);
  refusedWhy(stageActs({ ...deal, status: "Target" }), "Target on the deal list", /investor list only/);
  refusedWhy(stageActs({ ...inv, stage: "New" }), "the new stage on the investor list", /deal list only/);
  refusedWhy(stageActs({ list: "other_list", parent: "company", company: "Quillstone Partners", status: "Target" }), "a list that is neither configured list", /investor list only/);
  refusedWhy(stageActs({ ...inv, status: "Target", stage: "New" }), "an entry with both stage and status", /exactly one/);
  for (const kind of ["mail-draft", "follow-up-draft", "task", "link", "create-task", "delete-record", ""]) refusedWhy({ acts: [...recActs, { key: LQ, kind, payload: {} }] }, `an act of kind "${kind}"`, /is not one of create-company/);
  refusedWhy({ acts: [...recActs, { ...recActs[0], key: "e:other@x.example.com" }] }, "an act kind twice", /appears twice/);
  refusedWhy({ acts: recActs.map((a, i) => (i === 1 ? { ...a, key: "e:other@x.example.com" } : a)) }, "acts of two candidate keys", /one candidate key/);
  refusedWhy({ acts: recActs.map((a) => (a.kind === "create-person" ? { ...a, payload: { ...a.payload, secret: "x" } } : a)) }, "a payload key the plan never writes", /unknown payload key/);
  refusedWhy(withAct("create-person", { name: "Lotte <b>Quist</b>" }), "markup in a name", /HTML tag/);
  refusedWhy(withAct("create-person", { company: "x".repeat(201) }), "a company over 200 characters", /longer than 200/);
  refusedWhy(withAct("create-person", { email: "not-an-address" }), "a person email that is no address", /not an address/);
  refusedWhy(withAct("create-person", { linkedin: "https://evil.example.com/in/x" }), "a LinkedIn link that is not normalised", /LinkedIn/);
  refusedWhy(withAct("create-company", { nearCompany: { id: "c1", name: "Quill Mark Partners" } }), "a similar company (nearCompany)", /similar company/);
  refusedWhy(withAct("score", { kind: "deal" }), "a score whose kind does not fit its list", /do not fit/);
  refusedWhy({ acts: [{ key: LQ, kind: "create-person", extra: 1, payload: recActs[1].payload }] }, "an unknown act key", /unknown act key/);
  refusedWhy({ acts: [] }, "no acts", /no acts/);
  refusedWhy({ source: [{ type: "meeting", id: "../x" }, "x"] }, "no usable source", /no usable source/);
  const done = aa([appr({ executedAt: "2026-10-06T09:00:00Z", executedRunId: "contacts-2026-10-06T09:00:00Z" })]);
  eq([done.executable.length, done.refused.length, done.ignored], [0, 0, [{ approvalId: "appr-1", why: "already executed" }]], "approved-acts: an approval with executedAt is not executed again");
  eq(run("approved-acts", "--approvals", put("not-array.json", { nope: 1 }), "--config", CFG).status, 1, "approved-acts: an export that is not an array exits 1");

  // The zone of the dates in every text the module writes is --tz, else autopilot.notes.timezone, else UTC (source-note, the approved note
  // body and the follow-up prompt agree); a name that is no zone is a FAIL line and exit 1, not a RangeError.
  const withTz = (tz) => put(`cfg-tz-${String(tz).replace(/\W/g, "_")}.json`, { ...real, autopilot: { ...real.autopilot, notes: { ...real.autopilot.notes, timezone: tz } } });
  const noteDate = (cfgFile) => run("approved-acts", "--approvals", put("approvals-tz.json", [appr()]), "--config", cfgFile);
  eq([noteDate(withTz("UTC")), noteDate(withTz("Pacific/Auckland"))].map((r) => JSON.parse(r.stdout).executable[0].noteBody.includes('Mail thread "Quillstone Partners: next steps" (Oct 4, 2026)') ? "Oct 4" : JSON.parse(r.stdout).executable[0].noteBody.includes("(Oct 5, 2026)") ? "Oct 5" : "?"), ["Oct 4", "Oct 5"], "approved-acts: the note body's dates follow autopilot.notes.timezone");
  eq(JSON.parse(run("approved-acts", "--approvals", put("approvals-tz2.json", [appr()]), "--config", withTz("UTC"), "--tz", "Pacific/Auckland").stdout).executable[0].noteBody.includes("(Oct 5, 2026)"), true, "approved-acts: --tz wins over the configuration");
  const noZone = put("cfg-no-tz.json", { ...real, autopilot: { ...real.autopilot, notes: { ...real.autopilot.notes, timezone: undefined } } });
  eq(JSON.parse(run("approved-acts", "--approvals", put("approvals-tz3.json", [appr()]), "--config", noZone).stdout).executable[0].noteBody.includes("(Oct 4, 2026)"), true, "approved-acts: without a configured zone the dates are UTC");
  const fpWith = (cfgFile, ...extra) => run("followup-prompt", "--candidate", LQ, "--candidates", cfile, "--classify", OK, "--tone", TONE, "--config", cfgFile, ...extra);
  eq([fpWith(withTz("UTC")).stdout.includes('(Oct 4, 2026)'), fpWith(withTz("Pacific/Auckland")).stdout.includes('(Oct 5, 2026)'), fpWith(withTz("UTC"), "--tz", "Pacific/Auckland").stdout.includes('(Oct 5, 2026)')], [true, true, true], "followup-prompt: the dates of 'How we met' follow autopilot.notes.timezone (and --tz)");
  const badZone = (r, what) => eq([r.status, r.stdout, r.stderr.startsWith("FAIL: ") && /is not a time zone/.test(r.stderr), /RangeError|at .*\.mjs:\d+/.test(r.stderr)], [1, "", true, false], `${what}: an invalid time zone is a FAIL line and exit 1, not a RangeError (stderr: ${r.stderr.trim().slice(0, 140)})`);
  badZone(run("source-note", "--candidate", LQ, "--candidates", cfile, "--classify", OK, "--tz", "Nowhere/Land"), "source-note --tz");
  badZone(run("source-note", "--candidate", LQ, "--candidates", cfile, "--classify", OK, "--config", withTz("Mars/Olympus")), "source-note with a bad configured zone");
  badZone(run("followup-prompt", "--candidate", LQ, "--candidates", cfile, "--classify", OK, "--tone", TONE, "--config", CFG, "--tz", "Nowhere/Land"), "followup-prompt --tz");
  badZone(fpWith(withTz("Mars/Olympus")), "followup-prompt with a bad configured zone");
  badZone(run("approved-acts", "--approvals", put("approvals-tz4.json", [appr()]), "--config", CFG, "--tz", "Nowhere/Land"), "approved-acts --tz");
  badZone(noteDate(withTz("Mars/Olympus")), "approved-acts with a bad configured zone");
}

// ── the switch knows the module ──
const sw = spawnSync(process.execPath, [DEAL, "switch", "--settings", put("sw.json", { modules: { contacts: { mode: "review-first" } } }), "--module", "contacts", "--config", CFG], { encoding: "utf8" });
eq([sw.status, JSON.parse(sw.stdout || "{}")], [0, { module: "contacts", mode: "review-first", maxOutboundPerDay: 20 }], "deal-score-cli switch: module contacts");
eq(JSON.parse(spawnSync(process.execPath, [DEAL, "switch", "--settings", put("sw2.json", {}), "--module", "contacts", "--config", CFG], { encoding: "utf8" }).stdout).mode, "off", "deal-score-cli switch: a missing contacts entry is off");
const su = spawnSync(process.execPath, [DEAL, "store-url", "--module", "contacts", "--config", CFG], { encoding: "utf8" });
eq([su.status, su.stdout.trim()], [0, real.autopilot.inboxStore], "deal-score-cli store-url: contacts falls back to the Agent Workbench store");
eq(run("nonsense").status, 2, "contacts-cli: an unknown subcommand exits 2");

console.log(`  contacts-cli: ${checks} checks, ${failures} failed`);
process.exit(failures ? 1 : 0);
