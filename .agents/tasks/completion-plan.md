# UI-Library Completion Plan

> Investigation date: 2025-07-22
> Based on direct source reading of all atom, molecule, and organism components,
> all CLI source files, all existing `.stories.tsx` files, and ThemeProvider.

---

## 1. tv() Slots Priority List

### Classification Table

| Component | Layer | Verdict | Reason | Priority |
|---|---|---|---|---|
| Avatar | Atom | NEEDS_SLOTS | Root wrapper + img + fallback — consumer needs to style each independently | P2 |
| Badge | Atom | SIMPLE_SKIP | Single `<span>` root, single content area | P3 |
| Button | Atom | SIMPLE_SKIP | Already uses tv() for variants; inner spans (spinner, icons) are presentational | P3 |
| Checkbox | Atom | NEEDS_SLOTS | Root, box, check icon, label, description, error — all independently styleable | P2 |
| Cluster | Atom | SIMPLE_SKIP | Pure layout wrapper, single element | P3 |
| Code | Atom | SIMPLE_SKIP | Single `<code>` element | P3 |
| Divider | Atom | SIMPLE_SKIP | Single `<hr>` or line element | P3 |
| FloatingLabelInput | Atom | NEEDS_SLOTS | Wrapper, field, label, error, hint — floating label layout needs per-slot control | P2 |
| Heading | Atom | SIMPLE_SKIP | Single heading element | P3 |
| Icon | Atom | SIMPLE_SKIP | Single SVG element | P3 |
| Image | Atom | SIMPLE_SKIP | Single `<img>` element | P3 |
| Input | Atom | NEEDS_SLOTS | Wrapper, input, label, suffix, description, error — suffix positioning slot useful | P2 |
| Kbd | Atom | SIMPLE_SKIP | Single `<kbd>` element | P3 |
| Link | Atom | SIMPLE_SKIP | Single `<a>` element with no cv slots needed | P3 |
| Progress | Atom | NEEDS_SLOTS | Root progressbar + inner fill bar — consumer needs to style both | P2 |
| RadioButton | Atom | NEEDS_SLOTS | Wrapper, input, label (with text + description spans) | P2 |
| Select | Atom | NEEDS_SLOTS | Wrapper, `<select>`, label, icon overlay, error, description | P2 |
| Skeleton | Atom | SIMPLE_SKIP | Single element animated block | P3 |
| Spinner | Atom | SIMPLE_SKIP | Single SVG/spinner element | P3 |
| Stack | Atom | SIMPLE_SKIP | Pure layout wrapper | P3 |
| Switch | Atom | NEEDS_SLOTS | Root, button thumb, label, description — thumb needs independent style | P2 |
| Tag | Atom | NEEDS_SLOTS | Root span, icon span, content span, remove button | P2 |
| Text | Atom | SIMPLE_SKIP | Single `<p>` or text element | P3 |
| TextArea | Atom | SIMPLE_SKIP | Single `<textarea>` + optional label (same pattern as Input) | P2 |
| Accordion | Molecule | ALREADY_SLOTTED | Object.assign compound: `.Root`, `.Item`, `.Trigger`, `.Content` | — |
| Alert | Molecule | NEEDS_SLOTS | Single `<div>` root with no sub-parts exported; icon+title+description structure done via children only | **P1** |
| Breadcrumb | Molecule | NEEDS_SLOTS | nav, ol, li, link, separator, current — each deserves a slot for styling | P2 |
| Card | Molecule | NEEDS_SLOTS | Single root, no header/body/footer sub-parts exported | P2 |
| CoachMark | Molecule | NEEDS_SLOTS | Root, content, title, body, dismiss button | P2 |
| ColorPicker | Molecule | SIMPLE_SKIP | Minimal native inputs, functional but intentionally minimal | P3 |
| ComboBox | Molecule | NEEDS_SLOTS | Input, listbox ul, option li, empty-state li | P2 |
| ContextMenu | Molecule | ALREADY_SLOTTED | Uses PrimitiveContextMenu compound pattern | — |
| DatePicker | Molecule | NEEDS_SLOTS | fieldset, nav, table, th, td/day cells — all need independent styling | P2 |
| Dialog | Molecule | ALREADY_SLOTTED | Uses PrimitiveDialog compound, exposes trigger/overlay/content | — |
| Dropdown | Molecule | NEEDS_SLOTS | Wrapper, trigger button, menu div, item divs — trigger icon slot would be useful | P2 |
| Field | Molecule | NEEDS_SLOTS | Label, control wrapper, description, error — no tv() slots today | P2 |
| FileUpload | Molecule | NEEDS_SLOTS | Zone label, hint, input, file list, list items | P2 |
| MenuItem | Molecule | SIMPLE_SKIP | Single `<div>` container | P3 |
| NotificationItem | Molecule | NEEDS_SLOTS | Root, avatar area, content, entity-name, timestamp, title, description, action slot | **P1** |
| OTPInput | Molecule | NEEDS_SLOTS | Wrapper + slot inputs — currently no className per-slot | P2 |
| PageTip | Molecule | NEEDS_SLOTS | Root, icon, body, dismiss button | P2 |
| Pagination | Molecule | NEEDS_SLOTS | Root, controls, pages, prev/next buttons, meta, size select | P2 |
| Popover | Molecule | ALREADY_SLOTTED | Uses PrimitivePopover compound (Root/Trigger/Content/Portal) | — |
| Rating | Molecule | NEEDS_SLOTS | Wrapper + individual star buttons | P2 |
| SearchInput | Molecule | NEEDS_SLOTS | Wrapper, search icon, input, clear button | P2 |
| Slider | Molecule | ALREADY_SLOTTED | Uses primitive Root/Track/Range/Thumb sub-parts with className | — |
| Stepper | Molecule | NEEDS_SLOTS | Root, step button, indicator, label stack, description | **P1** |
| Tabs | Molecule | ALREADY_SLOTTED | Uses primitive compound (Root/List/Trigger/Content) | — |
| Toast | Molecule | NEEDS_SLOTS | Root, body div, close button — consumer needs per-slot styling | **P1** |
| Tooltip | Molecule | NEEDS_SLOTS | Trigger wrapper, tooltip bubble div | P2 |
| Accordion | Organism | ALREADY_SLOTTED | Re-exports molecule with compound pattern | — |
| AppShell | Organism | NEEDS_SLOTS | topnav header, body, sidebar aside, main — layout slots needed | P2 |
| Calendar | Organism | NEEDS_SLOTS | panel, nav, weekday header, day cell, event chip — each deserves a slot | P2 |
| CommandPalette | Organism | ALREADY_SLOTTED | Uses Dialog.Root compound; input/list/item have individual classNames | — |
| DataTable | Organism | NEEDS_SLOTS | Wrapper, table, thead, tbody, tr, th, td, empty-state, pagination | P2 |
| Drawer | Organism | ALREADY_SLOTTED | Object.assign: `.Close`, `.Title`, `.Description` | — |
| EmptyState | Organism | NEEDS_SLOTS | Root, icon wrapper, title, description, action div | P2 |
| ErrorBoundary | Organism | SIMPLE_SKIP | Utility component, no styled sub-parts | P3 |
| Form | Organism | SIMPLE_SKIP | Thin wrapper around `<form>`, children handle layout | P3 |
| KpiCard | Organism | NEEDS_SLOTS | Root, icon div, body, label, value, subtext | **P1** |
| Modal | Organism | ALREADY_SLOTTED | Object.assign: `.Trigger`, `.Content`, `.Header`, `.Body`, `.Footer`, `.Close` | — |
| Navigation | Organism | SIMPLE_SKIP | Thin `<nav>` wrapper, slots provided by children | P3 |
| PageHeader | Organism | NEEDS_SLOTS | header, breadcrumbs nav, row, titles div, title h1, subtitle p, actions div | P2 |
| PricingTable | Organism | NEEDS_SLOTS | Header, toggle, grid, card, badge, features list, CTA — many independently styled parts | P2 |
| Sidebar | Organism | NEEDS_SLOTS | Root aside, toolbar, nav, group-label, items, item, icon, badge | **P1** |
| Table | Organism | SIMPLE_SKIP | Thin `<table>` wrapper; thead/tbody/tr/td are children | P3 |
| Timeline | Organism | NEEDS_SLOTS | Root ol, item li, marker, body, title, description, timestamp | P2 |
| TopNav | Organism | NEEDS_SLOTS | Root nav, brand div, links ul, link a/button, actions div | P2 |
| TreeView | Organism | NEEDS_SLOTS | Root ul, branch li, row div, toggle button, node button | P2 |

