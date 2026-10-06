/**
 * Fund OS autopilot CLIs: what every prompt starts with, and how the fund's documents are shown to the model.
 * Each document says where it came from (the fund's own, the bundled template, or missing), and the
 * output carries that label: a score computed against a template is a different thing from one
 * computed against the fund's own matrix.
 */

/** The same preamble for every task, so a score and a draft mail were written by the same assistant with the same rules. */
export function preamble(cfg) {
  const md = cfg?.masterData && typeof cfg.masterData === "object" ? cfg.masterData : {};
  const name = typeof md.fundName === "string" && md.fundName.trim() ? md.fundName.trim() : "the fund";
  const bits = [typeof md.stageFocus === "string" ? md.stageFocus.trim() : "", Array.isArray(md.sectors) && md.sectors.length ? `sector focus: ${md.sectors.join(", ")}` : ""].filter(Boolean);
  return `You are the agent layer of Fund OS, working for ${name}${bits.length ? ` (${bits.join("; ")})` : ""}. You do one fund task at a time, exactly the way the fund's own documents say it must be done.

Rules, in order of importance:

1. The documents below are the methodology. Apply them verbatim — their
   weights, their tables, their formats. Where a document is marked as a
   fund-neutral TEMPLATE or MISSING, say so in your reasoning and apply the
   template's structure with its generic signals; never pretend it is the
   fund's own.
2. Evidence only. Every point you award names where it comes from: the
   description, the deck, a stated fact, the CRM record. A dimension you
   cannot assess from the material scores 0 with the reason
   "No information available" — except urgency, where unknown is not the same
   as not urgent (see the matrix).
3. Numbers come from the material or they do not appear. Do not estimate
   market sizes, revenues or dates that are not in front of you.
4. You never send, publish or change a pipeline stage. You draft and you
   propose. A partner decides.
5. Write in the fund's voice: concise, fact-first, no filler, no VC clichés,
   no exclamation marks, no superlatives. Match the recipient's formality.`;
}

export function knowledgeBlock(docs) {
  return Object.values(docs).map((d) => {
    const label = d.source.startsWith("fund") ? "the fund's own document"
      : d.source === "bundled" ? "FUND-NEUTRAL TEMPLATE — the fund has not provided its own version; signals in it are generic placeholders"
      : "MISSING — the fund has not provided this document";
    const body = d.text.trim() ? d.text.trim() : "(no content)";
    return `<document key="${d.key}" source="${d.source}">\n<!-- ${label} -->\n${body}\n</document>`;
  }).join("\n\n");
}

/** One line for an evaluation header: which rubric produced the number. */
export function provenanceLine(docs, keys) {
  const parts = keys.map((k) => (docs[k] ? `${k}: ${docs[k].source}` : `${k}: missing`));
  return `knowledge · ${parts.join(" · ")}`;
}
