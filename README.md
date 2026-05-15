# UI Library Monorepo

Production-ready monorepo for design tokens, React UI components, icons, and framework integrations.

## Packages

- `@ui-lib/core`: UI components (atoms, molecules, organisms, templates), themes, hooks
- `@ui-lib/tokens`: color scales, semantic tokens, motion/opacity tokens, CSS variables, Tailwind preset
- `@ui-lib/icons`: icon exports
- `@ui-lib/integration-next`: Next.js adapters
- `@ui-lib/integration-tanstack-query`: async DataTable integration
- `@ui-lib/integration-tanstack-router`: router adapters
- `@ui-lib/integration-i18n`: translation provider/hook

## Quick Start

```bash
pnpm install
pnpm typecheck
pnpm dev
```

## Build

```bash
pnpm build
```

## Docs

Architecture and guides are in `docs/`.

## Release

```bash
pnpm release:preflight
```
