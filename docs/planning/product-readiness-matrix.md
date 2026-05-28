# Product Readiness Matrix

## Capability matrix

| Area | Current state | Evidence | Readiness |
|---|---|---|---|
| Core component library | Modular package structure with build/lint/typecheck/test maturity across core packages | `packages/core`, `primitives`, `motion`, `registry`, `schema`, `utils`, `tokens`, `styles` package manifests | Product-ready |
| Builder editing shell | Real builder app with canvas/tree/inspector/editor/collaboration-oriented surfaces | `apps/builder/src/App.tsx`, `components/*`, `builderControllers.ts`, `editorState.ts` | Product-ready |
| Persistence and collaboration | Repository-backed persistence, comments, versions, members, publish flows, auth/session path | `apps/builder/src/persistence.ts`, `dataServices.ts`, `membershipService.ts`, `publishService.ts`, `auth.ts` | Product-ready |
| Prompt-to-UI engine | Deterministic prompt contracts, validation, repair, builder-compatible output, tests | `packages/prompt-engine/src/index.ts`, `packages/prompt-engine/src/index.test.ts` | Platform-ready |
| Export pipeline | Deterministic IR, diagnostics, dependency analysis, multi-target render slices, tests | `packages/export-core/src/index.ts`, `packages/export-core/src/index.test.ts` | Platform-ready |
| Docs app / public docs | Dedicated docs app and broad docs surface exist | `apps/docs/package.json`, `docs/*` | Platform-ready |
| Demo/showcase surfaces | Dedicated showcase and playground apps exist | `apps/demo-showcase`, `apps/playground`, `apps/storybook` | Platform-ready |
| Runtime/framework expansion | Strategy docs and initial target slices exist, but support policy is still evolving | `docs/architecture/framework-expansion-strategy.md`, `phase-7-*`, export targets | Experimental |
| End-to-end flagship product journeys | No single canonical prompt → refine → export → run → publish golden flow is yet packaged as a flagship experience | Repository audit and current plan analysis | Experimental |

## Best-in-market scorecard

| Metric | Target | Current interpretation |
|---|---|---|
| Time to first useful page | Under 3 minutes from project creation to editable structured draft | Not yet measured systematically |
| Time to first export | Under 2 minutes from accepted draft to runnable artifact | Architecture exists; not yet benchmarked end to end |
| Export success rate | 95%+ for supported golden-path inputs | Not yet measured systematically |
| Accessibility baseline | Builder and exported output pass agreed release gates | Partial quality infrastructure exists; release-gated baseline not yet formalized |
| Deploy success rate | 95%+ for supported generated/exported starter apps | Not yet measured systematically |

## Launch-tier model

| Tier | Meaning | Entry criteria |
|---|---|---|
| Internal alpha | Team-only development and validation | Major flows implemented, contracts changing frequently, internal docs sufficient |
| Design partner beta | Small trusted external users | Canonical flows stable, major diagnostics in place, onboarding and support path defined |
| Public beta | Open usage with stated limitations | Core flows reliable, docs discoverable, examples polished, known limitations explicit |
| Stable | Production-trustworthy release | Support tiers defined, release gates enforced, flagship journeys proven, migration policy clear |

## Current package/app classification

| Package or app | Classification | Notes |
|---|---|---|
| `@ui-construction-library/core` | Product-ready | Mature script surface and central package role |
| `@ui-construction-library/primitives` | Product-ready | Mature script surface and tests |
| `@ui-construction-library/motion` | Product-ready | Mature script surface and tests |
| `@ui-construction-library/registry` | Product-ready | Strong contract package with mature scripts |
| `@ui-construction-library/schema` | Product-ready | Strong contract package with mature scripts |
| `@ui-construction-library/utils` | Product-ready | Mature build/lint/typecheck/test surface |
| `@ui-construction-library/tokens` | Product-ready | Build pipeline package |
| `@ui-construction-library/styles` | Product-ready | Mature styling support package |
| `@ui-construction-library/dnd` | Product-ready | Mature package script surface |
| `@ui-construction-library/icons` | Product-ready | Mature package script surface |
| `@ui-construction-library/integration-i18n` | Platform-ready | Useful integration package, narrower adoption proof |
| `@ui-construction-library/integration-next` | Platform-ready | Integration package with growing external-facing importance |
| `@ui-construction-library/react-hook-form` | Platform-ready | Integration package with tests and good utility role |
| `@ui-construction-library/integration-tanstack-query` | Platform-ready | Integration package present, less central to primary product claim |
| `@ui-construction-library/integration-tanstack-router` | Platform-ready | Integration package present, less central to current flagship flows |
| `@ui-construction-library/prompt-engine` | Platform-ready | Strong deterministic subsystem, still under-productized in packaging |
| `@ui-construction-library/export-core` | Platform-ready | Strong deterministic subsystem, still under-productized in packaging |
| `@ui-app/builder` | Product-ready | Core product surface already exists |
| `@ui-app/docs` | Platform-ready | Docs delivery surface exists |
| `@ui-app/demo-showcase` | Platform-ready | Good proof surface, still needs flagship experiences |
| `@ui-app/playground` | Platform-ready | Useful exploration surface |
| `@ui-app/storybook` | Platform-ready | Component reference surface |

## Recommended current launch posture

Current overall posture: **internal alpha approaching design partner beta**.

The repository is strong enough for serious internal use and targeted validation of the end-to-end concept. Before claiming a design partner beta posture broadly, the system should productize prompt-to-builder UX, strengthen export-core and prompt-engine package maturity, and package canonical flagship user journeys.
