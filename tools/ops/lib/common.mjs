/**
 * Fund OS autopilot CLIs: the helpers all three share. No dependencies, no network.
 *
 * Every fund value comes from the user configuration (default ~/.fund-os/user-config.json,
 * overridden by --config <path> or the FUND_OS_CONFIG environment variable). Nothing about
 * one fund is written into this file.
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

export const DAY_MS = 86_400_000;

export const die = (msg, code = 1) => { process.stderr.write(`${msg}\n`); process.exit(code); };

// ── Arguments ─────────────────────────────────────────────────────────────────
export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) out[a.slice(2)] = true;
      else { out[a.slice(2)] = next; i++; }
    } else out._.push(a);
  }
  return out;
}

export const need = (args, name) => (typeof args[name] === "string" ? args[name] : die(`missing --${name}`));

export const readJson = (path, what, fail = die) => {
  try { return JSON.parse(readFileSync(resolve(path), "utf8")); }
  catch (e) { return fail(`cannot read ${what} ${path}: ${e.message}`); }
};

export const dateArg = (args, ...names) => {
  const name = names.find((n) => typeof args[n] === "string");
  const d = name ? new Date(args[name]) : new Date();
  return Number.isNaN(d.getTime()) ? die(`--${name} is not a date: ${args[name]}`) : d;
};

export const day = (d) => d.toISOString().slice(0, 10);
export const byteLength = (s) => Buffer.byteLength(s, "utf8");
export const clip = (s, max = 3000) => { const t = String(s ?? "").trim(); return t.length > max ? `${t.slice(0, max)} […]` : t; };
export const list = (v) => (Array.isArray(v) ? v.filter(Boolean).join(", ") : String(v ?? "").trim());
export const strings = (v) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : []);
export const isPlaceholder = (v) => typeof v !== "string" || v.trim() === "" || /^</.test(v.trim());

// ── Configuration ─────────────────────────────────────────────────────────────
export const DEFAULT_CONFIG = resolve(homedir(), ".fund-os", "user-config.json");

/** --config wins, then FUND_OS_CONFIG, then ~/.fund-os/user-config.json. A leading ~ is expanded. */
export function configPath(args = {}) {
  const raw = typeof args.config === "string" ? args.config : process.env.FUND_OS_CONFIG || DEFAULT_CONFIG;
  return resolve(raw.replace(/^~(?=$|\/)/, homedir()));
}

/**
 * The user configuration. required: a missing file or a missing `autopilot` section stops the command.
 * Not required: an unreadable file gives {} (commands that only need names for a heading).
 */
export function loadConfig(args = {}, { required = true, fail = die } = {}) {
  const path = configPath(args);
  if (!existsSync(path)) {
    if (!required) return {};
    return fail(`Fund OS is not configured: ${path} does not exist. Run fund-os:setup first, or point FUND_OS_CONFIG / --config at a configuration file.`);
  }
  let cfg;
  try { cfg = JSON.parse(readFileSync(path, "utf8")); }
  catch (e) { return required ? fail(`cannot read the configuration ${path}: ${e.message}`) : {}; }
  if (required && (!cfg || typeof cfg.autopilot !== "object" || cfg.autopilot === null)) return fail(`config: the autopilot section is missing in ${path}`);
  return cfg;
}

/** The autopilot section of the configuration, {} when absent. */
export const ap = (cfg) => (cfg && typeof cfg.autopilot === "object" && cfg.autopilot !== null ? cfg.autopilot : {});
export const fundName = (cfg) => (typeof cfg?.masterData?.fundName === "string" && cfg.masterData.fundName.trim() ? cfg.masterData.fundName.trim() : "the fund");

/**
 * Pairs of [crmFields key, value] to {slug: value}. A key whose slug is empty is skipped (that write is
 * disabled); a slug listed in crmFields.archivedSlugs is never written and stops the command.
 */
export function entryValues(cfg, pairs) {
  const f = cfg?.crmFields && typeof cfg.crmFields === "object" ? cfg.crmFields : {};
  const archived = new Set(strings(f.archivedSlugs));
  const out = {};
  for (const [key, value] of pairs) {
    const slug = typeof f[key] === "string" ? f[key].trim() : "";
    if (!slug) continue;
    if (archived.has(slug)) die(`FAIL: crmFields.${key} is "${slug}", which is in crmFields.archivedSlugs; an archived slug is never written`);
    out[slug] = value;
  }
  return out;
}

