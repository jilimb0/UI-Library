# @ui-construction-library/cli

## 0.4.0

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

## 0.2.0

### Minor Changes

- feat: add suffix prop to Input, themes package, CLI, cascade layers, and example apps

  - **Input**: new `suffix` prop for rendering content inside the input field (e.g., password visibility toggle)
  - **Themes**: new `@ui-construction-library/themes` package with dark/light/neutral themes
  - **CLI**: new `@ui-construction-library/cli` with init, component, docs, and theme commands
  - **Styles**: cascade layer support (`@layer uicl-reset, uicl-base, uicl-components`)
  - **Core**: subpath exports for all components (`./Button`, `./Card`, etc.)
  - **Example apps**: Next.js 15 App Router and Tailwind CSS 4 examples
  - **Showcase**: theme switcher integration

### Patch Changes

- Updated dependencies
  - @ui-construction-library/themes@0.2.0
  - @ui-construction-library/registry@0.3.1
