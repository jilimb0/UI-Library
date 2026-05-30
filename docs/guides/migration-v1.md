# Migration Guide: v1

This guide captures the practical path to the `v1.0` self-owned baseline.

## 1. Replace direct external UI usage

- Import UI primitives and components from `@ui-construction-library/*`.
- Remove direct app/runtime dependencies on Tier-1 UI packages from `core`.
- Keep app workspaces on workspace package imports only.

## 2. Use the owned building blocks

- Use `@ui-construction-library/primitives` for headless interaction patterns.
- Use `@ui-construction-library/motion` for motion primitives.
- Use `@ui-construction-library/dnd` for drag-and-drop surfaces.
- Use `@ui-construction-library/icons` for owned iconography.

## 3. Validate before release

- Run dependency and app policy checks.
- Run typecheck, tests, and build for changed workspaces.
- Confirm the certification and launch artifacts are up to date.

## 4. Rollback strategy

- Prefer reverting the workspace package bump or feature branch if a migration regresses.
- Follow the release runbook for stable promotion and rollback steps.
