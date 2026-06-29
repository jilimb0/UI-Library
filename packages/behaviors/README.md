# @ui-construction-library/behaviors

Framework-agnostic behavior layer for the UI Construction Library. Pure JavaScript state machines, ARIA attribute factories, and interaction logic with zero framework dependencies.

## When to use

Use this package when you are building UI in a **non-React framework** (Solid, Svelte, Vue, vanilla JS) and want accessible, tested interaction patterns for common widgets — buttons, switches, dialogs, tabs, tooltips, sliders, menus, selects, popovers, accordions, and checkbox groups.

For React projects, use `@ui-construction-library/core` or `@ui-construction-library/primitives` instead — they consume these behaviors internally.

## Installation

```bash
pnpm add @ui-construction-library/behaviors
```

No peer dependencies required — this package works without React.

## Minimal example — dialog behavior

```ts
import { createDialogBehavior } from '@ui-construction-library/behaviors';

const dialog = createDialogBehavior({
  onOpen: () => console.log('Dialog opened'),
  onClose: () => console.log('Dialog closed'),
});

dialog.open();           // triggers onOpen callback
dialog.close();          // triggers onClose callback
dialog.toggle();         // toggles open/close
console.log(dialog.isOpen()); // true / false
```

## Available behaviors

| Behavior | Description |
|---|---|
| `createButtonBehavior` | Click handling, disabled state, loading state |
| `createSwitchBehavior` | Toggle state, ARIA `role="switch"` attributes |
| `createCheckboxBehavior` | Checked/indeterminate state, ARIA attributes |
| `createDialogBehavior` | Open/close, focus trap trigger, dismiss on Escape |
| `createTabsBehavior` | Tab activation, keyboard navigation (arrow keys, Home, End) |
| `createTooltipBehavior` | Show/hide with delay, pointer tracking |
| `createSliderBehavior` | Range value, step, keyboard increment |
| `createMenuBehavior` | Menu item activation, submenu, keyboard navigation |
| `createAccordionBehavior` | Expand/collapse, keyboard navigation |
| `createSelectBehavior` | Option selection, open/close, keyboard filtering |
| `createPopoverBehavior` | Positioned overlay, dismiss on click outside |
| `createFieldBehavior` | Form field state, validation, error display |
| `createFocusTrapBehavior` | Focus containment, Escape to release |

## Compatibility

- Works in any JS/TS environment (React, Vue, Solid, Svelte, vanilla JS)
- TypeScript 5.x and 6.x
- Zero dependencies — 2.5 kB gzipped

## Public API

```ts
import { createDialogBehavior, createTabsBehavior, createButtonBehavior, ... } from '@ui-construction-library/behaviors';
```

All behaviors return an object with state getters, action methods, and ARIA attribute helpers.

## Troubleshooting

**Behavior callbacks not firing** — confirm you are calling the returned action methods (`.open()`, `.close()`, etc.) rather than mutating state directly. State is internal and read-only via getters.
