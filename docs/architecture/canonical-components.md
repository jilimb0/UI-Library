# Canonical Component List

This document defines the 10 canonical components that represent the core consumer experience of `@ui-construction-library`. These components should always have complete state coverage, documentation, and token-aware implementations.

## Layout

| # | Component | Package | Tier | Description |
|---|-----------|---------|------|-------------|
| 1 | `AppShell` | core/organisms | Organism | Top-level application layout: sidebar, topNav, main, footer regions. |
| 2 | `TopNav` | core/organisms | Organism | Navigation bar with brand, links, and actions slot. |
| 3 | `PageHeader` | core/organisms | Organism | Page heading with breadcrumbs, subtitle, and actions. |

## Forms

| # | Component | Package | Tier | Description |
|---|-----------|---------|------|-------------|
| 4 | `Input` | core/atoms | Atom | Single-line text field with label, description, error state. |
| 5 | `Select` | core/atoms | Atom | Dropdown selection with label, description, error state. |
| 6 | `Switch` | core/atoms | Atom | Toggle control with label, description, checked/unchecked states. |

## Data Display

| # | Component | Package | Tier | Description |
|---|-----------|---------|------|-------------|
| 7 | `DataTable` | core/organisms | Organism | Typed data grid with sorting, pagination, empty state. |
| 8 | `Badge` | core/atoms | Atom | Compact status label with intent variants. |

## Feedback

| # | Component | Package | Tier | Description |
|---|-----------|---------|------|-------------|
| 9 | `Card` | core/molecules | Molecule | Grouped content surface with elevation and interactive states. |
| 10 | `Skeleton` | core/atoms | Atom | Placeholder block for loading states. |

## State Coverage Requirements

Each canonical component must cover these states:

| State | Description |
|-------|-------------|
| `default` | Initial render state |
| `hover` | Mouse hover |
| `active` | Mouse down / pressed |
| `focus` | Keyboard focus |
| `disabled` | Non-interactive |
| `error` | Validation or runtime error |
| `loading` | Pending async operation |
| `empty` | No data available |

## Styling Hook Convention

All canonical components expose `data-*` attributes for CSS targeting:

- `data-variant` — current variant (e.g., `primary`, `error`)
- `data-size` — current size (e.g., `sm`, `default`, `lg`)
- `data-error` — present when in error state
- `data-loading` — present when loading
- `data-disabled` — present when disabled
- `data-elevation` — Card-specific: `flat`, `raised`, `overlay`
- `data-interactive` — Card-specific: present when clickable
- `data-state` — Switch/Checkbox: `checked` or `unchecked`
