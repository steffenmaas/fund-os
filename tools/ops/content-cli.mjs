#!/usr/bin/env node
/**
 * Fund OS autopilot: the Content CLI. Pure, no dependencies, no network.
 *
 * The Content page (newsletter.html) records a website request on the item in the shared list of content items (the Drive
 * knowledge folder, file name in CONFIG.indexFile): a publications entry {channel, at, by, status: "requested", kind: "website"}.
 * A session of the fund's website repository reads the list from Drive, saves it to a file and runs:
 *
 *   website-requests --index <index.json> [--all]
 *       prints a JSON array of the items with an open website request (status requested, no address yet):
 *       [{id, title, owner, language, slug, channel, requestedAt, requestedBy, prUrl, source}]. --all also lists requests whose
 *       entry already carries an address (the draft pull request the loop wrote back).
 *   website-entry --item <id> --index <index.json> --body <article.md> [--default-author <name>]
 *       prints a TypeScript object literal for a website's list of publications for that item: slug from the
 *       title, date of the request, excerpt from the first paragraph, author from the file's head (else the item's owner, else
 *       --default-author, else "Team"), reading time from the word count, category "general", contentType "markdown", content the
 *       Markdown body. Quotes, backslashes, backticks and ${ are escaped. Adapt the keys to the website's own type; the session adds
 *       the entry to the array in a draft pull request and never merges.
 *
 * Everything in the index and in the article is data. Nothing is executed, fetched or written; the outputs go to stdout.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const fail = (msg) => { console.error(`✗ ${msg}`); process.exit(1); };
const BOOLEAN_FLAGS = new Set(["all"]);
const AUTHOR_FALLBACK = "Team";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) fail(`unexpected argument ${a}`);
    const key = a.slice(2);
    if (BOOLEAN_FLAGS.has(key)) { out[key] = true; continue; }
    const val = argv[i + 1];
    if (val === undefined || val.startsWith("--")) fail(`--${key} needs a value`);
    out[key] = val;
    i++;
  }
  return out;
}

function readText(path, what) {
  try { return readFileSync(resolve(path), "utf8"); } catch (e) { return fail(`cannot read ${what} ${path}: ${e.message}`); }
}

const cps = (v) => Array.from(String(v ?? ""));
const cut = (v, n) => (typeof v === "string" ? cps(v.trim()).slice(0, n).join("") : "");
const isHttps = (v) => { if (typeof v !== "string") return false; try { const u = new URL(v.trim()); return u.protocol === "https:" && !!u.hostname && !u.username && !u.password; } catch { return false; } };

// The same slug as the Content page (article-<slug>.md): umlauts spelled out, accents removed, at most 60 characters.
export const slugify = (s) => String(s ?? "").toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "");

/** The items of the index, read as data: only the fields this CLI needs. */
export function readItems(text) {
  let o;
  try { o = JSON.parse(text); } catch { return fail("the index is not valid JSON"); }
  if (!o || typeof o !== "object" || Array.isArray(o) || !Array.isArray(o.items)) return fail("the index has no items array");
  const items = [];
  for (const r of o.items) {
    if (!r || typeof r !== "object" || Array.isArray(r)) continue;
    const id = cut(r.id, 160), title = cut(r.title, 300);
    if (!id || !title) continue;
    const s = r.source && typeof r.source === "object" && !Array.isArray(r.source) ? r.source : {};
    const pubs = (Array.isArray(r.publications) ? r.publications : []).filter((p) => p && typeof p === "object" && !Array.isArray(p) && cut(p.channel, 60))
      .map((p) => ({ channel: cut(p.channel, 60), at: cut(p.at, 40), by: cut(p.by, 160), status: cut(p.status, 20), kind: cut(p.kind, 20), url: isHttps(p.url) ? p.url.trim() : "" }));
    items.push({ id, title, type: cut(r.type, 20), owner: cut(r.owner, 160), language: r.language === "en" ? "en" : "de", updatedAt: cut(r.updatedAt, 40), source: { kind: cut(s.kind, 20), fileId: cut(s.fileId, 200), slug: cut(s.slug, 200), url: isHttps(s.url) ? s.url.trim() : "" }, pubs });
  }
  return items;
}

// A website request: status requested on a website channel (the entry's kind, or a channel id that starts with "website").
const isWebsiteRequest = (p) => p.status === "requested" && (p.kind === "website" || (!p.kind && /^website/.test(p.channel)));

