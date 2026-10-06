#!/usr/bin/env node
/**
 * Drift guard for the ranking mirrored from the Deal Cockpit into the digest CLI.
 *
 * The Monday digest ranks the deal list as the cockpit ranks it (score x urgency, passes excluded, the attention set on top).
 * The cockpit's rank arithmetic is a pure region of the page (// region:rank ... // endregion:rank) in
 * plugins/fund-os/templates/screens/deal-cockpit.html; tools/ops/digest-cli.mjs carries the same region byte for byte.
 * This check cuts the region out of both and holds them identical, holds the helper lines the region reads (constants,
 * first/scalar/num/str, urgencyIsStale) and parseAttioText() to the cockpit's own text, runs the page's region in node:vm
 * with an empty context on tools/ops/fixtures/digest/ (entries.txt, names.txt) and holds `digest-cli.mjs rank` to the same
 * result row by row. No model, no network, no browser.
 *
 *   node tools/check-digest-mirror.mjs        (run by tools/check-screen-templates.sh)
 */
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";
import { rankConfig } from "./ops/digest-cli.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = join(root, "plugins/fund-os/templates/screens/deal-cockpit.html");
const CLI = join(root, "tools/ops/digest-cli.mjs");
const FIX = join(root, "tools/ops/fixtures/digest");
const CONFIG_FILE = join(root, "tools/ops/fixtures/user-config.example.json");
const TODAY = "2026-10-05";

