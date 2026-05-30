# v1 Excellence Release Notes

These notes summarize the `v1.0` self-owned release posture for UI Construction Library.

## What shipped

- `@ui-construction-library/core` owns its runtime component surface without direct Tier-1 UI imports.
- `@ui-construction-library/primitives`, `motion`, `dnd`, `icons`, `registry`, and `styles` are first-class workspace packages.
- Builder, docs, demo-showcase, playground, and Storybook all validate against the shared workspace policy.

## Quality gates

- Dependency boundaries and app import policy checks pass in CI.
- API snapshot, source registry, preset docs, gold kits, and launch checks are wired into the validation flow.
- Focused component, integration, and builder helper tests cover the high-risk surface area.

## Operating notes

- Use `docs/release/RELEASE_RUNBOOK.md` for versioning and promotion steps.
- Use `docs/guides/self-owned-platform.md` for the platform ownership model and certification criteria.
- Keep `docs/guides/dependency-inventory.md` current when workspace dependencies change.
