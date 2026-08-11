# Fund OS — Versions-Audit und Konsolidierungsplan

*Erstellt 2026-08-11. Grundlage: vollständiger Datei-Hash-Vergleich aller auffindbaren Fund-OS-Stände auf diesem Rechner.*

---

## 1. Befund in einem Satz

Deine Hypothese stimmt, aber die Ursache ist nicht „Sessions überschreiben sich gegenseitig" —
es ist **ein fehlender Rückweg**: seit dem 25. Juni wurde ausschließlich über das
Claude-Desktop-`.plugin`-Upload iteriert, und dieser Weg schreibt **nie** nach Git zurück.
Der produktiv laufende Stand (**v0.3.7**) existiert nur in einem internen Cache-Verzeichnis
der Desktop-App und wäre bei einem Zurücksetzen der App restlos verloren.

---

## 2. Alle gefundenen Stände

| # | Stand | Version | Datum | Ort | Rolle |
|---|---|---|---|---|---|
| 1 | **Runtime (Desktop/Cowork)** | **0.3.7** | 10.07. 09:48 | `~/Library/Application Support/Claude/local-agent-mode-sessions/<session>/<sub>/rpm/plugin_<id>/` | **Der aktuell laufende Stand. Einzige Kopie.** |
| 2 | Drive-Bundle | 0.3.6 | 08.07. 13:17 | `…/FUND OS Collab/fund-os-0.3.6.plugin` | letztes gesichertes Artefakt |
| 3 | Drive-Bundle | 0.2.5 *(Datei heißt 0.3.2)* | 26.06. 19:51 | `fund-os-0.3.2.plugin` | Dateiname ≠ interne Version |
| 4 | Drive-Bundle | 0.2.5 *(Datei heißt 0.3.1)* | 26.06. 19:08 | `fund-os-0.3.1.plugin` | Dateiname ≠ interne Version |
| 5 | Drive-Bundle | 0.3.0 | 26.06. 17:22 | `fund-os-0.3.0.plugin` | inhaltsgleich mit 0.2.5 |
| 6 | Drive-Bundle | 0.2.5 | 26.06. 17:23 | `fund-os-0.2.5.plugin` | |
| 7 | Drive-Bundle | 0.2.3 | 25.06. 11:24 | `fund-os-v0.2.3-lp-scoring.plugin` | Geburt von `lp-investor-scoring` |
| 8 | Drive-Bundle | 0.2.1 | 03.06. 15:46 | `fund-os-o1.plugin` | |
| 9 | **Git / GitHub `steffenmaas/fund-os`** | **0.2.2** | 04.06. (letzter Push) | `~/Repository/fund-os-marketplace` | **seit 9 Wochen tot** |
| 10 | CLI-Install (aktiv in `settings.json`) | 0.2.0 | 03.06. | `~/.claude/plugins/marketplaces/local-desktop-app-uploads/fund-os` | ältester Stand, aber aktiv registriert |
| 11 | CLI-Marketplace-Klon | 0.2.0 | 03.06. | `~/.claude/plugins/marketplaces/fund-os-marketplace/plugins/fund-os` | Leiche aus `/plugin marketplace add` |

**Zusätzlich:** `lp-scoring-matrix-v5.md` liegt lose im Drive (08.07.) — ist aber **v5**,
während im Plugin bereits **v7** steckt. Kein Verlust, nur eine irreführende Kopie.

---

## 3. Die Versionslinie — es gibt nur *einen* echten Fork

Der Hash-Vergleich zeigt: die 0.2.3 → 0.3.7-Kette ist **strikt linear**. Keine Session hat
eine andere überschrieben. Was jeweils dazukam:

