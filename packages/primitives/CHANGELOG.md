# @ui-construction-library/primitives

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.6.0

### Minor Changes

- ### Design System & Component Library Minor Release (Mono Luxe)
  
  - **core**:
    - Add `asChild` composition pattern via internal `Slot` utility on atoms & molecules: `Button`, `Badge`, `Link`, `Tag`, `Heading`, `Text`, `Card`, `MenuItem`.
    - Add `classNames` slots prop to customize internal parts on `Checkbox`, `Switch`, `TextArea`, `Toast`, `Input`, `Alert`.
    - Full W3C ARIA APG compliance and roving tabindex keyboard navigation on `TreeView` (`role="tree"`, `role="treeitem"`, `role="group"`, `defaultExpanded`, Arrow keys, Home/End, Enter/Space) and `DatePicker` (`role="grid"`, `role="gridcell"`, `aria-selected`).
    - Overhaul `ComboBox` for APG 3.8 compliance (`role="combobox"`, `role="listbox"`, `role="option"`, `aria-activedescendant`, Home/End/Escape keys).
    - Migrate component variants engine to `tailwind-variants` (`tv()`).
    - Introduce `ThemeProvider` supporting custom `BrandTokens` and runtime dynamic theme switching.
  
  - **tokens**:
    - Full W3C Design Tokens source (`tokens.w3c.json`) with multi-brand generator and runtime CSS generator (`generateThemeCSS`).
    - Tailwind v4 `@theme` integration bridge mapping utilities to `--ucl-*` CSS custom properties.
    - Add Style Dictionary export configuration (`style-dictionary.config.mjs`) for cross-platform tokens.
  
  - **behaviors** & **primitives**:
    - W3C APG keyboard navigation and ARIA callbacks wired across Tabs, Accordion, Menu, and ContextMenu.
  
  - **cli**:
    - Add `tokens` command with `--filter` flag and ThemeProvider / W3C token override guide.
    - Update `init` AI guidance for Mono Luxe tokens and slot conventions.

### Patch Changes

- Updated dependencies
  - @ui-construction-library/behaviors@0.7.0

## 0.5.0

### Features

- minor version bump — new components, overlay fixes, docs ([b25e0df](../../commit/b25e0df))
- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))
- add clean script and enhance slider component with new props and functionality ([656cfdf](../../commit/656cfdf))
- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))

### Bug Fixes

- update tsconfig files to ignore deprecations and adjust package.json types paths ([b9ae216](../../commit/b9ae216))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- version packages (#34) ([04c20e3](../../commit/04c20e3))
- version packages (#29) ([0d85b8a](../../commit/0d85b8a))
- update node engine to >=26, add .nvmrc ([c6dc0fa](../../commit/c6dc0fa))
- version packages ([aea9238](../../commit/aea9238))
- revert all package versions to match npm published versions ([b5e1a9a](../../commit/b5e1a9a))
- version packages ([c955512](../../commit/c955512))
- V1 release preparation — full product readiness ([1fa252e](../../commit/1fa252e))
- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages (#24) ([0e88c47](../../commit/0e88c47))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))

### Other

- Revert "chore: version packages" ([bb5e9e3](../../commit/bb5e9e3))
- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.2 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/primitives

## 0.4.2

### Patch Changes

- Updated dependencies [933635a]
  - @ui-construction-library/behaviors@0.5.0

## 0.4.1

### Patch Changes

- b25e0df: feat: add ToastProvider/useToast, KpiCard/KpiGrid, Stack/Cluster layout, ErrorBoundary, FloatingLabelInput, CoachMark, PageTip, brand icons (Bitbucket, Radar, Integrations); fix body scroll lock, aria-hidden on overlays, missing PageHeader/TopNav CSS, template bugs, focus trap re-focus, CommandPalette keyboard nav, Drawer sub-components, Toast animations and tests; add template tests and stories; export subpath entries for new components
- Updated dependencies [b25e0df]
  - @ui-construction-library/behaviors@0.4.1

## 0.4.0

### Minor Changes

- 8d83152: chore: V1 readiness — test hardening, Storybook coverage, bundle budgets, security

### Patch Changes

- Updated dependencies [8d83152]
  - @ui-construction-library/behaviors@0.4.0

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.4.0

### Features

- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))
- add clean script and enhance slider component with new props and functionality ([656cfdf](../../commit/656cfdf))
- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))

### Bug Fixes

- update tsconfig files to ignore deprecations and adjust package.json types paths ([b9ae216](../../commit/b9ae216))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages (#24) ([0e88c47](../../commit/0e88c47))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))

### Other

- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.2 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/primitives

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.3.0

### Features

- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))
- add clean script and enhance slider component with new props and functionality ([656cfdf](../../commit/656cfdf))
- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))

### Bug Fixes

- update tsconfig files to ignore deprecations and adjust package.json types paths ([b9ae216](../../commit/b9ae216))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages (#24) ([0e88c47](../../commit/0e88c47))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))

### Other

- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.2 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/primitives

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.3.0

### Features

- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))
- add clean script and enhance slider component with new props and functionality ([656cfdf](../../commit/656cfdf))
- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))

### Bug Fixes

- update tsconfig files to ignore deprecations and adjust package.json types paths ([b9ae216](../../commit/b9ae216))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages (#24) ([0e88c47](../../commit/0e88c47))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))

### Other

- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.2 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/primitives

## 0.2.0

### Minor Changes

- 2285993: Improvement product readiness

### Patch Changes

- Updated dependencies [2285993]
  - @ui-construction-library/behaviors@0.2.0

## 0.1.3

### Patch Changes

- 656cfdf: Improvements

## 0.2.0

### Minor Changes

- 8e364a3: Upgrade product readiness

### Patch Changes

- Updated dependencies [8e364a3]
  - @ui-construction-library/behaviors@0.2.0

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/primitives

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/primitives

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2 — 2026-05-30

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/primitives

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.2

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))

---

# @ui-construction-library/primitives

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.1

### Features

- **builder:** add section review workflow with UI and state management ([113cdda](../../commit/113cdda))
- **tabs:** add interaction story for tab switching in Storybook ([68f7cbf](../../commit/68f7cbf))
- add scripts for assembling pages, checking API snapshots, and enforcing dependency policies ([e311e81](../../commit/e311e81))

### Other

- Add end-to-end tests for builder repository lifecycle, versioning, and visual regression ([cdea6ad](../../commit/cdea6ad))
