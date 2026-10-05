/**
 * Fund OS autopilot CLIs: the checks a free text must pass before it is written to a CRM, an approval or a mail:
 * no email address, no phone number, no URL or link of any form, no image, no HTML tag. No dependencies.
 */

// Everything is scanned after folding the look-alikes: NFKC (fullwidth letters, digits and punctuation), zero-width and
// bidi-control characters removed, every other decimal-digit script to ASCII, dash variants to "-".
const INVISIBLE_RE = /[\u00AD\u034F\u061C\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFE00-\uFE0F\uFEFF]/g;
const digitValue = (ch) => { let z = ch.codePointAt(0); const base = z; while (/\p{Nd}/u.test(String.fromCodePoint(z - 1))) z--; return String((base - z) % 10); };
export const fold = (s) => String(s ?? "").normalize("NFKC").replace(INVISIBLE_RE, "")
  .replace(/\p{Nd}/gu, digitValue).replace(/[\u2010-\u2015\u2212\u2E3A\u2E3B\uFE58\uFE63\uFF0D]/g, "-");

export const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
// A phone number: 7+ digits with separators (spaces, dots, slashes, dashes, brackets), a leading +, or 9+ digits in a row,
// with or without a leading 0. ISO and dotted dates are blanked first (they are digits with separators too).
const PHONE_RE = /\+?\d[\d\s()./-]{5,}\d/g;
const DATE_RE = /\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}\.\d{1,2}\.(?:\d{4}|\d{2})\b/g;
export const looksLikePhone = (s) => {
  const t = fold(s).replace(DATE_RE, " ");
  return /\d{7}/.test(t) || [...t.matchAll(PHONE_RE)].some((m) => {
    const digits = m[0].replace(/\D/g, "").length;
    return digits >= 7 && (m[0].startsWith("+") || /[\s()./-]/.test(m[0]) || digits >= 9);
  });
};
// http(s)://, www., mailto:, javascript:, vbscript:, protocol-relative //host.tld, and a bare host.tld/path.
const URL_RE = /https?:\/\/|\bwww\.|\b(?:mailto|javascript|vbscript)\s*:|\/\/[a-z0-9-]+\.[a-z]{2,}|[a-z0-9-]\.[a-z]{2,}\/[a-z0-9~%_.?#=&-]/i;
const IMAGE_RE = /!\[[^\]]*\]\s*[([]/;
const LINK_RE = /\]\s*\(/;
const TAG_RE = /<\s*\/?\s*[a-z!?]/i;

/** The reasons a free text (a meeting title, any string of the note) fails the address/link/number/markup checks. */
export function textProblems(text, what = "the note", { phone = true } = {}) {
  const t = fold(text), reasons = [];
  if (EMAIL_RE.test(t)) reasons.push(`an email address appears in ${what}`);
  if (phone && looksLikePhone(t)) reasons.push(`a phone number appears in ${what}`);
  if (URL_RE.test(t)) reasons.push(`a URL appears in ${what}`);
  if (IMAGE_RE.test(t)) reasons.push(`a markdown image appears in ${what}`);
  else if (LINK_RE.test(t)) reasons.push(`a markdown link appears in ${what}`);
  if (TAG_RE.test(t)) reasons.push(`an HTML tag appears in ${what}`);
  return reasons;
}