### P1 NEEDS_SLOTS — Exact tv() Definitions

#### Alert

```ts
// packages/core/src/components/molecules/Alert/Alert.tsx
const alertVariants = tv({
  slots: {
    root: 'alert',
    icon: 'alert__icon',
    title: 'alert__title',
    description: 'alert__description',
  },
  variants: {
    variant: {
      default:  { root: 'alert--default' },
      success:  { root: 'alert--success' },
      warning:  { root: 'alert--warning' },
      error:    { root: 'alert--error' },
      info:     { root: 'alert--info' },
    },
  },
  defaultVariants: { variant: 'default' },
});

// Updated interface
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** Icon element (e.g. <InfoIcon />) */
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  classNames?: {
    root?: string;
    icon?: string;
    title?: string;
    description?: string;
  };
}
```

#### Toast

```ts
// packages/core/src/components/molecules/Toast/Toast.tsx
const toastVariants = tv({
  slots: {
    root: 'toast',
    body: 'toast__body',
    close: 'toast__close',
  },
  variants: {
    variant: {
      default: {},
      success: { root: 'toast--success' },
      warning: { root: 'toast--warning' },
      error:   { root: 'toast--error' },
      info:    { root: 'toast--info' },
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  duration?: number;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
  classNames?: {
    root?: string;
    body?: string;
    close?: string;
  };
}
```

#### Stepper

```ts
// packages/core/src/components/molecules/Stepper/Stepper.tsx
const stepperVariants = tv({
  slots: {
    root:        'stepper',
    step:        'stepper__step',
    indicator:   'stepper__indicator',
    labelStack:  'control-stack',
    label:       'field-label',
    description: 'field-hint',
  },
  variants: {
    orientation: {
      horizontal: { root: '' },
      vertical:   { root: 'stepper--vertical' },
    },
    status: {
      active:    { indicator: 'stepper__indicator--active' },
      completed: { indicator: 'stepper__indicator--done' },
      pending:   {},
    },
  },
  defaultVariants: { orientation: 'horizontal', status: 'pending' },
});

export interface StepperProps {
  // ... existing props
  classNames?: {
    root?: string;
    step?: string;
    indicator?: string;
    label?: string;
    description?: string;
  };
}
```

#### KpiCard

```ts
// packages/core/src/components/organisms/KpiCard/KpiCard.tsx
const kpiCardVariants = tv({
  slots: {
    root:    'kpi-card',
    icon:    'kpi-card__icon',
    body:    'kpi-card__body',
    label:   'kpi-card__label',
    value:   'kpi-card__value',
    subtext: 'kpi-card__subtext',
  },
  variants: {
    variant: {
      default: {},
      success: { root: 'kpi-card--success' },
      warning: { root: 'kpi-card--warning' },
      error:   { root: 'kpi-card--error' },
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface KpiCardProps {
  // ... existing props
  classNames?: {
    root?: string;
    icon?: string;
    body?: string;
    label?: string;
    value?: string;
    subtext?: string;
  };
}
```

#### NotificationItem

