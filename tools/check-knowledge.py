#!/usr/bin/env python3
"""
check-knowledge.py — consistency check for a fund's own knowledge folder.

validate.py checks the plugin. This checks the *content* the plugin loads: the Drive knowledge
folder and the manifest that points at it. It exists because on 2026-08-11 four documents defined
the same 10-dimension framework with three different weightings, two of which did not sum to 100,
and the manifest pointed at a placeholder for the document that gates due diligence.

Run it after editing anything in the knowledge folder:

    python3 tools/check-knowledge.py

Exit code 0 = consistent, 1 = at least one conflict.
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

CONFIG = Path.home() / ".fund-os" / "user-config.json"

# Keys whose document must not still be a shipped placeholder. These are the ones a skill
# treats as authoritative; a placeholder here means the skill runs on empty values.
MUST_BE_FILLED = [
    "investment-thesis",
    "evaluation-criteria",
    "startup-scoring-matrix",
    "lp-scoring-matrix",
]

PLACEHOLDER_MARKERS = ["— TEMPLATE", "This is the shipped template", "[e.g. "]

failed = False


def report(label: str, problems: list[str], detail: str = "") -> None:
    global failed
    if problems:
        failed = True
        print(f"  {label}: FAILED")
        for p in problems:
            print(f"    - {p}")
    else:
        print(f"  {label}: ok{('  (' + detail + ')') if detail else ''}")


def find_drive_folder() -> Path | None:
    """Locate the synced knowledge folder. Path differs per user, so search the mount."""
    base = Path.home() / "Library" / "CloudStorage"
    if not base.is_dir():
        return None
    for account in base.iterdir():
        for candidate in account.glob("*/*/*/FUND OS Knowledge"):
            if candidate.is_dir():
                return candidate
    return None


def main() -> int:
    if not CONFIG.is_file():
        print(f"No configuration at {CONFIG} — run fund-os:setup first.")
        return 1

    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    manifest = cfg.get("knowledge", {}).get("manifest", {})
    print(f"Checking {len(manifest)} manifest entries against the knowledge folder\n")

    folder = find_drive_folder()
    if folder is None:
        print("  Drive folder not found locally — skipping file checks.")
        print("  (Google Drive must be mounted for this script to inspect documents.)")
        return 1
    print(f"  Folder: {folder}\n")

    names = {p.name for p in folder.iterdir()}
    archive = folder / "_archive"

    def drive_id(p: Path) -> str | None:
        """Every synced file carries its Drive id — .gdoc in the JSON body, others as an xattr."""
        if p.suffix == ".gdoc":
            try:
                return json.loads(p.read_text(encoding="utf-8")).get("doc_id")
            except Exception:
                return None
        try:
            import subprocess
            r = subprocess.run(
                ["xattr", "-p", "com.google.drivefs.item-id#S", str(p)],
                capture_output=True, text=True,
            )
            return r.stdout.strip() or None
        except Exception:
            return None

    active = {}     # drive id -> filename, in the working set
    stale = {}      # drive id -> filename, in _archive
    no_id = set()   # filenames whose id could not be read locally
    for p in folder.iterdir():
        if not p.is_file() or p.name.startswith("."):
            continue
        i = drive_id(p)
        if i:
            active[i] = p.name
        else:
            no_id.add(p.name)
    if archive.is_dir():
        for p in archive.iterdir():
            if p.is_file() and (i := drive_id(p)):
                stale[i] = p.name

    # A file that has just been written is uploaded asynchronously, so its id attribute can
    # be missing for a while. That is a local sync artefact, not a broken manifest — fall
    # back to the filename before claiming a document has gone missing.
    problems = []
    for key, fid in manifest.items():
        if fid in stale:
            problems.append(f"'{key}' points at {stale[fid]}, which was moved to _archive/")
        elif fid not in active:
            if f"{key}.md" in no_id:
                continue  # named correctly, id not yet synced
            problems.append(
                f"'{key}' points at id {fid}, which is not in the knowledge folder — "
                f"it was moved, renamed or deleted"
            )
    referenced = set(manifest.values())
    for i, n in sorted(active.items(), key=lambda kv: kv[1]):
        if i not in referenced and not n.startswith("_"):
            problems.append(f"'{n}' is in the folder but no manifest key points at it — no skill will find it")
    detail = f"{len(active) + len(no_id)} documents"
    if no_id:
        detail += f", {len(no_id)} still syncing"
    report("Manifest entries resolve", problems, detail)

    # --- documents that must be real, not placeholders -------------------------
    problems = []
    for key in MUST_BE_FILLED:
        f = folder / f"{key}.md"
        if not f.is_file():
            continue  # a Google Doc; cannot inspect from disk
        text = f.read_text(encoding="utf-8", errors="replace")
        for marker in PLACEHOLDER_MARKERS:
            if marker in text:
                problems.append(
                    f"{key}.md still contains '{marker.strip()}' — it is the shipped placeholder, "
                    f"not this fund's document. Skills that rely on it will run on empty values."
                )
                break
    report("No placeholders in load-bearing documents", problems)

    # --- scoring matrices add up ----------------------------------------------
    problems = []
    checked = []
    m = folder / "startup-scoring-matrix.md"
    if m.is_file():
        caps = [int(x) for x in re.findall(r"^### \d+\. .+ — Weight: (\d+)%", m.read_text(encoding="utf-8"), re.M)]
        if caps:
            checked.append(f"startup {sum(caps)}")
            if sum(caps) != 100:
                problems.append(f"startup-scoring-matrix.md: {len(caps)} weights sum to {sum(caps)}, not 100")
    m = folder / "lp-scoring-matrix.md"
    if m.is_file():
        text = m.read_text(encoding="utf-8")
        caps = [int(x) for x in re.findall(r"^## Dimension \d+ — .+ \(\d+–(\d+) pts\)", text, re.M)]
        if caps:
            checked.append(f"LP raw {sum(caps)}")
            norm = re.search(rf"round\(\s*raw\s*/\s*{sum(caps)}\s*[×x*]\s*100\s*\)", text)
            if not norm:
                problems.append(
                    f"lp-scoring-matrix.md: caps sum to {sum(caps)} but the document does not state "
                    f"'round(raw / {sum(caps)} × 100)' — scores would sit on a stretched scale"
                )
    report("Scoring matrices add up", problems, ", ".join(checked))

    # --- the thesis and the hypothesis must not contradict each other ----------
    problems = []
    t = folder / "investment-thesis.md"
    if t.is_file():
        text = t.read_text(encoding="utf-8")
        blanket = re.search(r"^-\s*Naval defence and autonomous vessels.*$", text, re.M)
        dual = "Dual-use is in scope" in text or "dual-use" in text.lower()
        if blanket and dual:
            problems.append(
                "investment-thesis.md excludes naval defence outright AND describes a dual-use path — "
                "pick one. A blanket exclusion auto-passes exactly the companies the dual-use thesis wants."
            )
        elif blanket:
            problems.append(
                "investment-thesis.md excludes naval defence outright, but investment-hypothesis promotes "
                "dual-use expansion as a TAM multiplier. Triage and strategy disagree."
            )
    report("Thesis and hypothesis agree on dual-use", problems)

    # --- nothing left in the working set that duplicates something -------------
    problems = []
    stems = {}
    for n in names:
        if n.startswith(("_", ".")) or n == "_archive":
            continue
        stem = re.sub(r"[-_ ]?v?\d+(\.\d+)*$", "", Path(n).stem.lower()).replace("_", "-").replace(" ", "-")
        stems.setdefault(stem, []).append(n)
    for stem, files in stems.items():
        if len(files) > 1:
            problems.append(f"possible duplicates for '{stem}': {', '.join(sorted(files))}")
    report("No duplicate documents in the working set", problems)

    # --- be explicit about what this script cannot see -------------------------
    gdocs = sorted(p.stem for p in folder.iterdir() if p.suffix == ".gdoc")
    if gdocs:
        print("\n  Not checked — Google Docs are pointer files on disk, so their content is")
        print("  invisible to this script. Review these by hand when the framework changes:")
        for g in gdocs:
            print(f"    · {g}")

    print("\nFAILED" if failed else "\nKnowledge folder is consistent.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
