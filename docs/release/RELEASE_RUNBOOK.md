# Release Runbook

Related policies:

- [LTS, Versioning, and Deprecation Policy](./LTS_VERSIONING_POLICY.md)
- [Compatibility Matrix](../guides/compatibility-matrix.md)

## 0. Pre-release checklist

Before starting the release process, run through the full checklist:

- [ ] Review [V1 Release Checklist](./V1_RELEASE_CHECKLIST.md) — all items must be complete or explicitly skipped
- [ ] Verify Node.js version ≥22.0.0 (`node --version`)
- [ ] Verify pnpm version ≥11.7.0 (`pnpm --version`)
- [ ] Run `pnpm check:deps` — dependency boundaries must pass
- [ ] Run `pnpm release:preflight` — preflight checks must pass
- [ ] Run `pnpm audit --audit-level=high` — zero high/critical vulnerabilities
- [ ] Run `pnpm validate:platform` — all checks (lint, typecheck, build, test) pass
- [ ] Verify all packages are at their intended versions (`pnpm check:published`)

## 1. Preflight

Run full verification:

```bash
pnpm check:deps
pnpm release:preflight
```

## 2. Versioning

**Requirement:** Node.js ≥22.0.0 (enforced in `package.json` engines and `.github/workflows/*`).

Create/update changesets, then version packages:

```bash
pnpm changeset
pnpm version-packages
node scripts/utils/sync-app-versions.js   # apps → workspace:^x.y.z (local packages)
pnpm install
```

`sync-app-versions.js` updates app deps to `^<version>` so apps consume the published npm packages directly.

Commit versioning changes:

```bash
git add .
git commit -m "chore: version packages"
```

## 3. Push and CI

```bash
git push origin main
```

Validate workflows in GitHub Actions:

- `CI`
- `Release`
- `Demo Showcase Deploy`
- `Chromatic`

## 4. Publish

Log in to npm with publish rights on the `@ui-construction-library` scope:

```bash
npm whoami
npm login   # if needed
```

If publish returns **E401**, refresh auth (`npm login`). **E404** on `PUT` for scoped packages usually means invalid/expired token or missing org publish permission—not that the package name is wrong.

If using Changesets action on `main`, publishing is automatic (uses `NPM_TOKEN` in CI).

Manual fallback:

```bash
pnpm release
# or: pnpm publish:stable
```

First-time packages (`motion`, `primitives`, `dnd`, etc.) require your npm user to be allowed to publish new packages under `@ui-construction-library`.

## 5. Post-release verification

- Verify packages on npm (`npm view <package-name>`)
- Verify demo URL opens and assets load
- Verify Storybook URL opens
- Verify release notes published in GitHub Releases

## 6. Rollback procedure

If a release introduces a critical issue:

1. **Immediate:** `npm deprecate @ui-construction-library/<package>@<bad-version> "contains a critical issue — use <previous-version> instead"`
2. **Patch:** Bump the version and release a fix via the normal process (sections 2-5)
3. **Git revert:** If the release commit introduced issues beyond a single package, revert it:
   ```bash
   git revert <release-commit-sha>
   git push origin main
   ```
4. **GitHub Release:** Mark the affected release as "Pre-release" in GitHub Releases UI
5. **Notify:** Announce the rollback in the team channel and via GitHub issue with `[ROLLBACK]` in the title
6. **Post-mortem:** File an issue documenting root cause, detection gap, and preventive measures

Rollback is reserved for **P0/P1 incidents** (broken builds, data loss, security vulnerabilities). For minor issues, ship a patch.

## 7. Announce

Use prepared content:

- `docs/release/RELEASE_NOTES_TEMPLATE.md`
- `docs/marketing/LAUNCH_POSTS.md`
