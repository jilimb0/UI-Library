# UI Library Monorepo

Production-ready monorepo for design tokens, React UI components, icons, and framework integrations.

## Packages

- `@ui-construction-library/core`: UI components (atoms, molecules, organisms, templates), themes, hooks
- `@ui-construction-library/tokens`: color scales, semantic tokens, motion/opacity tokens, CSS variables, Tailwind preset
- `@ui-construction-library/icons`: icon exports
- `@ui-construction-library/integration-next`: Next.js adapters
- `@ui-construction-library/integration-tanstack-query`: async DataTable integration
- `@ui-construction-library/integration-tanstack-router`: router adapters
- `@ui-construction-library/integration-i18n`: translation provider/hook

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
