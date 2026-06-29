# v1.0.0 Release Checklist

This checklist tracks what's needed to promote `@ui-construction-library` from `0.x` (public preview) to `1.0.0` (stable).

## API Stability

- [ ] All public packages at `≥0.3.x` with zero breaking changes in the last 3 minor releases
- [ ] Public API surface is frozen — no planned breaking changes in the backlog
- [ ] `api-snapshot.json` up to date and tracked in CI (`check:api`)
- [ ] Every public export has JSDoc with `@example` and `@deprecated` where applicable

## Testing & Quality

- [ ] All packages pass `pnpm validate:platform` with zero failures
- [ ] Coverage thresholds enforced at ≥80% (statements, branches, functions, lines)
- [ ] Cross-browser E2E tests passing (chromium + firefox + webkit)
- [ ] Chromatic visual regression baseline established and reviewed
- [ ] Performance benchmarks recorded and no regressions from last `0.x` release
- [ ] Bundle size budgets documented in `tests/performance/bundle-size.test.js`

## Documentation

- [ ] Every published package has a README on npm with install, quick start, and API overview
- [ ] Migration guide from latest `0.x` to `1.0.0` is complete
- [ ] `docs/migration/MIGRATION-GUIDE.md` includes all breaking changes since `0.1.0`
- [ ] Browser compatibility matrix is up to date in `support-policy.md`
- [ ] Storybook stories exist for all canonical components
- [ ] Integration kits (Vite, Next.js, RHF, TanStack) all verified with `1.0.0` prerelease

## Release Infrastructure

- [ ] npm provenance (OIDC trusted publishing) is enabled and verified
- [ ] Canary release workflow works end-to-end
- [ ] Published smoke test passes for all packages
- [ ] CHANGELOG.md generated and reviewed for all packages
- [ ] Release runbook (`docs/release/RELEASE_RUNBOOK.md`) updated with 1.0-specific steps

## Security

- [ ] Dependency audit passes at `--audit-level=high`
- [ ] SBOM generated and reviewed
- [ ] `SECURITY.md` contact information is current
- [ ] No hardcoded secrets or tokens in the repository

## Post-Release

- [ ] GitHub Release created with changelog summary
- [ ] Release announcement drafted (blog post / social)
- [ ] `docs/release/V1_EXCELLENCE_RELEASE_NOTES.md` updated
- [ ] npm package pages updated with `1.0.0` as latest

## Breaking changes to resolve before 1.0

All planned breaking changes should be resolved in a `0.x` release *before* bumping to `1.0.0`. The `1.0.0` release itself should contain no breaking changes from the final `0.x` version — only a version bump.

List known breaking changes here:

- [ ] (none currently documented)
