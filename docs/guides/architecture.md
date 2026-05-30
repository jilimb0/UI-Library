# Architecture Guide

This is a short implementation-oriented guide. For the canonical architecture index, start with [`docs/architecture/README.md`](../architecture/README.md).

## Quick map

- `apps/*` are product surfaces: builder, docs, demo-showcase, playground, storybook.
- `packages/*` are the reusable platform layers: foundation, components, contracts, adapters, utilities.
- CI and release scripts live under `.github/workflows/` and `scripts/`.
- Public UI imports should come from `@ui-construction-library/*`, not external UI vendors.
- `apps/builder` should keep domain logic out of the shell and follow [`docs/architecture/builder-boundary.md`](../architecture/builder-boundary.md).

## More detail

- [`docs/architecture/platform-overview.md`](../architecture/platform-overview.md)
- [`docs/architecture/platform-vocabulary.md`](../architecture/platform-vocabulary.md)
- [`docs/guides/self-owned-platform.md`](./self-owned-platform.md)
