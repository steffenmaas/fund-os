/**
 * Fund OS autopilot CLIs: the content playbook. content-playbook.md in the fund's knowledge folder is the one document the partners
 * keep for content: the strategy's sections (Goal, Audiences, Content pillars, Formats, Principles, KPIs) and, under a level-1
 * heading "Newsletter: ...", the newsletter's own sections (editorial notes, search terms, press sources, blocked domains, LinkedIn
 * keywords, settings). The newsletter and digest CLIs read the strategy part as a brief for their writing prompts. Pure, no
 * dependencies. Markdown headings (`##`) name the parts, list items (`- ...`) are the entries, and under Formats a `###` heading is one
 * format with "key: value" items. Headings are matched case-insensitively and read English and German names. Unknown headings and
 * stray lines are counted and never fatal; everything in the file is text, never an instruction; every value is capped. A line that
 * is still a template placeholder (an entry or value that is nothing but `[square brackets]`, as in the shipped template) is not an
 * entry: it is counted as stray and never becomes a theme, an audience, a principle or a format. The newsletter's own part
 * (below "# Newsletter") is not read here at all, only its headings are checked.
 */

/** True for text that is nothing but one or more `[...]` placeholders and punctuation ("[Topic 1]", "[Audience 1]: [what it needs]"). */
const isPlaceholder = (v) => /\[[^\[\]\n]*\]/.test(String(v)) && !/[\p{L}\p{N}]/u.test(String(v).replace(/\[[^\[\]\n]*\]/g, ""));

