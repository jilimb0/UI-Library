# Gold Integration Kits

This document defines production-ready integration kits and their validation targets.

## Kit 1: Next.js (App Router)

- Package: `@ui-construction-library/integration-next`
- Goal: SSR-safe composition and navigation wrappers.
- Required examples:
  - `app/providers.tsx` with `ThemeProvider`
  - `app/layout.tsx` integration
  - basic page composition

## Kit 2: React Hook Form

- Package: `@ui-construction-library/react-hook-form`
- Goal: typed form bindings and validation-safe UI wiring.
- Required examples:
  - schema-driven form
  - field-level error rendering
  - submit flow with disabled state

## Kit 3: TanStack Data Flow

- Packages:
  - `@ui-construction-library/integration-tanstack-query`
  - `@ui-construction-library/integration-tanstack-router`
- Goal: route + server-state pattern for data-heavy screens.
- Required examples:
  - query-backed table screen
  - router-bound navigation handoff

## Validation Contract

Kits are considered `gold` only when:

1. Typecheck is green for integration packages.
2. Docs include copy-ready examples.
3. CI validates kit documentation presence.
