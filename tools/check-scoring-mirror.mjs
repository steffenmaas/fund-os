#!/usr/bin/env node
/**
 * Drift guard for the scoring mirror in plugins/fund-os/templates/screens/deal-cockpit.html.
 *
 * The page cannot import a module, so it carries a copy of tools/ops/lib/scoring.mjs between the
 * `scoring-mirror:begin` and `scoring-mirror:end` markers. This script runs both on the same inputs
 * and fails on any difference: the rubric tables, pin, totals, bands, the Quality x Thesis Fit table,
 * the urgency clock, and the line format. The inline cases are the ones tools/check-ops-tools.sh
 * uses (same numbers in, same results out), plus a sweep of every score from 0 to 100.
 *
 *   node tools/check-scoring-mirror.mjs        (run by tools/check-screen-templates.sh)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as src from "./ops/lib/scoring.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const page = join(root, "plugins/fund-os/templates/screens/deal-cockpit.html");
const html = readFileSync(page, "utf8");
const m = /\/\/ ==== scoring-mirror:begin ====[^\n]*\n([\s\S]*?)\n\s*\/\/ ==== scoring-mirror:end ====/.exec(html);
if (!m) { console.error("FAIL: scoring-mirror markers not found in deal-cockpit.html"); process.exit(1); }

const NAMES = ["QUALITY_DIMENSIONS", "THESIS_DIMENSIONS", "URGENCY_DIMENSIONS", "capSum", "pin", "total", "qualityBand", "thesisBand", "urgencyBand", "recommendedAction", "nextStepBy", "URGENCY_VALID_DAYS", "voidAfter", "dimensionLines"];
let mirror;
try {
  mirror = new Function(`"use strict";\n${m[1]}\nreturn { ${NAMES.join(", ")} };`)();
} catch (e) {
  console.error(`FAIL: the scoring mirror does not load: ${e.message}`);
  process.exit(1);
}

let diffs = 0, cases = 0;
const same = (label, a, b) => {
  cases++;
  const ja = JSON.stringify(a), jb = JSON.stringify(b);
  if (ja !== jb) { diffs++; if (diffs <= 10) console.error(`FAIL: ${label}\n      page:   ${ja}\n      module: ${jb}`); }
};
// run the same call on the page's copy and on the module
const both = (label, f) => same(label, f(mirror), f(src));

// the numbers tools/check-ops-tools.sh uses
both("caps", (s) => [s.capSum(s.QUALITY_DIMENSIONS), s.capSum(s.THESIS_DIMENSIONS), s.capSum(s.URGENCY_DIMENSIONS)]);
both("quality bands", (s) => [89, 90, 74, 75, 59, 60, 39, 40].map(s.qualityBand));
both("action table", (s) => [[75, 70, 0], [75, 40, 0], [75, 39, 0], [60, 70, 0], [59, 70, 0], [90, 90, 1], [70, 90, 1]].map((a) => s.recommendedAction(...a)));
const at = new Date("2026-10-04T12:00:00Z");
both("urgency clock", (s) => [s.nextStepBy(85, at), s.nextStepBy(0, at), s.voidAfter(at)]);
both("urgency validity", (s) => s.URGENCY_VALID_DAYS);
const proposed = [{ points: 25 }, { points: -4 }, { points: 7.6 }, { points: NaN }];
both("pin clamps and rounds", (s) => s.pin(s.QUALITY_DIMENSIONS, proposed));

// the rubric tables, names and caps, in order
for (const k of ["QUALITY_DIMENSIONS", "THESIS_DIMENSIONS", "URGENCY_DIMENSIONS"]) both(`rubric ${k}`, (s) => s[k]);
// pin with reasons, a missing tail, an eleventh dimension; totals; the line format
const full = Array.from({ length: 11 }, (_, i) => ({ points: i * 3 + 0.4, reason: i % 2 ? `  reason ${i} ` : "" }));
for (const k of ["QUALITY_DIMENSIONS", "THESIS_DIMENSIONS", "URGENCY_DIMENSIONS"]) {
  both(`pin ${k}`, (s) => s.pin(s[k], full));
  both(`total ${k}`, (s) => s.total(s.pin(s[k], full)));
  both(`lines ${k}`, (s) => s.dimensionLines(s.pin(s[k], full)));
  both(`lines pad ${k}`, (s) => s.dimensionLines(s.pin(s[k], full), 34));
}
// every score 0..100 through every band and the clock
for (let n = 0; n <= 100; n++) {
  both(`bands ${n}`, (s) => [s.qualityBand(n), s.thesisBand(n), s.urgencyBand(n)]);
  both(`clock ${n}`, (s) => s.nextStepBy(n, at));
}
// the whole Quality x Thesis Fit grid, with and without failed hard filters
for (let q = 0; q <= 100; q += 5) for (let t = 0; t <= 100; t += 5) for (const h of [0, 1, 2]) {
  both(`action q${q} t${t} h${h}`, (s) => s.recommendedAction(q, t, h));
}
both("action at the edges", (s) => [39, 40, 59, 60, 69, 70, 74, 75].flatMap((n) => [s.recommendedAction(n, n, 0), s.recommendedAction(n, 100 - n, 0)]));

if (diffs > 0) { console.error(`Scoring mirror: ${diffs} difference(s) in ${cases} comparisons (deal-cockpit.html vs tools/ops/lib/scoring.mjs)`); process.exit(1); }
console.log(`Scoring mirror: ${cases} comparisons, identical`);
