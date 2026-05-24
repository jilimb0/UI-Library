# Phase 5 Closeout Steps

## Confirmed done now

- `packages/export-core` exposes the framework-agnostic export request/IR/diagnostic contract.
- `normalize -> analyze -> enrich -> render` is deterministic and covered by package-local tests.
- The builder-shaped integration fixture is aligned with the registry-backed components and passes.
- The acceptance checklist now records the remaining Phase 5 closeout criteria explicitly.

## Still required to close Phase 5 completely

1. Add a richer export target output, not only the current manifest baseline.
2. Add golden export fixtures for CI-buildable validation.
3. Broaden dependency/import derivation so the analyzer output reflects more than the current minimal set.
4. Wire a repo-wide validation path that can run without pnpm registry metadata fetch failures.

## How to finish the remaining work

1. Implement a second export slice or a richer `react-single-page` output path.
2. Add golden tests that assert generated files for real builder-shaped input.
3. Extend analyzer output with explicit derived import/dependency coverage for nested foundational components.
4. Run the monorepo gate in an environment where pnpm metadata access works, or adjust the workspace scripts so validation uses a cache-friendly/offline-friendly path.