```ts
// packages/core/src/components/molecules/NotificationItem/NotificationItem.tsx
const notificationItemVariants = tv({
  slots: {
    root:        'ucl-notification-item',
    indicator:   'ucl-notification__indicator',
    content:     'ucl-notification__content',
    entityName:  'ucl-notification__entity',
    timestamp:   'ucl-notification__timestamp',
    title:       'ucl-notification__title',
    description: 'ucl-notification__description',
    actions:     'ucl-notification__actions',
  },
  variants: {
    unread: {
      true:  { root: 'ucl-notification-item--unread' },
      false: {},
    },
    severity: {
      info:    {},
      warning: {},
      error:   {},
      success: {},
    },
  },
  defaultVariants: { unread: false, severity: 'info' },
});

export interface NotificationItemProps {
  // ... existing props
  classNames?: {
    root?: string;
    indicator?: string;
    content?: string;
    entityName?: string;
    timestamp?: string;
    title?: string;
    description?: string;
    actions?: string;
  };
}
```

#### Sidebar

```ts
// packages/core/src/components/organisms/Sidebar/Sidebar.tsx
const sidebarVariants = tv({
  slots: {
    root:       'sidebar',
    toolbar:    'sidebar__toolbar',
    nav:        'sidebar__nav',
    groupLabel: 'sidebar__group-label',
    items:      'sidebar__items',
    item:       'sidebar__item',
    itemIcon:   'sidebar__item-icon',
    badge:      'sidebar__badge',
  },
  variants: {
    collapsed: {
      true:  { root: 'sidebar--collapsed' },
      false: { root: 'sidebar--expanded' },
    },
  },
  defaultVariants: { collapsed: false },
});

export interface SidebarProps {
  // ... existing props
  classNames?: {
    root?: string;
    toolbar?: string;
    nav?: string;
    groupLabel?: string;
    items?: string;
    item?: string;
    itemIcon?: string;
    badge?: string;
  };
}
```

---

## 2. asChild Scope

### Classification Table

| Component | Layer | Classification | Note |
|---|---|---|---|
| Button | Atom | **HAS_ASCHILD** | `asChild` prop + Slottable already implemented |
| Badge | Atom | **HAS_ASCHILD** | `asChild` prop + Slottable already implemented |
| Link | Atom | **NEEDS_ASCHILD** | `<a>` wrapper — consumer needs `asChild` to swap for Next.js `<Link>` |
| Tag | Atom | **NEEDS_ASCHILD** | Rendered as `<span>` — needs `asChild` to render as `<a>` or router link |
| Avatar | Atom | SKIP | Image wrapper, not navigational |
| Checkbox | Atom | SKIP | Form control, compound element |
| Cluster | Atom | SKIP | Layout only |
| Code | Atom | SKIP | Inline text, no nav need |
| Divider | Atom | SKIP | Presentational |
| FloatingLabelInput | Atom | SKIP | Form control, internal structure fixed |
| Heading | Atom | **NEEDS_ASCHILD** | Consumer needs to render as custom heading level or route link |
| Icon | Atom | SKIP | SVG primitive |
| Image | Atom | SKIP | `<img>` — `as` prop pattern doesn't apply |
| Input | Atom | SKIP | Form control |
| Kbd | Atom | SKIP | `<kbd>` presentational |
| Progress | Atom | SKIP | Role=progressbar, no nav need |
| RadioButton | Atom | SKIP | Form control |
| Select | Atom | SKIP | Form control |
| Skeleton | Atom | SKIP | Presentational |
| Spinner | Atom | SKIP | Presentational |
| Stack | Atom | SKIP | Layout only |
| Switch | Atom | SKIP | Form control |
| Text | Atom | **NEEDS_ASCHILD** | Consumer needs `<p>` to become `<span>` or vice versa without losing styles |
| TextArea | Atom | SKIP | Form control |
| Alert | Molecule | SKIP | Informational block, not navigational |
| Breadcrumb | Molecule | SKIP | Internal links are rendered — items control their own `href` |
| Card | Molecule | **NEEDS_ASCHILD** | Consumer wants `<Card asChild><a href>…</a></Card>` for clickable cards |
| CoachMark | Molecule | SKIP | Informational overlay |
| ComboBox | Molecule | SKIP | Form control |
| ContextMenu | Molecule | ALREADY_SLOTTED | Trigger uses `asChild` via PrimitiveContextMenu |
| DatePicker | Molecule | SKIP | Self-contained widget |
| Dialog | Molecule | ALREADY_SLOTTED | Trigger via PrimitiveDialog.Trigger with asChild |
| Dropdown | Molecule | SKIP | Has internal button trigger |
| Field | Molecule | SKIP | Layout wrapper, children handle their own rendering |
| MenuItem | Molecule | **NEEDS_ASCHILD** | Consumers need `<MenuItem asChild><a href="/…">…</a></MenuItem>` |
| PageTip | Molecule | SKIP | Informational banner |
| Pagination | Molecule | SKIP | Internal structure |
| Popover | Molecule | ALREADY_SLOTTED | Trigger uses PrimitivePopover.Trigger asChild |
| Stepper | Molecule | SKIP | Internal step buttons |
| Toast | Molecule | SKIP | Notification element |
| Tooltip | Molecule | ALREADY_SLOTTED | Wraps child with cloneElement (Slottable-like injection) |
| Accordion | Organism | ALREADY_SLOTTED | Compound pattern |
| AppShell | Organism | SKIP | Layout shell |
| Drawer | Organism | ALREADY_SLOTTED | Drawer.Close uses Dialog.Close |
| Modal | Organism | ALREADY_SLOTTED | Modal.Trigger via Dialog.Trigger with asChild |
| Sidebar | Organism | SKIP | Internal `<a>` / `<button>` items via data props |

### NEEDS_ASCHILD — Exact Code Changes

#### Link

```tsx
// packages/core/src/components/atoms/Link/Link.tsx
import { Slottable } from '@ui-construction-library/primitives';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: keyof typeof linkVariants;
  /** Render as a child element (Slot pattern — merges link styles onto child). */
  asChild?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ variant = 'default', className, style, asChild = false, ...props }, ref) => {
    const linkClass = cn(linkVariants[variant], className);
    if (asChild) {
      return (
        <Slottable
          asChild
          ref={ref as React.Ref<HTMLElement>}
          className={linkClass}
          style={style}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        />
      );
    }
    return <a ref={ref} className={linkClass} style={style} {...props} />;
  }
);
```

#### Tag

