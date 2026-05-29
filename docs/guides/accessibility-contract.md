# Accessibility Contract Checklist

This document tracks the accessibility contract for every interactive component in `@ui-construction-library/core` and `@ui-construction-library/primitives`. Each component is audited against WCAG 2.1 AA criteria and the ARIA Authoring Practices Guide (APG).

> Full validation requires manual testing with assistive technologies (VoiceOver, NVDA, JAWS) and expert accessibility review. This checklist covers the programmatic contract — correct roles, keyboard behaviour, and focus management — which can be verified in code and automated tests.

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Implemented and tested |
| ⚠️ | Partially implemented — known gap noted |
| ❌ | Not yet implemented |
| N/A | Not applicable for this component |

---

## Atoms

### Button
| Criterion | Status | Notes |
|---|---|---|
| `role="button"` or native `<button>` | ✅ | Uses native `<button>` |
| Keyboard: Enter and Space activate | ✅ | Native behaviour |
| `disabled` prevents interaction | ✅ | `aria-disabled` set for non-button elements |
| `aria-busy` during loading | ✅ | Set when `loading={true}` |
| Visible focus indicator | ✅ | Via CSS `:focus-visible` |

### Input
| Criterion | Status | Notes |
|---|---|---|
| Associated `<label>` | ✅ | `label` prop renders `<label>` with `htmlFor` |
| `aria-describedby` for description/error | ✅ | Wired to description text |
| `aria-invalid` on error state | ✅ | Set when `error={true}` |
| Visible focus indicator | ✅ | |

### Checkbox
| Criterion | Status | Notes |
|---|---|---|
| Native `<input type="checkbox">` | ✅ | |
| Associated label | ✅ | |
| `aria-checked` for indeterminate | ✅ | |

### Select
| Criterion | Status | Notes |
|---|---|---|
| Native `<select>` | ✅ | Full keyboard support from browser |
| Associated label | ✅ | |
| `aria-invalid` on error | ✅ | |

### Switch (atom)
| Criterion | Status | Notes |
|---|---|---|
| `role="switch"` | ✅ | |
| `aria-checked` reflects state | ✅ | |
| Keyboard: Space toggles | ✅ | |

### TextArea
| Criterion | Status | Notes |
|---|---|---|
| Associated label | ✅ | |
| `aria-describedby` for description | ✅ | |
| `aria-invalid` on error | ✅ | |

---

## Molecules

### Dropdown
| Criterion | Status | Notes |
|---|---|---|
| Trigger: `aria-haspopup="listbox"` | ✅ | |
| Trigger: `aria-expanded` reflects state | ✅ | |
| Trigger: `aria-controls` points to menu | ✅ | |
| Menu: `role="menu"` | ✅ | |
| Items: `role="menuitem"` | ✅ | |
| Keyboard: Arrow keys navigate items | ✅ | Up/Down/Home/End |
| Keyboard: Escape closes | ✅ | |
| Keyboard: Tab closes and moves focus | ✅ | |
| Focus returns to trigger on close | ✅ | |
| Disabled items: `aria-disabled` | ✅ | |

### Popover
| Criterion | Status | Notes |
|---|---|---|
| Trigger: `aria-haspopup="dialog"` | ✅ | |
| Content: `role="dialog"` | ✅ | |
| `aria-modal` when `modal={true}` | ✅ | |
| Focus trap when `modal={true}` | ✅ | Via `trapFocus` from primitives |
| Keyboard: Escape closes | ✅ | |
| Click outside closes | ✅ | |

### Tooltip
| Criterion | Status | Notes |
|---|---|---|
| `role="tooltip"` on bubble | ⚠️ | CSS-only implementation — no ARIA wiring yet |
| Trigger: `aria-describedby` | ⚠️ | Not yet wired |
| Keyboard: focus shows tooltip | ⚠️ | CSS `:focus` shows it but no ARIA |

### Slider
| Criterion | Status | Notes |
|---|---|---|
| `role="slider"` | ✅ | |
| `aria-valuenow`, `aria-valuemin`, `aria-valuemax` | ✅ | |
| `aria-valuetext` for formatted value | ✅ | |
| Keyboard: Arrow keys adjust value | ✅ | |
| Keyboard: Home/End jump to min/max | ✅ | |

### ComboBox
| Criterion | Status | Notes |
|---|---|---|
| `role="combobox"` on input | ✅ | |
| `aria-expanded` reflects state | ✅ | |
| `aria-autocomplete="list"` | ✅ | |
| `aria-controls` points to listbox | ✅ | |
| Listbox: `role="listbox"` | ✅ | |
| Options: `role="option"` | ✅ | |
| `aria-selected` on active option | ✅ | |
| Keyboard: Arrow keys navigate | ✅ | |
| Keyboard: Escape closes | ✅ | |

