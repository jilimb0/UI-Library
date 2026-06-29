# UI-Library — @ui-construction-library

Multi-framework UI component library and design system. Published as `@ui-construction-library/*` on npm. Atoms-to-templates, accessible, Tailwind CSS v4.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm + Turbo |
| Language | TypeScript 5/6 |
| UI | React 18 |
| Build | Rollup |
| Tests | Vitest + happy-dom |
| Stories | Storybook 10 |
| Styling | Tailwind CSS v4 |
| E2E | Playwright |
| Lint/Format | Biome 2 (lineWidth 80, single quotes) |
| Versioning | Changesets |

## Structure
**14 packages:** core, primitives, behaviors, icons, tokens, utils, dnd, motion, schema, styles, export-core, prompt-engine, registry, integrations
**8 apps:** storybook, demo-showcase, docs, playground, builder, solid-dashboard, svelte-dashboard, vue-dashboard

## Commands
- `pnpm dev` — Turbo parallel dev
- `pnpm build` — Turbo orchestrated builds
- `pnpm test` — all packages
- `pnpm lint` / `pnpm format` — Biome
- `pnpm typecheck` — Turbo typecheck
- `pnpm storybook` — Storybook dev server

## Conventions
- Framework-agnostic (Solid, Svelte, Vue dashboards exist alongside React)
- Axe-core accessibility testing
- API snapshots, bundle size checks, dependency boundary enforcement
- Shared dependency versions in `pnpm-workspace.yaml`