```
0.2.3  (25.06.)  + lp-investor-scoring (Skill + Scoring-Matrix)
   ↓
0.2.5  (26.06.)  + investment-thesis.md: Platzhalter → echte O1V-Fondsdaten (2,3 KB → 6,8 KB)
                 + o1-scoring-matrix.md (10-Dimensionen-Rubrik) NEU
                 + deal-pitch-deck-analyze stark ausgebaut (4,5 KB → 8,9 KB)
                 + memo-template.md (1,8 KB → 6,2 KB)
                 − deal-thesis-screen entfernt (durch deal-startup-score ersetzt)
   ↓
0.3.0  (26.06.)  nur Versionsnummer
   ↓
0.3.2  (26.06.)  ~ deal-startup-score: KO-Filter raus, Total = arithmetische Summe,
                   Attio-Slug korrigiert (o1_investment_score)
   ↓
0.3.6  (08.07.)  ~ lp-scoring-matrix v5 → v7: Relationship-Type statt KO-Kriterien,
                   Institutional-Asset-Owner-Override
   ↓
0.3.7  (10.07.)  ~ lp-investor-scoring Output-Formatierung
```

**Der einzige echte Fork** ist Git 0.2.2 gegen diese Linie. Git hat am 03.06. etwas gemacht,
das die 0.3.x-Linie nicht kennt:

| | Git 0.2.2 | Runtime 0.3.7 |
|---|---|---|
| DD-Skill | `deal-due-diligence` — umbenannt, um DD-Plan-Modus + `evaluation-criteria`-Verdrahtung erweitert (7.972 B) | `deal-investment-memo-draft` — alter Name, memo-fokussiert (7.312 B) |
| Memo-Template | 1.847 B (alt) | **6.173 B (neu)** |
| `deal-thesis-screen` | vorhanden | entfernt — redundant zu `deal-startup-score` (gleiche Trigger) |
| `lp-investor-scoring` | fehlt | vorhanden |

→ **Genau eine Datei braucht einen echten Drei-Wege-Merge:** die DD-/Memo-Skill.
Alles andere ist „0.3.7 gewinnt".

---

## 4. Warum die Templates im Chat nicht gefunden werden

Zwei unabhängige Ursachen. Die erste ist ein harter, verifizierter Bug.

### 4.1 Der hartkodierte Pfad existiert nirgends (Hauptursache)

**40 von 42 Skills** enthalten diese Zeile — insgesamt 83 Vorkommen:

```bash
cat ~/.claude/plugins/cache/fund-os-marketplace/fund-os/*/preferences/user-config.json 2>/dev/null
```

Dieses Verzeichnis **existiert auf diesem Rechner nicht** (verifiziert). Es wird
ausschließlich von `install.sh` angelegt — und installiert wurde nie über `install.sh`,
sondern über den `.plugin`-Upload in Claude Desktop. Die tatsächlichen Orte sind:

- `~/.claude/plugins/marketplaces/local-desktop-app-uploads/fund-os/` (CLI)
- `~/Library/Application Support/Claude/…/rpm/plugin_<id>…/` (Desktop/Cowork)

Wegen `2>/dev/null` schlägt das **lautlos** fehl. Jeder Skill fällt auf Defaults zurück:
kein Fondsname, keine Ticket-Range, keine Drive-Folder-IDs, kein Tone-of-Voice.
Genau das erklärt „ein Skill funktioniert nicht wie erwartet und wir arbeiten manuell weiter".

Derselbe Bug betrifft `fund-os:update` doppelt — es schreibt in dasselbe nicht existierende
Verzeichnis, es adressiert den Registry-Key `fund-os@fund-os-marketplace` (real:
`fund-os@local-desktop-app-uploads`), und es lädt per `raw.githubusercontent.com` aus einem
**privaten** Repo, also ohne Auth → 404. Das Update-Skill kann strukturell nie funktioniert
haben.

### 4.2 Kein Plugin-Root-Anker (erklärt Chat vs. Cowork)

Referenzen auf Knowledge/Templates stehen relativ und ohne Anker:

```markdown
Read `knowledge/o1-scoring-matrix.md` (this plugin)
```

`${CLAUDE_PLUGIN_ROOT}` kommt in Fund OS **null Mal** vor (verifiziert). In einer
Cowork-/Task-Session hat der Agent Datei-Tools und findet die Datei durch Suchen — im
reinen Chat gibt es diesen Rettungsweg nicht. Das ist die Asymmetrie, die ihr beobachtet.

Founder OS hat genau dieses Problem bereits gelöst: dort steht überall
`${CLAUDE_PLUGIN_ROOT}/templates/…`, in Skills, Hooks und Tools.

### 4.3 Was zusätzlich fehlt

