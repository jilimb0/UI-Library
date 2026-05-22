# Release Runbook

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
```

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

If using Changesets action on `main`, publishing is automatic.

Manual fallback:

```bash
pnpm release
```

## 5. Post-release verification

- Verify packages on npm (`npm view <package-name>`)
- Verify demo URL opens and assets load
- Verify Storybook URL opens
- Verify release notes published in GitHub Releases

## 6. Announce

Use prepared content:

- `docs/release/RELEASE_NOTES_TEMPLATE.md`
- `docs/marketing/LAUNCH_POSTS.md`
