# Component Registry Spec

## Problem statement
Builder, docs, prompt generation, and export pipelines need a single source of truth for component behavior and metadata.

## Scope
- Define metadata schema and required fields.
- Define recipe/anti-pattern model.
- Define compatibility matrix and export mapping strategy.

## Non-goals
- Exhaustive metadata content for all components in this document.

## Data model
Each component record includes:
- `id`, `slug`, `displayName`, `package`, `version`, `category`, `description`, `status`, `tags`
- `props`, `slots`, `events`, `states`, `a11y`, `responsiveBehavior`, `styleHooks`, `builder`
- `recipes`, `antiPatterns`, `export`, `compatibility`

## Public contracts
- JSON file format under `packages/registry`.
- Typed runtime helpers for querying by category/tag/support status.
- Validation API shared with builder and CI jobs.

## Technical decisions
- Schema-validated registry payloads.
- Stable component IDs that survive display-name changes.
- Compatibility matrix per component/recipe and export target.

## Migration path
- Start with 15 foundational components.
- Add higher-level components once prop/a11y contracts stabilize.

## Risks
- Drift between code and metadata.
- Ambiguous slot/child semantics for composite components.

## Open questions
- Recipe DSL format (graph JSON vs strongly typed TS helpers).
- Localization strategy for descriptions and UI labels.
