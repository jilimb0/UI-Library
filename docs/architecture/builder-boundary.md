# Builder Boundary

## Purpose

`apps/builder` is the active product shell for prompt, edit, version, publish, and collaboration flows. This document defines the intended boundary so the app shell stays thin and future refactors remain incremental.

## Intended Layering

1. **App shell**
   - route resolution
   - top-level composition
   - provider wiring
   - screen selection

2. **Domain helpers**
   - prompt generation state
   - section review state
   - version-link metadata
   - validation summaries
   - builder-mode transitions

3. **Persistence / repository adapters**
   - local and remote data access
   - publish event persistence
   - member and version actions that need a data boundary

4. **Presentational UI**
   - panels
   - overlays
   - timelines
   - tree views
   - shell chrome

## Current Expectations

- `App.tsx` coordinates, but does not own domain rules.
- Domain helpers can be tested without rendering the full shell.
- Repository adapters stay isolated from presentation components.
- Behavioral changes should be covered by focused tests near the layer they affect.

## Refactor Rule

When a new builder concern appears, place it in the smallest layer that can own it cleanly. Do not grow `App.tsx` with new cross-cutting logic unless there is no better boundary.