```tsx
// packages/core/src/components/atoms/Tag/Tag.tsx
// Add to TagProps:
  /** Render as a child element (merges tag styles onto child). */
  asChild?: boolean;

// In render, before returning the <span>:
if (asChild) {
  return (
    <Slottable
      asChild
      ref={ref as React.Ref<HTMLElement>}
      className={cn(tagVariants({ variant, size }), className)}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Slottable>
  );
}
```

#### Heading

```tsx
// packages/core/src/components/atoms/Heading/Heading.tsx
// (read source first, but the pattern is):
export interface HeadingProps {
  asChild?: boolean;
  // ...existing props
}
// in render:
if (asChild) {
  return (
    <Slottable asChild ref={ref} className={headingClass} {...props}>
      {children}
    </Slottable>
  );
}
```

#### Text

```tsx
// packages/core/src/components/atoms/Text/Text.tsx
// Same pattern — add asChild prop and delegate to Slottable when true.
```

#### Card

```tsx
// packages/core/src/components/molecules/Card/Card.tsx
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  // ...existing props
}
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild = false, elevation = 'flat', interactive, ...props }, ref) => {
    const cardClass = cn(cardVariants({ elevation, interactive, className }));
    if (asChild) {
      return (
        <Slottable asChild ref={ref as React.Ref<HTMLElement>} className={cardClass}
          data-elevation={elevation} data-interactive={interactive || undefined}
          {...(props as React.HTMLAttributes<HTMLElement>)} />
      );
    }
    return <div ref={ref} className={cardClass} ... />;
  }
);
```

#### MenuItem

```tsx
// packages/core/src/components/molecules/MenuItem/MenuItem.tsx
export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  asChild?: boolean;
}
// in render: same Slottable delegation pattern
```

---

## 3. Complex A11y Gap Analysis

### ComboBox — `packages/core/src/components/molecules/ComboBox/ComboBox.tsx`

**Current ARIA/keyboard state:**
- `<input>` has no `role`, no `aria-haspopup`, no `aria-expanded`, no `aria-autocomplete`, no `aria-activedescendant`
- `<ul>` has no `role="listbox"`
- `<li>/<button>` items have no `role="option"`, no `id` attributes for `aria-activedescendant` pointing
- `highlightedIndex` tracked in state but not reflected in ARIA at all
- Keyboard: ArrowDown/Up, Enter (select), Escape work; Home/End, PageUp/PageDown, type-ahead absent

**APG pattern:** [ARIA Combobox Pattern 3.8](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)

**Exact missing requirements:**
1. Add `role="combobox"` to `<input>`
2. Add `aria-haspopup="listbox"` to `<input>`
3. Add `aria-expanded={open}` to `<input>`
4. Add `aria-autocomplete="list"` to `<input>`
5. Add stable `id` to `<input>` (e.g. use `useId()`)
6. Add `role="listbox"` to `<ul>` + give it an `id`
7. Add `aria-controls={listboxId}` to `<input>`
8. Add `role="option"` to each `<li>` (not the button inside — change `<li>/<button>` to just `<li role="option" tabIndex={-1}>`)
9. Add `id={`combobox-option-${option.value}`}` to each option element
10. Add `aria-selected={index === highlightedIndex}` to each option
11. Add `aria-activedescendant` to `<input>` pointing to the currently highlighted option id
12. Add Home/End keys: Home → `setHighlightedIndex(0)`, End → `setHighlightedIndex(filtered.length - 1)`

**Effort:** MED  
**Recommendation:** fix-now (P1 a11y gap)

**Code change sketch:**

```tsx
const inputId = useId();
const listboxId = `${inputId}-listbox`;

<input
  id={inputId}
  role="combobox"
  aria-haspopup="listbox"
  aria-expanded={open}
  aria-autocomplete="list"
  aria-controls={open ? listboxId : undefined}
  aria-activedescendant={
    open && filtered[highlightedIndex]
      ? `${inputId}-opt-${filtered[highlightedIndex].value}`
      : undefined
  }
  ...
/>
{open && (
  <ul
    id={listboxId}
    role="listbox"
    aria-label={placeholder}
    className="dropdown-menu absolute z-20 max-h-56 w-full overflow-auto"
  >
    {filtered.map((option, index) => (
      <li
        key={option.value}
        id={`${inputId}-opt-${option.value}`}
        role="option"
        aria-selected={index === highlightedIndex}
        onClick={() => { emitChange(option.value); setQuery(''); setOpen(false); }}
        className={cn(
          'dropdown-menu__item w-full text-left',
          index === highlightedIndex && 'dropdown-menu__item--active'
        )}
      >
        {option.label}
      </li>
    ))}
  </ul>
)}
```

Also add to `onKeyDown`:
```ts
case 'Home': e.preventDefault(); setHighlightedIndex(0); break;
case 'End':  e.preventDefault(); setHighlightedIndex(Math.max(filtered.length - 1, 0)); break;
```

---

### TreeView — `packages/core/src/components/organisms/TreeView/TreeView.tsx`

**Current ARIA/keyboard state:**
- Root `<ul>` has no `role`; nested `<ul>` has no `role`
- Toggle `<button>` has no `aria-expanded`
- Node `<button>` has no `role="treeitem"`, no `aria-selected`
- No `selectedId` state tracked — selection is fired via `onSelect` callback but component has no internal selected concept
- Keyboard: click/toggle buttons only — no keyboard tree navigation per APG

**APG pattern:** [ARIA Tree View Pattern 3.26](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)

**Exact missing requirements:**
1. Add `role="tree"` to root `<ul>` in `TreeView`
2. Add `role="group"` to child `<ul>` elements inside expanded `TreeBranch`
3. Add `role="treeitem"` to the node `<button>` (or enclosing `<li>`, per APG option B)
4. Add `aria-expanded={open}` to toggle button (or to the `<li>` with `role="treeitem"` if merging toggle+select)
5. Add `aria-selected={selectedId === node.id}` to each treeitem; requires tracking `selectedId` in `TreeView` state
6. Add `tabIndex` management: only the selected/focused node gets `tabIndex={0}`, all others `-1` (roving tabindex)
7. Add keyboard navigation:
   - `ArrowRight`: if collapsed → expand; if expanded → move focus to first child
   - `ArrowLeft`: if expanded → collapse; if collapsed → move focus to parent
   - `ArrowDown`: move focus to next visible node
   - `ArrowUp`: move focus to previous visible node
   - `Enter` / `Space`: activate (select) current node
   - `Home`: move to first node
   - `End`: move to last visible node

