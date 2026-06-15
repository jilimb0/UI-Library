# UI Construction Library — Architecture

## Purpose

This document defines the package architecture, public API boundaries, dependency rules, and recommended consumer flows for the `@ui-construction-library/*` ecosystem.

The goal is to make the library easy to adopt, easy to evolve, safe to integrate into external projects, and understandable for humans and AI agents.

The machine-readable source of truth for package visibility is `config/package-surface.json`.

---

## Positioning

`@ui-construction-library` is a modular React UI system for **data-heavy application shells**, **tight framework integrations** (Next.js, TanStack, react-hook-form), and **design-system consistency** through tokens and primitives.

### What this library is NOT

- **Not a full MUI / Ant Design replacement.** It does not aim to ship 100+ components covering every conceivable UI pattern. It is deliberately scoped to app-shell, dashboard, and data-UI use cases.
- **Not a shadcn / Radix clone.** It is not a source-code generator or a bare headless toolkit. It ships a styled, opinionated component layer on top of primitives, with first-class integration packages.

### Key differentiators

1. **Integration depth.** Dedicated, typed adapter packages for Next.js App Router, TanStack Query, TanStack Router, react-hook-form, and i18next — not afterthoughts, but first-class citizens with SSR-safe providers, query-boundary components, and router-aware navigation.
2. **Tokens and primitives as first-class citizens.** A three-tier token hierarchy (primitive → semantic → component) with light/dark variants, and a headless primitives layer that core components are built from — not a side-effect of styling.
3. **App-shell / dashboard / data-UI focus.** Canonical layout organisms (AppShell, Sidebar, TopNav), data components (DataTable, QueryTable), and form integration — purpose-built for product dashboards and internal tools, not marketing sites.

### Target user

Advanced full-stack TypeScript developer who:
- Maintains 1–3 products,
- Wants a single UI language across all applications,
- Does not want the weight of MUI/Ant, but finds shadcn/Radix alone insufficient for integrations and design-system coherence.

See [`docs/architecture/target-user.md`](./docs/architecture/target-user.md) for the detailed persona.

---

## Architecture Layers

The library follows a three-layer architecture that separates framework-agnostic
design foundations from framework-specific implementations.

### Layer A — Universal Core (framework-agnostic)

Zero framework dependencies. Consumable by any JS/TS environment.

- **`tokens`** — Design tokens as TS objects, JSON exports, CSS custom properties (`--ucl-*` namespace), and a Tailwind preset.
- **`styles`** — Pure CSS layer: reset, component classes (`ucl-` prefixed with backward-compat aliases), density presets, and utility classes.
- **`behaviors`** — Pure JS state machines and ARIA logic (no React, no DOM). Factory functions like `createSwitchBehavior()`, `createDialogBehavior()` returning `{ attrs, className }`.
- **`utils`** — Generic JS utilities: date, number, string, object helpers.

### Layer B — React Adapter (reference implementation)

- **`primitives`** — Headless React components consuming `behaviors` for ARIA/state delegation.
- **`core`** — Styled React components consuming `primitives` + `styles` + `tokens`.
- **`icons`**, **`motion`**, **`dnd`** — React-specific extension packages.
- **`integrations/*`** — Adapters for Next.js, TanStack Query/Router, React Hook Form, i18next.

### Layer C — Other Framework Adapters (future)

Not yet implemented. When demand arises, new adapter packages will consume
`tokens` + `styles` + `behaviors` from Layer A and wrap them in idiomatic
components for Vue, Solid, Angular, or other frameworks.

### Dependency flow

```
Layer A (Universal Core)
  tokens → (no deps)
  styles → tokens (CSS vars only)
  behaviors → (no deps, pure JS)
  utils → (no deps, pure JS)

Layer B (React Adapter)
  primitives → behaviors, utils
  core → primitives, tokens, styles
  icons, motion, dnd → core, tokens
  integrations → core (+ third-party peer deps)

Layer C (Future Adapters)
  adapter-* → tokens, styles, behaviors (from Layer A)
```

See [`docs/architecture/package-layers.md`](./docs/architecture/package-layers.md)
for the complete package classification inventory.

---

## Package Roles

