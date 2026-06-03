# Portfolio KPI Standards

> **How to use:** Edit this file to match your fund's KPI definitions and benchmarks. Save it as `kpi-standards` in your Drive folder — portfolio monitoring, health check and variance analysis skills all load it automatically.

## Core KPI definitions

### Revenue
| Metric | Definition |
|---|---|
| MRR | Monthly Recurring Revenue — contracted recurring revenue in the month |
| ARR | MRR × 12 |
| New ARR | ARR added from new customers in the period |
| Expansion ARR | ARR added from existing customers (upsell, cross-sell) |
| Churned ARR | ARR lost from cancellations and downgrades |
| Net new ARR | New ARR + Expansion ARR − Churned ARR |

### Growth
| Metric | Definition |
|---|---|
| MoM growth | (MRR this month − MRR last month) / MRR last month |
| YoY growth | (ARR this year − ARR last year) / ARR last year |
| NRR (Net Revenue Retention) | (Opening ARR + Expansion − Churn) / Opening ARR, measured over 12 months |
| GRR (Gross Revenue Retention) | (Opening ARR − Churn) / Opening ARR — excludes expansion |

### Unit economics
| Metric | Definition |
|---|---|
| CAC | Total sales + marketing spend / new customers acquired in period |
| LTV | ARPU / monthly churn rate (or: ARPU × gross margin / churn rate) |
| LTV:CAC | LTV / CAC |
| CAC payback | CAC / (ARPU × gross margin) — expressed in months |
| Gross margin | (Revenue − COGS) / Revenue |

### Team & operations
| Metric | Definition |
|---|---|
| Headcount | Full-time equivalents (FTEs) at end of period |
| Burn rate | Net cash outflow per month (COGS + OpEx − Revenue) |
| Runway | Cash balance / monthly burn rate — expressed in months |
| ARR per FTE | ARR / headcount — efficiency metric |

## Stage benchmarks

| Metric | Pre-Seed target | Seed target | Series A target |
|---|---|---|---|
| MoM growth | ≥15% | ≥10% | ≥7% |
| NRR | — | ≥100% | ≥105% |
| Gross margin (SaaS) | — | ≥60% | ≥70% |
| LTV:CAC | — | ≥3× | ≥4× |
| CAC payback | — | <18 months | <12 months |
| Runway | ≥12 months | ≥12 months | ≥18 months |

## Red flag thresholds

These trigger an immediate alert in `portfolio-early-warning-alert`:

| Signal | Threshold |
|---|---|
| Runway | < 6 months |
| NRR | < 90% |
| MoM growth decline | Negative for 2 consecutive months |
| Top customer concentration | > 30% of ARR |
| Gross margin compression | > 10pp decline QoQ |
| Unplanned founder / C-suite departure | Any |

## KPI collection cadence

| Frequency | What to collect |
|---|---|
| Monthly | MRR, burn rate, runway, headcount, pipeline |
| Quarterly | Full P&L, ARR waterfall, NRR, unit economics, cap table update |
| Annually | Audited financials (if applicable), board-approved budget |

## Submission format

Request KPIs via the standard monthly update request (see `portfolio-kpi-collect` skill). Accept: spreadsheet, inline email, or Notion/Google Doc — normalise to the central dashboard on receipt.
