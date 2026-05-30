# Task

## Phase
Build

## Completed
- Identified which `@ui-construction-library/*` packages are published on npm.
- Converted app/package manifests to use published semver ranges for packages already on npm.
- Refreshed `pnpm-lock.yaml` with the updated dependency specifiers.
- Restored `apps/builder` unpublished package deps to `workspace:*` so local installs resolve correctly.
- Published the remaining packages on npm at `0.1.0`:
  - `@ui-construction-library/export-core`
  - `@ui-construction-library/prompt-engine`
  - `@ui-construction-library/registry`
  - `@ui-construction-library/schema`
  - `@ui-construction-library/styles`
- Split builder prompt, selection, mode, lifecycle, and persistence helpers out of `apps/builder/src/App.tsx`.
- Added focused tests for the new builder helper modules.
- Fixed correctness bugs in prompt versioning, prompt generation, member lookup, and publish event repository payload handling.
- Added a builder boundary document and tightened architecture navigation.
- Removed the tracked `docs/.DS_Store` artifact.

## Open
- Re-run dependency checks after the next release sync if any package versions change.
- Continue the builder boundary cleanup only in small, validated slices.
- Consolidate the remaining release docs into the canonical set described in `plans/STATUS.md`.

## Blockers
- None for the current publish batch.
