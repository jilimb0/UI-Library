# Contributing

## Prerequisites

- Node `>=24`
- pnpm `11.x`

## Setup

```bash
pnpm install
```

## Workflow

1. Create a feature branch.
2. Implement changes in the correct layer:
- `packages/tokens` for design tokens/theming
- `packages/core` for UI components
- `packages/integrations/*` for framework adapters
3. Keep API contracts consistent (`value/onChange`, `open/onOpenChange`, `as`, `variant`, `size`).
4. Update docs when API changes.

## Required checks

```bash
pnpm --filter @ui-construction-library/tokens typecheck
pnpm --filter @ui-construction-library/core typecheck
pnpm --filter @ui-construction-library/integration-next typecheck
pnpm --filter @ui-construction-library/integration-tanstack-query typecheck
pnpm --filter @ui-construction-library/integration-tanstack-router typecheck
pnpm --filter @ui-construction-library/integration-i18n typecheck
```

For full validation:

```bash
pnpm lint
pnpm test
pnpm build
```

## Component checklist

- [ ] Component exported from layer index
- [ ] Public API typed and documented
- [ ] Story coverage for states/variants
- [ ] Accessibility semantics verified
- [ ] Tests added/updated

## Release checklist

- [ ] Changeset added (`pnpm changeset`)
- [ ] Migration notes updated if API changed
- [ ] Docs updated (`README` + `docs/api/components.md`)
