# Canary release channel

## Publish canary

```bash
pnpm changeset version              # bump package versions + changelogs
node scripts/sync-app-versions.js   # apps use workspace:^ (not bare semver)
pnpm install
pnpm publish:canary                 # preflight + build + publish --tag canary
```

Or use `./scripts/release.sh` for a **stable** release (version → sync → install → publish `latest`).

## Promote to stable

```bash
pnpm publish:stable      # preflight + build + publish --tag latest
```

Manual equivalent:

```bash
pnpm build
pnpm changeset publish --tag canary   # or --tag latest
```

## Rollback

1. Revert the merge commit on `main`.
2. Run `pnpm changeset publish` with the previous version bump if needed.
3. See [RELEASE_RUNBOOK](./RELEASE_RUNBOOK.md) for full rollback steps.
