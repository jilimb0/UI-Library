# Demo Showcase

Marketing-grade demo app for `@ui-lib/*` packages.

## Run

```bash
pnpm --filter @ui/demo-showcase dev
```

## Build

```bash
pnpm --filter @ui/demo-showcase build
```

## Typecheck

```bash
pnpm --filter @ui/demo-showcase typecheck
```

## GitHub Pages deploy

`/.github/workflows/demo-showcase.yml` publishes this app to GitHub Pages on each push to `main`.

Required repository settings:

1. Open GitHub repository settings.
2. Go to `Pages`.
3. Set `Source` to `GitHub Actions`.

After first successful run, demo URL will be:

`https://<your-org-or-user>.github.io/<repo-name>/`
