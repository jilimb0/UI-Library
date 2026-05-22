# Dependency Policy

Part of the [Self-Owned Platform program](./self-owned-platform.md). Full register: [dependency inventory](./dependency-inventory.md).

## Goal

Self-owned UI runtime: no third-party component libraries in `core` or apps.

## Current model

- UI primitives, motion, DnD, icons: `@ui-construction-library/*` (first-party).
- Apps import UI only from `@ui-construction-library/*`.
- Integrations stay in `packages/integrations/*`.

## Criticality tiers

### Tier 0 (platform-critical)

- `react`, `react-dom`
- `typescript`, `vite`, `rollup`, `vitest`, `pnpm`, `turbo`

Policy: pin via workspace `catalog`; upgrade with full CI.

### Tier 1 (formerly external UI — replaced)

- `@radix-ui/*` → `@ui-construction-library/primitives`
- `@dnd-kit/*` → `@ui-construction-library/dnd`
- `framer-motion` → `@ui-construction-library/motion`
- `lucide-react` → `@ui-construction-library/icons`
- `cmdk` → owned `CommandPalette` implementation
- `date-fns` → `@ui-construction-library/utils` calendar helpers

Policy: **banned** in `packages/core` and `apps/*` (`pnpm check:deps`).

### Tier 2 (utility / support in `core`)

- `clsx`, `tailwind-merge`, `class-variance-authority`, `zod`

Policy: isolated to `packages/core`; optional inline/fork later.

## Independence rules

1. App workspaces (`apps/*`) use `@ui-construction-library/*` only for UI.
2. `packages/core` depends on first-party UI packages + Tier-2 utilities only.
3. `pnpm check:deps` and `pnpm check:apps` must pass before merge.

## CI

```bash
pnpm check:deps
```
