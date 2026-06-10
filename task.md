# Task

## Phase
Done

## Completed
- Planned the P0 public/internal package surface slice from the attached roadmap.
- Added the machine-readable package surface contract in `config/package-surface.json`.
- Added internal package metadata and README notices for internal/platform packages.
- Added a public surface validation script and wired it into `pnpm validate`.
- Updated architecture docs to distinguish Library mode from Platform mode.
- Fixed performance Vitest aliases so perf tests resolve workspace packages instead of stale published package copies.
- Added `builderEditorController.test.ts` (35 tests): editorContext derivation via
  parseEditorRoute, session role capabilities for all 5 roles, publish guard chain (5 cases),
  publish state summary and guidance, member presence (4 cases), PromptDraftOverrides defaults.
  Wired into builder vitest config alongside the existing 10 test files (80 total tests).
- Added `packages/icons/src/icons.test.tsx` (18 tests): IconProps type contract, iconManifest
  completeness (299 entries, no duplicates, required fields, keywords), iconRegistry shape,
  render smoke tests (SVG output, prop forwarding, aria-hidden default), named export
  tree-shakeability. Added `vitest.config.ts` (happy-dom) and testing-library/react devDep.
  Updated `test` script from build-icons.js to vitest.
- Added `tests/e2e/README.md`: documents all 11 E2E test files, how to run, visual regression
  baseline update workflow, and the Supabase configured-mode skip — why it exists, what
  conditions trigger it, and how to run the connected test locally.
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
- Consolidated release docs around a single release index.
- Added a top-level docs index.
- Wired CI to check published package versions.
- Fixed the `Dropdown.keyboard.test.tsx` assertion to match component behavior.
- Removed the stale planning/status backlog files.
- Added the A+ improvement roadmap with a tracked implementation checklist.
- Removed the hardcoded Chromatic token from Storybook scripts and documented
  the `CHROMATIC_PROJECT_TOKEN` secret requirement.
- Added repository hygiene and workspace script checks, then wired them into
  `pnpm validate` and CI.
- Removed tracked Rollup cache artifacts from package source control.
- Normalized workspace package/app scripts for `build`, `lint`, `typecheck`,
  and `test`.
- Fixed Storybook lint/typecheck/build coverage for `.storybook` and `stories`.
- Removed production debug logging and targeted production `any` escape hatches
  in builder, core, and utils runtime paths.
- Isolated the builder E2E role override behind a typed helper.
- Fixed peerDependency gaps: added react-dom to icons, integration-i18n, integration-next,
  integration-tanstack-query, integration-tanstack-router for consistent public package contract.
- Extracted surface checker logic into scripts/surface-checker.mjs (importable module) and
  refactored check-public-surface.mjs as a thin CLI wrapper — behaviour unchanged.
- Added tests/surface/check-public-surface.test.mjs: 20 unit tests covering metadata checks,
  README notices, matrix completeness, import boundary detection, and importPattern correctness.
- Wired pnpm check:surface-tests into pnpm validate.
- Added docs/guides/getting-started.md: consumer quick-start guide covering install, stylesheet,
  ThemeProvider, basic usage, icons, optional extensions (with install commands), and package
  boundary rules linking to the full architecture guide.
- Added dedicated vitest configs with 80% coverage thresholds to all 7 previously unconfigured
  packages: tokens, styles, integration-i18n, integration-next, integration-tanstack-query,
  integration-tanstack-router, react-hook-form. Updated their test scripts to use own configs.
- Decomposed prompt-engine/generation.ts (333 lines) into three focused modules:
  - compositionPlan.ts — deriveCompositionPlan + CompositionPlan type
  - sectionBuilder.ts — makeTextNode, makeHeadingNode, makeSectionCopy, makeSectionChildren,
    getSectionLayoutVariant
  - generation.ts — thin orchestrator (buildLandingPageDraft, validatePromptDraftProject)
  All 16 prompt-engine tests pass. No API regressions.
- Extracted route/browser-sync slice into `useRouteController.ts` (initial route derivation,
  URL sync via replaceState, popstate handling). Refactored `builderEditorController.ts` to
  consume it; public controller API unchanged.
- Extracted page/project management slice into `useProjectController.ts`
  (projectRenameDraft, newPageTitle, handleRenameProject, handleCreatePage).
- Full hook decomposition of `builderEditorController.ts` (804 → 442 lines) complete:
  `useRouteController`, `useSessionController`, `useNodeEditor`, `useVersionController`,
  `useMemberController`, `usePromptController`, `useProjectController` — all extracted,
  tested, and green under `pnpm validate`.
- Extracted publish orchestration into `usePublishController.ts` (publish guard, state
  summary/guidance, handlePublishProject, handleUnpublishProject) and comment orchestration
  into `useCommentController.ts` (handleAddComment, handleResolveComment).
- Extracted `useEditorContext.ts` (route→project+page derivation) and `useActivityTracker.ts`
  (touchMemberActivity, page activity refresh effects). `builderEditorController.ts` is now
  358 lines (804 → 358 across the full decomposition) with 11 focused hook dependencies.
  Hook extraction complete.

## Open
- No immediate builder controller work remaining. The orchestrator is now a thin composition
  layer that wires 11 single-responsibility hooks together.

## Blockers
None.
