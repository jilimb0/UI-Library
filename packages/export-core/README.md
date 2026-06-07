# @ui-construction-library/export-core

> INTERNAL-ONLY: This package is not part of the public API surface.

Deterministic builder-document export pipeline for generated application artifacts.

## Status

Current maturity: **beta / platform-ready**.

This package is responsible for converting normalized builder-compatible projects into deterministic export artifacts through an explicit pipeline of normalization, analysis, enrichment, rendering, and post-processing. It is viable as an internal subsystem with stable target plugin entrypoints, but individual targets still carry their own support tiers and fidelity limits.

## Responsibilities

- Accept export requests for supported targets.
- Normalize builder-compatible project input into export IR.
- Analyze imports, dependencies, unsupported nodes, and diagnostics.
- Enrich export results with deterministic metadata.
- Render artifacts for supported targets.
- Expose diagnostics and acceptance-check style signals.

## Current public surface

Primary concepts currently exposed by the package:

- `ExportRequest`
- `ExportTarget`
- `ExportIRProject`
- `normalizeExportProject()`
- `analyzeExportProject()`
- `enrichExportProject()`
- `renderExportProject()`
- target render helpers such as `renderReactSinglePage()`
- acceptance helpers such as `createExportAcceptanceChecklist()`

## Design goals

- Deterministic rendering for the same input.
- Clear separation between pipeline stages.
- Explicit diagnostics for unsupported or degraded export paths.
- Framework-agnostic core with target-specific render slices.

## Target support policy

Every export target should be documented with one of three support tiers:

- `experimental`: architecture proof or internal-only slice; deterministic output may exist, but target ergonomics, fidelity, or docs are still incomplete.
- `beta`: recommended for internal usage and design-partner evaluation; contracts are intentionally shaped and covered by regression tests, but output fidelity or target breadth may still evolve.
- `stable`: target contract is expected to remain durable, has documented acceptance expectations, and should be safe for broad product-facing usage.

A target should only move up a tier when deterministic rendering, acceptance coverage, diagnostics posture, and handoff expectations are clear enough for that level.

## Framework expansion checkpoints

Next.js should remain intentionally deferred until the React export is clearly excellent rather than merely functional. Expansion into a Next.js-specific target should only begin after all of the following are true:

- `react-single-page` keeps a beta-or-better support tier with durable route-aware manifests and shared theme composition.
- Asset, font, and icon export fidelity is strong enough that the React target no longer depends on caveated handoff guidance for common flows.
- Export doctor diagnostics exist in a form that can explain degraded output before introducing framework-specific branching.
- Acceptance and visual-fidelity coverage are strong enough to compare richer runtime targets against a proven React baseline.
- The team can articulate what Next.js adds beyond the existing React export, instead of using framework expansion as a substitute for baseline quality.

Until those checkpoints are met, React remains the excellence gate and Next.js stays out of the active target set.

## Supported targets

| Target | Tier | Posture | Notes |
|---|---|---|---|
| `react-single-page` | `beta` | Documented app-shell export | Route-aware React export with page layouts, shared theme layer, and deterministic file manifests. |
| `html-static` | `beta` | Documented static export | Multi-page navigation shell and deterministic single-file HTML output for lightweight handoff and preview flows. |
| `web-components-static` | `beta` | Documented static export | Deterministic custom-elements-style export for framework-light embedding experiments and platform validation. |

These targets now represent documented support tiers rather than proof-only slices, but they still stop short of full stable guarantees until asset fidelity and diagnostics depth are stronger.

## Target expectations

### react-single-page

Use when the handoff target is a React/Vite-style app shell with route structure and shared theme tokens. The output is deterministic and tested as an app-style manifest, but it is still limited by current asset and visual fidelity constraints.

### html-static

Use when the goal is a static preview, deterministic handoff artifact, or low-friction shareable export. The target is documented and regression-tested, but it does not yet promise perfect parity with richer runtime environments.

### web-components-static

Use when framework-agnostic embedding matters more than first-class runtime ergonomics. The target is documented and supported for deterministic export validation, but should still be treated as a beta integration path.

## Non-goals

- Full deployment orchestration.
- Runtime hosting concerns.
- Perfect visual parity with the builder in all cases.
- Complete asset pipeline fidelity.
- Broad framework coverage before the first target reaches excellent maturity.

## Current limitations

- Asset, font, and icon export fidelity is still incomplete.
- Some target outputs are still intentionally beta rather than stable.
- Support tiers are documented, but they remain below stable until fidelity, diagnostics, and asset coverage mature further.

## Intended evolution

Planned evolution areas include:

- stronger asset manifests and export fidelity;
- export doctor diagnostics and support reporting;
- target-specific acceptance criteria for stable graduation;
- framework expansion only after current targets clear stronger excellence thresholds.

## Public entrypoints

- `@ui-construction-library/export-core`: core pipeline types and helpers.
- `@ui-construction-library/export-core/targets`: stable target plugin contract and public snapshot helpers.

## Target plugin contract

Target plugins use the `ExportTargetPlugin` contract with a versioned `version: '1'` field, a declared `target`, supported pipeline stages, and a `render()` implementation.
