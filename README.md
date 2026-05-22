# UI Construction Library

Composable React UI system for product teams that need a consistent design language across demos, docs, Storybook and application surfaces [cite:199][cite:211].

## Packages

- `@ui-construction-library/core` — core components, themes, hooks and the bundled stylesheet export [cite:202][cite:205]
- `@ui-construction-library/tokens` — color, spacing, typography and semantic theme tokens [cite:184][cite:185][cite:186][cite:187]
- `@ui-construction-library/icons` — shared icon and asset layer [cite:202]
- `@ui-construction-library/react-hook-form` — form integration package used in the showcase demo [cite:199]
- `@ui-construction-library/integration-tanstack-query` — data fetching integration package [cite:199]
- `@ui-construction-library/integration-tanstack-router` — routing integration package [cite:199]
- `@ui-construction-library/integration-i18n` — localization helpers for app surfaces [cite:199]
- `@ui-construction-library/integration-next` — Next.js integration layer [cite:199]

## Entry points

- Demo showcase: product-oriented live demo with ThemeProvider, integrations, hooks and motion proof [cite:199][cite:201]
- Documentation site: install flow, category reference, package overview and adoption guidance [cite:211][cite:212]
- Storybook: component exploration and design-system stories [cite:214]

## Quick start

```bash
pnpm install
pnpm --filter @ui-construction-library/core build
pnpm --filter @ui-app/docs dev
```

## Build

```bash
pnpm build
```

## Release checks

```bash
pnpm release:preflight
```
