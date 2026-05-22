# Architecture

## Monorepo layout

- `apps/*` — playground, docs, storybook, demo-showcase (consumption surfaces)
- `packages/tokens` — design token source of truth (**foundation**)
- `packages/core` — component library: atoms, molecules, organisms, templates (**components**)
- `packages/core/src/adapters` — Tier-1 external UI runtime boundary (L1; see ADR-0001)
- `packages/icons` — icon package (migrating to owned SVG set)
- `packages/integrations/*` — optional framework adapters (**integrations**)
- `packages/utils` — shared utilities
- `.github/workflows`, `scripts/` — **ops** (CI, release, boundary checks)

Planned extractions (platform program): `primitives`, `motion`, `dnd`, `a11y` packages under `packages/`.

## Target layer model

```
┌─────────────────────────────────────────────────────────┐
│  ops: CI, security, release, reproducible builds        │
├─────────────────────────────────────────────────────────┤
│  integrations: Next, TanStack, i18n, RHF (optional)   │
├─────────────────────────────────────────────────────────┤
│  components: atoms → molecules → organisms → templates│
│              (@ui-construction-library/core)            │
├─────────────────────────────────────────────────────────┤
│  primitives: headless, a11y-first (future package)      │
├─────────────────────────────────────────────────────────┤
│  foundation: tokens, theming, motion tokens             │
│              (@ui-construction-library/tokens)          │
└─────────────────────────────────────────────────────────┘
```

**Import contract:** app code uses `@ui-construction-library/*` for UI. External UI libraries are not part of the public app contract.

See [Self-Owned Platform](./self-owned-platform.md) for maturity levels (L1 → L3).

## UI layers (current)

1. **Atoms**: visual primitives (`Button`, `Input`, `Icon`, etc.)
2. **Molecules**: composed controls (`Pagination`, `ComboBox`, `SearchInput`, etc.)
3. **Organisms**: feature blocks (`Sidebar`, `Drawer`, `DataTable`, `Kanban`, etc.)
4. **Templates**: page-level layouts (`DashboardLayout`, `AuthLayout`, etc.)

## Core API conventions

- Controlled/uncontrolled naming:
  - `value` / `defaultValue` / `onChange`
  - `open` / `defaultOpen` / `onOpenChange`
- Visual API:
  - `variant`, `size`, `className`
- Polymorphism:
  - `as` for compatible primitives (`Button`, `Text`, `Heading`)
- Compound pattern for complex UI:
  - `Modal`, `Tabs`, `Accordion`

## UI runtime boundary (L3)

`@ui-construction-library/core` composes first-party packages only:

- `@ui-construction-library/primitives`
- `@ui-construction-library/motion`
- `@ui-construction-library/dnd`
- `@ui-construction-library/icons`
- `@ui-construction-library/utils` (calendar helpers)

Tier-1 UI vendors and `cmdk` / `date-fns` are banned (`pnpm check:deps`). Historical context: [ADR-0001](../adr/0001-adapter-boundary-for-external-ui.md).

## Theming

- `@ui-construction-library/tokens` provides:
  - color scales `50..900`
  - semantic light/dark colors
  - motion/opacity tokens
  - CSS variable generator
  - Tailwind preset

## Integrations

Optional; they must not be required for core library readiness.

- `integration-next` — Next.js wrappers
- `integration-tanstack-query` — async DataTable
- `integration-tanstack-router` — router adapters
- `integration-i18n` — translation provider/hook
- `react-hook-form` — form field bindings

## Related docs

- [Dependency policy](./dependency-policy.md)
- [Dependency inventory](./dependency-inventory.md)
- [Package ownership](../ownership/PACKAGE_OWNERSHIP.md)
- [Roadmap progress](./roadmap-progress.md)
