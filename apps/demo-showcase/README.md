# Demo Showcase

Marketing-grade demo app for `@ui-construction-library/*` packages.

## Flagship flows

The showcase now includes five product-grade proof flows:

- SaaS landing page
- Dashboard shell
- Settings app
- Docs page
- Pricing site

Each flow is presented as prompt input, builder state, exported artifact, and runnable demo context.

## Run

```bash
pnpm --filter @ui-app/demo-showcase dev
```

## Build

```bash
pnpm --filter @ui-app/demo-showcase build
```

## Typecheck

```bash
pnpm --filter @ui-app/demo-showcase typecheck
```

## GitHub Pages deploy

`/.github/workflows/demo-showcase.yml` publishes this app to GitHub Pages on each push to `main`.

Required repository settings:

1. Open GitHub repository settings.
2. Go to `Pages`.
3. Set `Source` to `GitHub Actions`.

After first successful run, demo URL will be:

`https://<your-org-or-user>.github.io/<repo-name>/`
