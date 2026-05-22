# Dependency Policy

Part of the [Self-Owned Platform program](./self-owned-platform.md). Full register: [dependency inventory](./dependency-inventory.md).

## Goal
Reduce vendor lock-in while keeping release velocity and accessibility quality.

## Current Model
- Internal packages are first-class (`@ui-construction-library/*`).
- External packages are allowed only when they provide one of:
  - proven accessibility primitives,
  - runtime performance benefits,
  - ecosystem interoperability (React/Next/TanStack).

## Criticality Tiers

### Tier 0 (Platform-critical)
- `react`, `react-dom`
- `typescript`, `vite`, `rollup`, `vitest`, `pnpm`, `turbo`

Policy:
- Pin through workspace `catalog`.
- Upgrade only with green CI and visual regression checks.

### Tier 1 (UI runtime-critical)
- `@radix-ui/*`
- `@dnd-kit/*`
- `framer-motion`
- `date-fns`

Policy:
- Must be wrapped behind internal component APIs.
- No direct usage from app surfaces unless explicitly approved.

### Tier 2 (Utility/support)
- `clsx`, `tailwind-merge`, `class-variance-authority`, `zod`, `cmdk`, `lucide-react`

Policy:
- Keep usages isolated to `packages/core` or `packages/icons`.
- Prefer thin wrappers and avoid hard-coupling app code.

## Independence Rules
1. App workspaces (`apps/*`) should import from `@ui-construction-library/*` only for UI concerns.
2. Tier-1 UI primitives in `packages/core` must enter only through `packages/core/src/adapters/*` (see [ADR-0001](../adr/0001-adapter-boundary-for-external-ui.md)).
3. `pnpm check:deps` must pass before merge.
4. New external dependency requires:
- documented reason,
- owner,
- fallback/exit strategy,
- bundle impact check.

## Package Naming Contract
Public package names must match repository package manifests:
- `@ui-construction-library/react-hook-form`
- `@ui-construction-library/integration-tanstack-query`
- `@ui-construction-library/integration-tanstack-router`
- `@ui-construction-library/integration-i18n`
- `@ui-construction-library/integration-next`

## Quarterly Hardening Checklist
- Audit direct external imports from `apps/*`.
- Review transitive dependency growth and vulnerabilities.
- Verify React/toolchain versions are aligned via `catalog`.
- Re-run Storybook a11y checks and smoke tests after upgrades.