| Package | Role | Audience |
|---|---|---|
| `@ui-construction-library/core` | **Primary public entrypoint.** Base UI components, provider/theme glue, public hooks. | Almost all consumers. |
| `@ui-construction-library/tokens` | **Design token and theme contract.** Color, typography, spacing, semantic tokens, CSS variables (`--ucl-*` namespace), JSON exports, Tailwind preset. | Consumers who need theming or token-level integration. |
| `@ui-construction-library/behaviors` | **Framework-agnostic interaction logic.** Pure JS state machines, ARIA attributes, and behavior factories (no React, no DOM). | Consumers building custom components in any framework. |
| `@ui-construction-library/icons` | **Standalone icon package.** React icon components, no component logic. | Consumers who need icons with or without `core`. |
| `@ui-construction-library/primitives` | **Headless overlay primitives.** Dialog, Popover, ContextMenu, Accordion, Tabs, Slider, Switch. | `core` internally; advanced consumers building custom overlays. |
| `@ui-construction-library/motion` | **Optional motion extension.** Motion-enhanced components, animation wrappers. | Consumers who explicitly want motion behaviour. |
| `@ui-construction-library/dnd` | **Optional drag-and-drop extension.** Sortable abstractions, DnD adapters. | Consumers who explicitly need drag-and-drop. |
| `@ui-construction-library/react-hook-form` | **Optional form adapter layer.** Bindings between `core` form primitives and `react-hook-form`. | Consumers who use `react-hook-form`. |
| `@ui-construction-library/integration-i18n` | **Optional i18next integration.** Locale-aware wrappers and translation helpers. | Consumers who use i18next. |
| `@ui-construction-library/integration-next` | **Optional Next.js integration.** SSR-safe providers and App Router glue. | Consumers who use Next.js App Router. |
| `@ui-construction-library/integration-tanstack-query` | **Optional TanStack Query integration.** Query-backed data UI helpers. | Consumers who use TanStack Query. |
| `@ui-construction-library/integration-tanstack-router` | **Optional TanStack Router integration.** Router-bound navigation helpers. | Consumers who use TanStack Router. |
| `@ui-construction-library/utils` | **Internal infrastructure.** Helpers, hooks, DOM utilities, type utilities. | Library maintainers and extension packages only. |
| `@ui-construction-library/styles` | **Universal CSS layer.** Reset, component classes (`ucl-` prefixed), density presets, utility classes. Bundled `dist/styles.css`. | Consumers who import the CSS layer directly. |
| `@ui-construction-library/schema` | **Internal platform contract.** Builder/export/prompt JSON schemas + Zod validators for component props and theme. | Platform maintainers; server-side validation. |
| `@ui-construction-library/registry` | **Component registry.** Metadata for all components in `core` + `primitives` for builder, docs, and CLI (`ucl add`). | Platform maintainers; CLI consumers. |
| `@ui-construction-library/prompt-engine` | **Internal platform generation engine.** Deterministic prompt-to-builder draft generation. | Platform maintainers only. |

---

## Dependency Graph

```
@ui-construction-library/tokens      @ui-construction-library/icons
                |                                   |
                v                                   v
        @ui-construction-library/core <------------|
                ^                                   |
                |                                   |
        @ui-construction-library/primitives -------|
                ^                                   |
                |                                   |
@ui-construction-library/behaviors                 |
                |                                   |
                +----> @ui-construction-library/core (direct)
                |                                   |
                +----> Future: Vue / Solid / Angular adapters

        @ui-construction-library/core
                |
                +----> @ui-construction-library/motion
                |
                +----> @ui-construction-library/dnd
                |
                +----> @ui-construction-library/react-hook-form
                |
                +----> @ui-construction-library/integration-*

@ui-construction-library/utils
        ^
        |
   internal dependency of core / extensions only

@ui-construction-library/schema / registry / prompt-engine
        ^
        |
   internal platform dependency of builder / export / generation systems only
```

---

## Dependency Rules

### Allowed
- `core → tokens`
- `core → utils`
- `core → primitives`
- `core → behaviors` (for simple atoms without complex state)
- `core → styles`
- `primitives → behaviors`
- `primitives → utils`
- `motion → core`
- `motion → utils`
- `dnd → core`
- `dnd → utils`
- `react-hook-form → core`
- `react-hook-form → utils`
- `integration-* → core`
- `core → icons` (only for intentional re-exports)
- `behaviors → (no deps)`
- Platform internals may depend on other platform internals according to their package manifests.

### Forbidden
- `tokens → core`
- `tokens → behaviors`
- `icons → core`
- `utils → core`
- `primitives → core`
- `behaviors → primitives`
- `behaviors → core`
- `motion → dnd`
- `dnd → motion`
- `react-hook-form → motion`
- Any circular dependency
- Any dependency from a foundational package to an extension package

---

## primitives vs behaviors — Role Boundary

These two packages are adjacent but have strictly different responsibilities. This boundary must never be violated.

### `behaviors` — Pure JS, zero framework assumptions
- **Output:** `{ attrs, className, handlers }` — plain objects
- **No React, no DOM, no Context, no hooks**
- **Use when:** building components in Vue, Svelte, Solid, vanilla JS, or server-side rendering
- **Examples:** `createButtonBehavior()`, `createDialogBehavior()`, `createSwitchBehavior()`

### `primitives` — Headless React, stateful
- **Output:** React components with internal state via Context
- **Contains:** React hooks, Context providers, DOM event wiring
- **Depends on:** `behaviors` for ARIA attrs, but adds React state management
- **Use when:** you need React-specific headless components (like Radix)
- **Examples:** `<Dialog.Root>`, `<Popover.Root>`, `<Tabs.Root>`, `<Slider.Root>`

