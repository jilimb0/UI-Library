# Product Architecture Index

## Purpose

This index is the fastest way to navigate the architecture of the UI Construction Library monorepo. It groups the most important documents by product concern so contributors can understand the system without reading every document in `docs/architecture` and adjacent doc folders.

## Core platform

- `docs/architecture/platform-overview.md` — high-level platform shape and package/app boundaries.
- `docs/architecture/platform-vocabulary.md` — canonical terms used across builder, schema, registry, export, and runtime flows.
- `docs/architecture/package-naming-strategy.md` — package naming conventions and scope rules.
- `docs/guides/architecture.md` — broader implementation-oriented architecture guide.

## Schema and registry

- `docs/architecture/layout-schema-spec.md` — required builder/layout shapes and serialization rules.
- `docs/architecture/component-registry-spec.md` — registry metadata, component definitions, and resolution expectations.
- `docs/architecture/builder-domain-model.md` — builder-side project/page/node concepts and relationships.
- `docs/architecture/phase-2-canonical-recipes.md` — canonical recipe model for generated or assembled structures.
- `docs/architecture/phase-2-prop-conventions.md` — property naming and value conventions.
- `docs/architecture/phase-2-accessibility-metadata.md` — accessibility-oriented metadata and contract notes.
- `docs/architecture/phase-2-editing-surface-taxonomy.md` — editing surface taxonomy and intended editing contexts.

## Builder product

- `docs/architecture/auth-and-persistence-spec.md` — auth, persistence, repository modes, and remote/local behavior.
- `docs/architecture/realtime-collaboration-spec.md` — collaboration and realtime-oriented product expectations.
- `docs/architecture/current-state-audit.md` — prior system audit useful for context on gaps and trade-offs.

## Prompt generation

- `docs/architecture/prompt-generation-spec.md` — prompt-to-UI generation contracts, modes, and safety rails.

## Export and runtime

- `docs/architecture/export-pipeline-spec.md` — export stages, pipeline contracts, and system boundaries.
- `docs/architecture/phase-5-export-foundation.md` — Phase 5 export foundation, including style/theme and asset/dependency strategy notes.
- `docs/architecture/framework-expansion-strategy.md` — long-term framework and runtime expansion path.
- `docs/architecture/phase-7-runtime-expansion-contract.md` — runtime expansion contract expectations.
- `docs/architecture/phase-7-web-components-target.md` — dedicated target notes for web components export.

## API and governance

- `docs/adr/README.md` — ADR index.
- `docs/adr/0001-adapter-boundary-for-external-ui.md` — adapter boundary decisions.
- `docs/adr/0002-api-and-accessibility-contracts.md` — API and accessibility decisions.
- `docs/api/components.md` — public component API documentation.
- `docs/api/hooks.md` — public hook API documentation.
- `docs/api/utilities.md` — utility API documentation.

## Product, release, and market context

- `docs/guides/roadmap-progress.md` — roadmap progress snapshot.
- `docs/guides/market-comparison.md` — market context and comparative positioning.
- `docs/planning/best-in-market-epics.md` — strategic epics for broader product ambition.
- `docs/roadmaps/best-in-market-90-day.md` — shorter-horizon execution roadmap.
- `docs/release/RELEASE_RUNBOOK.md` — release process.
- `docs/release/PR_CHECKLIST.md` — PR and release quality expectations.

## Recommended reading order

1. `docs/architecture/platform-overview.md`
2. `docs/architecture/platform-vocabulary.md`
3. `docs/architecture/layout-schema-spec.md`
4. `docs/architecture/component-registry-spec.md`
5. `docs/architecture/builder-domain-model.md`
6. `docs/architecture/auth-and-persistence-spec.md`
7. `docs/architecture/prompt-generation-spec.md`
8. `docs/architecture/export-pipeline-spec.md`
9. `docs/architecture/framework-expansion-strategy.md`
10. `docs/guides/roadmap-progress.md`
