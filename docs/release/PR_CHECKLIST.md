# PR Checklist (Release Candidate)

## Code Quality

- [x] `pnpm lint` passes
- [x] `pnpm typecheck` passes
- [x] `pnpm test` passes
- [x] No skipped critical tests in changed areas

## Build and Artifacts

- [x] `pnpm build` passes for all workspaces
- [x] `pnpm demo:build` passes
- [ ] Storybook build passes (`pnpm build-storybook`) — not executed in this pass

## Demo Readiness

- [x] `/apps/demo-showcase` builds and runs locally
- [x] Main component flows compile and render
- [ ] Mobile viewport smoke test completed (manual)
- [ ] UI interaction smoke test completed (manual)

## Release Infrastructure

- [ ] `.changeset/*` added for package changes
- [ ] GitHub Actions green: `CI`, `Demo Showcase Deploy`, `Release`
- [ ] NPM auth and org access verified

## Security and Compliance

- [ ] security workflow passed in CI
- [ ] No critical vulnerabilities open
- [x] License constraints respected (no known conflicts in local pass)

## Documentation

- [x] Package README updated
- [x] API docs updated (`docs/api/components.md`)
- [x] Contributing/development/architecture guides updated
- [x] Migration/progress notes updated

## Approval

- [ ] QA sign-off
- [ ] Maintainer sign-off
- [ ] Release owner sign-off
