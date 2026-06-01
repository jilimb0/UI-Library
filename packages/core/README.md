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

## Troubleshooting

**Styles not applying** — make sure you import `@ui-construction-library/core/styles.css` before your own CSS.

**ThemeProvider missing** — wrap your app root with `<ThemeProvider>`. Without it, theme tokens will not resolve.

**SSR / Next.js** — use the `'use client'` directive on any component that uses hooks or browser APIs. The `ThemeProvider` must be in a client component.
