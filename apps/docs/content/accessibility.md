# Accessibility

The library follows a contract-first accessibility model:

- WCAG 2.1 AA baseline for interactive components
- Explicit ARIA semantics for composite widgets
- Keyboard and focus behavior covered by automated tests

## Contracted Components (W1-W4)

| Component | Keyboard | Focus Management | ARIA Semantics | A11y Tests |
| --- | --- | --- | --- | --- |
| Dropdown | ✅ Arrow/Home/End/Escape/Enter/Space/Tab | ✅ Returns focus to trigger on close | ✅ `menu` / `menuitem` / disabled semantics | ✅ |
| ContextMenu | ✅ Context open + item selection behavior | ✅ Focus lands on first enabled item | ✅ `menu` / `menuitem` + disabled semantics | ✅ |
| DatePicker | ✅ Arrow grid navigation + Enter/Space select | ✅ Grid cell focus movement across month changes | ✅ Calendar labeling + disabled day semantics | ✅ |
| Tooltip | ✅ Trigger-based discoverability | ✅ Non-modal, no focus trap | ✅ `role="tooltip"` + `aria-describedby` | ✅ |
| Popover | ✅ Trigger open/close behavior | ✅ Overlay close returns control flow | ✅ Overlay semantics via primitive contracts | ✅ |
| Toast | ✅ Non-blocking interaction model | ✅ No focus stealing | ✅ Live region behavior for announcements | ✅ |
| Kanban | ✅ Keyboard move/reorder with arrows | ✅ Card focus retained during reorder/move | ✅ Live announcements for move operations | ✅ |

## CI Enforcement

- Pull requests run accessibility assertions in component test suites.
- Regressions fail the main validation pipeline (`pnpm validate`).
- Contract updates must include tests and docs updates in the same change.
