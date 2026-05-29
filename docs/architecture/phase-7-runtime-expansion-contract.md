# Phase 7 Runtime Expansion Contract

## Goal
Define the first post-MVP runtime expansion contract on top of the validated builder, prompt-generation, and export-core baseline.

## Current baseline
- `packages/export-core` already supports deterministic normalization, analysis, enrichment, and rendering for `react-single-page`.
- Phase 7 first vertical slice extends the same pipeline with `html-static` as an additional target.
- Both targets now pass package-local compatibility tests without regressing the existing React baseline.

## Contract direction
Phase 7 should continue proving that the export pipeline is target-agnostic at the contract layer while remaining deterministic at the file-output layer.

Required invariants for every new runtime target:
- Accept the same normalized `ExportIRProject` shape.
- Preserve deterministic file order and deterministic dependency ordering.
- Emit a target-specific README or entry manifest that identifies the renderer.
- Keep diagnostics compatible with the existing export-core acceptance checklist.
- Avoid weakening the existing `react-single-page` contract or changing builder-shaped fixture semantics.

## Target taxonomy
Two target classes are now recognized:

1. `renderers`: targets that map a validated export IR into runnable project files.
   - Existing: `react-single-page`
   - Existing: `html-static`
   - Existing: `web-components-static`
   - Existing: `nextjs-app-router`
   - Candidate next: `vue3` — a Vue 3 SFC renderer stub has been added to `packages/export-core/src/targets/vue3-target.ts` to prove IR target-agnosticism.

2. `runtime shells`: targets that wrap or host rendered output in a product/runtime boundary.
   - Candidate next: an app shell with navigation, bootstrapping, and deployment assumptions layered on top of the renderer contract.

## Recommended next slice
The next Phase 7 slice should prefer a richer framework renderer before a runtime shell.

Reasoning:
- It stresses export contracts more directly than another documentation-only pass.
- It reveals whether the current IR is sufficient for a second JS framework target.
- It keeps validation and compatibility pressure close to export-core, where regressions are easiest to detect.
- It postpones app-shell concerns until renderer-level gaps are better understood.

## Compatibility checklist for new targets
A Phase 7 target should not be considered complete unless all of the following are true:
- Export request and IR contracts remain backward compatible for existing targets.
- The new target has deterministic golden-style manifest coverage.
- Existing `react-single-page` tests still pass unchanged.
- Builder-shaped multi-page fixtures are exercised through the new target.
- The generated artifact clearly identifies the target and entry point semantics.

## Documentation follow-up
- `docs/architecture/export-pipeline-spec.md` has been revised to reflect the real support matrix (`react-single-page`, `html-static`, `web-components-static`, `nextjs-app-router`).
- `docs/architecture/framework-expansion-strategy.md` has been updated to mark completed migration-path steps.
