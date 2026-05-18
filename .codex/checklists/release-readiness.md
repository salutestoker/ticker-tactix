# Release Readiness Checklist

- Scope is clear and implemented.
- User-facing behavior is verified.
- Tests are updated for changed behavior.
- Environment variables are documented without secret values.
- Build passes locally or known build gaps are documented.
- Database migrations or seed changes are reviewed.
- Accessibility basics are checked.
- Performance-sensitive pages are checked for obvious regressions.
- Final `git status --short` contains only intentional changes.

