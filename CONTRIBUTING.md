# Contributing

## Prerequisites

- Node `>=24`
- pnpm `11.x`

## Setup

```bash
pnpm install
pnpm playwright:install   # one-time: downloads Chromium for E2E
```

E2E expects the **assembled Pages layout** (same as GitHub Pages), not `demo:preview` alone:

```bash
./scripts/serve-pages-preview.sh   # terminal 1 — serves /UI-Library/ with rewrites
pnpm check:e2e                     # terminal 2 — or use default webServer in playwright.config
```

Do not use `UI_LIBRARY_SKIP_WEB_SERVER=1` unless you started `serve-pages-preview.sh` yourself. Plain `vite preview` uses base `/demo/` and will fail smoke tests.

### Platform validation (L3)

```bash
pnpm validate              # deps, API snapshot, lint, typecheck, test, build, perf
pnpm validate:platform     # above + E2E (assembles Pages site; slow first run)
```

Release channels: `pnpm publish:canary` / `pnpm publish:stable` (see [CANARY_RELEASE.md](docs/release/CANARY_RELEASE.md)).

## Workflow

1. Create a feature branch.
2. Implement changes in the correct layer:
- `packages/tokens` for design tokens/theming
- `packages/core` for UI components
- `packages/integrations/*` for framework adapters
3. Keep API contracts consistent (`value/onChange`, `open/onOpenChange`, `as`, `variant`, `size`).
4. Update docs when API changes.

## Platform program

The library targets [v1.0 self-owned](docs/guides/self-owned-platform.md): UI primitives and behavior live in `@ui-construction-library/*`. See [dependency policy](docs/guides/dependency-policy.md).

## Security scanning (CodeQL)

CodeQL runs automatically when you change code under `packages/`, `apps/`, `tools/`, or this workflow file:

- **Pull request** to `main` — scan runs before merge; new findings appear on the PR Security tab.
- **Push** to `main` — rescan runs after merge; fixed issues (for example ReDoS in `slugify`) are marked **Fixed** in [Security → Code scanning](https://github.com/jilimb0/UI-Library/security/code-scanning).
- **Weekly** schedule and **manual** run: Actions → CodeQL → Run workflow.

You do not need to dismiss alerts by hand after a fix once a successful CodeQL run completes on `main`.

## Required checks

```bash
pnpm check:deps
pnpm --filter @ui-construction-library/tokens typecheck
pnpm --filter @ui-construction-library/core typecheck
pnpm --filter @ui-construction-library/integration-next typecheck
pnpm --filter @ui-construction-library/integration-tanstack-query typecheck
pnpm --filter @ui-construction-library/integration-tanstack-router typecheck
pnpm --filter @ui-construction-library/integration-i18n typecheck
```

For full validation:

```bash
pnpm validate
```

(`validate` = `check:deps` + lint + typecheck + test + build)

E2E (builds Pages preview, installs Chromium if needed):

```bash
pnpm check:e2e
```

## Public apps (demo, docs, Storybook)

All three surfaces share the same integration pattern:

1. **Styles** — `@import "@ui-construction-library/core/styles"` in the app CSS entry (includes globals, components, utilities, animations).
2. **Vite** — `libraryAliases()` from `tools/vite/library-aliases.ts` (source aliases to `packages/*/src`, not only `dist`).
3. **Tailwind** — `@source` directives pointing at `packages/core/src` and the app `src` tree.
4. **Theme** — wrap the app in `ThemeProvider` from `@ui-construction-library/core`.
5. **Cross-site nav** — `CrossSiteNav` with `current` set to `'demo' | 'docs' | 'storybook'`.

When adding a component story, colocate `*.stories.tsx` beside the component and use the title prefix `Components/Atoms| Molecules| Organisms/<Name>`. Tag stories with `autodocs` when props should appear in Storybook Docs.

## Component checklist

- [ ] Component exported from layer index
- [ ] Public API typed and documented
- [ ] Colocated story under `Components/{Atoms|Molecules|Organisms}/<Name>` with `tags: ['autodocs']` when useful
- [ ] Accessibility semantics verified
- [ ] Tests added/updated

## Release checklist

- [ ] Changeset added (`pnpm changeset`)
- [ ] Migration notes updated if API changed
- [ ] Docs updated (`README` + `docs/api/components.md`)
