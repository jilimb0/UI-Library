# A+ Improvement Plan for UI-Library

## Summary

Goal: raise the repo from **B+ to A+** by eliminating security/repo hygiene risks, enforcing complete quality gates, reducing high-complexity modules, tightening public package contracts, and making canonical docs/wiki ownership clear.

Priority model: **risk-first**. Work in small validated slices, with one commit per passing sub-task.

Target acceptance criteria:

- No committed secrets, local env files, temp files, package tarballs, OS files, or build info artifacts.
- `pnpm validate` and `pnpm validate:platform` pass locally and in CI.
- Every workspace package has meaningful `build`, `lint`, `typecheck`, and `test` behavior or an explicit documented exemption.
- High-risk files are decomposed so no strategic source file remains above the agreed maintainability threshold unless it is generated data.
- Production `any`, debug logging, and test-only globals are removed or isolated behind typed adapters.
- `/docs` is canonical; `.qoder` is clearly treated as generated secondary wiki material.
- A new tracked roadmap artifact exists at `docs/quality/a-plus-improvement-roadmap.md`.

## Architecture Decision Record

Decision: treat A+ as an engineering system upgrade, not a single refactor.

- Security and hygiene gates come first because they affect every branch and release.
- Public package APIs remain backward compatible unless an ADR explicitly approves a breaking change.
- Large-file decomposition must preserve behavior first, then improve shape.
- `.qoder` remains generated/non-authoritative; `/docs`, ADRs, package READMEs, and tests are source of truth.
- Generated artifacts are excluded from source control unless there is a documented release reason.

## Task List

1. Security and repository hygiene
   - Remove the hardcoded Chromatic token from `apps/storybook/package.json`.
   - Replace it with `chromatic --project-token=$CHROMATIC_PROJECT_TOKEN` or Chromatic’s standard env-based invocation.
   - Document required secrets in release/setup docs.
   - Audit `apps/builder/.env.local`, `supabase/.temp/*`, `.DS_Store`, `*.tgz`, `*.tsbuildinfo`, and `.rollup.cache`.
   - Remove tracked local/generated artifacts and strengthen `.gitignore` only where gaps remain.
   - Add or update a lightweight secret/artifact check in CI.

2. Quality gate normalization
   - Ensure every package/app has consistent scripts: `build`, `lint`, `typecheck`, and `test`.
   - Replace placeholder tests with real smoke tests or documented no-op test files that assert package importability.
   - Fix Storybook lint/typecheck so it checks `.storybook` and `stories`, not a nonexistent `src`.
   - Add coverage threshold enforcement if missing, targeting the repo’s stated 80 percent policy.
   - Make `pnpm validate` the local release gate and `pnpm validate:platform` the full platform gate.

3. Type safety and production polish
   - Remove production `console.log` from library/runtime code, especially `packages/core/src/hooks/useFocus.ts`.
   - Replace production `any` in builder repositories, schema guard, Supabase adapter, core animation props, validation helpers, accessibility helpers, and object merge utilities.
   - Keep `any` in tests only when unavoidable, and prefer framework types such as Playwright `Page`.
   - Isolate E2E-only globals behind typed test helpers instead of direct `globalThis as any` usage in runtime modules.

4. High-risk module decomposition
   - Split `packages/registry/src/components/foundations.ts` into maintainable registry modules grouped by component category or data domain.
   - Continue decomposing `apps/builder/src/App.tsx` into route, layout, state orchestration, and feature container modules.
   - Split `apps/builder/src/builderControllers.ts` into typed controller modules for selection, mutation, publish/comment, versioning, collaboration, and repository connectivity.
   - Split `packages/export-core/src/index.ts` into model normalization, render tree, framework target dispatch, fidelity checks, and public exports.
   - Split `packages/prompt-engine/src/index.ts` into prompt parsing, recipe selection, draft generation, repair, and diff/application modules.
   - After each extraction, preserve public exports and add regression tests around the moved behavior.

