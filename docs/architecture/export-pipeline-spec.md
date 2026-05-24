# Export Pipeline Spec

## Problem statement
The platform must export deterministic, human-readable projects instead of brittle generated code.

## Scope
- Define export request/response contracts.
- Define React and Next exporters as first targets.
- Define CI smoke-test strategy for generated output.

## Non-goals
- Full implementation of all exporters.

## Data model
Export request fields:
- `targetFramework`
- `targetVersion`
- `snapshotId`
- `includedPages`
- `themeMode`
- `assetBundle`
- `packagePinningStrategy`
- `formattingOptions`

## Public contracts
- `packages/export-react` and `packages/export-next` interfaces.
- Archive manifest and generated README contract.

## Technical decisions
- Export from validated snapshot only.
- Deterministic formatter and import order.
- Version-pinned dependencies in generated artifacts.

## Migration path
- Start with single-project archive export.
- Add repository integration and incremental export in later phases.

## Risks
- Generated code quality regressions.
- Target framework version drift.

## Open questions
- Template ownership model for exporter boilerplates.
- Support matrix for server/client component boundaries.
