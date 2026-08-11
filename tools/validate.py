#!/usr/bin/env python3
"""
validate.py — self-check for the Fund OS plugin.

Every check here exists because the corresponding defect actually shipped. See
docs/version-audit-2026-08-11.md for what each one is guarding against.

    python3 tools/validate.py

Exit code 0 = clean, 1 = at least one check failed.
"""

from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "plugins" / "fund-os"
SKILLS = PLUGIN / "skills"
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv"}

failed = False


def report(label: str, bad: list[str], count: int) -> None:
    global failed
    if bad:
        failed = True
        print(f"  {label}: FAILED")
        for b in bad:
            print(f"    - {b}")
    else:
        print(f"  {label}: {count} checked, ok")


def walk(*suffixes: str):
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if fn.endswith(suffixes):
                yield Path(dirpath) / fn


def rel(p: Path) -> str:
    return str(p.relative_to(ROOT))


# ---------------------------------------------------------------- JSON --------
def check_json() -> None:
    files = list(walk(".json", ".template"))
    bad = []
    for f in files:
        try:
            json.loads(f.read_text(encoding="utf-8"))
        except Exception as e:
            bad.append(f"{rel(f)}: {e}")
    report("JSON parses", bad, len(files))


# ------------------------------------------------------- skill front matter ---
def check_frontmatter() -> None:
    files = sorted(SKILLS.glob("*/SKILL.md"))
    bad = []
    for f in files:
        t = f.read_text(encoding="utf-8")
        m = re.match(r"^---\n(.*?)\n---\n", t, re.S)
        if not m:
            bad.append(f"{rel(f)}: no front matter")
            continue
        fm = m.group(1)
        name = re.search(r"^name:\s*(\S+)\s*$", fm, re.M)
        desc = re.search(r"^description:\s*(.+)$", fm, re.M)
        if not name:
            bad.append(f"{rel(f)}: front matter has no name")
        elif name.group(1) != f.parent.name:
            bad.append(f"{rel(f)}: name '{name.group(1)}' != directory '{f.parent.name}'")
        if not desc:
            bad.append(f"{rel(f)}: front matter has no description")
        elif len(desc.group(1)) < 40:
            bad.append(f"{rel(f)}: description too short to route on ({len(desc.group(1))} chars)")
    report("Skill front matter", bad, len(files))