// ── Addresses and URLs ────────────────────────────────────────────────────────
export const addressOf = (v) => { const s = String(v ?? "").trim(); const m = /<([^>]+)>/.exec(s); return (m ? m[1] : s).trim().toLowerCase(); };
export const CLEAN_ADDRESS = /^[^\s@<>,;()"'\\]+@[^\s@<>,;()"'\\]+\.[^\s@<>,;()"'\\]+$/;
export const domainOf = (address) => address.split("@")[1] ?? "";
export const onOwnDomain = (address, own) => own.some((d) => domainOf(address) === d || domainOf(address).endsWith(`.${d}`));
export const ownDomains = (cfg) => strings(ap(cfg).inbound?.ownDomains).map((d) => d.toLowerCase());

/** Every http(s) URL (and bare www. link) in a text; trailing sentence punctuation is not part of it. */
export function urlsIn(text) {
  const found = String(text ?? "").match(/(?:https?:\/\/|\bwww\.)[^\s<>"'`)\]}]+/gi) ?? [];
  return found.map((u) => u.replace(/[.,;:!?]+$/, "")).map((u) => (/^www\./i.test(u) ? `https://${u}` : u));
}

/** The hosts a mail may link to: autopilot.allowedUrlHosts plus the hosts of the booking link and the deck link. */
export function allowedHosts(cfg) {
  const a = ap(cfg);
  const hosts = new Set(strings(a.allowedUrlHosts).map((h) => h.toLowerCase()));
  for (const link of [a.fund?.bookingLink, a.investors?.deckLink]) {
    try { const u = new URL(String(link)); if (/^https?:$/.test(u.protocol) && u.hostname) hosts.add(u.hostname.toLowerCase()); } catch { /* unset or a placeholder */ }
  }
  return hosts;
}

/** One reason per URL whose host is not on the list. A URL that does not parse fails too. */
export function urlProblems(text, hosts) {
  const reasons = [];
  for (const raw of new Set(urlsIn(text))) {
    let host = "";
    try { host = new URL(raw).hostname.toLowerCase(); } catch { /* reported below */ }
    if (!host) reasons.push(`URL ${raw.slice(0, 80)} cannot be read`);
    else if (!hosts.has(host)) reasons.push(`URL host ${host} is not in autopilot.allowedUrlHosts`);
  }
  return reasons;
}

// ── Knowledge documents from a directory ──────────────────────────────────────
const SOURCE = { fund: "fund", bundled: "bundled", missing: "missing" };
export const CAPS = [40000, 24000, 16000, 10000];
export const PROMPT_MAX_BYTES = 60000;
export const WRITE_TEXT_MAX = 20000;

/** <dir>/<key>.md plus an optional <key>.meta.json {source: "fund"|"bundled"|"missing", title, modifiedTime}. */
export function loadDocs(dir, keys) {
  const docs = {};
  for (const key of keys) {
    const md = resolve(dir, `${key}.md`), meta = resolve(dir, `${key}.meta.json`);
    const text = existsSync(md) ? readFileSync(md, "utf8") : "";
    const info = existsSync(meta) ? JSON.parse(readFileSync(meta, "utf8")) : {};
    const source = text.trim() ? (SOURCE[info.source] ?? "fund") : "missing";
    docs[key] = { key, text, source, updatedAt: info.modifiedTime ?? null, bytes: byteLength(text) };
  }
  return docs;
}

/** Cut each document at `cap` characters, and say so in the text the model reads. */
export function capDocs(docs, cap) {
  const out = {};
  for (const [key, d] of Object.entries(docs)) {
    out[key] = d.text.length > cap ? { ...d, text: `${d.text.slice(0, cap)}\n[… cut at ${cap} characters]`, cutAt: cap } : d;
  }
  return out;
}

/** The documents that were cut for the prompt say so on the provenance line. */
export function provenanceDocs(docs, cap) {
  const out = {};
  for (const [key, d] of Object.entries(docs)) {
    out[key] = cap !== null && d.text.length > cap && d.source === "fund" ? { ...d, source: `fund (cut at ${Math.round(cap / 1000)}k)` } : d;
  }
  return out;
}

/** The prompt, first line `# cap=<n> bytes=<total>`, at the largest cap whose total fits the budget (default PROMPT_MAX_BYTES). */
export function fitPrompt(build, budget = PROMPT_MAX_BYTES) {
  let last = null;
  for (const cap of CAPS) {
    const body = build(cap);
    // The first line states the total, itself included; a few passes settle the digits.
    let bytes = byteLength(body);
    for (let i = 0; i < 3; i++) bytes = byteLength(`# cap=${cap} bytes=${bytes}\n${body}`);
    last = { text: `# cap=${cap} bytes=${bytes}\n${body}`, bytes };
    if (bytes <= budget) break;
  }
  if (last.bytes > budget) die(`the prompt is ${last.bytes} bytes at the smallest cap (${CAPS.at(-1)}); the CRM record is too long`);
  return last.text;
}
