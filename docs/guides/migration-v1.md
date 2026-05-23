# Migration Guide to v1 Excellence

## Scope

This guide covers migration from pre-v1 snapshots to `v1` contracts.

## API Alignment

1. Prefer `className` + `style` support where component contracts provide it.
2. Prefer standardized size scale: `sm | default | lg`.
3. For value-driven controls, use `onValueChange` when available.

## Validation Checklist

1. Run `pnpm upgrade:doctor`.
2. Run `pnpm validate`.
3. Run visual checks in PR (`chromatic.yml`).

## Typical Fixes

1. Replace custom ad-hoc size enums with `sm/default/lg`.
2. Normalize controlled/uncontrolled patterns:
   - controlled: `value` + `onValueChange`
   - uncontrolled: `defaultValue`
3. Remove direct third-party UI imports from apps; use `@ui-construction-library/*`.