**Effort:** HIGH  
**Recommendation:** fix-now for ARIA roles/aria-expanded/aria-selected (LOW effort items); defer full keyboard nav to a separate task (HIGH effort, requires ref forwarding and flat node index)

**Quick wins (fix-now):**
- Add `role="tree"` + `aria-label` to root `<ul>` in `TreeView` — 2 lines
- Add `role="treeitem"` to node `<button>` — 1 line per button
- Add `role="group"` to child `<ul>` — 1 line
- Add `aria-expanded={open}` to toggle `<button>` — 1 line
- Add `selectedId` state and `aria-selected` — ~10 lines

---

### DatePicker — `packages/core/src/components/molecules/DatePicker/DatePicker.tsx`

**Current ARIA/keyboard state:**
- `<fieldset>` + `<legend>` wraps the calendar (good pattern)
- `<table>` present with `aria-label={label}` on it
- `<thead>/<tr>/<th scope="col">` with `abbr` — correct
- `<td>` has `aria-disabled`, `data-date`, `tabIndex` (roving — selected/today gets 0, others -1) — roving tabindex mostly correct
- `aria-live="polite"` on month display — correct
- Arrow keys navigate days, Enter/Space selects, auto-shifts month — correct
- **Missing:** `role="grid"` on `<table>` (APG Calendar/Grid pattern requires this), `aria-selected={isSelected}` on `<td>`, `role="gridcell"` on `<td>`, `role="row"` on `<tr>` inside `<tbody>`

**APG pattern:** [ARIA Grid / Date Picker Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)

**Exact missing requirements:**
1. `<table role="grid">` → add `role="grid"` attribute
2. `<tr role="row">` in `<tbody>` → add `role="row"` to each `<tr>` (already implied by `<table>` but explicit role required)
3. `<td role="gridcell">` → add `role="gridcell"` to each `<td>`
4. `aria-selected={isSelected}` → add to each `<td>`

**Effort:** LOW (4 attribute additions)  
**Recommendation:** fix-now

**Input+popover pattern** (trigger button → floating calendar):  
Currently the calendar is always rendered inline (no popover trigger). Converting to an input+popover dialog is a larger architectural change. **Defer** — mark as enhancement issue.

---

### ColorPicker — `packages/core/src/components/molecules/ColorPicker/ColorPicker.tsx`

**Current ARIA/keyboard state:**
- `<input type="color">` — natively accessible by most browsers/AT (color picker role)
- `<input type="text">` — accessible but has no `aria-label`
- RGB display `<div>` — no label, purely visual

**Missing requirements:**
1. `<input type="color">` needs `aria-label="Color"` or a visible `<label>` — currently no label at all
2. `<input type="text">` needs `aria-label="Hex value"` or associated `<label>`
3. Component is uncontrolled when `value` prop is passed — state diverges from prop after mount (known bug: `useState(value)` at init only)

**Effort:** LOW  
**Recommendation:** fix-now for missing labels (2 attribute additions); fix controlled/uncontrolled state divergence bug

**Code change:**
```tsx
<input
  type="color"
  value={color}
  aria-label="Color"         // ADD
  ...
/>
<input
  type="text"
  value={color}
  aria-label="Hex value"     // ADD
  ...
/>
```

For the controlled/uncontrolled bug, replace `useState(value)` with:
```tsx
// Sync external value changes
useEffect(() => { setColor(value); }, [value]);
```

---

## 4. CLI Package State

### Version Mismatch

- **`packages/cli/src/index.ts` line 9:** hard-coded string `'@ui-construction-library/cli v0.1.0'`
- **`packages/cli/src/commands/index.ts` line 10 (help banner):** hard-coded `v0.1.0`
- **`packages/cli/package.json`:** `"version": "0.3.0"`
- **Fix:** read version dynamically: `import { version } from '../../package.json' assert { type: 'json' };` or use a build-time injection

### Commands That Work

| Command | What it does | Status |
|---|---|---|
| `init [--theme dark\|light\|neutral]` | Creates `.cursor/rules/ucl-agent.mdc` or `.opencode/ucl-agent-guide.md` with AI usage instructions; also writes `.cursorrules` | Works |
| `component [name]` | Lists all registry components by category, or shows detail (props/states/recipes/a11y) for a named component | Works |
| `docs [--tree]` | Walks up from CWD to find a `docs/` directory, lists markdown files by category | Works but fragile: only useful inside the monorepo |
| `theme [--list\|<name>]` | Lists available themes or copies a theme CSS file to CWD | Works |

### What `init` is Missing

1. **No dependency installation step** — does not run `npm install @ui-construction-library/core` or equivalent
2. **No Tailwind config setup** — does not add `@ui-construction-library/styles` to Tailwind content paths
3. **No styles import instruction** — does not add `import '@ui-construction-library/styles/styles.css'` to the user's entry file
4. **No theme CSS import instruction** — does not add `import '@ui-construction-library/themes/theme-dark.css'` to the user's entry file
5. **No `data-theme` attribute instruction** — does not modify `index.html` or layout root

Recommended `init` completion sequence:
```
1. Detect package manager (npm/pnpm/yarn/bun) via lockfile detection
2. Run: <pm> install @ui-construction-library/core @ui-construction-library/styles @ui-construction-library/themes
3. Print: "Add to your entry file: import '@ui-construction-library/styles/styles.css'"
4. Print: "Add to your entry file: import '@ui-construction-library/themes/theme-{theme}.css'"
5. Print: "Add data-theme=\"{theme}\" to <html> in your index.html"
6. Write AI config file (existing behavior)
```

