# @ui-construction-library/behaviors

## 0.7.0

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

## 0.5.0

### Minor Changes

- 933635a: Add `success`/`warning`/`info` button variants (CSS + behavior mapping +
  types), `info` badge/alert variants, and table modifiers
  (`.table--striped`, `.table--compact`, `.table-sticky-header`). Also widens
  core `ButtonVariant` with the previously missing `outline`/`link` members to
  match CSS and behaviors.

## 0.4.1

### Patch Changes

- b25e0df: feat: add ToastProvider/useToast, KpiCard/KpiGrid, Stack/Cluster layout, ErrorBoundary, FloatingLabelInput, CoachMark, PageTip, brand icons (Bitbucket, Radar, Integrations); fix body scroll lock, aria-hidden on overlays, missing PageHeader/TopNav CSS, template bugs, focus trap re-focus, CommandPalette keyboard nav, Drawer sub-components, Toast animations and tests; add template tests and stories; export subpath entries for new components

## 0.4.0

### Minor Changes

- 8d83152: chore: V1 readiness — test hardening, Storybook coverage, bundle budgets, security

## 0.3.0

### Minor Changes

- e0c5394: feat: 10/10 business readiness — real SECURITY.md with PGP key and disclosure SLA, full CODE_OF_CONDUCT.md with enforcement, dependency review + SBOM in CI, signed commits policy, browser compatibility matrix, cross-browser E2E (chromium + firefox + webkit), .browserslistrc, error boundary docs, v1.0 release checklist, DataTable load tests, per-package npm READMEs (behaviors, i18n, next, tanstack-query, tanstack-router), root README badges, create-ucl-app CLI, GOVERNANCE.md, SUPPORT.md, public ROADMAP.md, expanded Component API docs (64 components), English utilities API, mutation testing (Stryker), post-publish smoke dashboard

## 0.2.0

### Minor Changes

- 2285993: Improvement product readiness

## 0.2.0

### Minor Changes

- 8e364a3: Upgrade product readiness
