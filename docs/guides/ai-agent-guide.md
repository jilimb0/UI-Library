# AI / Agent Integration Guide

This guide defines the recommended import paths, package boundaries, and usage rules for AI agents and automated tooling working with `@ui-construction-library`.

---

## Default entrypoint

Always start with `core`. It is the primary public API for almost all UI scenarios.

```ts
import { Button, Input, Modal, DataTable } from '@ui-construction-library/core'
```

---

## Package selection rules

| Task | Package to use |
|---|---|
| Render any UI component | `@ui-construction-library/core` |
| Use an icon | `@ui-construction-library/icons` |
| Build a custom overlay (dialog, popover) | `@ui-construction-library/primitives` |
| Add animation to a component | `@ui-construction-library/motion` |
| Add drag-and-drop | `@ui-construction-library/dnd` |
| Wire a form with react-hook-form | `@ui-construction-library/react-hook-form` |
| Reference a design token value | `@ui-construction-library/tokens` |

---

## Import rules

### ✅ Always correct

```ts
import { Button, Card, Heading, Text } from '@ui-construction-library/core'
import { SearchIcon } from '@ui-construction-library/icons'
import { Dialog } from '@ui-construction-library/primitives'
import { trapFocus, useControllableState } from '@ui-construction-library/primitives'
```

### ❌ Never do this

```ts
// Do not import from utils in generated or agent-authored code
import { cn } from '@ui-construction-library/utils'

// Do not use deep/dist imports
import { Button } from '@ui-construction-library/core/dist/Button'
import { Button } from '@ui-construction-library/core/src/components/Button'

// Do not import internal paths
import { trapFocus } from '@ui-construction-library/primitives/src/internal/focusTrap'
```

---

## Component API patterns

### Controlled state — overlay family

All overlay components share the same contract:

```ts
// open: boolean — controlled open state
// defaultOpen: boolean — uncontrolled initial state
// onOpenChange: (open: boolean) => void — state change callback

<Modal open={open} onOpenChange={setOpen}>...</Modal>
<Dropdown open={open} onOpenChange={setOpen} items={items} />
<Popover open={open} onOpenChange={setOpen} trigger={...} content={...} />
<ContextMenu.Root open={open} onOpenChange={setOpen}>...</ContextMenu.Root>
```

### Size variants — overlay family

```ts
// Modal: size="sm" | "md" | "lg" | "full"
// Popover: size="sm" | "md" | "lg"
// Dropdown: size="sm" | "md" | "lg"
<Modal.Content size="lg" title="Editor">...</Modal.Content>
<Popover size="sm" trigger={...} content={...} />
<Dropdown size="md" items={items} />
```

### Focus trap

```ts
import { trapFocus } from '@ui-construction-library/primitives'
// or
import { trapFocus } from '@ui-construction-library/core'

// Returns a cleanup function
const cleanup = trapFocus(containerElement, () => setOpen(false))
// Call cleanup() on unmount or close
```

### Controllable state hook

```ts
import { useControllableState } from '@ui-construction-library/primitives'

const [value, setValue] = useControllableState({
  value: controlledValue,      // undefined = uncontrolled
  defaultValue: false,
  onChange: onValueChange,
})
```

---

## CSS setup

Import the stylesheet once in the app entry point:

```ts
import '@ui-construction-library/core/styles.css'
// or
import '@ui-construction-library/core/styles'
```

Wrap the app with `ThemeProvider`:

```tsx
import { ThemeProvider } from '@ui-construction-library/core'

<ThemeProvider>{/* app */}</ThemeProvider>
```

---

## Generation modes (prompt-engine)

When generating UI with `@ui-construction-library/prompt-engine`, use these generation modes:

| Mode | Use for |
|---|---|
| `landing-page` | Conversion-focused landing pages |
| `dashboard` | Data-heavy admin and analytics surfaces |
| `marketing-section` | Single reusable marketing section |
| `settings-app` | Account and configuration pages |
| `docs-page` | Documentation and reference pages |
| `pricing-page` | Plan comparison and pricing surfaces |
| `onboarding` | Step-by-step onboarding flows |

---

## Export pipeline

When generating export artifacts with `@ui-construction-library/export-core`:

```ts
import {
  createExportRequestFromBuilderProject,
  normalizeExportProject,
  analyzeExportProject,
  enrichExportProject,
  renderExportProject,
} from '@ui-construction-library/export-core'

// Supported targets
type ExportTarget =
  | 'react-single-page'
  | 'html-static'
  | 'web-components-static'
  | 'nextjs-app-router'
```

The Next.js App Router target plugin is also available:

```ts
import { nextjsAppRouterTarget } from '@ui-construction-library/export-core'
```

---

## What not to generate

- Do not generate imports from `@ui-construction-library/utils` in consumer code.
- Do not generate deep imports (`/dist/`, `/src/`, `/internal/`).
- Do not generate custom `trapFocus` implementations — use the one from `primitives`.
- Do not generate duplicate `useControllableState` — use the one from `primitives`.
- Do not mix `core` form components with `react-hook-form` bindings without using the `react-hook-form` package.
