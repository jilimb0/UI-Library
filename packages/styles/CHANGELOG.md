# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.8.0

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

## 0.7.0

### Features

- minor release v0.6.0 ([501d00c](../../commit/501d00c))
- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))

### Bug Fixes

- add registry type declarations for CLI build ([93fbe68](../../commit/93fbe68))
- refactor densityClassMap to use const assertion and update DensityPreset type ([25b877d](../../commit/25b877d))
- **packages:** add repository field to schema, styles, registry ([8a4c567](../../commit/8a4c567))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))

### Chores

- version packages (#34) ([04c20e3](../../commit/04c20e3))
- update node engine to >=26, add .nvmrc ([c6dc0fa](../../commit/c6dc0fa))
- version packages ([aea9238](../../commit/aea9238))
- revert all package versions to match npm published versions ([b5e1a9a](../../commit/b5e1a9a))
- version packages ([c955512](../../commit/c955512))
- V1 release preparation — full product readiness ([1fa252e](../../commit/1fa252e))
- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages (#24) ([0e88c47](../../commit/0e88c47))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update package versions and changelogs for icons and styles packages ([6f7f3d9](../../commit/6f7f3d9))

### Other

- Feat/UI utilities variants (#33) ([933635a](../../commit/933635a))
- Revert "chore: version packages" ([bb5e9e3](../../commit/bb5e9e3))
- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.1 — 2026-06-02

### Features

- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))
- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Bug Fixes

- update package.json and rollup.config.js to use .cjs extension for CommonJS output ([2f14c2e](../../commit/2f14c2e))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))
- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

## 0.6.0

### Minor Changes

- 933635a: Add layout utilities (`.ucl-cluster--between`, `.ucl-sticky-top`,
  `.ucl-w-full`) and `.ucl-text-info` for feature parity with the rest of the
  text-color scale. No breaking changes.

## 0.5.0

### Minor Changes

- feat: add suffix prop to Input, themes package, CLI, cascade layers, and example apps

  - **Input**: new `suffix` prop for rendering content inside the input field (e.g., password visibility toggle)
  - **Themes**: new `@ui-construction-library/themes` package with dark/light/neutral themes
  - **CLI**: new `@ui-construction-library/cli` with init, component, docs, and theme commands
  - **Styles**: cascade layer support (`@layer uicl-reset, uicl-base, uicl-components`)
  - **Core**: subpath exports for all components (`./Button`, `./Card`, etc.)
  - **Example apps**: Next.js 15 App Router and Tailwind CSS 4 examples
  - **Showcase**: theme switcher integration

## 0.4.0

### Minor Changes

- 8d83152: chore: V1 readiness — test hardening, Storybook coverage, bundle budgets, security

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.4.0

### Features

- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))

### Bug Fixes

- refactor densityClassMap to use const assertion and update DensityPreset type ([25b877d](../../commit/25b877d))
- **packages:** add repository field to schema, styles, registry ([8a4c567](../../commit/8a4c567))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))

### Chores

- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages (#24) ([0e88c47](../../commit/0e88c47))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update package versions and changelogs for icons and styles packages ([6f7f3d9](../../commit/6f7f3d9))

### Other

- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.1 — 2026-06-02

### Features

- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))
- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Bug Fixes

- update package.json and rollup.config.js to use .cjs extension for CommonJS output ([2f14c2e](../../commit/2f14c2e))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))
- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.3.0

### Features

- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))

### Bug Fixes

- refactor densityClassMap to use const assertion and update DensityPreset type ([25b877d](../../commit/25b877d))
- **packages:** add repository field to schema, styles, registry ([8a4c567](../../commit/8a4c567))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))

### Chores

- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages (#24) ([0e88c47](../../commit/0e88c47))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update package versions and changelogs for icons and styles packages ([6f7f3d9](../../commit/6f7f3d9))

### Other

- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.1 — 2026-06-02

### Features

- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))
- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Bug Fixes

- update package.json and rollup.config.js to use .cjs extension for CommonJS output ([2f14c2e](../../commit/2f14c2e))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))
- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.3.0

### Features

- add scripts for assembling and serving pages site ([2285993](../../commit/2285993))

### Bug Fixes

- refactor densityClassMap to use const assertion and update DensityPreset type ([25b877d](../../commit/25b877d))
- **packages:** add repository field to schema, styles, registry ([8a4c567](../../commit/8a4c567))
- update CI and release workflows, enhance published version checks, and synchronize package versions ([8f523bf](../../commit/8f523bf))

### Chores

- version packages (#25) ([ca1e0be](../../commit/ca1e0be))
- version packages (#24) ([0e88c47](../../commit/0e88c47))
- version packages ([6c3a3c6](../../commit/6c3a3c6))
- update package versions and changelogs for icons and styles packages ([6f7f3d9](../../commit/6f7f3d9))

### Other

- Add public internal surface guardrails (#21) ([8e364a3](../../commit/8e364a3))

## 0.1.1 — 2026-06-02

### Features

- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))
- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Bug Fixes

- update package.json and rollup.config.js to use .cjs extension for CommonJS output ([2f14c2e](../../commit/2f14c2e))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))
- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

## 0.2.0

### Minor Changes

- 2285993: Improvement product readiness

## 0.2.0

### Minor Changes

- 8e364a3: Upgrade product readiness

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.1

### Features

- add build artifacts and restructure package exports ([60aff9d](../../commit/60aff9d))
- enhance workspace with hygiene checks and script validation ([49f16b2](../../commit/49f16b2))
- add scripts for checking published code and generating changelogs ([2bd5166](../../commit/2bd5166))

### Bug Fixes

- update package.json and rollup.config.js to use .cjs extension for CommonJS output ([2f14c2e](../../commit/2f14c2e))

### Refactoring

- reorganize package architecture and consolidate documentation ([4b17086](../../commit/4b17086))

### Chores

- update changelogs and dependencies across packages ([b989aeb](../../commit/b989aeb))
- update changelogs across all packages with recent release notes ([d1f72fa](../../commit/d1f72fa))
- consolidate release documentation and update changelogs ([df9320c](../../commit/df9320c))

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))

---

# @ui-construction-library/styles

<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->

## 0.1.0 — 2026-05-30

### Features

- enhance testing setup and coverage ([f37b8eb](../../commit/f37b8eb))
- **schema, registry, styles:** add schema package with JSON schemas and validation helpers ([262a914](../../commit/262a914))
