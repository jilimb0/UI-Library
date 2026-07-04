# UI-Library — @ui-construction-library

Multi-framework UI component library and design system. Published as `@ui-construction-library/*` on npm. Atoms-to-templates, accessible, Tailwind CSS v4.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm v11.7 + Turbo |
| Language | TypeScript ^5.6.3 (6.x compatible) |
| UI | React >=18.0.0 (18.x / 19.x compatible) |
| Build | Rollup |
| Tests | Vitest v4 |
| Stories | Storybook 10 |
| Styling | Tailwind CSS v4 |
| E2E | Playwright |
| Lint/Format | Biome v2.4.15 (lineWidth 80, single quotes) |
| Versioning | Changesets |
| Runtime | Node >=22 |

## Structure
**14 packages:** behaviors, core, dnd, export-core, icons, integrations, motion, primitives, prompt-engine, registry, schema, styles, tokens, utils
**8 apps:** storybook, demo-showcase, docs, playground, builder, solid-dashboard, svelte-dashboard, vue-dashboard

## Commands
- `pnpm dev` — Turbo parallel dev
- `pnpm build` — Turbo orchestrated builds
- `pnpm test` — all packages (Vitest)
- `pnpm lint` / `pnpm format` — Biome
- `pnpm typecheck` — Turbo typecheck
- `pnpm storybook` — Storybook dev server
- `pnpm validate` — full CI gate (slow; avoid in hooks)

## Conventions
- Framework-agnostic (Solid, Svelte, Vue dashboards exist alongside React)
- Axe-core accessibility testing
- API snapshots, bundle size checks, dependency boundary enforcement
- Shared dependency versions in `pnpm-workspace.yaml`
