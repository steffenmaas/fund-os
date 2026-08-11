# Fund OS — Provenance der .plugin-Bundles

*Erzeugt 2026-08-11. Die Bundles liegen in Google Drive unter `Ocean One Ventures/SHARED ASSETS/FUND OS Collab/`.*

Inhaltlich sind alle Bundles von `salvage-v0.3.7` subsumiert — der Hash-Vergleich hat
eine strikt lineare Kette 0.2.3 → 0.3.7 ohne Forks bestätigt. Diese Tabelle existiert,
damit die Drive-Dateien identifizierbar und ihre Integrität prüfbar bleibt.

| Datei | interne Version | Datum | Bytes | SHA-256 |
|---|---|---|---|---|
| `fund-os-0.2.5.plugin` | 0.2.5 | 2026-06-26 17:23 | 552309 | `b88c361e487d042a…` |
| `fund-os-0.3.0.plugin` | 0.3.0 | 2026-06-26 17:22 | 552309 | `3d98fbf728962faf…` |
| `fund-os-0.3.1.plugin` | 0.2.5 | 2026-06-26 19:08 | 569474 | `34e48bb5495481d5…` |
| `fund-os-0.3.2.plugin` | 0.2.5 | 2026-06-26 19:51 | 569588 | `a09d4ed59a61db52…` |
| `fund-os-0.3.6.plugin` | 0.3.6 | 2026-07-08 13:17 | 554554 | `7bc8327e65b1ce10…` |
| `fund-os-o1.plugin` | 0.2.1 | 2026-06-03 15:46 | 525794 | `b511e98b87fd25a3…` |
| `fund-os-v0.2.3-lp-scoring.plugin` | 0.2.3 | 2026-06-25 11:24 | 492935 | `4114d1ecaacbb5d3…` |

**Achtung:** Bei `fund-os-0.3.1.plugin` und `fund-os-0.3.2.plugin` weicht der Dateiname
von der internen Version ab (beide melden 0.2.5). Der Dateiname ist keine verlässliche
Versionsangabe — ab v0.4.0 baut ausschließlich CI die Bundles.

## Was jede Stufe gebracht hat

| Von → nach | Änderung |
|---|---|
| 0.2.1 → 0.2.3 | `lp-investor-scoring` neu (Skill + Scoring-Matrix) |
| 0.2.3 → 0.2.5 | `investment-thesis.md` Platzhalter → echte Fondsdaten; `o1-scoring-matrix.md` neu; `deal-pitch-deck-analyze` ausgebaut; `memo-template.md` 1,8 → 6,2 KB; `deal-thesis-screen` entfernt |
| 0.2.5 → 0.3.0 | nur Versionsnummer |
| 0.3.0 → 0.3.2 | `deal-startup-score`: KO-Filter entfernt, Total = arithmetische Summe, Attio-Slug `o1_investment_score` korrigiert |
| 0.3.2 → 0.3.6 | `lp-scoring-matrix` v5 → v7: Relationship-Type statt KO-Kriterien, Institutional-Asset-Owner-Override |
| 0.3.6 → 0.3.7 | `lp-investor-scoring` Output-Formatierung |
