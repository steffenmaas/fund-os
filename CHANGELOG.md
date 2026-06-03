# Changelog

## 0.2.1 - 2026-06-03

- Fix: move `suggested_prompts` and `featured_skills` inside `cowork_fusion_metadata` object in `plugin.json` — this is the correct nesting the Claude Desktop parser reads, restoring the "Customize" and quick-action buttons in the plugin detail page.

## 0.2.0 - 2026-05-19

- 42 skills across 8 domains: deal flow, LP management, portfolio, finance, legal, market intel, outreach, exit.
- Skill naming convention: `[domain]-[context]-[action]`.
- Per-skill `knowledge/`, `templates/`, `preferences/` folder structure.
- Setup wizard: master data, brand guidelines, systems, storage paths, Drive knowledge scan.
- Starter knowledge and templates for top 10 documents.
- `fund-os:update` skill and `merge-plugin.sh` for safe updates.
- `.plugin` file upload install (no CLI required).
- `USER_GUIDE.md` for end users.
