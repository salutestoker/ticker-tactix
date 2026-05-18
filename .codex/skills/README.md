# Project Skills

Place project-local Codex skills in this directory.

## Expected Structure

```text
.codex/skills/
└── skill-name/
    ├── SKILL.md
    ├── agents/openai.yaml
    ├── references/
    ├── scripts/
    └── assets/
```

## Skill Naming

- Use lowercase letters, numbers, and hyphens only.
- Keep the folder name and the `name` field in `SKILL.md` the same.
- Keep descriptions specific, because Codex uses the description to decide when to load the skill.

Copy `.codex/skill-template/` into this directory when you want to draft a new project-specific skill.

