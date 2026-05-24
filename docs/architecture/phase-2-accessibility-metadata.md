# Phase 2 — Accessibility Metadata Completeness

## Goal

Ensure every registry component exposes enough accessibility metadata to drive builder guidance, export defaults, and future prompt safety checks.

## Required metadata

Each registry component should provide:

- semantic role expectations;
- required ARIA attributes when applicable;
- keyboard interaction notes;
- focus behavior notes;
- screen reader notes;
- invalid combinations or misuse cases;
- localization notes when accessibility strings require translation or culturally aware phrasing.

## Completeness rules

- Interactive components must include keyboard interaction guidance.
- Components with icon-only or non-text affordances must document accessible naming expectations.
- Overlay components must document focus management and dismissal behavior.
- Components with state must describe how state is announced or perceived by assistive technology.
- Decorative-only patterns must document when accessibility attributes should be omitted rather than forced.
