/**
 * Fund OS autopilot CLIs: the LP fundraising playbook. lp-fundraising-playbook.md is the one document the partners keep for
 * investors, in the fund's knowledge folder. It drives the investor search (search profiles, regions), is the rubric of both LP
 * scores (the Fit and Timing sections, kept as raw text) and carries a brief into the scoring prompt. Pure, no dependencies:
 * Markdown headings (`##`) name the parts, list items are the entries, unknown headings and stray lines are reported and never
 * fatal, every value is capped, and everything in the file is text, never an instruction. The shipped template is
 * plugins/fund-os/skills/lp-investor-scoring/knowledge/lp-fundraising-playbook.md.
 */

// ISO 3166-1 alpha-2 (the officially assigned codes). EU and UK are the two extra tokens the config's geographies use.
const ISO2 = new Set(("AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ " +
  "DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
  "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM " +
  "PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ " +
  "UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW").split(" "));
const REGION_TOKENS = new Set([...ISO2, "EU", "UK"]);

// Heading and key matching is case-insensitive and reads English and German names; a hyphen, a dash, an underscore, a colon or a
// parenthesis reads as a space ("Scoring: Fit", "Scoring – Fit" and "Scoring (Fit)" are one heading).
const norm = (s) => String(s ?? "").toLowerCase().replace(/[-–—_:()]+/g, " ").replace(/[.]+\s*$/, "").replace(/\s+/g, " ").trim();
const SECTIONS = [
  [/^(ziel( ?(und|&|\/|,) ?fonds)?|ziele|zielsetzung|fonds( ?(und|&|\/|,) ?ziel)?|goals?|goal (and|&) fund|fund (and|&) goals?|fund)$/, "goal"],
  [/^(wen wir suchen|wen suchen wir|zielgruppe|zielinvestoren|ziel investoren|ziel ?lps?|who we( are|'re)? looking for|who we look for|target investors?|targets?)$/, "who"],
  [/^(suchprofile|suchprofil|suche|suchbegriffe|search profiles?|searches)$/, "searchProfiles"],
  [/^(regionen|region|geografie|geographie|geografien|geographien|regions?|geographies)$/, "regions"],
  [/^(datenquellen|datenquelle|quellen|data sources?|sources)$/, "sources"],
  [/^(ausschlüsse|ausschluesse|ausschluss|ausschlusskriterien|exclusions?)$/, "exclusions"],
  [/^((bewertung|scoring|score|rating) ?fit( ?(score|rubrik|rubric))?|fit( ?(bewertung|score|rubrik|rubric))?)$/, "fit"],
  [/^((bewertung|scoring|score|rating) ?timing( ?(score|rubrik|rubric))?|timing( ?(bewertung|score|rubrik|rubric))?)$/, "timing"],
  [/^(was in die bewertung (einfließt|einfliesst|einflieszt|einfließen|einfliessen)|bewertungsgrundlagen|bewertungsinputs|evidenz|evidence|inputs|what (goes|feeds) into the (score|scoring|rating))$/, "inputs"],
  [/^(pipeline( ?(und|and|&) ?onboarding)?|onboarding( ?(und|and|&) ?pipeline)?)$/, "pipeline"],
  [/^(grundsätze|grundsaetze|prinzipien|regeln|principles)$/, "principles"],
];
const REGION_KEYS = [[/^(kern|kernländer|kernmärkte|kernregionen|core)$/, "core"], [/^(erweitert|erweiterte regionen|angrenzend|adjacent|extended)$/, "adjacent"]];
// Sections kept as raw text with their cap; every other section is a list of bullets.
const RAW = { goal: 2000, who: 2000, fit: 30000, timing: 10000, pipeline: 4000 };
const LISTS = ["sources", "exclusions", "inputs", "principles"];
const PLACEHOLDER_KEYS = ["searchProfiles", "regions", "exclusions"];

const cut = (v, n) => Array.from(String(v ?? "").trim()).slice(0, n).join("");

/**
 * lp-fundraising-playbook.md → {goal, who, searchProfiles[{tag, type}], regions{core[], adjacent[]}, sources[], exclusions[], fit, timing,
 * inputs[], pipeline, principles[], unknown[], stray[]}. goal, who, fit, timing and pipeline are the raw section text (the two rubrics
 * keep their ### subsections and tables untouched). Never throws, never reads anything as an instruction.
 * Search profiles: "<search term> → <type>", also "->", "=>" and "term; type". The type is an LP type or "Co-Investor"; the CLI
 * decides which it knows. Caps: tag 60, type 40, 12 profiles, 40 entries per list, 400 characters per entry.
 * A line starting with ">" in a list section is a hint for humans, ignored without a report. A list item with a `<…>` placeholder in Search profiles, Regions or
 * Exclusions is not an entry; it goes to stray.
 * Regions: "Core: DE, AT, …" and "Extended: EU, UK"; only ISO 3166 alpha-2 codes and EU/UK are kept, any other token goes to stray.
 */
function parsePlaybook(text) {
  const out = { goal: "", who: "", searchProfiles: [], regions: { core: [], adjacent: [] }, sources: [], exclusions: [], fit: "", timing: "", inputs: [], pipeline: "", principles: [], unknown: [], stray: [] };
  const note = (list, v, max = 20) => { if (list.length < max) list.push(cut(v, 80)); };
  const item = (line) => { const m = /^\s*(?:[-*+]|\d{1,2}[.)])\s+(.*\S)\s*$/.exec(line); return m ? m[1] : null; };
  const keyed = (s) => { const m = /^([^:]{1,40}):\s*(.+)$/.exec(s); return m ? [m[1].trim(), m[2].trim()] : null; };
  const blocks = String(text ?? "").replace(/\r\n?/g, "\n").split(/^##[ \t]+(?!#)/m).slice(1);
  for (const block of blocks) {
    const nl = block.indexOf("\n");
    const heading = (nl < 0 ? block : block.slice(0, nl)).replace(/#+\s*$/, "").trim();
    const body = nl < 0 ? "" : block.slice(nl + 1);
    const hit = SECTIONS.find(([re]) => re.test(norm(heading)));
    if (!hit) { note(out.unknown, heading); continue; }
    const key = hit[1];
    if (key in RAW) {
      // A section written twice is one section: the second part follows the first.
      out[key] = cut([out[key], body.trim().replace(/\n{3,}/g, "\n\n")].filter(Boolean).join("\n\n"), RAW[key]);
      continue;
    }
    for (const line of body.split("\n")) {
      const it = item(line);
      // A line starting with ">" is a hint for the humans who keep the file (the template uses them): neither an entry nor stray.
      if (it === null) { if (line.trim() && !/^\s*>/.test(line)) note(out.stray, line); continue; }
      // A list item that still holds a template placeholder ("<search term> → <type>", "Core: <country codes>") is not an entry: it is reported as stray, never searched, classified or excluded on.
      if (PLACEHOLDER_KEYS.includes(key) && /<[^<>\n]+>/.test(it)) { note(out.stray, `placeholder: ${it}`); continue; }
      if (key === "searchProfiles") {
        const m = /^(.+?)\s*(?:→|->|–>|=>|;)\s*(.+)$/.exec(it);
        const tag = m ? cut(m[1], 60) : "", type = m ? cut(m[2], 40) : "";
        if (!tag || !type) { note(out.stray, `search profile without a type: ${it}`); continue; }
        if (out.searchProfiles.length >= 12) { note(out.stray, `search profile over the limit of 12: ${tag}`); continue; }
        out.searchProfiles.push({ tag, type });
      } else if (key === "regions") {
        const kv = keyed(it);
        const which = kv ? REGION_KEYS.find(([re]) => re.test(norm(kv[0])))?.[1] : null;
        if (!which) { note(out.stray, it); continue; }
        for (const raw of kv[1].split(/[\s,;/]+/).filter(Boolean)) {
          const token = raw.toUpperCase();
          if (!REGION_TOKENS.has(token)) { note(out.stray, `region ${cut(raw, 20)} is no ISO country code`); continue; }
          if (!out.regions[which].includes(token) && out.regions[which].length < 40) out.regions[which].push(token);
        }
      } else if (LISTS.includes(key) && out[key].length < 40) out[key].push(cut(it, 400));
    }
  }
  return out;
}

/**
 * The brief the LP scoring prompt carries: Goal and fund, Who we look for, Exclusions, Principles (no search profiles and no regions:
 * those drive the search; the rubrics are carried on their own). Plain text, at most 3000 characters; empty when the playbook has
 * none of these.
 */
function playbookBrief(doc) {
  const d = doc && typeof doc === "object" ? doc : {};
  const arr = (v) => (Array.isArray(v) ? v : []);
  const lines = [];
  if (d.goal) lines.push("Goal and fund:", String(d.goal).replace(/\n{2,}/g, "\n"));
  if (d.who) lines.push("Who we look for:", String(d.who).replace(/\n{2,}/g, "\n"));
  if (arr(d.exclusions).length) lines.push("Exclusions:", ...arr(d.exclusions).slice(0, 12).map((t) => `- ${t}`));
  if (arr(d.principles).length) lines.push("Principles:", ...arr(d.principles).slice(0, 12).map((t) => `- ${t}`));
  return Array.from(lines.join("\n")).slice(0, 3000).join("");
}

/**
 * A rubric section (Scoring: Fit or Timing) is usable when it is more than a heading and a stub: at least 300 characters and at least one
 * Markdown table row (not just the separator row) or one `###` sub-heading. Anything less counts as absent: the matrix (Fit) or the built-in
 * Timing guide (Timing) stands in, so a half-written or starter section never replaces the rubric.
 */
const RUBRIC_MIN = 300;
function rubricUsable(text) {
  const t = String(text ?? "").trim();
  if (Array.from(t).length < RUBRIC_MIN) return false;
  return /^###[ \t]+\S/m.test(t) || /^[ \t]*\|(?![\s|:-]*\|?[ \t]*$)[^\n]*\|[ \t]*$/m.test(t);
}

export { parsePlaybook, playbookBrief, rubricUsable, RUBRIC_MIN };