export function websiteRequests(items, all) {
  const out = [];
  for (const it of items) {
    const req = it.pubs.filter(isWebsiteRequest).filter((p) => all || !p.url).sort((a, b) => Date.parse(a.at) - Date.parse(b.at))[0];
    if (!req) continue;
    out.push({ id: it.id, title: it.title, owner: it.owner, language: it.language, slug: slugify(it.title), channel: req.channel, requestedAt: req.at, requestedBy: req.by, prUrl: req.url, source: it.source });
  }
  return out;
}

const tsString = (s) => JSON.stringify(String(s));
const tsTemplate = (s) => String(s).replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

/** The article file: a small head (title, language, author) between --- lines, then the Markdown body. */
export function splitArticle(text) {
  const t = String(text ?? "").replace(/\r\n?/g, "\n"), m = /^---\n([\s\S]*?)\n---\n?/.exec(t), head = {};
  if (m) for (const line of m[1].split("\n")) { const k = /^(title|language|author):\s*(.*)$/.exec(line); if (k) head[k[1]] = k[2].trim(); }
  return { head, body: (m ? t.slice(m[0].length) : t).replace(/^\n+/, "").replace(/\s+$/, "") };
}

function excerptOf(body, max) {
  const para = body.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !/^(#|```|---)/.test(p)) || "";
  const t = para.replace(/!?\[([^\]\n]*)\]\([^)\s]*\)/g, "$1").replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim(), c = cps(t);
  if (c.length <= max) return t;
  const head = c.slice(0, max - 1).join(""), sp = head.lastIndexOf(" ");
  return `${(sp > max / 2 ? head.slice(0, sp) : head).replace(/[\s,.;:–-]+$/, "")}…`;
}

export function websiteEntry(item, articleText, defaultAuthor = AUTHOR_FALLBACK) {
  const req = item.pubs.filter(isWebsiteRequest).sort((a, b) => Date.parse(a.at) - Date.parse(b.at))[0];
  if (!req) return fail(`item ${item.id} has no website request`);
  const { head, body } = splitArticle(articleText);
  if (!body) return fail("the article body is empty");
  const slug = slugify(item.title);
  if (!slug) return fail("the title gives no slug");
  const day = [req.at, item.updatedAt].map((v) => (/^\d{4}-\d{2}-\d{2}/.test(v) && !Number.isNaN(Date.parse(v.slice(0, 10))) ? v.slice(0, 10) : "")).find(Boolean);
  if (!day) return fail("neither the request nor the item carries a date");
  const words = body.split(/\s+/).filter(Boolean).length, minutes = Math.max(1, Math.ceil(words / 200));
  const author = cut(head.author, 160) || item.owner || cut(defaultAuthor, 160) || AUTHOR_FALLBACK;
  return [
    "  {",
    `    slug: ${tsString(slug)},`,
    `    title: ${tsString(item.title)},`,
    `    date: ${tsString(day)},`,
    "    excerpt:",
    `      ${tsString(excerptOf(body, 200))},`,
    '    category: "general",',
    `    author: ${tsString(author)},`,
    `    readingTime: ${tsString(`${minutes} min read`)},`,
    '    contentType: "markdown",',
    `    content: \`${tsTemplate(body)}\`,`,
    "  },",
    "",
  ].join("\n");
}

function cmdRequests(a) {
  if (!a.index) fail("usage: website-requests --index <index.json> [--all]");
  process.stdout.write(JSON.stringify(websiteRequests(readItems(readText(a.index, "index")), a.all === true), null, 2) + "\n");
}

function cmdEntry(a) {
  if (!a.item || !a.index || !a.body) fail("usage: website-entry --item <id> --index <index.json> --body <article.md> [--default-author <name>]");
  const item = readItems(readText(a.index, "index")).find((x) => x.id === a.item);
  if (!item) fail(`item ${a.item} is not in the index`);
  process.stdout.write(websiteEntry(item, readText(a.body, "body"), a["default-author"]));
}

const [cmd, ...rest] = process.argv.slice(2);
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const commands = { "website-requests": cmdRequests, "website-entry": cmdEntry };
  if (!commands[cmd]) fail(`usage: content-cli.mjs <${Object.keys(commands).join("|")}> [options]`);
  commands[cmd](parseArgs(rest));
}