- **Preferences liegen im Plugin** (`preferences/user-config.json`). Bei jedem Neu-Upload
  eines `.plugin` werden sie mitgeliefert oder überschrieben — sie gehören nach außen.
- **Keine Validierung.** Nichts prüft vor dem Release, ob referenzierte Pfade existieren.
  Founder OS hat dafür `tools/validate.py` + CI.

---

## 5. Konsolidierungsplan

### Phase 1 — Sichern (sofort, vor jeder anderen Aktion)

1. Runtime-0.3.7 aus dem Desktop-Cache in einen Branch `salvage/v0.3.7` committen —
   1:1, unverändert. Das ist die Rettung des einzigen Exemplars.
2. Alle Drive-Bundles unter `archive/` als Tags/Commits ablegen, damit die Historie
   25.06.–10.07. nachvollziehbar bleibt.

### Phase 2 — Merge auf v0.4.0

**Basis: 0.3.7.** Darauf genau drei Eingriffe:

1. `deal-investment-memo-draft` → `deal-due-diligence` umbenennen und den DD-Plan-Modus +
   die `evaluation-criteria`-Verdrahtung aus Git 0.2.2 einarbeiten — mit dem **neuen**
   6-KB-Memo-Template aus 0.3.7.
2. `deal-thesis-screen` bleibt entfernt (redundant zu `deal-startup-score`).
3. Dashboard, README, USER_GUIDE, CHANGELOG auf den echten Skill-Bestand ziehen.

### Phase 3 — Pfad-Bug beheben (das eigentliche Problem)

1. Alle 83 Vorkommen des toten Pfads durch `${CLAUDE_PLUGIN_ROOT}` ersetzen.
2. Preferences aus dem Plugin herauslösen nach `~/.fund-os/user-config.json`, mit
   Fallback-Kette: `~/.fund-os/` → `${CLAUDE_PLUGIN_ROOT}/preferences/` → Defaults.
   Damit überlebt die Konfiguration jeden Plugin-Update und jeden Re-Upload.
3. Jede Knowledge-/Template-Referenz mit `${CLAUDE_PLUGIN_ROOT}` ankern.
4. **`fund-os:setup` muss laut sein**, wenn keine Config gefunden wird — kein
   `2>/dev/null`-Schweigen mehr. Ein Skill ohne Config sagt das, bevor er arbeitet.
5. `fund-os:update` neu schreiben oder entfernen — der aktuelle Stand ist nicht reparabel.

### Phase 4 — Release-Pipeline (damit es nicht wieder passiert)

Nach dem Muster von Founder OS:

- **`tools/validate.py`** — prüft JSON, Skill-Frontmatter, **und ob jeder referenzierte
  Pfad wirklich existiert**. Der Bug aus §4.1 wäre damit nie ins Release gekommen.
- **`.github/workflows/validate.yml`** — läuft bei jedem Push und PR.
- **`.github/workflows/release.yml`** — Version in `plugin.json` bumpen = Release. Erzeugt
  Tag `fund-os/v<version>` und baut das `.plugin`-Bundle als Release-Asset.
- **Regel: Das `.plugin` wird nur noch aus CI gebaut, nie mehr von Hand.** Damit ist ein
  Bundle ohne Git-Commit strukturell unmöglich — der fehlende Rückweg aus §1 ist zu.

### Phase 5 — Upstream-Learning-Loop

`fund-os:learn` nach dem Vorbild von `founder-os:dev-learn`, aber auf Fondsarbeit gemünzt:

- **Modus A (capture):** Nach jedem Skill-Lauf, der schieflief oder manuell nachgearbeitet
  werden musste → `docs/learnings/YYYY-MM-DD-<slug>.md` mit Frontmatter
  `scope: fund | upstream`, `area: sourcing | dd | lp | portfolio | legal | tooling`,
  `severity`.
- **Modus B (upstream):** Gruppiert offene `scope: upstream`-Learnings, leitet daraus die
  konkrete Regeländerung ab (Skill / Knowledge-Datei / Template / Validator-Regel) und
  öffnet einen PR gegen `steffenmaas/fund-os`.
- **Zwingend zu übernehmen — der Scrub-Schritt.** Founder OS ist öffentlich und hat deshalb
  eine Pflichtprüfung „keine Projekt-Internals". Bei Fund OS ist das noch kritischer:
  siehe §6.