### What `component` is Missing

- **No scaffolding / code generation** — `component add <Name>` should copy a component's source file into the user's project under a chosen path
- The registry has metadata (package, props, description) but no file templates
- Missing: `component add <Name> [--path src/components/]` that reads from the registry and writes the component file

### What `docs` is Missing

- Works only inside the monorepo (walks relative paths to find `docs/`)
- After publishing to npm, `docs/` will not be in `node_modules` — the command becomes a no-op
- Fix: embed a docs URL or render docs from the registry's `description` + `recipes` fields

### What `theme` is Missing

- `getThemesDistDir()` resolves via `__dirname`-relative paths; likely breaks when installed globally or in projects without the monorepo structure
- No `--preview` flag showing what CSS variables a theme defines
- No guidance on CSS variable override pattern (`--ucl-*`)

### Missing Commands

**A) `add <ComponentName> [--output-dir ./src/components/]`**
- Purpose: scaffolds a component's source file into the user's project
- Files to create: `packages/cli/src/commands/add.ts`
- Register in `packages/cli/src/commands/index.ts`
- Needs: component file template per-component in the registry, or a static file map

**B) `tokens [--list] [--filter <prefix>]`**
- Purpose: list all `--ucl-*` CSS custom properties, their default values, and which semantic token they map to
- Would need: parse `packages/tokens/src/` or `packages/styles/src/` for variable definitions and emit them
- Files to create: `packages/cli/src/commands/tokens.ts`

**C) Version string fix**
- File: `packages/cli/src/index.ts` — replace hard-coded `v0.1.0` with dynamic import
- File: `packages/cli/src/commands/index.ts` — same fix in help banner
- Option: add a build step that injects `__VERSION__` at bundle time

---

## 5. Storybook Coverage Gaps

Stories are co-located at `packages/core/src/components/**/*.stories.tsx` and in `apps/storybook/stories/`. The Storybook config (`apps/storybook/.storybook/main.ts`) picks up both locations.

### Gap Table

| Capability | Story exists? | File path (where to create) | Notes |
|---|---|---|---|
| MultiBrand / ThemeProvider with custom BrandTokens | ❌ No | `apps/storybook/stories/ThemeProvider.stories.tsx` | Introduction.stories.tsx mentions it but no interactive story |
| W3C token override (`--ucl-*` CSS vars) | ❌ No | `apps/storybook/stories/TokenOverrides.stories.tsx` | No story demonstrates CSS variable override |
| Slots usage (className per-slot) | ❌ No | `apps/storybook/stories/SlotPatterns.stories.tsx` | No story shows `classNames` prop on a tv()-slotted component |
| asChild usage (Button asChild + router Link) | ❌ No | `apps/storybook/stories/AsChildPatterns.stories.tsx` | Button.stories.tsx has no `asChild` export |
| ColorPicker | ✅ Exists | `packages/core/src/components/molecules/ColorPicker/ColorPicker.stories.tsx` | Story file exists |
| TreeView | ✅ Exists | `packages/core/src/components/organisms/TreeView/TreeView.stories.tsx` | Story file exists |
| DatePicker | ✅ Exists | `packages/core/src/components/molecules/DatePicker/DatePicker.stories.tsx` | Story file exists |
| ComboBox | ✅ Exists | `packages/core/src/components/molecules/ComboBox/ComboBox.stories.tsx` | Story file exists |
| ThemeProvider (any) | ❌ No | `apps/storybook/stories/ThemeProvider.stories.tsx` | No ThemeProvider story anywhere |

### Story Shapes for Missing Items

#### 1. ThemeProvider + MultiBrand (`apps/storybook/stories/ThemeProvider.stories.tsx`)

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import ThemeProvider from '@ui-construction-library/core/themes/ThemeProvider';
import { Button, Card, Badge } from '@ui-construction-library/core';

// Example custom brand tokens matching BrandTokens interface
const brandTheme = {
  brand: {
    primary: { '500': '#0ea5e9', '600': '#0284c7' },
    secondary: { '500': '#8b5cf6' },
  },
  semantic: {
    '--ucl-primary': 'var(--brand-primary-500)',
    '--ucl-primary-foreground': '#ffffff',
  },
};

const meta: Meta = {
  title: 'Foundations/ThemeProvider',
  tags: ['autodocs'],
};
export default meta;

