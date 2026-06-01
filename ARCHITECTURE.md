# UI Construction Library — Architecture

## Purpose

This document defines the package architecture, public API boundaries, dependency rules, and recommended consumer flows for the `@ui-construction-library/*` ecosystem.

The goal is to make the library easy to adopt, easy to evolve, safe to integrate into external projects, and understandable for humans and AI agents.

---

## Package Roles

| Package | Role | Audience |
|---|---|---|
| `@ui-construction-library/core` | **Primary public entrypoint.** Base UI components, provider/theme glue, public hooks. | Almost all consumers. |
| `@ui-construction-library/tokens` | **Design token and theme contract.** Color, typography, spacing, semantic tokens, CSS variables. | Consumers who need theming or token-level integration. |
| `@ui-construction-library/icons` | **Standalone icon package.** React icon components, no component logic. | Consumers who need icons with or without `core`. |
| `@ui-construction-library/primitives` | **Headless overlay primitives.** Dialog, Popover, ContextMenu, Accordion, Tabs, Slider, Switch. | `core` internally; advanced consumers building custom overlays. |
| `@ui-construction-library/motion` | **Optional motion extension.** Motion-enhanced components, animation wrappers. | Consumers who explicitly want motion behaviour. |
| `@ui-construction-library/dnd` | **Optional drag-and-drop extension.** Sortable abstractions, DnD adapters. | Consumers who explicitly need drag-and-drop. |
| `@ui-construction-library/react-hook-form` | **Optional form adapter layer.** Bindings between `core` form primitives and `react-hook-form`. | Consumers who use `react-hook-form`. |
| `@ui-construction-library/utils` | **Internal-first infrastructure.** Helpers, hooks, DOM utilities, type utilities. | Library maintainers and extension packages only. |

---

## Dependency Graph

```
@ui-construction-library/tokens      @ui-construction-library/icons
                |                                   |
                v                                   |
        @ui-construction-library/core <-------------|
                ^
                |
        @ui-construction-library/primitives
                |
        (used by core internally)

        @ui-construction-library/core
                |
                +----> @ui-construction-library/motion
                |
                +----> @ui-construction-library/dnd
                |
                +----> @ui-construction-library/react-hook-form

@ui-construction-library/utils
        ^
        |
   internal dependency of core / extensions only
```

---

## Dependency Rules

### Allowed
- `core → tokens`
- `core → utils`
- `core → primitives`
- `motion → core`
- `motion → utils`
- `dnd → core`
- `dnd → utils`
- `react-hook-form → core`
- `react-hook-form → utils`
- `core → icons` (only for intentional re-exports)

### Forbidden
- `tokens → core`
- `icons → core`
- `utils → core`
- `primitives → core`
- `motion → dnd`
- `dnd → motion`
- `react-hook-form → motion`
- Any circular dependency
- Any dependency from a foundational package to an extension package

---

## Public API Rules

### Stable public entrypoints

Consumers should import from:
- `@ui-construction-library/core`
- `@ui-construction-library/tokens`
- `@ui-construction-library/icons`
- `@ui-construction-library/primitives`
- `@ui-construction-library/motion`
- `@ui-construction-library/dnd`
- `@ui-construction-library/react-hook-form`

### Restricted entrypoints

Consumers should **not** import from:
- `@ui-construction-library/utils` (unless explicitly documented)
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
```

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