- **Die Regel über Regeln übernehmen:** „Eine Regel entsteht nach einem Vorfall, nie
  präventiv." Ohne die wächst die Knowledge-Basis zu, und dann liest sie niemand mehr.

Ergänzend sinnvoll, weil bei euch mehrere Leute im Team arbeiten: das
`founder-os-update.yml`-Muster — ein täglicher Check, ob der lokal installierte Stand
hinter dem letzten Release liegt.

---

## 6. Umsetzung — Stand 2026-08-11

Alle fünf Phasen sind umgesetzt und in `main`. `python3 tools/validate.py` ist grün.

| Phase | Ergebnis |
|---|---|
| 1 Sichern | 0.3.7 als `salvage-v0.3.7` in Git; Drive-Bundles per Hash in `docs/provenance.md` indexiert |
| 2 Merge | v0.4.0; `deal-due-diligence` aus beiden Linien zusammengeführt; Dashboard repariert (es warf `SyntaxError` und rendert erst wieder seit diesem Commit) |
| 3 Pfad-Bug | 83 tote Pfade ersetzt; alle 43 Skills auf `${CLAUDE_PLUGIN_ROOT}` verankert; Config nach `~/.fund-os/`; `update` neu geschrieben |
| 3b Sanitizing | Drive-IDs, Track-Record-Zahlen und ein realer Startup-Score aus Stand **und Historie** entfernt |
| 4 Pipeline | `validate.py`, `build-plugin.sh`, `validate.yml`, `release.yml` |
| 5 Learning-Loop | `fund-os:learn` mit Consent- und Scrub-Schritt |

**Zusätzlich gefunden und behoben — alles im produktiv laufenden Stand:**

- Beide Scoring-Matrizen waren arithmetisch falsch: O1 deklarierte /100 bei Summe **110**,
  LP deklarierte 0–100 bei Summe **120**. Seit Ende Juni lagen damit alle Scores auf einer
  gedehnten Skala, und die Tier-Schwellen bedeuteten nicht, was sie behaupteten.
  → O1: Competition und GTM von 10 auf 5. LP: v8 mit `round(raw/120×100)`.
  **Vor dem 11.08. vergebene Scores müssen umgerechnet werden, bevor sie mit neuen
  verglichen werden** — mehrere LP-Einstufungen rutschen eine Stufe.
- Das Dashboard lief seit dem 26. Juni gar nicht: 456 rohe Zeilenumbrüche in JS-Strings.
- Vier `outreach-*`-Skills rendern seit derselben Zeit nicht (Phasen-ID `outreach` statt `ecosystem`).
- 34 Skills verwiesen auf einen Generator `skills-data.js`, den es im Repo nie gab.

## 7. Zur Veröffentlichung

Entscheidung: **Repo bleibt privat, wird aber mit anderen Funds geteilt.** Daraus folgt die
Grenze, die jetzt gilt und die `validate.py` maschinell prüft:

| Bleibt im Repo | Muss draußen bleiben |
|---|---|
| Scoring-Matrizen und Methodik | Startup- und Portfolio-Namen, besonders mit Score |
| O1-Branding und Framework-Namen | LP-/Investorennamen mit Tier oder Pipeline-Stufe |
| Struktur-Templates mit Platzhaltern | Drive-/CRM-IDs, Keys, interne URLs |
| Öffentliche Marktdaten (SaaS-Benchmarks) | Fondsökonomie, Track-Record-Zahlen, NAV, Personendaten |

Fondsspezifische Inhalte liegen in `~/.fund-os/` (Config, Knowledge-Overlay, Learnings) und
werden nie mitgeliefert — `build-plugin.sh` schließt sie aus und verifiziert den Ausschluss.

**Offener Punkt für das Team:** `~/.fund-os/` liegt auf je einem Rechner. Damit weitere Teammitglieder dieselbe Thesis und Config nutzen, muss der Ordner geteilt werden —
entweder über den Drive-Knowledge-Manifest-Weg, der dafür schon vorgesehen ist
(`knowledge.manifest` in der Config), oder indem `~/.fund-os/` aus der geteilten Drive-Ablage
kopiert wird. Das ist noch nicht eingerichtet.