export const BuiltinLight: StoryObj = { ... };
export const BuiltinDark: StoryObj = { ... };
export const CustomBrand: StoryObj = {
  render: () => (
    <ThemeProvider themes={{ 'aurora': brandTheme }} defaultTheme="aurora">
      <Button>Custom brand button</Button>
      <Badge variant="default">Badge</Badge>
    </ThemeProvider>
  ),
};
export const ThemeSwitcher: StoryObj = { ... }; // interactive switcher
```

#### 2. W3C Token Overrides (`apps/storybook/stories/TokenOverrides.stories.tsx`)

```tsx
// Story title: 'Foundations/Token Overrides'
// Minimum exports:
export const OverridePrimary: StoryObj = {
  render: () => (
    <div style={{ '--ucl-primary': '#f59e0b', '--ucl-primary-foreground': '#000' } as React.CSSProperties}>
      <Button>Amber primary</Button>
    </div>
  ),
};
export const OverrideRadius: StoryObj = {
  render: () => (
    <div style={{ '--ucl-radius': '0px' } as React.CSSProperties}>
      <Button>Square button</Button>
      <Card style={{ padding: 16 }}>Square card</Card>
    </div>
  ),
};
```

#### 3. Slots Usage (`apps/storybook/stories/SlotPatterns.stories.tsx`)

```tsx
// Story title: 'Patterns/Slot Patterns'
// Minimum exports:
export const AlertWithSlotClassNames: StoryObj = {
  render: () => (
    <Alert
      variant="success"
      icon={<CheckIcon />}
      title="Saved!"
      description="Your changes were saved."
      classNames={{
        root: 'border-2 border-green-500',
        icon: 'text-green-600',
        title: 'font-black',
        description: 'italic',
      }}
    />
  ),
};
export const ToastSlots: StoryObj = { ... };
export const KpiCardSlots: StoryObj = { ... };
```

#### 4. asChild Patterns (`apps/storybook/stories/AsChildPatterns.stories.tsx`)

```tsx
// Story title: 'Patterns/asChild'
// Minimum exports:
export const ButtonAsNextLink: StoryObj = {
  render: () => (
    // Simulate Next.js Link with a plain <a> for Storybook
    <Button asChild variant="default">
      <a href="/dashboard">Go to Dashboard</a>
    </Button>
  ),
};
export const BadgeAsRouterLink: StoryObj = {
  render: () => (
    <Badge asChild variant="success">
      <a href="/status">Live</a>
    </Badge>
  ),
};
export const LinkAsChild: StoryObj = {
  // Shows Link asChild after it's implemented
  render: () => (
    <Link asChild variant="default">
      <a href="/about">About page</a>
    </Link>
  ),
};
```

---

## 6. Prioritized Implementation Roadmap

Items are ordered by impact-to-effort ratio. Each item is a discrete task for an implementation agent.

---

### Phase 1 — Critical A11y & Bugs (do first)

**1.1 Fix ComboBox ARIA (MED effort, P1 a11y)**
- File: `packages/core/src/components/molecules/ComboBox/ComboBox.tsx`
- Add `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-autocomplete="list"`, `aria-activedescendant`, `aria-controls` to input
- Change `<ul>` to `role="listbox"`, each option element to `role="option"` with `id` + `aria-selected`
- Add Home/End keyboard handlers
- Tests: `pnpm test --filter @ui-construction-library/core`

**1.2 Fix DatePicker ARIA roles (LOW effort)**
- File: `packages/core/src/components/molecules/DatePicker/DatePicker.tsx`
- Add `role="grid"` to `<table>`, `role="gridcell"` to `<td>`, `aria-selected={isSelected}` to `<td>`, `role="row"` to `<tr>` in `<tbody>`
- Verify: `pnpm test --filter @ui-construction-library/core`

**1.3 Fix ColorPicker labels + controlled state bug (LOW effort)**
- File: `packages/core/src/components/molecules/ColorPicker/ColorPicker.tsx`
- Add `aria-label="Color"` and `aria-label="Hex value"` to the two inputs
- Fix controlled/uncontrolled divergence: add `useEffect(() => setColor(value), [value])`
- Verify: `pnpm test --filter @ui-construction-library/core`

**1.4 Fix TreeView ARIA roles (LOW effort, defer full keyboard nav)**
- File: `packages/core/src/components/organisms/TreeView/TreeView.tsx`
- Add `role="tree"` + `aria-label` to root `<ul>`, `role="group"` to nested `<ul>`, `role="treeitem"` to node buttons, `aria-expanded` to toggle buttons
- Add `selectedId` state and `aria-selected` to node buttons
- Verify: `pnpm test --filter @ui-construction-library/core`

---

### Phase 2 — P1 NEEDS_SLOTS Components (high DX impact)

**2.1 Alert → tv() slots (P1)**
- File: `packages/core/src/components/molecules/Alert/Alert.tsx`
- Apply exact tv() definition from Section 1
- Add `icon`, `title`, `description`, `classNames` props; update render to use slots
- Update test + story: `packages/core/src/components/molecules/Alert/Alert.stories.tsx`
- Verify: `pnpm test --filter @ui-construction-library/core`

**2.2 Toast → tv() slots (P1)**
- File: `packages/core/src/components/molecules/Toast/Toast.tsx`
- Apply exact tv() definition from Section 1
- Add `classNames` prop; update render to use slots
- Update story: `packages/core/src/components/molecules/Toast/Toast.stories.tsx`
- Verify: `pnpm test --filter @ui-construction-library/core`

**2.3 KpiCard → tv() slots (P1)**
- File: `packages/core/src/components/organisms/KpiCard/KpiCard.tsx`
- Apply exact tv() definition from Section 1
- Add `classNames` prop; update render to use slots
- Update story: `packages/core/src/components/organisms/KpiCard/KpiCard.stories.tsx`
- Verify: `pnpm test --filter @ui-construction-library/core`

**2.4 Stepper → tv() slots (P1)**
- File: `packages/core/src/components/molecules/Stepper/Stepper.tsx`
- Apply exact tv() definition from Section 1
- Add `classNames` prop; update render to use slots
- Update story: `packages/core/src/components/molecules/Stepper/Stepper.stories.tsx`
- Verify: `pnpm test --filter @ui-construction-library/core`

**2.5 NotificationItem → tv() slots (P1)**
- File: `packages/core/src/components/molecules/NotificationItem/NotificationItem.tsx`
- Apply exact tv() definition from Section 1
- Add `classNames` prop; update render to use slots
- Verify: `pnpm test --filter @ui-construction-library/core`

**2.6 Sidebar → tv() slots (P1)**
- File: `packages/core/src/components/organisms/Sidebar/Sidebar.tsx`
- Apply exact tv() definition from Section 1
- Add `classNames` prop; update render to use slots
- Update story: `packages/core/src/components/organisms/Sidebar/Sidebar.stories.tsx`
- Verify: `pnpm test --filter @ui-construction-library/core`

---

### Phase 3 — asChild for NEEDS_ASCHILD Components

**3.1 Link → asChild (HIGH consumer demand)**
- File: `packages/core/src/components/atoms/Link/Link.tsx`
- Apply exact code from Section 2
- Verify: `pnpm test --filter @ui-construction-library/core`

**3.2 Tag → asChild**
- File: `packages/core/src/components/atoms/Tag/Tag.tsx`
- Apply exact code from Section 2
- Verify: `pnpm test --filter @ui-construction-library/core`

**3.3 Card → asChild**
- File: `packages/core/src/components/molecules/Card/Card.tsx`
- Apply exact code from Section 2
- Verify: `pnpm test --filter @ui-construction-library/core`

**3.4 Heading + Text → asChild**
- Files: `packages/core/src/components/atoms/Heading/Heading.tsx`, `packages/core/src/components/atoms/Text/Text.tsx`
- Apply asChild pattern (read source first to match existing variant patterns)
- Verify: `pnpm test --filter @ui-construction-library/core`

**3.5 MenuItem → asChild**
- File: `packages/core/src/components/molecules/MenuItem/MenuItem.tsx`
- Apply exact code from Section 2
- Verify: `pnpm test --filter @ui-construction-library/core`

---

### Phase 4 — CLI Improvements

**4.1 Fix version string mismatch**
- Files: `packages/cli/src/index.ts`, `packages/cli/src/commands/index.ts`
- Replace hard-coded `v0.1.0` with dynamic `import { version } from '../../package.json' assert { type: 'json' }` (or build-time injection)
- Verify: `node packages/cli/dist/index.js --version` outputs `0.3.0`

**4.2 Improve `init` with install/setup guidance**
- File: `packages/cli/src/commands/init.ts`
- After writing AI config, print a numbered checklist of next steps:
  1. Install command with detected package manager
  2. Styles import instruction
  3. Theme CSS import instruction
  4. `data-theme` attribute instruction
- Detect package manager via lockfile: `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `package-lock.json` → npm, `bun.lockb` → bun
- Verify: manually run `npx ucl init` in a temp directory

