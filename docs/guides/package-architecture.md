# Package Architecture

`@ui-construction-library` is a modular React UI system with one primary entrypoint and several optional extension packages. The default path starts with `core`, then adds tokens, icons, or integrations depending on project needs.

---

## Packages

| Package | Role | Public? |
|---|---|---|
| `@ui-construction-library/core` | Base components and primary public API | ✅ Primary |
| `@ui-construction-library/tokens` | Design tokens and theme contract | ✅ Foundational |
| `@ui-construction-library/icons` | Standalone icon package | ✅ Foundational |
| `@ui-construction-library/primitives` | Headless overlay primitives (Dialog, Popover, etc.) | ✅ Advanced |
| `@ui-construction-library/motion` | Animation extensions for core components | ✅ Extension |
| `@ui-construction-library/dnd` | Drag-and-drop extensions for core components | ✅ Extension |
| `@ui-construction-library/react-hook-form` | Form adapters for core components | ✅ Extension |
| `@ui-construction-library/utils` | Internal infrastructure, helpers, hooks | ⚠️ Internal-first |

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
                                 motion                 dnd          react-hook-form

utils ◄── internal dependency of core and extensions only
```

- `core` is the centre of the public API.
- `tokens` and `icons` are independent — they do not depend on `core`.
- `primitives` is used by `core` internally; advanced consumers can use it directly.
- Extension packages (`motion`, `dnd`, `react-hook-form`) extend `core` — they do not compete with it.
- `utils` is not part of the recommended consumer path.

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

// ❌ Do not import from utils in application code
import { cn } from '@ui-construction-library/utils'

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

**Avoid `utils` in application code.** It is an internal infrastructure package. Its exports are not covered by the same stability guarantees as the public packages.
