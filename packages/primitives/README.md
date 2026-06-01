# @ui-construction-library/primitives

Headless overlay primitives for the UI Construction Library. Provides unstyled, accessible Dialog, Popover, ContextMenu, Accordion, Tabs, Slider, and Switch components with full keyboard navigation and focus management.

## When to use

Use this package when you are building a **custom overlay component** (e.g. a date picker, colour picker, or custom combobox) and need the headless behaviour — focus trapping, controlled state, portal rendering — without the `core` styling layer.

For most use cases, use `@ui-construction-library/core` instead. It wraps these primitives with the library's design system.

## Installation

```bash
pnpm add @ui-construction-library/primitives
```

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Minimal example — custom dialog

```tsx
import { Dialog } from '@ui-construction-library/primitives';
import { useState } from 'react';

function CustomDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <button type="button">Open</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
        <Dialog.Content style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', padding: '1.5rem', borderRadius: '8px' }}>
          <Dialog.Title>Custom dialog</Dialog.Title>
          <Dialog.Description>This dialog traps focus and closes on Escape.</Dialog.Description>
          <Dialog.Close>
            <button type="button">Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

## Utilities

### `trapFocus`

Traps keyboard focus within a container. Returns a cleanup function.

```ts
import { trapFocus } from '@ui-construction-library/primitives';

const cleanup = trapFocus(containerElement, () => setOpen(false));
// Call cleanup() on unmount or when the overlay closes
```

### `useControllableState`

Supports both controlled and uncontrolled usage in custom components.

```ts
import { useControllableState } from '@ui-construction-library/primitives';

const [value, setValue] = useControllableState({
  value: controlledValue,   // undefined = uncontrolled
  defaultValue: false,
  onChange: onValueChange,
});
```

## Available primitives

| Primitive | Description |
|---|---|
| `Dialog` | Modal dialog with focus trap, Escape close, and portal rendering |
| `Popover` | Positioned popover with optional focus trap (`modal` prop) |
| `ContextMenu` | Right-click context menu with keyboard navigation |
| `Accordion` | Collapsible sections with ARIA contract |
| `Tabs` | Tab panel with keyboard navigation |
| `Slider` | Range slider with ARIA value attributes |
| `Switch` | Toggle switch with `role="switch"` |

## Controlled state contract

All root components accept the same open-state contract:

```tsx
<Dialog.Root open={open} defaultOpen={false} onOpenChange={setOpen}>
<Popover.Root open={open} defaultOpen={false} onOpenChange={setOpen} modal={false}>
<ContextMenu.Root open={open} defaultOpen={false} onOpenChange={setOpen}>
```

## Compatibility

- React 18 and 19
- TypeScript 5.x and 6.x
- No CSS shipped — fully unstyled

## Public API

```ts
import { Dialog, Popover, ContextMenu, Accordion, Tabs, Slider, Switch } from '@ui-construction-library/primitives';
import { trapFocus, getFocusableElements, useControllableState } from '@ui-construction-library/primitives';
```

## Troubleshooting

**Focus not trapped** — confirm the container element is mounted and visible before calling `trapFocus`. The container must contain at least one focusable element.

**Dialog not closing on Escape** — pass an `onEscape` callback as the second argument to `trapFocus`, or use `Dialog.Content` which handles this automatically.