**4.3 Add `tokens` command**
- File: `packages/cli/src/commands/tokens.ts`
- Parse `packages/tokens/src/` CSS for `--ucl-*` variable definitions and print them with descriptions
- Register in `packages/cli/src/commands/index.ts`
- Verify: `node packages/cli/dist/index.js tokens` outputs token list

**4.4 Add `add <ComponentName>` command**
- File: `packages/cli/src/commands/add.ts`
- Reads registry to confirm component exists, then copies the component source file to `--output-dir`
- Register in `packages/cli/src/commands/index.ts`
- Verify: `node packages/cli/dist/index.js add Button --output-dir /tmp/test-out` creates `Button.tsx`

---

### Phase 5 — Storybook Coverage Gaps

**5.1 ThemeProvider + MultiBrand story**
- File: `apps/storybook/stories/ThemeProvider.stories.tsx`
- Minimum exports: `BuiltinLight`, `BuiltinDark`, `CustomBrand` (per shape in Section 5)
- Verify: `pnpm storybook` — "Foundations/ThemeProvider" appears

**5.2 Token Overrides story**
- File: `apps/storybook/stories/TokenOverrides.stories.tsx`
- Minimum exports: `OverridePrimary`, `OverrideRadius`
- Verify: `pnpm storybook` — "Foundations/Token Overrides" appears

**5.3 Slot Patterns story** (depends on Phase 2 completion)
- File: `apps/storybook/stories/SlotPatterns.stories.tsx`
- Minimum exports: `AlertWithSlotClassNames`, `ToastSlots`, `KpiCardSlots`
- Verify: `pnpm storybook` — "Patterns/Slot Patterns" appears

**5.4 asChild Patterns story** (depends on Phase 3 completion)
- File: `apps/storybook/stories/AsChildPatterns.stories.tsx`
- Minimum exports: `ButtonAsNextLink`, `BadgeAsRouterLink`, `LinkAsChild`
- Verify: `pnpm storybook` — "Patterns/asChild" appears

---

### Phase 6 — P2 Slots (remaining NEEDS_SLOTS components)

Apply tv() slots + `classNames` prop to all remaining P2 NEEDS_SLOTS components in this order (each is a single file change + test update):

1. Card — `packages/core/src/components/molecules/Card/Card.tsx`
2. Avatar — `packages/core/src/components/atoms/Avatar/Avatar.tsx`
3. Progress — `packages/core/src/components/atoms/Progress/Progress.tsx`
4. Switch — `packages/core/src/components/atoms/Switch/Switch.tsx`
5. Tag — `packages/core/src/components/atoms/Tag/Tag.tsx`
6. Breadcrumb — `packages/core/src/components/molecules/Breadcrumb/Breadcrumb.tsx`
7. Toast (body/close slots) — already covered in Phase 2
8. Field — `packages/core/src/components/molecules/Field/Field.tsx`
9. PageTip — `packages/core/src/components/molecules/PageTip/PageTip.tsx`
10. CoachMark — `packages/core/src/components/molecules/CoachMark/CoachMark.tsx`
11. EmptyState — `packages/core/src/components/organisms/EmptyState/EmptyState.tsx`
12. TopNav — `packages/core/src/components/organisms/TopNav/TopNav.tsx`
13. AppShell — `packages/core/src/components/organisms/AppShell/AppShell.tsx`
14. Timeline — `packages/core/src/components/organisms/Timeline/Timeline.tsx`
15. PageHeader — `packages/core/src/components/organisms/PageHeader/PageHeader.tsx`

Verify all: `pnpm test --filter @ui-construction-library/core`

---

### Phase 7 — TreeView Full Keyboard Navigation (deferred HIGH effort a11y)

- File: `packages/core/src/components/organisms/TreeView/TreeView.tsx`
- Implement APG Tree View Pattern 3.26 full keyboard support: ArrowRight/Left/Up/Down, Home/End, Enter/Space
- Requires: flattening the visible tree nodes into an array, ref map keyed by node id, roving tabindex
- Verify: `pnpm test --filter @ui-construction-library/core` + axe-core test

---

### Summary of Effort

| Phase | Items | Effort | Impact |
|---|---|---|---|
| 1 — Critical A11y | 4 | LOW–MED | P1 a11y compliance |
| 2 — P1 Slots | 6 | MED | High DX improvement for daily-use components |
| 3 — asChild | 5 | LOW | Unlocks router-link composition patterns |
| 4 — CLI | 4 | LOW–MED | Complete onboarding experience |
| 5 — Storybook | 4 | LOW | Documentation completeness |
| 6 — P2 Slots | 15 | MED | Full tv() slot coverage across library |
| 7 — TreeView KB Nav | 1 | HIGH | Full APG keyboard compliance for tree |

**Total estimated implementation sessions:** ~8–12 focused coding sessions.
