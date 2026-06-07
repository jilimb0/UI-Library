# Package Architecture

`@ui-construction-library` is a modular React UI system with one primary entrypoint and several optional extension packages. The default path starts with `core`, then adds tokens, icons, or integrations depending on project needs.

The source of truth for package visibility is `config/package-surface.json`. Documentation, package metadata, and validation scripts must stay aligned with that matrix.

---

## Packages

| Package | Role | Surface |
|---|---|---|
| `@ui-construction-library/core` | Base components and primary public API | Public / Primary |
| `@ui-construction-library/tokens` | Design tokens and theme contract | Public / Foundational |
| `@ui-construction-library/icons` | Standalone icon package | Public / Foundational |
| `@ui-construction-library/primitives` | Headless overlay primitives (Dialog, Popover, etc.) | Public / Advanced |
| `@ui-construction-library/motion` | Animation extensions for core components | Public / Extension |
| `@ui-construction-library/dnd` | Drag-and-drop extensions for core components | Public / Extension |
| `@ui-construction-library/react-hook-form` | React Hook Form adapters for core components | Public / Integration |
| `@ui-construction-library/integration-i18n` | i18next integration wrappers | Public / Integration |
| `@ui-construction-library/integration-next` | Next.js App Router integration | Public / Integration |
| `@ui-construction-library/integration-tanstack-query` | TanStack Query-backed UI helpers | Public / Integration |
| `@ui-construction-library/integration-tanstack-router` | TanStack Router-bound navigation helpers | Public / Integration |
| `@ui-construction-library/utils` | Shared infrastructure helpers and hooks | Internal |
| `@ui-construction-library/styles` | CSS/style runtime build layer | Internal |
| `@ui-construction-library/schema` | Builder/export/prompt schemas | Internal / Platform |
| `@ui-construction-library/registry` | Builder/docs/export component metadata registry | Internal / Platform |
| `@ui-construction-library/export-core` | Deterministic platform export pipeline | Internal / Platform |
| `@ui-construction-library/prompt-engine` | Deterministic platform prompt generation | Internal / Platform |

---

## Dependency model

```
tokens ──────────────────────────────────────────────────────┐
                                                              ▼
icons ────────────────────────────────────────────────► core
                                                         │
                                              primitives ─┘ (used internally)
                                                         │
                                    ┌────────────────────┼────────────────────┐
                                    ▼                    ▼                    ▼
                                 motion                 dnd          integrations/*

utils/styles ◄── internal dependencies of core and extensions only

schema/registry/export-core/prompt-engine ◄── platform-only internals
```

- `core` is the centre of the public API.
- `tokens` and `icons` are independent — they do not depend on `core`.
- `primitives` is used by `core` internally; advanced consumers can use it directly.
- Extension packages (`motion`, `dnd`, `react-hook-form`, `integration-*`) extend `core` — they do not compete with it.
- `utils`, `styles`, `schema`, `registry`, `export-core`, and `prompt-engine` are not part of the recommended consumer path.

---

## Import rules

```ts
// ✅ Components — always from core
import { Button, Modal, DataTable } from '@ui-construction-library/core'

// ✅ Icons — from icons
import { SearchIcon, CloseIcon } from '@ui-construction-library/icons'

// ✅ Headless primitives — from primitives (advanced use)
import { Dialog, Popover } from '@ui-construction-library/primitives'

// ✅ Extensions — from their dedicated packages
import { FormField } from '@ui-construction-library/react-hook-form'

// ❌ Do not import from internal packages in application code
import { cn } from '@ui-construction-library/utils'
import { renderExportProject } from '@ui-construction-library/export-core'

// ❌ Do not use deep imports
import { Button } from '@ui-construction-library/core/dist/Button'
```

---

## Installation matrix

