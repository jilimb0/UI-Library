## 0.1.1

### Patch Changes

- 3332676: fix: disable CSS minification to prevent selector nesting corruption
- standardize component API surface across atoms and molecules:
  - align `size` usage toward `sm | default | lg` with backward-compatible aliases where needed
  - add value-callback consistency via `onValueChange` aliases for value-driven controls
  - add missing `className`/`style` support on several interactive components
- harden quality gates:
  - enforce coverage configuration across core/primitives/dnd/motion
  - add strict bundle budget checks and wire them into validation and release preflight
  - strengthen dependency boundary checks for layered package direction
- add Storybook interaction coverage for Dropdown behavior

# Changelog

## [1.0.0] - 2025-09-15

- Initial release: Enterprise React UI Component Library
- Fully implemented 23 components with full TS typings
- Added theming, utilities, hooks, animations, and styles
- Comprehensive test coverage and Storybook documentation
