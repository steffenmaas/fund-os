#!/usr/bin/env python3
"""
knowledge-map.py — generate the index of which knowledge document each skill uses.

The knowledge folder is a flat list of documents with no indication of what reads them. Editing
one is a change to live behaviour, so "which skill does this affect?" has to be answerable
without opening 43 skills.

This is generated, never hand-written. A hand-maintained map is a second source of truth, and
this project already learned what happens to those: the README's skill inventory sat two months
out of date because nothing compared it to reality.

    python3 tools/knowledge-map.py              # write into the Drive knowledge folder
    python3 tools/knowledge-map.py --stdout     # print instead of writing
    python3 tools/knowledge-map.py --plugin PATH  # map a specific plugin copy

Re-run it after any Fund OS update. `check-knowledge.py` warns when the map is older than the
installed plugin version.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import date
from pathlib import Path

CONFIG = Path.home() / ".fund-os" / "user-config.json"
OUT_NAME = "_KNOWLEDGE-MAP.md"


# ---------------------------------------------------------------- locating ---
def find_plugin() -> Path | None:
    """Prefer the repository checkout we are running inside; fall back to the install."""
    here = Path(__file__).resolve().parent.parent / "plugins" / "fund-os"
    if (here / "skills").is_dir():
        return here
    reg = Path.home() / ".claude" / "plugins" / "installed_plugins.json"
    if reg.is_file():
        d = json.loads(reg.read_text(encoding="utf-8"))
        for key, entries in d.get("plugins", {}).items():
            if key.startswith("fund-os@") and entries:
                p = Path(entries[0]["installPath"])
                if (p / "skills").is_dir():
                    return p
    return None


def find_drive_folder() -> Path | None:
    base = Path.home() / "Library" / "CloudStorage"
    if not base.is_dir():
        return None
    for account in base.iterdir():
        for candidate in account.glob("*/*/*/FUND OS Knowledge"):
            if candidate.is_dir():
                return candidate
    return None


# ----------------------------------------------------------------- parsing ---
MANIFEST_CLAUSE = re.compile(r"From `knowledge\.manifest`,[^.\n]*?((?:`[a-z0-9-]+`[,\s(and)]*)+)")
BUNDLED_PATH = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/skills/([a-z-]+)/knowledge/([a-z0-9-]+\.md)")
OVERLAY_PATH = re.compile(r"~/\.fund-os/knowledge/([a-z0-9-]+)\.md")
TEMPLATE_PATH = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/skills/([a-z-]+)/templates/([a-z0-9-]+\.md)")
# Pre-0.4.0 style: bare CamelCase names with no path and no manifest key behind them.
LEGACY_REF = re.compile(r"^- `([A-Z][A-Za-z]+(?:-[A-Z][A-Za-z]+)+)`\s*$", re.M)


def parse_skill(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    keys: set[str] = set()
    for m in MANIFEST_CLAUSE.finditer(text):
        keys.update(re.findall(r"`([a-z0-9-]+)`", m.group(1)))

    bundled = {(s, f) for s, f in BUNDLED_PATH.findall(text)}
    templates = {(s, f) for s, f in TEMPLATE_PATH.findall(text)}
    overlay = set(OVERLAY_PATH.findall(text)) - {"$k"}

    # A bundled path implies the document, whether or not the manifest clause lists it.
    for _, fname in bundled:
        keys.add(fname[:-3])
    keys.update(overlay)

    section = ""
    m = re.search(r"^## Knowledge references\n(.*?)(?=^## )", text, re.S | re.M)
    if m:
        section = m.group(1)
    legacy = set(LEGACY_REF.findall(section))

    return {
        "keys": keys,
        "bundled": bundled,
        "templates": templates,
        "legacy": legacy,
    }


# ------------------------------------------------------------------ render ---
def build(plugin: Path, manifest: dict[str, str], version: str) -> str:
    skills = sorted(p for p in plugin.glob("*/SKILL.md")) if plugin.name == "skills" else sorted(
        (plugin / "skills").glob("*/SKILL.md")
    )
    parsed = {p.parent.name: parse_skill(p) for p in skills}

    doc_to_skills: dict[str, set[str]] = {}
    for skill, info in parsed.items():
        for k in info["keys"]:
            doc_to_skills.setdefault(k, set()).add(skill)

    # Index what the plugin actually ships, not only what a skill happens to link explicitly.
    bundled_home: dict[str, str] = {}
    for f in sorted((plugin / "skills").glob("*/knowledge/*.md")):
        bundled_home[f.stem] = f"skills/{f.parent.parent.name}/knowledge/{f.name}"
    for f in sorted((plugin / "skills").glob("*/templates/*.md")):
        bundled_home.setdefault(f.stem, f"skills/{f.parent.parent.name}/templates/{f.name}")
    for info in parsed.values():
        for owner, fname in info["bundled"]:
            bundled_home[fname[:-3]] = f"skills/{owner}/knowledge/{fname}"

    out: list[str] = []
    A = out.append
    A("# Knowledge Map — welches Dokument welcher Skill nutzt")
    A("")
    A(f"*Generiert am {date.today().isoformat()} für Fund OS v{version}. "
      f"Nicht von Hand bearbeiten — mit `python3 tools/knowledge-map.py` neu erzeugen.*")
    A("")
    A("Ein Dokument in diesem Ordner zu ändern, ändert sofort das Verhalten der unten genannten")
    A("Skills — ohne Update, ohne Deployment. Diese Tabelle beantwortet die Frage, die man sich")
    A("vor jeder Änderung stellt: **wen betrifft das?**")
    A("")
    A("Auflösungsreihenfolge je Dokument, erster Treffer gewinnt:")
    A("")
    A("```")
    A("Drive-Manifest  →  ~/.fund-os/knowledge/  →  mitgelieferte Vorlage im Plugin")
    A("```")
    A("")
    A("---")
    A("")
    A("## Dokument → Skills")
    A("")
    A("| Dokument | Woher zur Laufzeit | Genutzt von | Mitgelieferte Vorlage |")
    A("|---|---|---|---|")
    missing = []
    for key in sorted(doc_to_skills):
        users = sorted(doc_to_skills[key])
        if key in manifest:
            source = "**Drive**"
        elif key in bundled_home:
            source = "Plugin-Vorlage"
        else:
            source = "⚠️ **nirgends**"
            missing.append((key, users))
        fallback = f"`{bundled_home[key]}`" if key in bundled_home else "—"
        A(f"| **{key}** | {source} | {', '.join(f'`{u}`' for u in users)} | {fallback} |")
    A("")
    if missing:
        A("### ⚠️ Erwartet, aber nirgends vorhanden")
        A("")
        A("Diese Dokumente fordern Skills an, aber sie liegen weder im Drive-Manifest noch als")
        A("Vorlage im Plugin. Der Skill läuft ohne sie weiter — nur eben ohne die Methodik, die")
        A("er eigentlich anwenden sollte. Entweder anlegen und ins Manifest eintragen, oder den")
        A("Verweis im Skill entfernen.")
        A("")
        A("| Fehlendes Dokument | Betroffene Skills |")
        A("|---|---|")
        for key, users in missing:
            A(f"| **{key}** | {', '.join(f'`{u}`' for u in users)} |")
        A("")

    orphans = sorted(set(manifest) - set(doc_to_skills))
    if orphans:
        A("### Im Manifest, aber von keinem Skill referenziert")
        A("")
        A("Werden geladen, wenn ein Skill sie namentlich anfordert, sonst nicht. Meist Nachschlage-")
        A("material für Menschen — das ist in Ordnung, sollte aber bewusst so sein.")
        A("")
        for k in orphans:
            A(f"- **{k}**")
        A("")

    A("---")
    A("")
    A("## Skill → Dokumente")
    A("")
    A("| Skill | Braucht |")
    A("|---|---|")
    for skill in sorted(parsed):
        keys = sorted(parsed[skill]["keys"])
        tmpl = sorted(f"{s}/templates/{f}" for s, f in parsed[skill]["templates"])
        cells = [f"`{k}`" for k in keys] + [f"*{t}*" for t in tmpl]
        A(f"| `{skill}` | {', '.join(cells) if cells else '— (keine)'} |")
    A("")

    legacy = {s: sorted(i["legacy"]) for s, i in parsed.items() if i["legacy"]}
    if legacy:
        A("---")
        A("")
        A("## Unaufgelöste Altverweise")
        A("")
        A("Diese Skills nennen Dokumente in der Schreibweise von vor v0.4.0 — ohne Pfad und ohne")
        A("Manifest-Schlüssel dahinter. Sie werden **nicht geladen**; der Skill arbeitet ohne sie.")
        A("Entweder ein passendes Dokument ins Manifest aufnehmen und den Verweis anpassen, oder")
        A("den Verweis entfernen.")
        A("")
        A("| Skill | Nennt | Im Manifest vorhanden? |")
        A("|---|---|---|")
        for skill, refs in sorted(legacy.items()):
            for r in refs:
                slug = r.lower()
                A(f"| `{skill}` | `{r}` | {'ja, als `' + slug + '`' if slug in manifest else 'nein'} |")
        A("")

    A("---")
    A("")
    A("## Pflege")
    A("")
    A("Nach jedem Fund-OS-Update neu erzeugen:")
    A("")
    A("```bash")
    A("python3 tools/knowledge-map.py")
    A("```")
    A("")
    A("`check-knowledge.py` warnt, wenn diese Datei älter ist als die installierte Plugin-Version.")
    A("Neue Dokumente müssen zusätzlich in `knowledge.manifest` in `~/.fund-os/user-config.json`")
    A("eingetragen werden — sonst findet sie kein Skill, und sie tauchen hier als unreferenziert auf.")
    return "\n".join(out) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--stdout", action="store_true", help="print instead of writing to Drive")
    ap.add_argument("--plugin", help="path to a specific plugin copy")
    args = ap.parse_args()

    plugin = Path(args.plugin) if args.plugin else find_plugin()
    if plugin is None or not (plugin / "skills").is_dir():
        print("Plugin not found — pass --plugin PATH.", file=sys.stderr)
        return 1
    version = json.loads((plugin / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))["version"]

    manifest: dict[str, str] = {}
    if CONFIG.is_file():
        manifest = json.loads(CONFIG.read_text(encoding="utf-8")).get("knowledge", {}).get("manifest", {})
    else:
        print("No ~/.fund-os/user-config.json — the manifest column will be empty.", file=sys.stderr)

    text = build(plugin, manifest, version)

    if args.stdout:
        print(text)
        return 0

    folder = find_drive_folder()
    if folder is None:
        print("Drive knowledge folder not found. Use --stdout, or mount Google Drive.", file=sys.stderr)
        return 1
    out = folder / OUT_NAME
    out.write_text(text, encoding="utf-8")
    print(f"Wrote {out}")
    print(f"  Fund OS v{version} · {len(list((plugin / 'skills').glob('*/SKILL.md')))} skills · "
          f"{len(manifest)} manifest entries")
    return 0


if __name__ == "__main__":
    sys.exit(main())