/** The text in two parts: the strategy up to the heading "# Newsletter ..." and the newsletter part from it on (empty when the heading is missing). */
function playbookParts(text) {
  const raw = String(text ?? "").replace(/\r\n?/g, "\n");
  const at = raw.search(/^#[ \t]+newsletter\b/im);
  return at < 0 ? { strategy: raw, newsletter: "" } : { strategy: raw.slice(0, at), newsletter: raw.slice(at) };
}
function parseStrategy(text) {
  const cut = (v, n) => Array.from(String(v ?? "").trim()).slice(0, n).join("");
  const SECTIONS = [
    [/^(ziel|ziele|goal|goals)$/, "goal"], [/^(zielgruppen|zielgruppe|leser|audiences|audience)$/, "audiences"],
    [/^(themen-säulen|themensäulen|themen|säulen|content pillars|pillars|themes)$/, "pillars"], [/^(formate|format|formats)$/, "formats"],
    [/^(grundsätze|prinzipien|regeln|principles)$/, "principles"], [/^(kennzahlen|kpis|kpi|metriken|metrics)$/, "kpis"],
  ];
  const FIELDS = [
    [/^(frequenz|rhythmus|takt|frequency|cadence)$/, "frequency"], [/^(kanäle|kanal|channels|channel)$/, "channels"],
    [/^(zielgruppen|zielgruppe|audiences|audience)$/, "audiences"], [/^(ziel|zweck|goal|purpose)$/, "goal"],
    [/^(umfang|länge|format|scope|length)$/, "scope"],
  ];
  const out = { goal: "", audiences: [], pillars: [], formats: [], principles: [], kpis: [], unknown: [], stray: 0 };
  const item = (line) => { const m = /^\s*[-*+]\s+(.*\S)\s*$/.exec(line); return m ? m[1] : null; };
  const split = (v) => String(v).split(/\s*[,;]\s*/).map((x) => cut(x, 80)).filter(Boolean).slice(0, 12);
  const keyed = (s) => { const m = /^([^:]{1,40}):\s*(.+)$/.exec(s); return m ? [m[1].trim(), m[2].trim()] : null; };
  const parts = playbookParts(text);
  const blocks = parts.strategy.split(/^##[ \t]+(?!#)/m).slice(1);
  for (const block of blocks) {
    const nl = block.indexOf("\n");
    const heading = (nl < 0 ? block : block.slice(0, nl)).replace(/#+\s*$/, "").trim();
    const body = nl < 0 ? "" : block.slice(nl + 1);
    const hit = SECTIONS.find(([re]) => re.test(heading.toLowerCase()));
    if (!hit) { if (out.unknown.length < 20) out.unknown.push(cut(heading, 60)); continue; }
    const key = hit[1];
    if (key === "goal") {
      const paras = body.replace(/\n{3,}/g, "\n\n").split(/\n\s*\n/).filter((x) => x.trim());
      const kept = paras.filter((x) => !isPlaceholder(x));
      out.stray += paras.length - kept.length;
      out.goal = cut(kept.join("\n\n"), 2000);
      continue;
    }
    if (key === "formats") {
      let cur = null, skipping = false;
      for (const line of body.split("\n")) {
        const h = /^###[ \t]+(.+?)\s*#*\s*$/.exec(line);
        if (h && isPlaceholder(h[1])) { cur = null; skipping = true; out.stray++; continue; }
        if (h) { skipping = false; if (out.formats.length >= 20) { cur = null; continue; } cur = { name: cut(h[1], 80), frequency: "", channels: [], audiences: [], goal: "", scope: "", extra: [] }; out.formats.push(cur); continue; }
        const it = item(line);
        if (it === null) { if (line.trim() && !skipping) out.stray++; continue; }
        const kv = keyed(it);
        if (skipping) continue; // the bullets of a placeholder format
        if (!cur || !kv) { out.stray++; continue; }
        if (isPlaceholder(kv[1])) { out.stray++; continue; }
        const f = FIELDS.find(([re]) => re.test(kv[0].toLowerCase()));
        if (!f) { if (cur.extra.length < 8) cur.extra.push({ key: cut(kv[0], 40), value: cut(kv[1], 300) }); continue; }
        if (f[1] === "channels" || f[1] === "audiences") cur[f[1]] = split(kv[1]);
        else cur[f[1]] = cut(kv[1], f[1] === "frequency" ? 120 : 300);
      }
      continue;
    }
    for (const line of body.split("\n")) {
      const it = item(line);
      if (it === null) { if (line.trim()) out.stray++; continue; }
      if (isPlaceholder(it)) { out.stray++; continue; }
      if (out[key].length >= 40) continue;
      if (key === "audiences") {
        const kv = keyed(it);
        if (kv && isPlaceholder(kv[0])) { out.stray++; continue; }
        out.audiences.push(kv ? { name: cut(kv[0], 80), need: isPlaceholder(kv[1]) ? "" : cut(kv[1], 400) } : { name: cut(it, 80), need: "" });
      }
      else out[key].push(cut(it, 400));
    }
  }
  const NL_KNOWN = /^(leser|leserschaft|zielgruppe|readers|audience|themen|themes|redaktionelle hinweise|redaktion|hinweise|editorial notes|editorial guidance|suchbegriffe|suchen|web ?suche|search terms|search queries|web search queries|pressequellen|presseseiten|press pages|press sources|gesperrte domains|gesperrte seiten|blocked domains|linkedin[- ]stichworte|linkedin|linkedin keywords|einstellungen|settings)$/;
  for (const block of parts.newsletter.split(/^##[ \t]+(?!#)/m).slice(1)) {
    const h = (block.indexOf("\n") < 0 ? block : block.slice(0, block.indexOf("\n"))).replace(/#+\s*$/, "").trim();
    if (!NL_KNOWN.test(h.toLowerCase()) && out.unknown.length < 20) out.unknown.push(cut(h, 60));
  }
  return out;
}
/**
 * The brief a writing task gets from the strategy: goal, audiences, principles and the formats whose name or channels contain one of the
 * keywords (no keyword: no format). Plain text, at most 3000 characters; empty when the strategy has none of these.
 */
function strategyBrief(doc, keywords) {
  const d = doc && typeof doc === "object" ? doc : {};
  const keys = (Array.isArray(keywords) ? keywords : []).map((k) => String(k ?? "").trim().toLowerCase()).filter(Boolean);
  const hit = (f) => keys.some((k) => String(f.name).toLowerCase().includes(k) || f.channels.some((c) => String(c).toLowerCase().includes(k)));
  const named = (f) => keys.some((k) => String(f.name).toLowerCase().includes(k));
  const formats = (Array.isArray(d.formats) ? d.formats : []).filter(hit).sort((a, b) => Number(named(b)) - Number(named(a))).slice(0, 3);
  const lines = [];
  if (d.goal) lines.push(`Goal: ${String(d.goal).replace(/\s*\n+\s*/g, " ")}`);
  if (Array.isArray(d.audiences) && d.audiences.length) lines.push("Audiences:", ...d.audiences.slice(0, 8).map((a) => `- ${a.name}${a.need ? `: ${a.need}` : ""}`));
  if (Array.isArray(d.principles) && d.principles.length) lines.push("Principles:", ...d.principles.slice(0, 12).map((p) => `- ${p}`));
  for (const f of formats) {
    const parts = [f.frequency && `frequency ${f.frequency}`, f.channels.length && `channels ${f.channels.join(", ")}`, f.audiences.length && `for ${f.audiences.join(", ")}`, f.goal && `goal: ${f.goal}`, f.scope && `scope: ${f.scope}`, ...f.extra.map((x) => `${x.key}: ${x.value}`)].filter(Boolean);
    lines.push(`Format "${f.name}": ${parts.join("; ")}`);
  }
  return Array.from(lines.join("\n")).slice(0, 3000).join("");
}

export { parseStrategy, strategyBrief, playbookParts };
