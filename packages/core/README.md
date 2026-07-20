# @ui-construction-library/core

Primary public entrypoint for the UI Construction Library. Contains base UI components, provider/theme glue, and public hooks for almost all consumer scenarios.

## When to use

Start here. This package covers ~80% of UI needs — atoms, molecules, organisms, and templates. Add extension packages only when you need motion, drag-and-drop, or form adapters.

## Installation

```bash
pnpm add @ui-construction-library/core
```

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Minimal example

```tsx
import { ThemeProvider, Button, Input, Modal } from '@ui-construction-library/core';
import '@ui-construction-library/core/styles.css';
import { useState } from 'react';

export function App() {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider>
      <Input label="Project name" placeholder="Aurora Dashboard" />
      <Button onClick={() => setOpen(true)}>Open settings</Button>

      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content size="md" title="Settings">
          <Modal.Body>Configure your project.</Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Modal.Close>
            <Button>Save</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </ThemeProvider>
  );
}
```

## Integration with other packages

```bash
# Icons
pnpm add @ui-construction-library/icons

# Form adapters
pnpm add @ui-construction-library/react-hook-form react-hook-form

# Drag and drop
pnpm add @ui-construction-library/dnd

# Animation
pnpm add @ui-construction-library/motion
```

## Styling and theme

Import the bundled stylesheet once in your app entry point:

```ts
import '@ui-construction-library/core/styles.css';
// or
import '@ui-construction-library/core/styles';
```

Wrap your app with `ThemeProvider` to enable light/dark mode and token overrides:

```tsx
import { ThemeProvider } from '@ui-construction-library/core';

<ThemeProvider theme="light">{/* app */}</ThemeProvider>
```

## Compatibility

- React 18 and 19
- TypeScript 5.x and 6.x
- Vite 5+, Next.js 15 (App Router), Rollup 4+, webpack 5

## Public API

All exports are available from the package root:

```ts
import { Button, Input, Modal, DataTable, Tabs, ... } from '@ui-construction-library/core';
```

Subpath exports:
- `@ui-construction-library/core/styles.css` — bundled stylesheet

Do not import from `dist/*` or `src/*` paths.

## Components

| Component | Category | Description |
|-----------|----------|-------------|
| `Button` | Atom | Styled button with variants (default, outline, ghost, danger) |
| `Input` | Atom | Text input with label, error, and hint support |
| `FloatingLabelInput` | Atom | Text input with animated floating label |
| `Stack` | Atom | Flex-based vertical or horizontal layout with gap control |
| `Cluster` | Atom | Inline-flex horizontal layout for tags, button groups, icon lists |
| `Modal` | Molecule | Accessible dialog with header, body, footer, and close handling |
| `ToastProvider` / `useToast` | Molecule | Context-based toast notification system with auto-dismiss |
| `CoachMark` | Molecule | Dismissible onboarding card with localStorage persistence |
| `PageTip` | Molecule | Compact dismissible inline tip banner |
| `Tabs` | Organism | Tab navigation with content panel switching |
| `DataTable` | Organism | Sortable, filterable data table with pagination |
| `KpiCard` / `KpiGrid` | Organism | Dashboard metric cards with semantic variants and grid layout |
| `ErrorBoundary` | Organism | Class-based error boundary with chunk-load detection and reset |

### `ToastProvider` + `useToast`

Context-based toast notification system. Wrap your app with `ToastProvider`, then call `useToast().push()` anywhere in the tree to show a toast.

```tsx
import { ToastProvider, useToast } from '@ui-construction-library/core';

function App() {
  return (
    <ToastProvider maxToasts={5} position="bottom-right">
      <MainContent />
    </ToastProvider>
  );
}

function MainContent() {
  const toast = useToast();

  const handleSave = () => {
    toast.push({ message: 'Saved successfully', variant: 'success' });
  };

  return <button onClick={handleSave}>Save</button>;
}
```

**`ToastProvider` props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | App tree |
| `maxToasts` | `number` | `5` | Max visible toasts at once |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Toast stack position |

**`useToast()` return value:**
| Method | Signature | Description |
|--------|-----------|-------------|
| `push` | `(msg: Omit<ToastMessage, 'id'>) => string` | Add a toast; returns the toast id |
| `dismiss` | `(id: string) => void` | Dismiss a specific toast |
| `dismissAll` | `() => void` | Dismiss all visible toasts |

**`ToastMessage` fields:**
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `message` | `string` | — | Toast text |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Visual intent |
| `duration` | `number` | `3000` | Auto-dismiss ms. Set to `0` to keep open |

---

### `KpiCard` + `KpiGrid`

Dashboard metric cards with semantic color variants. `KpiCard` renders a single KPI with label, value, optional subtext, and icon. `KpiGrid` arranges cards in a CSS Grid layout.

```tsx
import { KpiCard, KpiGrid } from '@ui-construction-library/core';

<KpiGrid columns={3}>
  <KpiCard
    label="Active Users"
    value="24,831"
    subtext="+12% vs last week"
    variant="success"
  />
  <KpiCard
    label="Error Rate"
    value="0.8%"
    variant="error"
  />
  <KpiCard
    label="Avg Response"
    value="142ms"
    subtext="P95: 310ms"
    variant="warning"
  />
</KpiGrid>
```

