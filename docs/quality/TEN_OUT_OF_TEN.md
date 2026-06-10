# 10/10 Quality Criteria

This document defines what "10 out of 10" means for `@ui-construction-library` and how to measure it.

## DX — Developer Experience

| # | Criterion | How to verify |
|---|-----------|---------------|
| 1 | A new developer can scaffold a dashboard shell (AppShell + Sidebar + TopNav + PageHeader) in under 30 minutes. | Timed exercise using only docs. |
| 2 | A form with validation (react-hook-form integration) works end-to-end in under 1 hour. | Build a settings form with 3 fields + array field + submit. |
| 3 | Theming (light/dark switch + token override) works in under 15 minutes. | Follow the token docs to swap 5 brand colors. |
| 4 | Every public component has a JSDoc block with `@example`. | Automated check via `api-extractor`. |
| 5 | TypeScript errors are actionable — no `any` leaks in public APIs. | `tsc --strict` passes on all consumer-facing packages. |

## Consistency — Design System Integrity

| # | Criterion | How to verify |
|---|-----------|---------------|
| 6 | Every new component uses tokens and primitives — no hard-coded colors, spacing, or fonts. | Code review + lint rule checking for `var(--` usage. |
| 7 | The 3-tier token hierarchy (primitive → semantic → component) is complete. | Token audit: every semantic token references a primitive, every component token references a semantic. |
| 8 | All interactive states are covered: default, hover, active, focus, disabled, error, loading. | Visual regression tests per canonical component. |
| 9 | Layout primitives (Box, Stack, Grid) are used instead of raw `div` + inline styles in organisms. | Code audit of organism components. |
| 10 | Intent tokens (success, error, warning, info) are used for all feedback UIs. | Audit Badge, Alert, Toast, form error states. |

## Docs — Communication Quality

| # | Criterion | How to verify |
|---|-----------|---------------|
| 11 | A new dev understands the library architecture in under 30 minutes. | Read ARCHITECTURE.md + getting-started.md — timed. |
| 12 | Every integration package has a dedicated doc page with install, setup, and usage example. | Check `docs/integrations/` — one file per package. |
| 13 | Token documentation shows the full hierarchy with CSS variable names. | Check `docs/design-system/tokens.md`. |
| 14 | Internal packages are documented with "why they exist" and "do not import" warnings. | Check `docs/guides/internal-packages.md`. |
| 15 | Semver policy is documented and enforced. | Check `docs/release/SEMVER-POLICY.md`. |

## Stability — Release Quality

| # | Criterion | How to verify |
|---|-----------|---------------|
| 16 | Zero breaking changes in minor versions. | CHANGELOG audit over 6 months. |
| 17 | Contract tests exist for all public package exports. | `tests/contract/` directory with per-package tests. |
| 18 | Visual regression coverage for all canonical components. | Chromatic baseline coverage report. |
| 19 | CI blocks merge when types, lint, tests, or API snapshots fail. | GitHub Actions workflow check. |
| 20 | Public API surface is verified by `api-extractor` snapshots. | `config/package-surface.json` matches actual exports. |

## Scoring

Each criterion scores 0 (not met), 0.5 (partially met), or 1 (fully met).
Maximum score: 20/20. Target: ≥18/20.

---

# Maturity Model

## Current state: "App-grade component library"

The library sits between a basic component library and a full platform SDK.

### What we have today

- **Component library**: 57+ components across atoms, molecules, organisms, and templates.
- **Design tokens**: 3-tier hierarchy (primitive → semantic → component) with CSS variables and light/dark themes.
- **Primitives**: Layout (Box, Stack, Grid) and form (Field, Label, InputBase, SelectBase) headless primitives.
- **Integration packages**: Next.js (SSR-safe theme), react-hook-form (FormField, FormFieldArray, FormActions), TanStack Query (QueryBoundary, QueryTable, QueryList), TanStack Router (RouterLink, SidebarNav, RouterBreadcrumbs).
- **Internal tooling**: Schema validation, component registry, export scaffolding, prompt engineering for AI-assisted development.

### What "full platform" looks like

| Capability | Current | Target |
|-----------|---------|--------|
| **Theming** | CSS variables + light/dark | Brand theming wizard, runtime theme generation |
| **Components** | 57+ components | All production-ready with full state coverage |
| **Integrations** | 5 packages | Add i18n integration, analytics, feature flags |
| **Templates** | DashboardLayout | Auth, settings, CRUD, onboarding templates |
| **Code generation** | Registry + schema | Full route-to-page scaffolding from schema |
| **Testing** | Unit + some visual | Contract tests, visual regression, a11y automated |
| **Documentation** | Architecture + guides | Interactive playground, video walkthroughs |

### Path to "platform" status

1. **Templatize common flows**: Auth, settings, CRUD list, dashboard — all composable from existing organisms + integrations.
2. **Code generation pipeline**: Schema → component tree → rendered page.
3. **Runtime theming**: Brand color picker that generates token overrides live.
4. **Observability**: Component usage telemetry (which components, which props, which states).
5. **Ecosystem**: Community-contributed recipes, templates, and integration packages.
