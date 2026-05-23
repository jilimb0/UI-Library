# LTS, Versioning, and Deprecation Policy

## Scope

This policy applies to all public packages in the monorepo:

- `@ui-construction-library/core`
- `@ui-construction-library/primitives`
- `@ui-construction-library/tokens`
- `@ui-construction-library/icons`
- `@ui-construction-library/utils`
- `@ui-construction-library/dnd`
- `@ui-construction-library/motion`
- `@ui-construction-library/integration-*`
- `@ui-construction-library/react-hook-form`

## Versioning Model

1. Semver is mandatory for all published packages.
2. `major` for breaking API or behavior changes.
3. `minor` for backward-compatible features.
4. `patch` for fixes and non-breaking improvements.
5. Releases are cut via Changesets (`pnpm changeset`, `pnpm version-packages`, `pnpm release`).

## LTS Policy

1. Node.js runtime support: `24.x` only.
2. React support: `18.x` only.
3. LTS branch naming: `release/x.y`.
4. Each LTS line receives:
   - bug fixes,
   - security fixes,
   - critical accessibility regressions fixes.
5. No new features in existing LTS lines after the next minor is designated as active.

## Deprecation Policy

1. Any public API deprecation requires:
   - changelog entry,
   - migration note,
   - replacement path.
2. Soft-deprecation window: minimum one minor cycle.
3. Hard removal only in the next `major`.
4. Deprecation warnings must be deterministic and test-covered where practical.

## Backport Rules

1. Backports are allowed only for:
   - security fixes,
   - production regressions,
   - a11y critical regressions.
2. Backport PR must reference:
   - original PR,
   - risk assessment,
   - validation evidence.
3. Backport changes must pass the same CI gates as `main`.

## Release Gates

A release is allowed only when all checks are green:

- `pnpm check:deps`
- `pnpm check:api`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm check:bundle`
- `pnpm check:perf`
- visual regression workflow (`Chromatic`)

## Rollback

If a release introduces regression:

1. Pause further publish.
2. Revert or patch on release branch.
3. Publish patch version.
4. Add incident note to release notes.
