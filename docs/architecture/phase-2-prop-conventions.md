# Phase 2 — Prop Conventions

## Goal

Define canonical component prop categories and editing semantics so builder, schema, registry, export, and prompt workflows all reason about component inputs consistently.

## Prop categories

- `content`: user-facing copy, labels, helper text, placeholders, headings, rich content, and icon references.
- `layout`: alignment, spacing, orientation, width, density, grouping, child-slot structure, and container behavior.
- `style`: purely visual variants such as tone, variant, emphasis, size preset, elevation, and decoration.
- `behavior`: interactive runtime behavior such as open state, dismissibility, loading state, selection state, and callbacks.
- `accessibility`: aria labels, semantic role overrides, keyboard/focus options, and screen-reader-specific descriptions.
- `data`: bindings, collection sources, record identifiers, query parameters, and data-derived display options.

## Prop semantics

- `editable`: builder may expose the prop in at least one inspector surface.
- `computed`: the prop is derived from runtime state, builder context, or recipe expansion and is not directly edited as a freeform value.
- `locked`: the prop is intentionally hidden from regular builder editing because changing it would break invariants or exported behavior.

## Default value rules

- Every optional prop should declare a deterministic default when omission changes visible output.
- `defaultValue` in registry metadata must reflect the value used by recipes and builder-created nodes.
- Nullable values should be explicit in metadata description rather than implied by omission.
- Optional props without meaningful defaults should omit `defaultValue` and explain fallback behavior in the description.

## Builder mapping

- `content` props default to quick/content editing surfaces.
- `layout` props default to layout editing surfaces.
- `style` props default to quick edit when common, advanced edit when decorative or niche.
- `behavior` props default to advanced edit unless they are essential to the primary component workflow.
- `accessibility` props default to advanced edit and should remain grouped together.
- `data` props default to hidden or advanced edit until formal data-binding UX exists.
