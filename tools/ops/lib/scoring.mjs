/**
 * Fund OS autopilot CLIs: the arithmetic a model is not allowed to do.
 *
 * A model proposes per-dimension points with a reason each. Everything after that is computed here,
 * deterministically, from the Fund OS scoring matrices (startup-scoring-matrix v2, lp-scoring-matrix v2):
 * totals are sums, bands come from fixed thresholds, the recommended action comes from the
 * Quality x Thesis Fit table, urgency expires after thirty days and the LP Timing reading after sixty. Pure functions, no imports.
 * tools/validate.py proves the caps below still sum to what the matrices declare.
 */

export const QUALITY_DIMENSIONS = [
  ["Team & Founder-Market Fit", 20],
  ["Market Opportunity", 15],
  ["Problem–Solution Fit", 15],
  ["Technology & Product", 10],
  ["Business Model", 10],
  ["Traction & Validation", 10],
  ["Competition & Differentiation", 5],
  ["Go-to-Market Strategy", 5],
  ["Financial Planning & Use of Funds", 5],
  ["Exit Potential", 5],
];

export const THESIS_DIMENSIONS = [
  ["Sector fit", 30],
  ["Stage fit", 25],
  ["Geography fit", 20],
  ["Business model fit", 15],
  ["Ticket & ownership fit", 10],
];

export const URGENCY_DIMENSIONS = [
  ["Round status", 35],
  ["Time to close", 25],
  ["Allocation remaining", 15],
  ["Runway pressure", 10],
  ["Competitive tension", 15],
];

/**
 * LP Fit: seven dimensions, raw maximum 113, normalised to 0-100. "Activity Signal" of the earlier eight-dimension matrix
 * (raw 120) moved out of Fit: whether an investor is deploying now is Timing's question, a second score.
 */
export const LP_DIMENSIONS = [
  ["Fund of Funds Fit", 20],
  ["Emerging Manager Fit", 20],
  ["Thesis Fit", 20],
  ["Geography", 15],
  ["AuM / Ticket Size", 8],
  ["Investor Strength", 15],
  ["Network Proximity", 15],
];

export const LP_RAW_MAX = 113;

/**
 * LP Timing: is this investor deploying now? Four dimensions that sum to 100, so the total needs no normalisation. A reading
 * is valid for TIMING_VALID_DAYS, like urgency's thirty: an allocation window moves.
 */
export const LP_TIMING_DIMENSIONS = [
  ["Current commitments", 35],
  ["Allocation window / fund cycle", 25],
  ["Signals from conversations and meetings", 25],
  ["Constraints", 15],
];

export const capSum = (dims) => dims.reduce((a, [, c]) => a + c, 0);

/**
 * Pins what the model sent to the rubric: names in the rubric's order, points clamped to [0, cap],
 * integers. A model that invents an eleventh dimension or exceeds a cap is corrected here, never
 * trusted. A missing dimension scores 0 with the zero-information label.
 */
export function pin(rubric, proposed) {
  return rubric.map(([name, cap], i) => {
    const p = proposed[i];
    const raw = typeof p?.points === "number" && Number.isFinite(p.points) ? p.points : 0;
    const points = Math.max(0, Math.min(cap, Math.round(raw)));
    const reason = (p?.reason ?? "").trim() || "No information available";
    return { name, points, cap, reason };
  });
}

export const total = (dims) => dims.reduce((a, d) => a + d.points, 0);

export function qualityBand(q) {
  if (q >= 90) return "Strong";
  if (q >= 75) return "Investable";
  if (q >= 60) return "Possible";
  if (q >= 40) return "Weak";
  return "Poor";
}

export function thesisBand(t) {
  if (t >= 85) return "Core thesis";
  if (t >= 70) return "Solidly inside";
  if (t >= 40) return "Adjacent";
  if (t >= 20) return "Outside, one point of contact";
  return "Outside the thesis";
}

export function urgencyBand(u) {
  if (u >= 80) return "Closing now";
  if (u >= 60) return "Closing soon";
  if (u >= 40) return "Open window";
  if (u >= 20) return "Early";
  return "No window";
}

