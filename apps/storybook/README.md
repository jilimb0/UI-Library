# Storybook

Public component catalog for `@ui-construction-library/core`, plus foundation stories (tokens, typography, spacing, icons).

## Scripts

- `pnpm --filter @ui-app/storybook dev` — local dev on port 6006
- `pnpm build-storybook` — static build (also used by Pages assemble)
- `pnpm --filter @ui-app/storybook chromatic` — visual regression (Chromatic token required)
- `Product/Flagship Flows` — the canonical proof recipes used by the Phase G product story

## Story layout

| Section | Source |
| -------- | ------ |
| **Design System** | `apps/storybook/stories/*` — introduction and token reference |
| **Components/Atoms** | `packages/core/src/components/atoms/**/*.stories.tsx` |
| **Components/Molecules** | `packages/core/src/components/molecules/**/*.stories.tsx` |
| **Components/Organisms** | `packages/core/src/components/organisms/**/*.stories.tsx` |

Colocated core stories are loaded automatically via `.storybook/main.ts`. Add or edit stories next to the component in `packages/core`.

Stories tagged with `autodocs` generate Docs pages (`docs.autodocs: 'tag'`).

## Styling and theme

- Global styles: `@import "@ui-construction-library/core/styles"` in `.storybook/storybook.css`
- Tailwind v4 scans `packages/core/src` and `apps/storybook/stories`
- `ThemeProvider` wrapper and light/dark toolbar in `.storybook/preview.tsx`
- `CrossSiteNav` links to demo and docs (same component as on other public sites)

Vite aliases are shared with demo and docs via `tools/vite/library-aliases.ts`.
