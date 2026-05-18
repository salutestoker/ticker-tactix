# Codex Project Workspace

This directory stores project-local context and reusable agent skills.

## Project Baseline

- Scaffold with Laravel's official React/Inertia starter kit or Laravel Breeze's React stack when Breeze is used directly.
- Use the latest compatible Inertia + React packages at scaffold/update time.
- Use Laravel Sail for local development and command examples: `./vendor/bin/sail composer`, `./vendor/bin/sail artisan`, and `./vendor/bin/sail npm`.
- Keep detailed implementation guidance in `context/`; keep `AGENTS.md` concise.

## Layout

- `skills/`: Project skills. Each installed skill should live at `.codex/skills/<skill-name>/SKILL.md`.
- `skill-template/`: A non-active template you can copy when authoring a new skill manually.
- `context/`: Durable project notes for Codex to reference during future work.
- `checklists/`: Project QA and release checklists.

## Installing Skills From skills.sh

Skills from `skills.sh` generally follow the `SKILL.md` format. Install or copy them into:

```text
.codex/skills/<skill-name>/SKILL.md
```

Keep each skill in its own lowercase hyphenated folder. A typical skill folder may include:

```text
skill-name/
├── SKILL.md
├── agents/openai.yaml
├── references/
├── scripts/
└── assets/
```

Only `SKILL.md` is required. Add references, scripts, or assets only when they directly support the skill.
