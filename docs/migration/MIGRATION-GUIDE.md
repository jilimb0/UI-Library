# Migration Guide

This document covers API changes introduced during the accessibility and API quality pass. It includes before/after examples and CLI codemod patterns for each change.

## Version compatibility

| Package | Current version | Semver stage |
|---------|----------------|--------------|
| `core` | 0.4.0 | Stable — breaking changes not permitted |
| `tokens` | 0.4.0 | Stable — breaking changes not permitted |
| `icons` | 0.4.0 | Stable — breaking changes not permitted |
| `primitives` | 0.3.0 | Stable — breaking changes not permitted |
| `styles` | 0.3.0 | Stable — breaking changes not permitted |
| `motion` | 0.3.0 | Stable — breaking changes not permitted |
| `dnd` | 0.3.0 | Stable — breaking changes not permitted |
| `behaviors` | 0.3.0 | Stable — breaking changes not permitted |
| `utils` | 0.3.0 | Stable — breaking changes not permitted |

**Semver policy:** Breaking changes are permitted in `0.1.x` and `0.2.x` releases but **not** in `0.3.x` or higher. All current packages are at `≥0.3.0`, meaning the public API is stable. No breaking changes have been introduced since `0.3.x` began.

All entries below are **additive** (new props, new exports, new capabilities). Existing code continues to work without modification.

---

## 1. `trapFocus` signature change

**Package:** `@ui-construction-library/core` (re-exported from `@ui-construction-library/primitives`)

The old `trapFocus` in `core/utils/accessibility` used an element-scoped `keydown` listener and accepted only one argument. The canonical implementation now lives in `primitives` and accepts an optional `onEscape` callback as a second argument.

### Before

```ts
import { trapFocus } from '@ui-construction-library/core';

const cleanup = trapFocus(containerElement);
// No Escape handling — had to be wired separately
```

### After

```ts
import { trapFocus } from '@ui-construction-library/core';

const cleanup = trapFocus(containerElement, () => setOpen(false));
// Escape key now calls the callback automatically
```

### Codemod

```bash
# Find all trapFocus call sites with a single argument
grep -rn "trapFocus(" src --include="*.ts" --include="*.tsx"

# Pattern to update manually:
# trapFocus(el)  →  trapFocus(el, onEscape)
# Add the onEscape callback if Escape handling is needed, or leave it out
# for traps that should not close on Escape.
```

---

## 2. `ContextMenu.Root` — controlled open state

**Package:** `@ui-construction-library/primitives`

`ContextMenu.Root` was previously uncontrolled only. It now accepts `open`, `defaultOpen`, and `onOpenChange` to match the rest of the overlay family.

### Before

```tsx
// Uncontrolled only — no way to drive open state externally
<ContextMenu.Root>
  <ContextMenu.Trigger>...</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>...</ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

### After

```tsx
// Uncontrolled (unchanged behaviour — no migration needed)
<ContextMenu.Root>...</ContextMenu.Root>

// Controlled (new capability)
<ContextMenu.Root
  open={isOpen}
  onOpenChange={setIsOpen}
>
  ...
</ContextMenu.Root>
```

**No breaking change.** Existing uncontrolled usage continues to work without modification.

---

## 3. `Dropdown` — controlled open state

**Package:** `@ui-construction-library/core`

`Dropdown` now accepts `open`, `defaultOpen`, and `onOpenChange` in addition to the existing `value`/`defaultValue`/`onChange` props.

### Before

```tsx
<Dropdown items={items} onChange={handleChange} />
// open state was fully internal — no external control
```

### After

```tsx
// Uncontrolled (unchanged — no migration needed)
<Dropdown items={items} onChange={handleChange} />

// Controlled open state (new capability)
<Dropdown
  items={items}
  open={menuOpen}
  onOpenChange={setMenuOpen}
  onChange={handleChange}
/>
```

**No breaking change.**

---

## 4. `Dropdown` — `size` prop added

**Package:** `@ui-construction-library/core`

`Dropdown` now accepts a `size` prop (`'sm' | 'md' | 'lg'`). The default is `'md'`, which matches the previous unsized behaviour exactly.

### Before

```tsx
<Dropdown items={items} />
// No size control
```

### After

```tsx
<Dropdown items={items} size="sm" />  // compact
<Dropdown items={items} size="md" />  // default (same as before)
<Dropdown items={items} size="lg" />  // spacious
```

**No breaking change.** Existing usage without `size` renders identically.

---

## 5. `Modal.Content` — `size` prop added

**Package:** `@ui-construction-library/core`

`Modal.Content` now accepts a `size` prop (`'sm' | 'md' | 'lg' | 'full'`). The default is `'md'`, which matches the previous hardcoded `32rem` width.

### Before

```tsx
<Modal.Content title="Settings">...</Modal.Content>
// Width was always min(calc(100% - 2rem), 32rem)
```

### After

```tsx
<Modal.Content size="sm" title="Confirm">...</Modal.Content>   // 22rem max
<Modal.Content size="md" title="Settings">...</Modal.Content>  // 32rem max (default)
<Modal.Content size="lg" title="Editor">...</Modal.Content>    // 48rem max
<Modal.Content size="full" title="Preview">...</Modal.Content> // full viewport width
```

**No breaking change.** Existing usage without `size` renders identically.

---

## 6. `Popover` — `size` prop added

**Package:** `@ui-construction-library/core`

`Popover` now accepts a `size` prop (`'sm' | 'md' | 'lg'`). The default is `'md'`.

### Before

```tsx
<Popover trigger={<button>Open</button>} content={<div>...</div>} />
```

### After

```tsx
<Popover size="sm" trigger={<button>Open</button>} content={<div>...</div>} />
<Popover size="lg" trigger={<button>Open</button>} content={<div>...</div>} />
```

**No breaking change.**

---

## 7. `useControllableState` — now public

**Package:** `@ui-construction-library/primitives`

`useControllableState` was previously internal. It is now exported from the primitives public index for use in custom overlay components.

```ts
import { useControllableState } from '@ui-construction-library/primitives';

const [value, setValue] = useControllableState({
  value: controlledValue,
  defaultValue: false,
  onChange: onValueChange,
});
```

---

## Codemod reference

The changes above are all **additive** — no existing prop was removed or renamed. A mechanical codemod is not required. The following grep patterns help locate call sites that may benefit from the new capabilities:

```bash
# Find Dropdown usages that might want controlled open state
grep -rn "<Dropdown" src --include="*.tsx"

# Find Modal.Content usages that might benefit from explicit size
grep -rn "<Modal.Content" src --include="*.tsx"

# Find trapFocus usages to verify onEscape wiring
grep -rn "trapFocus(" src --include="*.ts" --include="*.tsx"

# Find ContextMenu.Root usages that might want controlled state
grep -rn "<ContextMenu.Root" src --include="*.tsx"
```
