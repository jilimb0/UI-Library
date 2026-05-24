# Layout Schema Spec

## Problem statement
A deterministic and portable layout schema is required for builder editing, validation, and export generation.

## Scope
- Define tree structure for pages and nodes.
- Define rules for props/bindings/responsive visibility.

## Non-goals
- Runtime renderer implementation details.

## Data model
- Layout document root: project/page metadata + node tree.
- Node fields: `id`, `componentId`, `props`, `bindings`, `children`, `slotAssignments`, `styleOverrides`, `responsiveRules`, `visibilityRules`, `lockState`, `meta`.
- Optional history metadata: operation IDs, authorship, timestamps.

## Public contracts
- JSON Schema files in `packages/schema`.
- Runtime validation helpers for editor and export engines.

## Technical decisions
- Deterministic node ordering.
- Explicit slot assignments over implicit child heuristics.
- Strict separation of content props vs style overrides.

## Migration path
- Phase 1: baseline schema + validator.
- Phase 3: full builder integration.
- Later: data-binding extensions and branch/fork metadata.

## Risks
- Schema complexity growth affecting editor performance.
- Backward-compatibility burden if early schema changes frequently.

## Open questions
- Granularity of responsive rules.
- Server-side normalization strategy for malformed payloads.