**`KpiCard` props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Primary metric label |
| `value` | `string \| number` | — | The metric value |
| `subtext` | `string` | — | Sub-text below value (e.g., "vs last week") |
| `icon` | `ReactNode` | — | Icon rendered above label |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Left border accent color |
| `selected` | `boolean` | — | Selected/active visual state |
| `onClick` | `() => void` | — | When set, renders as a `<button>` |
| `className` | `string` | — | Additional class name |

**`KpiGrid` props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | `KpiCard` children |
| `columns` | `number` | auto-fill, min 16rem | Explicit column count |
| `className` | `string` | — | Additional class name |

---

### `Stack` + `Cluster`

Flex-based layout utilities. `Stack` arranges children vertically (default) or horizontally with consistent spacing. `Cluster` is an inline-flex horizontal layout that wraps, suited for tag groups and button bars.

```tsx
import { Stack, Cluster } from '@ui-construction-library/core';

// Vertical stack
<Stack gap="1.5rem">
  <Section />
  <Section />
</Stack>

// Horizontal stack
<Stack direction="horizontal" gap="0.75rem" align="center">
  <Avatar />
  <UserName />
</Stack>

// Cluster for tags/badges
<Cluster gap="0.5rem">
  <Badge>React</Badge>
  <Badge>TypeScript</Badge>
  <Badge>Tailwind</Badge>
</Cluster>
```

**`Stack` props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to stack |
| `gap` | `string \| number` | `'1rem'` | Spacing (number = rem) |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Flex direction |
| `align` | `CSSProperties['alignItems']` | — | Align items |
| `justify` | `CSSProperties['justifyContent']` | — | Justify content |
| `wrap` | `boolean` | — | Enable wrap (horizontal only) |
| `className` | `string` | — | Additional class name |
| `style` | `CSSProperties` | — | Inline styles |

**`Cluster` props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Items to cluster |
| `gap` | `string \| number` | `'0.5rem'` | Spacing (number = rem) |
| `align` | `CSSProperties['alignItems']` | `'center'` | Align items |
| `justify` | `CSSProperties['justifyContent']` | — | Justify content |
| `className` | `string` | — | Additional class name |
| `style` | `CSSProperties` | — | Inline styles |

---

### `ErrorBoundary`

Class-based React error boundary. Catches rendering errors in its subtree and displays a fallback UI. Detects `ChunkLoadError` (code-split chunk failures) and shows a "Reload page" button instead of "Try again".

```tsx
import { ErrorBoundary } from '@ui-construction-library/core';

<ErrorBoundary
  onError={(error, errorInfo) => {
    reportToServer(error, errorInfo);
  }}
>
  <HeavyDashboard />
</ErrorBoundary>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Subtree to catch errors for |
| `fallback` | `ReactNode \| ((error, reset) => ReactNode)` | Built-in UI | Custom fallback or render function |
| `onError` | `(error, errorInfo) => void` | — | Called when an error is caught |
| `resetKey` | `string \| number` | — | Changing this value resets the boundary |

The built-in fallback shows "Something went wrong" / "Failed to load module" with a reset or reload button. In development mode, error details and stack trace are shown in a collapsible section.

---

### `FloatingLabelInput`

A text `<input>` with an animated label that starts inside the field and floats above it on focus or when a value is present.

```tsx
import { FloatingLabelInput } from '@ui-construction-library/core';

<FloatingLabelInput
  label="Project name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={validationError}
/>

<FloatingLabelInput
  label="Description"
  hint="Briefly describe your project"
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Floating label text |
| `error` | `string` | — | Error message; shows input in error state |
| `hint` | `string` | — | Hint text below input (hidden when error is set) |

Extends all native `<input>` attributes except `placeholder`.

---

### `CoachMark`

A dismissible onboarding card. Once dismissed, the choice is persisted in `localStorage` so the card does not reappear on subsequent visits.

```tsx
import { CoachMark } from '@ui-construction-library/core';

<CoachMark
  id="dashboard-onboarding"
  title="Welcome to your dashboard"
  dismissLabel="Got it"
>
  <p>Drag widgets to customize your view. Changes save automatically.</p>
</CoachMark>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | — | Unique identifier for dismiss persistence |
| `children` | `ReactNode` | — | Card content |
| `title` | `string` | — | Title displayed above content |
| `dismissLabel` | `string` | `'Got it'` | Dismiss button label |
| `storageKey` | `string` | `'ucl-coachmark'` | `localStorage` key prefix |
| `onDismiss` | `(id: string) => void` | — | Called when dismissed |
| `className` | `string` | — | Additional class name |

---

### `PageTip`

A compact dismissible inline tip banner. Similar persistence pattern to `CoachMark` but rendered as a horizontal bar with optional icon, content, and an `×` dismiss button.

```tsx
import { PageTip } from '@ui-construction-library/core';

<PageTip id="export-tip">
  You can export your data as CSV or JSON from the Settings page.
</PageTip>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | — | Unique identifier for dismiss persistence |
| `children` | `ReactNode` | — | Tip content |
| `icon` | `ReactNode` | — | Icon displayed before content |
| `storageKey` | `string` | `'ucl-pagetip'` | `localStorage` key prefix |
| `onDismiss` | `(id: string) => void` | — | Called when dismissed |
| `className` | `string` | — | Additional class name |

## Troubleshooting

**Styles not applying** — make sure you import `@ui-construction-library/core/styles.css` before your own CSS.

**ThemeProvider missing** — wrap your app root with `<ThemeProvider>`. Without it, theme tokens will not resolve.

**SSR / Next.js** — use the `'use client'` directive on any component that uses hooks or browser APIs. The `ThemeProvider` must be in a client component.