### Dependency rule
```
behaviors → (no deps)
    ↓
primitives → behaviors (only for ARIA attrs)
    ↓
core → primitives (for state) + behaviors (for className/handlers in simple atoms)
```

`core` may use `behaviors` directly for simple atoms (Button, Switch, Checkbox) where no complex React state is needed. For molecules (Dialog, Accordion, Tabs) `core` must consume `primitives` which internally consume `behaviors`.

### Stable public entrypoints

Consumers should import from:
- `@ui-construction-library/core`
- `@ui-construction-library/tokens`
- `@ui-construction-library/behaviors`
- `@ui-construction-library/icons`
- `@ui-construction-library/primitives`
- `@ui-construction-library/motion`
- `@ui-construction-library/dnd`
- `@ui-construction-library/react-hook-form`
- `@ui-construction-library/integration-i18n`
- `@ui-construction-library/integration-next`
- `@ui-construction-library/integration-tanstack-query`
- `@ui-construction-library/integration-tanstack-router`

### Restricted entrypoints

Consumers should **not** import from:
- `@ui-construction-library/utils` (unless explicitly documented)
- `@ui-construction-library/schema`
- `@ui-construction-library/registry`
- `@ui-construction-library/export-core` (removed, replaced by placeholder)
- `@ui-construction-library/prompt-engine`
- `dist/*` or `src/*` paths
- Any undocumented subpath export

### Deep import policy

Deep imports are not supported unless explicitly defined in the package `exports` field.

```ts
// ✅ Correct
import { Button } from '@ui-construction-library/core'
import { SearchIcon } from '@ui-construction-library/icons'

// ❌ Unsupported
import { Button } from '@ui-construction-library/core/dist/Button'
import { cn } from '@ui-construction-library/utils'
```

---

## Consumer Flows

### Default flow
```bash
pnpm add @ui-construction-library/core
```

### With explicit theming
```bash
pnpm add @ui-construction-library/core @ui-construction-library/tokens
```

### Optional extensions
```bash
pnpm add @ui-construction-library/icons
pnpm add @ui-construction-library/motion
pnpm add @ui-construction-library/dnd
pnpm add @ui-construction-library/react-hook-form react-hook-form
pnpm add @ui-construction-library/integration-i18n i18next react-i18next
pnpm add @ui-construction-library/integration-next next
pnpm add @ui-construction-library/integration-tanstack-query @tanstack/react-query
pnpm add @ui-construction-library/integration-tanstack-router @tanstack/react-router
```

## Library Mode vs Platform Mode

The repository has two product modes:

| Mode | Paths | Dependency policy |
|---|---|---|
| Library mode | `apps/docs`, `apps/storybook`, `apps/playground`, `apps/demo-showcase` | Public packages only. Internal package imports are forbidden. |
| Platform mode | `apps/builder`, `supabase`, `registry/source` | May use internal platform packages to implement builder, export, registry, and prompt workflows. |

Library mode is the default consumer mental model. Platform mode is intentionally documented separately so builder/export/prompt internals do not expand the ordinary UI-kit onboarding surface.

---

## Dependency Type Policy

| Type | Use for |
|---|---|
| `dependencies` | Internal published packages required at runtime; small runtime libraries safe to bundle. |
| `peerDependencies` | `react`, `react-dom`; host libraries that must match the app's installed version (e.g. `react-hook-form`). |
| `peerDependenciesMeta` | Optional host integrations not required in every use case. |
| `devDependencies` | Build tools, tests, linting, Storybook, TypeScript, local dev dependencies. |

---

## CSS and Side Effects Policy

Packages that ship CSS must declare it in `sideEffects`:
```json
{ "sideEffects": ["*.css", "**/*.css"] }
```

Packages with no CSS and no import-time side effects:
```json
{ "sideEffects": false }
```

---

## Export Map Policy

Every public package must define explicit `exports`.

### Minimum requirement
```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js"
    }
  }
}
```

### Optional documented subpaths
- `./styles.css` — for packages that ship CSS
- `./themes/light.css`, `./themes/dark.css` — for tokens
- `./tailwind.preset` — for tokens Tailwind integration

### Not allowed
- `./src/*`
- `./internal/*`
- Undocumented subpaths

---

## Change Management

Any of the following requires an architecture review:
- Changing package roles
- Making `utils` part of public onboarding
- Making any internal package part of public onboarding
- Introducing new public subpath exports
- Adding dependency edges outside the allowed graph
- Re-exporting extension package APIs from `core`
- Changing the default consumer flow

---

## Success Criteria

This architecture is considered successful when:
- A new user can start with `core` in one obvious step
- Package responsibilities are easy to explain in one sentence each
- Internal implementation details stay internal
- Optional capabilities remain optional
- Docs and package boundaries match each other