| Scenario | Install |
|---|---|
| Basic UI | `pnpm add @ui-construction-library/core` |
| UI + explicit theming | `pnpm add @ui-construction-library/core @ui-construction-library/tokens` |
| UI + icons | `pnpm add @ui-construction-library/core @ui-construction-library/icons` |
| UI + forms (React Hook Form) | `pnpm add @ui-construction-library/core @ui-construction-library/react-hook-form react-hook-form` |
| UI + i18n | `pnpm add @ui-construction-library/core @ui-construction-library/integration-i18n i18next react-i18next` |
| UI + Next.js App Router | `pnpm add @ui-construction-library/core @ui-construction-library/integration-next next` |
| UI + TanStack Query | `pnpm add @ui-construction-library/core @ui-construction-library/integration-tanstack-query @tanstack/react-query` |
| UI + TanStack Router | `pnpm add @ui-construction-library/core @ui-construction-library/integration-tanstack-router @tanstack/react-router` |
| UI + drag and drop | `pnpm add @ui-construction-library/core @ui-construction-library/dnd` |
| UI + animation | `pnpm add @ui-construction-library/core @ui-construction-library/motion` |
| Full stack | `pnpm add @ui-construction-library/core @ui-construction-library/tokens @ui-construction-library/icons` |

---

## Dependency type policy

| Type | Use for |
|---|---|
| `dependencies` | Internal published packages required at runtime |
| `peerDependencies` | `react`, `react-dom`, host libraries like `react-hook-form` |
| `peerDependenciesMeta` | Optional host integrations |
| `devDependencies` | Build tools, tests, TypeScript, Storybook |

---

## CSS and side effects

Packages that ship CSS declare `"sideEffects": ["*.css", "**/*.css"]`.  
Packages with no CSS declare `"sideEffects": false`.

Import the core stylesheet once in your app entry:

```ts
import '@ui-construction-library/core/styles.css'
// or
import '@ui-construction-library/core/styles'
```

---

## Export map policy

Every public package defines explicit `exports`. Deep imports not listed in `exports` are not supported and may break between versions.

Supported subpath exports:
- `@ui-construction-library/core` → `.` and `./styles.css`
- `@ui-construction-library/tokens` → `.`, `./css`, `./tailwind.preset`
- All other packages → `.` only

---

## When to use each package

**Use `core` when** you need any UI component — buttons, inputs, modals, tables, navigation.

**Use `tokens` when** you need to customise the theme, integrate with a design tool, or reference token values in custom CSS.

**Use `icons` when** you need icons. It works standalone without `core`.

**Use `primitives` when** you are building a custom overlay component (e.g. a custom date picker) and need the headless Dialog or Popover behaviour without the `core` styling layer.

**Use `motion` when** you want animated transitions on core components.

**Use `dnd` when** you need sortable lists, kanban boards, or drag-and-drop interactions.

**Use `react-hook-form` when** your project uses `react-hook-form` and you want typed, validated form fields wired to core components.

**Use `integration-i18n` when** your project uses i18next and needs locale-aware wrappers around UI flows.

**Use `integration-next` when** your project uses Next.js App Router and needs SSR-safe providers or navigation glue.

**Use `integration-tanstack-query` when** your project uses TanStack Query and needs query-backed data UI helpers.

**Use `integration-tanstack-router` when** your project uses TanStack Router and needs router-bound navigation helpers.

**Avoid internal packages in application code.** `utils`, `styles`, `schema`, `registry`, `export-core`, and `prompt-engine` are internal implementation packages. Their exports are not covered by the same stability guarantees as the public packages.

## Library mode vs Platform mode

The repository supports two product modes:

| Mode | Paths | Package surface |
|---|---|---|
| Library mode | `apps/docs`, `apps/storybook`, `apps/playground`, `apps/demo-showcase` | Public packages only |
| Platform mode | `apps/builder`, `supabase`, `registry/source` | May use internal platform packages |

Library-facing examples and docs must not import internal packages. Platform code may use `schema`, `registry`, `export-core`, and `prompt-engine` because those packages implement the builder/export/generation system.
