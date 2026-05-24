# Phase 5 — Export Foundation

## Goal

Define the first explicit contract layer that converts validated builder/project state into deterministic export-ready structures before any framework-specific renderer runs.

## Done criteria

Phase 5 foundation is considered established when the repository contains:

- a framework-agnostic export request/response contract;
- a deterministic export intermediate representation (IR);
- normalization rules from project/layout state into export IR;
- diagnostics for unsupported nodes, missing registry metadata, and normalization fallbacks;
- tests that prove IR normalization is deterministic for a golden-path document.

## Pipeline stages

1. `normalize` — validate source project/pages/nodes and convert them into export IR.
2. `analyze` — inspect imports, unsupported patterns, asset references, and page-level dependencies.
3. `enrich` — inject target defaults, formatting options, package versions, and derived metadata.
4. `render` — turn enriched IR into concrete files for a selected export target.
5. `post-process` — format files, generate manifests, and emit export diagnostics/reporting.

## First deterministic slice

The first export slice should target a single-page React application using foundational registry components only. The minimum file set is:

- `package.json`
- `tsconfig.json`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles.css`
- `README.md`

## IR rules

- IR ordering must be stable by page order and source node order.
- Each exported node must retain both `nodeId` and `componentId`.
- Prop maps must preserve only serializable values for the first slice.
- Non-serializable props must generate diagnostics instead of silent omission.
- Unknown registry components must be preserved as unsupported IR nodes with explicit reasons.

## Style and theme strategy

- Exporters should emit generated CSS variables as the first shared style contract for deterministic output.
- The initial strategy is plain generated CSS files rather than CSS Modules or Tailwind presets.
- Theme output should remain composable across pages by keeping root-level variables in a shared stylesheet and page rendering free of page-specific theme mutations.
- Builder-specific style metadata should be normalized into serializable scalar props before rendering; non-serializable style metadata should degrade to diagnostics.

## Assets and dependency strategy

- Local assets, external URLs, icons, fonts, and placeholders should resolve through deterministic export metadata rather than ad hoc renderer decisions.
- Exported apps should emit an explicit dependency manifest through generated package metadata or runtime module manifests depending on target type.
- Exporters should prefer stable relative paths for generated artifacts and avoid target-specific rewriting unless required by the manifest contract.
- When referenced content is unavailable, exported output should fall back to explicit placeholders or diagnostics rather than silently dropping the reference.

## Validation follow-up

- Builder-shaped examples should continue to serve as end-to-end export fixtures across supported targets.
- Generated applications should be buildable through package-local smoke validation for targets that emit buildable app manifests.