5. Documentation and wiki source-of-truth
   - Create `docs/quality/a-plus-improvement-roadmap.md` with phases, owners/placeholders, validation commands, and completion criteria.
   - Update `docs/README.md` to identify canonical docs and mark `.qoder` as generated secondary documentation.
   - Add a short note in `.qoder` policy docs or repo docs explaining how/when generated wiki should be refreshed.
   - Restore or replace deleted planning references with the new roadmap if those deletions are intentional.
   - Update release docs after token, CI, artifact, and validation changes.

6. CI/CD and release hardening
   - Update CI to fail on secret/artifact leakage, contract drift, package script gaps, and coverage below threshold.
   - Make security audit non-optional for release workflows; CI may keep advisory/continue-on-error only if release gates are strict.
   - Confirm `check:published`, `check:published:code`, changelog generation, and release preflight align with the current publish model.
   - Ensure release runbook includes rollback, staging validation, smoke checks, and post-release health checks.

7. Final validation and certification
   - Run dependency checks, API snapshot checks, source registry checks, preset checks, gold kit checks, launch checks, lint, typecheck, tests, build, bundle, perf, security, contracts, Supabase schema check, and E2E.
   - Update `docs/quality/project-analysis-report.md` with before/after grades and residual risks.
   - Create a final A+ certification note under `docs/quality` or update existing release certification docs.

## Dependency Map

- Security cleanup must happen before release/CI hardening.
- Artifact cleanup must happen before adding artifact leak gates.
- Script normalization must happen before making `pnpm validate` stricter.
- Type tightening should happen before or during decomposition to prevent moved code from preserving weak contracts.
- Decomposition should happen before final docs certification so docs reflect the final structure.
- Release docs should be updated after CI and validation gates settle.

## Test Plan

| Test name | Status target | Coverage delta |
|---|---:|---:|
| `pnpm check:deps` | pass | no regression |
| `pnpm check:api` | pass | public API unchanged unless documented |
| `pnpm registry:source:check` | pass | registry split remains equivalent |
| `pnpm preset:check` | pass | preset docs remain synced |
| `pnpm check:gold-kits` | pass | launch artifacts intact |
| `pnpm check:launch` | pass | readiness docs/artifacts intact |
| `pnpm lint` | pass | Storybook/docs/package lint included |
| `pnpm typecheck` | pass | fewer `any` escape hatches |
| `pnpm test` | pass | package tests normalized |
| `pnpm build` | pass | package/app build graph intact |
| `pnpm check:bundle` | pass | no bundle regression |
| `pnpm check:perf` | pass | no perf regression |
| `pnpm check:security` | pass | no high-severity audit failures |
| `pnpm check:contracts` | pass | accessibility/API contracts intact |
| `pnpm check:supabase-schema` | pass | migrations/schema skeleton aligned |
| `pnpm validate:platform` | pass | full A+ platform gate |

Additional scenarios:

- Chromatic works from CI secrets and fails clearly if token is missing.
- Local dev still works with `.env.example` and without `.env.local`.
- Builder flows pass for owner/editor/viewer role behavior.
- Export outputs remain byte-stable or intentionally snapshot-updated.
- Registry import paths and package exports remain backward compatible.
- `.qoder` absence does not break validation because it is generated documentation.

## Risks

- Token rotation requires human action outside the repo. Recommended action: rotate Chromatic token before merging cleanup.
- Removing tracked artifacts may affect current release habits if `.tgz` files are being used manually. Recommended action: move artifacts to release assets or regenerate with documented commands.
- Large-file decomposition can cause subtle behavior regressions. Recommended action: slice by subsystem and run focused tests after every extraction.
- Enforcing coverage may reveal existing gaps. Recommended action: introduce threshold at current measured baseline if below 80, then ratchet to 80 with explicit tasks.
- CI may get slower once all gates are strict. Recommended action: keep fast PR gates plus a full platform gate for release branches if needed.

## Assumptions

- Full repo scope is intended.
- Risk-first sequencing is preferred.
- A tracked roadmap artifact should be created later at `docs/quality/a-plus-improvement-roadmap.md`.
- No public API breaking changes are allowed unless a new ADR explicitly approves them.
- Work will remain on a feature branch and will not be pushed directly to `main`.