---

## Organisms

### Modal
| Criterion | Status | Notes |
|---|---|---|
| `role="dialog"` | ✅ | Via `Dialog.Content` primitive |
| `aria-modal="true"` | ✅ | |
| `aria-labelledby` points to title | ✅ | Via `Dialog.Title` with `useId` |
| `aria-describedby` points to description | ✅ | Via `Dialog.Description` |
| Focus trap active while open | ✅ | `trapFocus` in `Dialog.Content` |
| Focus returns to trigger on close | ✅ | Via `Dialog.Trigger` ref |
| Keyboard: Escape closes | ✅ | |
| Backdrop click closes | ✅ | Via `Dialog.Overlay` |

### Drawer
| Criterion | Status | Notes |
|---|---|---|
| `role="dialog"` | ✅ | Inherits from `Dialog.Content` |
| `aria-modal="true"` | ✅ | |
| `aria-labelledby` | ✅ | |
| Focus trap | ✅ | |
| Keyboard: Escape closes | ✅ | |

### CommandPalette
| Criterion | Status | Notes |
|---|---|---|
| Input: `role="combobox"` | ✅ | |
| Input: `aria-expanded` | ✅ | |
| Input: `aria-controls` points to listbox | ✅ | |
| Listbox: `role="listbox"` | ✅ | |
| Items: `role="option"` | ✅ | |
| `aria-selected` on active item | ✅ | |
| Focus trap (inherits from Dialog) | ✅ | |
| Keyboard: Arrow keys navigate | ✅ | |
| Keyboard: Enter selects | ✅ | |
| Keyboard: Escape closes | ✅ | |
| Input focused on open | ✅ | `requestAnimationFrame` focus |

### Accordion
| Criterion | Status | Notes |
|---|---|---|
| Trigger: `role="button"` | ✅ | |
| Trigger: `aria-expanded` | ✅ | |
| Trigger: `aria-controls` points to panel | ✅ | |
| Panel: `role="region"` | ✅ | |
| Panel: `aria-labelledby` points to trigger | ✅ | |
| Keyboard: Enter/Space toggle | ✅ | |

### Tabs
| Criterion | Status | Notes |
|---|---|---|
| Tab list: `role="tablist"` | ✅ | |
| Tabs: `role="tab"` | ✅ | |
| `aria-selected` on active tab | ✅ | |
| `aria-controls` points to panel | ✅ | |
| Panels: `role="tabpanel"` | ✅ | |
| `aria-labelledby` points to tab | ✅ | |
| Keyboard: Arrow keys navigate tabs | ✅ | |
| Keyboard: Home/End jump to first/last | ✅ | |

### ContextMenu
| Criterion | Status | Notes |
|---|---|---|
| Menu: `role="menu"` | ✅ | |
| Items: `role="menuitem"` | ✅ | |
| First item focused on open | ✅ | Via `setTimeout` focus |
| Keyboard: Arrow keys navigate | ✅ | |
| Keyboard: Escape closes | ✅ | |
| Keyboard: Enter/Space activates item | ✅ | |

### DataTable
| Criterion | Status | Notes |
|---|---|---|
| `<table>` with `<thead>` / `<tbody>` | ✅ | |
| Sortable columns: `aria-sort` | ⚠️ | Sort direction shown visually (▲▼) but `aria-sort` not set on `<th>` |
| Empty state announced | ✅ | `EmptyState` component renders visible text |

---

## Known gaps (priority order)

1. **Tooltip** — needs `role="tooltip"`, trigger `aria-describedby`, and keyboard show/hide. Medium priority.
2. **DataTable sortable columns** — `aria-sort="ascending"` / `aria-sort="descending"` missing on `<th>`. Low effort fix.
3. **DatePicker** — calendar grid needs `role="grid"`, day cells need `role="gridcell"`, and keyboard navigation (arrow keys between days) is not yet implemented. High priority for form-heavy surfaces.
4. **ColorPicker** — no ARIA contract defined yet. Needs `role="group"` with `aria-label` and keyboard-accessible swatch selection.
5. **FileUpload** — drop zone needs `role="button"` or `role="region"` with `aria-label` and keyboard activation.

---

## Testing approach

Automated checks run in CI via `axe-playwright` on the Storybook surface. Manual checks use:
- **macOS VoiceOver** with Safari for primary screen reader testing
- **NVDA + Chrome** for Windows coverage
- **Keyboard-only navigation** verified in Chrome and Firefox

To run the automated a11y audit locally:
```bash
pnpm check:e2e
```