# ------------------------------------------------------------ dead paths ------
def check_dead_paths() -> None:
    """The 0.2.0-0.3.7 bug: 40 skills read the fund config from a guessed plugin path.

    Naming ~/.claude/plugins/ as an install *location* is fine — that is where the CLI puts
    marketplace installs. What broke was reading a fund *resource* from a hand-built path
    under it, instead of from ${CLAUDE_PLUGIN_ROOT} or ~/.fund-os. So flag the resource read,
    not the mention.
    """
    resource = re.compile(r"~/\.claude/plugins/[^\s`'\"|)]*/[^\s`'\"|)]*\.(json|md)")
    bad = []
    n = 0
    for f in walk(".md", ".json", ".sh", ".html"):
        r = rel(f)
        if r.startswith("docs/") or r == "CHANGELOG.md":
            continue
        n += 1
        for i, line in enumerate(f.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            m = resource.search(line)
            if m:
                bad.append(
                    f"{r}:{i}: reads a resource from a hand-built plugin path — {m.group(0)}. "
                    f"Use ${{CLAUDE_PLUGIN_ROOT}} or ~/.fund-os; the plugin directory layout is not stable."
                )
    report("No resource reads from guessed plugin paths", bad, n)


# --------------------------------------------------- plugin-root references ---
def check_plugin_root_refs() -> None:
    """Every ${CLAUDE_PLUGIN_ROOT}/... reference must resolve to a real file."""
    pat = re.compile(r"\$\{CLAUDE_PLUGIN_ROOT\}/([A-Za-z0-9_./-]+)")
    bad = []
    n = 0
    for f in sorted(SKILLS.glob("*/SKILL.md")):
        n += 1
        for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            for m in pat.finditer(line):
                target = PLUGIN / m.group(1)
                if "$" in m.group(1) or "*" in m.group(1):
                    continue  # shell-interpolated, cannot resolve statically
                if not target.exists():
                    bad.append(f"{rel(f)}:{i}: ${{CLAUDE_PLUGIN_ROOT}}/{m.group(1)} does not exist")
    report("Plugin-root references resolve", bad, n)


def check_skills_have_anchor() -> None:
    """A skill that reads config or knowledge must anchor it, or chat sessions break."""
    bad = []
    files = sorted(SKILLS.glob("*/SKILL.md"))
    for f in files:
        t = f.read_text(encoding="utf-8")
        if "CLAUDE_PLUGIN_ROOT" not in t and "~/.fund-os" not in t:
            bad.append(f"{rel(f)}: no ${{CLAUDE_PLUGIN_ROOT}} or ~/.fund-os anchor")
    report("Skills anchor their paths", bad, len(files))


# ------------------------------------------------------- cross-references -----
def check_skill_crossrefs() -> None:
    """A reference to a sibling skill must name a skill that exists."""
    known = {p.name for p in SKILLS.iterdir() if p.is_dir()}
    pat = re.compile(r"`fund-os:([a-z0-9-]+)`")
    bad = []
    for f in sorted(SKILLS.glob("*/SKILL.md")):
        for i, line in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            for m in pat.finditer(line):
                if m.group(1) not in known:
                    bad.append(f"{rel(f)}:{i}: refers to fund-os:{m.group(1)}, which does not exist")
    report("Skill cross-references", bad, len(known))


# ------------------------------------------------------------- dashboard -----
def check_dashboard() -> None:
    """The 0.3.7 bug: raw newlines inside JS strings killed the whole <script>."""
    f = PLUGIN / "Fund_OS_Dashboard.html"
    bad = []
    if not f.exists():
        report("Dashboard", [f"{rel(f)} missing"], 0)
        return
    t = f.read_text(encoding="utf-8")
    i = t.find("const SKILLS = ")
    if i < 0:
        report("Dashboard", ["SKILLS array not found"], 0)
        return
    s = i + len("const SKILLS = ")
    depth = k = 0
    k = s
    instr = esc = False
    raw_newlines = 0
    while k < len(t):
        c = t[k]
        if instr:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                instr = False
            elif c == "\n":
                raw_newlines += 1
        else:
            if c == '"':
                instr = True
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    break
        k += 1

    if raw_newlines:
        bad.append(f"{raw_newlines} raw newlines inside JS string literals — the <script> block will not parse")
    else:
        try:
            data = json.loads(t[s:k + 1])
        except Exception as e:
            bad.append(f"SKILLS array does not parse: {e}")
            data = []
        on_disk = {p.name for p in SKILLS.iterdir() if p.is_dir()}
        in_dash = {x.get("slug") for x in data}
        for slug in sorted(on_disk - in_dash):
            bad.append(f"skill '{slug}' exists on disk but is missing from the dashboard")
        for slug in sorted(in_dash - on_disk):
            bad.append(f"dashboard lists '{slug}', which has no skill directory")

        phases = re.search(r"const PHASES = (\[.*?\]);", t, re.S)
        if phases:
            ids = {p["id"] for p in json.loads(phases.group(1))} | {"setup"}
            for x in data:
                if x.get("phase") not in ids:
                    bad.append(f"skill '{x.get('slug')}' has phase '{x.get('phase')}', which PHASES does not define — it will not render")

        hero = re.search(r'<div class="num">(\d+)</div><div class="lbl">Skills</div>', t)
        if hero and int(hero.group(1)) != len(on_disk):
            bad.append(f"hero skill count says {hero.group(1)}, there are {len(on_disk)} skills")

    report("Dashboard", bad, 1)


# --------------------------------------------------------------- versions ----
def check_versions() -> None:
    bad = []
    pj = json.loads((PLUGIN / ".claude-plugin" / "plugin.json").read_text(encoding="utf-8"))
    mj = json.loads((ROOT / ".claude-plugin" / "marketplace.json").read_text(encoding="utf-8"))
    v = pj["version"]
    mv = mj["plugins"][0]["version"]
    if v != mv:
        bad.append(f"plugin.json is {v} but marketplace.json says {mv}")
    ch = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    if not re.search(rf"^## {re.escape(v)} ", ch, re.M):
        bad.append(f"CHANGELOG.md has no '## {v}' entry")
    n_skills = len([p for p in SKILLS.iterdir() if p.is_dir()])
    m = re.match(r"(\d+) Claude Skills", pj.get("description", ""))
    if m and int(m.group(1)) != n_skills:
        bad.append(f"plugin.json description says {m.group(1)} skills, there are {n_skills}")
    for s in pj.get("cowork_fusion_metadata", {}).get("featured_skills", []):
        if not (SKILLS / s).is_dir():
            bad.append(f"featured_skills lists '{s}', which has no skill directory")
    report("Versions consistent", bad, 1)


# ---------------------------------------------------------------- secrets ----
def check_secrets() -> None:
    """This repository is shared with other funds. Nothing fund-private may enter it."""
    patterns = [
        (re.compile(r"\b1[A-Za-z0-9_-]{27,}\b"), "looks like a Google Drive file/folder id"),
        (re.compile(r"(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|xox[bp]-[A-Za-z0-9-]{20,}|AIza[A-Za-z0-9_-]{30,})"), "looks like an API key or token"),
        (re.compile(r'"(api_?key|secret|token|password)"\s*:\s*"(?!\$\{)[^"]{8,}"', re.I), "hardcoded credential"),
    ]
    bad = []
    n = 0
    for f in walk(".md", ".json", ".template", ".sh", ".html", ".example"):
        if "docs/" in rel(f) or rel(f) == "CHANGELOG.md":
            continue
        n += 1
        for i, line in enumerate(f.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            for pat, why in patterns:
                m = pat.search(line)
                if m:
                    bad.append(f"{rel(f)}:{i}: {why}: {m.group(0)[:24]}…")
    report("No secrets", bad, n)


# ---------------------------------------------------------- fund-neutral -----
def check_fund_neutral() -> None:
    """The plugin ships templates, not one fund's filled-in documents.

    This repository is shared with other funds. A fund's own thesis, scoring signals, sector
    language and CRM slugs belong in ~/.fund-os/ or the Drive knowledge folder — never here.
    Attribution (author, copyright) is the one legitimate exception.
    """
    terms = [
        (re.compile(r"\bOcean One\b", re.I), "names the publishing fund as if it were the user's fund"),
        (re.compile(r"maritime\s+leisure", re.I), "hardcodes one fund's sector"),
        (re.compile(r"\bO1\s+(Framework|Startup Scoring|LP|Thesis Fit)\b"), "hardcodes one fund's framework name"),
        (re.compile(r"\bo1_[a-z_]+\b"), "hardcodes one fund's CRM field slug — read it from crmFields instead"),
        (re.compile(r"\b(Steffen Maas|Dietlind)\b"), "names an individual"),
    ]
    # Attribution is legitimate; a fund still authors the plugin it publishes.
    allow = [
        re.compile(r'"name":\s*"Ocean One Ventures"'),      # plugin.json author
        re.compile(r"©\s*(\d{4}\s+)?Ocean One Ventures"),      # README copyright, with or without year
        re.compile(r'"author"'),
    ]
    bad = []
    n = 0
    for f in walk(".md", ".json", ".template", ".html", ".example"):
        r = rel(f)
        if r.startswith("docs/") or r == "CHANGELOG.md" or not r.startswith("plugins/"):
            continue
        n += 1
        for i, line in enumerate(f.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            if any(a.search(line) for a in allow):
                continue
            for pat, why in terms:
                m = pat.search(line)
                if m:
                    bad.append(f"{r}:{i}: '{m.group(0)}' {why}")
                    break
    report("Shipped content is fund-neutral", bad, n)


# ------------------------------------------------------- scoring integrity ---
def check_scoring_matrices() -> None:
    """A scored matrix must add up. Either the caps sum to 100, or it normalises explicitly.

    Both matrices shipped for weeks declaring /100 while their caps summed to 110 and 120,
    so every score sat on a stretched scale and the tier thresholds did not mean what they said.
    """
    bad = []
    checked = 0
    specs = [
        # path, dimension-cap pattern, raw total that is correct, normalisation required?
        (SKILLS / "deal-startup-score" / "knowledge" / "startup-scoring-matrix.md",
         re.compile(r"^### \d+\. .+ — Weight: (\d+)%", re.M), 100, False),
        (SKILLS / "lp-investor-scoring" / "knowledge" / "lp-scoring-matrix.md",
         re.compile(r"^## Dimension \d+ — .+ \(\d+–(\d+) pts\)", re.M), 120, True),
    ]
    for path, pat, expected_raw, needs_norm in specs:
        if not path.exists():
            continue
        checked += 1
        text = path.read_text(encoding="utf-8")
        caps = [int(x) for x in pat.findall(text)]
        if not caps:
            bad.append(f"{rel(path)}: no dimension caps found — the heading pattern may have changed")
            continue
        if sum(caps) != expected_raw:
            bad.append(
                f"{rel(path)}: {len(caps)} dimension caps sum to {sum(caps)}, expected {expected_raw}. "
                f"Either rebalance the caps or update this check and the normalisation."
            )
        if needs_norm:
            if not re.search(rf"round\(\s*raw\s*/\s*{expected_raw}\s*[×x*]\s*100\s*\)", text):
                bad.append(
                    f"{rel(path)}: caps sum to {expected_raw}, so the matrix must state the "
                    f"normalisation 'round(raw / {expected_raw} × 100)' — otherwise scores are on a stretched scale"
                )
            if "cap at 100" in text:
                bad.append(f"{rel(path)}: still says 'cap at 100' — capping hides the scale defect instead of fixing it")
        elif "raw" in text and re.search(r"round\(\s*raw\s*/", text):
            bad.append(f"{rel(path)}: caps already sum to 100, so it must not also normalise")
    report("Scoring matrices add up", bad, checked)


# ----------------------------------------------------------------- shell -----
def check_shell() -> None:
    files = list(walk(".sh"))
    bad = []
    for f in files:
        r = subprocess.run(["bash", "-n", str(f)], capture_output=True, text=True)
        if r.returncode:
            bad.append(f"{rel(f)}: {r.stderr.strip()}")
    report("Shell syntax", bad, len(files))


def main() -> int:
    print(f"Validating {ROOT}  (Fund OS)\n")
    check_json()
    check_frontmatter()
    check_dead_paths()
    check_plugin_root_refs()
    check_skills_have_anchor()
    check_skill_crossrefs()
    check_fund_neutral()
    check_dashboard()
    check_versions()
    check_secrets()
    check_scoring_matrices()
    check_shell()
    print("\nFAILED" if failed else "\nAll checks passed.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