/**
 * The Quality x Thesis Fit table. A failed hard filter overrides it: Pass, or Refer out when the
 * company is strong on the merits.
 */
export function recommendedAction(quality, thesisFit, hardFiltersFailed) {
  if (hardFiltersFailed > 0) return quality >= 75 ? "Refer out" : "Pass";
  const core = thesisFit >= 70, adjacent = thesisFit >= 40 && thesisFit < 70;
  if (quality >= 75) return core ? "Pursue" : adjacent ? "Exception review" : "Refer out";
  if (quality >= 60) return core ? "Watchlist" : adjacent ? "Monitor" : "Pass";
  return core ? "Monitor" : "Pass";
}

/** Urgency sets the clock and nothing else: when the next step is due. */
export function nextStepBy(urgency, from) {
  const days = urgency >= 80 ? 3 : urgency >= 60 ? 7 : urgency >= 40 ? 14 : urgency >= 20 ? 30 : 90;
  return new Date(from.getTime() + days * 86_400_000).toISOString().slice(0, 10);
}

export const URGENCY_VALID_DAYS = 30;

export function voidAfter(from) {
  return new Date(from.getTime() + URGENCY_VALID_DAYS * 86_400_000).toISOString().slice(0, 10);
}

export function timingBand(t) {
  if (t >= 80) return "Deploying now";
  if (t >= 60) return "Window open";
  if (t >= 40) return "Possible window";
  if (t >= 20) return "Not yet";
  return "Closed";
}

export const TIMING_VALID_DAYS = 60;

/** The last day a Timing reading counts, from the day it was made. */
export function timingValidUntil(from) {
  return new Date(from.getTime() + TIMING_VALID_DAYS * 86_400_000).toISOString().slice(0, 10);
}

/**
 * A Timing evaluation starts with its own as-of date ("as of YYYY-MM-DD ..."); this reads it back. Anything that does not start
 * that way is stale: a reading without a date cannot be trusted to still hold. A reading is valid through the end of its
 * timingValidUntil day (as-of + 60 days, inclusive), whatever the time of day `today` carries.
 */
export function timingIsStale(evaluation, today) {
  if (!evaluation) return true;
  const m = /^\s*as of (\d{4}-\d{2}-\d{2})/.exec(evaluation);
  if (!m) return true;
  const asOf = new Date(`${m[1]}T00:00:00Z`).getTime();
  const todayDay = Math.floor(today.getTime() / 86_400_000) * 86_400_000;
  return !Number.isFinite(asOf) || todayDay - asOf > TIMING_VALID_DAYS * 86_400_000;
}

export const lpNormalise = (raw) => Math.round((raw / LP_RAW_MAX) * 100);

export function lpTier(score) {
  if (score >= 80) return { label: "Priority", emoji: "🔥", lpAction: "Immediate warm outreach; anchor LP candidate", coAction: "Immediate outreach; priority co-investment relationship" };
  if (score >= 60) return { label: "High Fit", emoji: "⭐", lpAction: "Active pipeline; personalised approach", coAction: "Active co-investor pipeline; build the relationship" };
  if (score >= 40) return { label: "Qualified", emoji: "👍", lpAction: "Outreach when capacity allows; thesis tailoring needed", coAction: "Worth a warm intro; monitor for co-investment opportunities" };
  if (score >= 20) return { label: "Watchlist", emoji: "👁", lpAction: "Monitor; revisit for the next fund", coAction: "Ecosystem-map only; light-touch relationship" };
  return { label: "Low Fit", emoji: "❌", lpAction: "Do not prioritise for LP outreach", coAction: "Not a near-term priority; keep on file" };
}

export const stars = (n) => "★".repeat(Math.max(0, Math.min(5, n))) + "☆".repeat(5 - Math.max(0, Math.min(5, n)));

/** `• Label:            +X/Y   — reason`, labels padded so the plus signs line up. */
export function dimensionLines(dims, pad = 28) {
  return dims.map((d) => `${`• ${d.name}:`.padEnd(pad)}${`+${d.points}/${d.cap}`.padEnd(8)}— ${d.reason}`).join("\n");
}