let failures = 0, checks = 0;
const fail = (msg) => { failures++; console.error(`   FAIL: ${msg}`); };
const eq = (got, want, what) => { checks++; if (JSON.stringify(got) !== JSON.stringify(want)) fail(`${what}: got ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
const plain = (v) => JSON.parse(JSON.stringify(v));

const html = readFileSync(PAGE, "utf8");
const cli = readFileSync(CLI, "utf8");
const regionOf = (source) => /^ *\/\/ region:rank\b.*$[\s\S]*?^ *\/\/ endregion:rank\b.*$/m.exec(source)?.[0] ?? null;
const scriptOf = (source) => { const b = [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]; return b.length === 1 ? b[0][1] : null; };
function extractFunction(source, name) {
  const lines = source.split("\n");
  const start = lines.findIndex((l) => l.startsWith(`  function ${name}(`));
  if (start < 0) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) if (/^ {2}\S/.test(lines[i]) && !lines[i].startsWith("  }")) { end = i; break; }
  return lines.slice(start, end).join("\n").trimEnd();
}

// ── The page and the CLI: one script block, the regions, byte for byte ─────────────────
const src = scriptOf(html);
if (src === null) fail("deal-cockpit.html does not hold exactly one script block");
const pageRegion = src ? regionOf(src) : null;
const cliRegion = regionOf(cli);
{
  const before = failures;
  if (!pageRegion) fail("the page has no // region:rank ... // endregion:rank");
  if (!cliRegion) fail("tools/ops/digest-cli.mjs has no // region:rank ... // endregion:rank");
  if (pageRegion && cliRegion && pageRegion !== cliRegion) {
    const la = pageRegion.split("\n"), lb = cliRegion.split("\n");
    const at = la.findIndex((l, i) => l !== lb[i]);
    fail(`the rank region differs between the cockpit and digest-cli.mjs (first difference at region line ${(at < 0 ? Math.min(la.length, lb.length) : at) + 1}); the cockpit is the master, mirror it verbatim`);
  }
  for (const name of ["toDeal", "rank"]) if (pageRegion && !new RegExp(`^  function ${name}\\(`, "m").test(pageRegion)) fail(`${name}() is not inside the rank region of the page`);
  checks++;
  if (failures === before) console.log(`   ok  the rank region is byte-identical in the cockpit and digest-cli.mjs (${pageRegion.split("\n").length} lines)`);
}

// ── The helper lines the region reads, and parseAttioText(): the cockpit's own text ─────
{
  const before = failures;
  const pageLines = new Set((src ?? "").split("\n"));
  const mirror = /^function cockpitMirror\(CONFIG\) \{$([\s\S]*?)^ {2}return \{ toDeal, rank, parseAttioText \};$/m.exec(cli)?.[1] ?? "";
  if (!mirror) fail("digest-cli.mjs has no cockpitMirror(CONFIG) function");
  const prefix = mirror.slice(0, mirror.indexOf("  // ── the region ──"));
  const helpers = prefix.slice(0, prefix.indexOf("  function parseAttioText(")).split("\n").filter((l) => l.trim() && !l.trim().startsWith("//"));
  const staleLines = new Set((extractFunction(prefix, "urgencyIsStale") ?? "").split("\n"));
  for (const l of helpers) if (!staleLines.has(l) && !pageLines.has(l)) fail(`a helper line of digest-cli.mjs is not in the cockpit: ${l.trim().slice(0, 100)}`);
  for (const name of ["urgencyIsStale", "parseAttioText"]) {
    const a = extractFunction(src ?? "", name), b = extractFunction(prefix, name);
    if (!a) fail(`${name}() is not in the cockpit`);
    else if (a !== b) fail(`${name}() in digest-cli.mjs differs from the cockpit's`);
  }
  for (const c of ["const URGENCY_VALID_DAYS", "const TOP_N", "const LIVE", "const PASSED", "const first", "const scalar", "const num", "const str"]) {
    checks++;
    if (!helpers.some((l) => l.startsWith(`  ${c} `))) fail(`digest-cli.mjs does not carry the cockpit line "${c}"`);
  }
  checks++;
  if (failures === before) console.log("   ok  constants, first/scalar/num/str, urgencyIsStale() and parseAttioText() are the cockpit's lines");
}

// ── The page's region on the fixtures, in node:vm with no globals ──────────────────────
const CONFIG = rankConfig(JSON.parse(readFileSync(CONFIG_FILE, "utf8")));
let page = null;
if (pageRegion && src) {
  try {
    const lines = src.split("\n");
    const take = (p) => lines.find((l) => l.startsWith(p)) ?? "";
    const helperSrc = [take("  const URGENCY_VALID_DAYS = "), extractFunction(src, "urgencyIsStale"), take("  const TOP_N = "), take("  const LIVE = "), take("  const PASSED = "), take("  const first = "), take("  const scalar = "), take("  const num = "), take("  const str = ")].join("\n");
    page = vm.runInContext(`(function (CONFIG) {${helperSrc}\n${pageRegion}\n return { toDeal, rank };})`, vm.createContext({}), { filename: "rank-region", timeout: 5000 })(plain(CONFIG));
  } catch (e) { fail(`the rank region does not evaluate with no globals: ${e.message}`); }
}
let parseText = null;
{
  const fn = extractFunction(src ?? "", "parseAttioText");
  if (fn) parseText = vm.runInContext(`(${fn.replace(/^\s*function parseAttioText/, "function")})`, vm.createContext({}), { filename: "parseAttioText", timeout: 5000 });
}

const entriesText = readFileSync(join(FIX, "entries.txt"), "utf8");
const namesText = readFileSync(join(FIX, "names.txt"), "utf8");
const today = new Date(`${TODAY}T00:00:00Z`);
let cockpitRows = null;
if (page && parseText) {
  const before = failures;
  const entries = plain(parseText(entriesText).entries);
  const names = new Map(plain(parseText(namesText)).map((r) => [r.record_id, r.attributes.name]));
  eq(entries.length, 12, "entries in entries.txt");
  const deals = entries.map((e) => { const d = page.toDeal(e); d.name = names.get(d.recordId) ?? "?"; return d; });
  cockpitRows = plain(page.rank(deals, today));
  const by = Object.fromEntries(cockpitRows.map((r) => [r.d.name, r]));
  eq(cockpitRows.filter((r) => r.rank !== null).sort((x, y) => x.rank - y.rank).map((r) => r.d.name).slice(0, 3), ["Birchwood Health", "Alder Robotics", "Delta Fern"], "the first three ranks (by score x urgency, passes out)");
  eq([by["Hollow Pine"].rank, by["Iris Fleet"].rank], [null, null], "passes never rank");
  eq([by["Hollow Pine"].outcome, by["Iris Fleet"].outcome], [3, 3], "passes are 'Pass with care'");
  eq([by["Hollow Pine"].next, by["Iris Fleet"].next], ["Decline sent?", "Log the loss reason"], "the rejected stage and the other passed stage read from CONFIG");
  eq(by["Delta Fern"].scoreIsThesis, true, "thesis fit stands in for a missing quality");
  eq(by["Alder Robotics"].why, "Live process: In diligence", "a live process (CONFIG.liveStages) needs attention");
  eq(by["Birchwood Health"].why, "Round closing soon", "urgency 85 says closing soon");
  eq(by["Ember Grid"].why, "Top 20 by score × urgency", "a top-20 row without a window says so");
  eq(by["Kestrel Works"].stale, true, "an old as-of date is stale");
  eq(by["Juniper Cloud"].rank, null, "no score, no rank");
  if (failures === before) console.log("   ok  the page's region ranks the digest fixtures: passes out, thesis stands in, live and open windows need attention, top 20 labelled");
}

// ── digest-cli rank holds the same result ──────────────────────────────────────────────
function runRank(extra = []) {
  const r = spawnSync(process.execPath, [CLI, "rank", "--entries", join(FIX, "entries.txt"), "--names", join(FIX, "names.txt"), "--today", TODAY, "--config", CONFIG_FILE, ...extra], { encoding: "utf8" });
  if (r.status !== 0) { fail(`digest-cli rank exited ${r.status}: ${r.stderr.split("\n")[0]}`); return null; }
  try { return JSON.parse(r.stdout); } catch (e) { fail(`digest-cli rank did not print JSON: ${e.message}`); return null; }
}
const out = runRank();
if (out && cockpitRows) {
  const before = failures;
  const live = cockpitRows.filter((r) => r.d.stage === null || !CONFIG.passedStages.includes(r.d.stage));
  const byName = new Map(live.map((r) => [r.d.name, r]));
  eq([out.total, out.passes, out.ignored, out.ranked.length], [12, 2, 0, 10], "total, passes, ignored and rows of rank");
  for (const row of out.ranked) {
    const c = byName.get(row.name);
    if (!c) { fail(`rank printed ${row.name}, which the cockpit does not keep`); continue; }
    eq([row.rank, row.product, row.attention, row.why, row.outcome, row.stale, row.scoreIsThesis], [c.rank, c.product, c.attention, c.why, c.outcome, c.stale, c.scoreIsThesis], `${row.name}: rank, product, attention, why, outcome, stale, thesis flag`);
  }
  const att = out.ranked.map((r) => r.attention);
  eq(att, [...att].sort((a, b) => Number(b) - Number(a)), "the attention set is on top");
  for (const grp of [true, false]) {
    const ranks = out.ranked.filter((r) => r.attention === grp).map((r) => r.rank ?? 1e9);
    eq(ranks, [...ranks].sort((a, b) => a - b), `within the ${grp ? "attention" : "rest"} group rows run by rank`);
  }
  eq(out.ranked.some((r) => ["Hollow Pine", "Iris Fleet"].includes(r.name)), false, "passes are left out of the digest list");
  const ign = runRank(["--ignore-stages", "Watchlist,New"]);
  eq([ign?.ignored, ign?.ranked.some((r) => r.stage === "Watchlist" || r.stage === "New")], [3, false], "--ignore-stages leaves the named stages out");
  eq(runRank(["--limit", "3"])?.ranked.length, 3, "--limit cuts the list");
  const same = JSON.stringify(plain(out)) === JSON.stringify(plain(JSON.parse(readFileSync(join(FIX, "ranked.json"), "utf8"))));
  if (!same) fail("tools/ops/fixtures/digest/ranked.json is not what `rank` prints for the fixtures today; regenerate it");
  checks++;
  if (failures === before) console.log("   ok  `rank` agrees with the page's region row by row; attention first; passes, ignored stages and --limit; ranked.json is current");
}

// ── The check must be able to fail ─────────────────────────────────────────────────────
{
  const before = failures;
  if (pageRegion) {
    const drifted = pageRegion.replace("score * d.urgency", "score + d.urgency");
    if (drifted === pageRegion) fail("negative control: the arithmetic the control drifts is not in the region");
    else if (drifted === cliRegion) fail("negative control: a drifted region would pass as identical");
  }
  checks++;
  if (failures === before) console.log("   ok  a drifted product in the region is not the region in the CLI");
}

if (failures) { console.error(`Digest mirror: ${failures} failure(s) in ${checks} checks (deal-cockpit.html vs tools/ops/digest-cli.mjs)`); process.exit(1); }
console.log(`Digest mirror: ${checks} checks, identical`);
