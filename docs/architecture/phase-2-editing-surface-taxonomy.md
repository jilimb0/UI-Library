# Phase 2 — Editing Surface Taxonomy

## Goal

Define how registry metadata maps component props into consistent builder editing surfaces.

## Canonical surfaces

- `quick-edit`: high-frequency adjustments that users expect immediately after inserting a component.
- `content-edit`: textual or media content changes that directly affect user-facing meaning.
- `layout-edit`: spacing, alignment, width, direction, and child arrangement controls.
- `advanced-edit`: lower-frequency visual, interaction, accessibility, and edge-case behavior settings.
- `hidden`: internal, computed, or runtime-only props that should not appear in the default builder inspector.

## Mapping rules

- A prop should appear in exactly one primary surface.
- Quick edit should stay intentionally small and bias toward the smallest set of common changes.
- Content edit should contain user-visible words, labels, links, helper text, alt text, and media references.
- Layout edit should contain structural controls and never duplicate purely stylistic variant controls.
- Advanced edit should contain accessibility, stateful behavior, rare variants, and future data-binding configuration.
- Hidden props should still remain documented in registry metadata even when not rendered by the current inspector.

## Component-level editingSurface vs prop-level surfaces

- `builder.editingSurface` describes the dominant editing model of the component as a whole.
- Prop-level `editingSurface` metadata describes where a specific prop is edited in the inspector.
- The component-level editing surface must not replace prop-level classification; both are needed.
