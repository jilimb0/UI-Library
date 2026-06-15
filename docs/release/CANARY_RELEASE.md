# Canary release channel

This is a supporting note for canary/stable promotion. The canonical process is [`RELEASE_RUNBOOK.md`](./RELEASE_RUNBOOK.md).

## Quick commands

```bash
pnpm changeset version
node scripts/utils/sync-app-versions.js
pnpm install
pnpm publish:canary
```

```bash
pnpm publish:stable
```

For rollback and post-release verification, use [`RELEASE_RUNBOOK.md`](./RELEASE_RUNBOOK.md).
