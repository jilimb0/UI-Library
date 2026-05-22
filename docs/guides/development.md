# Development Guide

## Install

```bash
pnpm install
```

## Run apps

```bash
pnpm dev
pnpm --filter @ui-app/playground dev
pnpm --filter @ui-app/docs dev
```

## Typecheck

```bash
pnpm --filter @ui-construction-library/core typecheck
pnpm --filter @ui-construction-library/tokens typecheck
```

## Component development flow

1. Choose the correct layer (`atoms/molecules/organisms/templates`).
2. Implement typed props and stable API contract.
3. Export component from layer index.
4. Add docs and usage examples.
5. Add tests/stories in quality iteration.

## Integration package flow

1. Implement adapter in `packages/integrations/<target>/src`.
2. Keep peerDependencies minimal and explicit.
3. Validate with package-level typecheck.

## Commands

```bash
pnpm lint
pnpm test
pnpm build
```
