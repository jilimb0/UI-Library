# PR Checklist (Release Candidate)

## Code Quality

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] No skipped critical tests in changed areas

## Build and Artifacts

- [ ] `pnpm build` passes for all workspaces
- [ ] `pnpm demo:build` passes
- [ ] Storybook build passes (`pnpm build-storybook`)

## Demo Readiness

- [ ] `/apps/demo-showcase` runs locally
- [ ] Core flows are clickable and error-free
- [ ] Mobile viewport smoke test completed (375px width)
- [ ] Main CTA and key components render correctly

## Release Infrastructure

- [ ] `.changeset/*` added for package changes
- [ ] GitHub Actions green: `CI`, `Demo Showcase Deploy`, `Release`
- [ ] NPM auth and org access verified

## Security and Compliance

- [ ] `security-audit.yml` passed
- [ ] No critical vulnerabilities open
- [ ] License constraints respected

## Documentation

- [ ] Package README updated (if public API changed)
- [ ] Changelog entries reviewed
- [ ] Migration notes added if breaking changes exist

## Approval

- [ ] QA sign-off
- [ ] Maintainer sign-off
- [ ] Release owner sign-off
