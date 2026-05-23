# Manual Keyboard Audit

Date: 2026-05-23  
Scope: Contracted components (W3-W4)  
Environment: macOS + Chromium (Playwright local run) + component-level keyboard tests

## Legend

- ✅ Passed
- ⚠️ Partial
- ❌ Failed
- ⏳ Pending manual verification

## Checklist

| Component | Open/Close | Arrow Navigation | Enter/Space Select | Escape Close | Focus Return | Notes | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dropdown | ✅ | ✅ | ✅ | ✅ | ✅ | Automated coverage present; manual smoke aligned | ✅ |
| ContextMenu | ✅ | ✅ | ✅ | ✅ | ✅ | Verified with component tests and local interaction checks | ✅ |
| DatePicker | ✅ | ✅ | ✅ | N/A | ✅ | Verified keyboard selection and month transitions | ✅ |
| Tooltip | ✅ | N/A | N/A | N/A | ✅ | Trigger/focus semantics validated | ✅ |
| Popover | ✅ | ✅ | ✅ | ✅ | ✅ | Verified close behavior and controlled/uncontrolled open state | ✅ |
| Toast | N/A | N/A | N/A | N/A | N/A | Live region + non-blocking behavior covered | ✅ |
| Kanban | ✅ | ✅ | ✅ | N/A | ✅ | Verified keyboard move/reorder and live region announcements | ✅ |

## Evidence

1. Component tests:
   - `ContextMenu.test.tsx`
   - `Kanban.test.tsx`
   - `Dropdown.test.tsx` + `Dropdown.keyboard.test.tsx`
   - `DatePicker.test.tsx`
   - `Popover.test.tsx`
2. E2E keyboard smoke:
   - `tests/e2e/keyboard-contracts.spec.ts`
3. Global gate:
   - `pnpm validate` passes with contracts enabled.

## Follow-up actions

1. Expand browser matrix in CI from Chromium-only to include WebKit and Firefox.
2. Add nested-layout keyboard stress tests for popover/context overlays.
3. Re-run manual audit before W9-W10 reliability freeze.
