# Release Runbook

Related policies:

- [LTS, Versioning, and Deprecation Policy](./LTS_VERSIONING_POLICY.md)
- [Compatibility Matrix](../guides/compatibility-matrix.md)

## 1. Preflight

Run full verification:

```bash
pnpm check:deps
pnpm release:preflight
```

## 2. Versioning

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

## 6. Announce

Use prepared content:

- `docs/release/RELEASE_NOTES_TEMPLATE.md`
- `docs/marketing/LAUNCH_POSTS.md`
