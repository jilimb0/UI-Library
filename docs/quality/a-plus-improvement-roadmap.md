# A+ Improvement Roadmap

This roadmap tracks the work needed to raise UI-Library from the May 2026
project analysis grade of B+ to A+.

## Implementation Checklist

Status legend:

- `[x]` Completed in the current A+ improvement slice.
- `[ ]` Not started or still requires a dedicated follow-up slice.
- `[~]` Started but not fully accepted yet.

### Phase 1: Security and Repository Hygiene

- [x] Remove hardcoded Chromatic project token from Storybook scripts.
- [x] Use `CHROMATIC_PROJECT_TOKEN` for local/CI Chromatic execution.
- [x] Document that Chromatic tokens must live only in GitHub Actions secrets or
  a local shell environment.
- [x] Add `pnpm check:hygiene` to fail on tracked secrets and local/generated
  artifacts.
- [x] Wire `pnpm check:hygiene` into `pnpm validate` and CI.
- [x] Remove tracked Rollup cache files found in package cache folders.
- [~] Audit all local/generated files; ignored untracked artifacts still exist
  locally but are not accepted as tracked source.

### Phase 2: Quality Gate Normalization

- [x] Add `pnpm check:workspace-scripts` to enforce `build`, `lint`,
  `typecheck`, and `test` scripts across workspace packages/apps.
- [x] Wire `pnpm check:workspace-scripts` into `pnpm validate` and CI.
- [x] Replace the React Hook Form placeholder test script with a real Vitest
  script.
- [x] Add test scripts for integration packages with existing tests.
- [x] Add test scripts for `styles`, `tokens`, `icons`, Storybook, docs,
  playground, and demo showcase.
- [x] Fix Storybook lint to check `.storybook` and `stories`.
- [x] Fix Storybook typecheck to run `tsc --noEmit`.
- [x] Add or ratchet explicit package coverage thresholds beyond the packages
  that already define them.

### Phase 3: Type Safety and Production Polish

- [x] Remove the runtime debug log from `useFocus`.
- [x] Update the `useFocus` test to assert focus behavior instead of logging.
- [x] Replace `PropsWithChildren<any>` in `FadeIn` and `Bounce` with typed div
  props.
- [x] Replace remaining production `any` in builder repositories, schema guard,
  Supabase adapter, utility validation, accessibility helpers, and object merge.
- [x] Isolate E2E-only globals behind typed helpers.

### Phase 4: High-Risk Module Decomposition

- [x] Split `packages/registry/src/components/foundations.ts` by component
  category or data domain.
- [x] Continue decomposing `apps/builder/src/App.tsx`.
- [x] Decompose `apps/demo-showcase/src/App.tsx`.
- [x] Split `apps/builder/src/builderControllers.ts` into focused controller
  modules.
- [x] Split `packages/export-core/src/index.ts` into normalization, rendering,
  target dispatch, fidelity, and public export modules.
- [x] Split `packages/prompt-engine/src/index.ts` into parsing, recipes,
  generation, repair, and diff/application modules.
- [x] Add regression tests around each extraction.

### Phase 5: Documentation and Certification

- [x] Create this tracked A+ roadmap.
- [x] Add `docs/` source-of-truth guidance to `docs/README.md`.
- [x] Mark `.qoder/repowiki` as generated secondary reference material.
- [x] Update the project analysis report to remove the exposed token value and
  reflect script-normalization progress.
- [x] Restore/replace deleted planning references where needed.
- [x] Update final grades and residual risks after all phases complete.
- [x] Create or update final A+ certification notes.

### Validation Checklist

- [x] `pnpm check:hygiene`
- [x] `pnpm check:workspace-scripts`
- [x] Secret/debug-log search for exposed Chromatic token and removed focus log
- [x] Focused `@ui-construction-library/core` tests
- [x] Focused `@ui-construction-library/react-hook-form` tests
- [x] `pnpm test`
- [x] `pnpm lint`
- [x] Storybook focused typecheck
- [x] `pnpm typecheck`
- [x] Focused builder/core/utils runtime tests
- [x] Targeted production `any`/debug-log scan
- [x] `pnpm build`
- [x] `pnpm validate`
- [x] `pnpm validate:platform`

## Phase 1: Security and Repository Hygiene

Owner: platform maintainer

Completion criteria:

- No tracked secrets, local environment files, package tarballs, OS metadata,
  TypeScript build info, Supabase temp files, or Rollup cache files.
- Chromatic uses `CHROMATIC_PROJECT_TOKEN` from the local shell or GitHub
  Actions secrets.
- `pnpm check:hygiene` passes locally and in CI.

Validation:

```bash
pnpm check:hygiene
pnpm check:workspace-scripts
```

## Phase 2: Quality Gate Normalization

Owner: package maintainers

Completion criteria:

- Every workspace package and app exposes `build`, `lint`, `typecheck`, and
  `test`.
- Placeholder test scripts are replaced with Vitest smoke or behavior tests, or
  a documented no-test exemption.
- Storybook lint and typecheck cover `.storybook` and `stories`.
- `pnpm validate` is the local release gate.

Validation:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm validate
```

## Phase 3: Type Safety and Production Polish

Owner: package maintainers

Completion criteria:

- Runtime packages do not emit debug logs.
- Production `any` casts are removed or isolated behind typed adapters.
- E2E-only globals are typed and kept out of runtime control paths where
  possible.

Validation:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Phase 4: High-Risk Module Decomposition

Owner: subsystem maintainers

Completion criteria:

- Registry, builder, export-core, and prompt-engine high-risk files are split
  into focused modules with preserved public exports.
- Each extraction lands with regression tests for the moved behavior.
- Public API changes require an ADR before implementation.

Validation:

```bash
pnpm check:api
pnpm registry:source:check
pnpm test
pnpm build
```

## Phase 5: Documentation and Certification

Owner: docs/release maintainer

Completion criteria:

- `docs/` is documented as canonical source of truth.
- `.qoder/repowiki` is documented as generated secondary reference material.
- The project analysis report is updated with final grades and residual risks.
- Release runbooks reflect security, staging, rollback, and health-check gates.

Validation:

```bash
pnpm check:launch
pnpm check:contracts
pnpm validate:platform
```

## Final A+ Gate

The repo is A+ only when the following command set passes without ignored
failures:

```bash
pnpm check:hygiene
pnpm check:workspace-scripts
pnpm check:deps
pnpm check:api
pnpm registry:source:check
pnpm preset:check
pnpm check:gold-kits
pnpm check:launch
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check:bundle
pnpm check:perf
pnpm check:security
pnpm check:contracts
pnpm check:supabase-schema
pnpm validate:platform
```
