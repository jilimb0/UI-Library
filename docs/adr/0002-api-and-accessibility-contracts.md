# ADR-0002: API and Accessibility Contracts for Public Components

**Status:** Accepted  
**Date:** 2026-05-23  
**Owners:** `@ui-construction-library/core`, `@ui-construction-library/primitives`

## Context

The library has grown quickly across atoms, molecules, and organisms. While behavior is already strong, long-term scale requires strict contracts for:

- public API consistency (`size`, `variant`, controlled/uncontrolled props),
- polymorphism (`as` or equivalent render override),
- accessibility behavior (roles, labels, keyboard, focus, disabled states),
- and release safety (tests and CI gates).

Without shared contracts, feature work risks divergence and regressions across components.

## Decision

1. **API Contract Baseline**
- Shared size scale: `sm | default | lg` for interactive controls unless explicitly documented.
- Shared visual conventions for `variant` and state props (`disabled`, `loading`, `error`).
- Shared controlled/uncontrolled patterns: `value` + `onValueChange`, `defaultValue`.
- Shared extension props: `className`, `style`, and polymorphic render support where meaningful.

2. **Accessibility Contract Baseline**
- Components follow WAI-ARIA authoring patterns relevant to their role.
- Keyboard support is mandatory for all complex components.
- Focus order and escape routes are mandatory for overlays and composite widgets.
- Labeling contract is mandatory (`aria-label`, `aria-labelledby`, `aria-describedby`) based on component semantics.

3. **Contracted Components (Phase 1)**
- `Dropdown`, `ContextMenu`, `DatePicker`, `Tooltip`, `Popover`, `Toast`, `Kanban`, `Dialog`-class overlays.

4. **Quality Gates**
- CI must block merges when contract tests fail.
- Every contracted component requires:
  - behavior tests,
  - accessibility tests,
  - interaction stories,
  - and docs examples.

## Consequences

### Positive
- Predictable API for consumers across packages.
- Lower regression risk in future refactors.
- Stronger enterprise confidence for adoption.

### Negative
- Slightly slower feature velocity while contract tests are expanded.
- Migration overhead for legacy edge-case props.

### Follow-ups
- Publish component-by-component checklist in docs.
- Add codemods for any future contract-driven prop renames.
- Include contract compliance summary in release notes.

## References

- `/Users/jilimbo/Documents/PersonalProjects/UI-Library/task.md`
- `/Users/jilimbo/Documents/PersonalProjects/UI-Library/packages/core`
- `/Users/jilimbo/Documents/PersonalProjects/UI-Library/packages/primitives`
