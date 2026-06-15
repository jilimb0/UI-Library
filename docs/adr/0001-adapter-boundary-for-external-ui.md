# ADR-0001: Adapter boundary for external UI runtime

**Status:** Superseded (L3 — adapters removed, owned packages in `core`)  
**Date:** 2026-05-22  
**Owners:** `@ui-construction-library/core`

## Context

The library relies on mature third-party packages for accessibility-heavy primitives (Radix), drag-and-drop (dnd-kit), motion (Framer Motion), and icons (Lucide). Direct imports scattered across components create vendor lock-in, complicate replacement, and allow app workspaces to accidentally depend on implementation details.

The [Self-Owned Platform program](../guides/self-owned-platform.md) requires a controlled path from **L1 (controlled independence)** to **L2 (self-owned core)** without blocking current delivery.

## Decision

1. **All Tier-1 UI runtime imports in `packages/core` must go through `packages/core/src/adapters/*`.** Component and organism code imports adapters (or future internal primitives), never `@radix-ui/*`, `@dnd-kit/*`, `framer-motion`, or `lucide-react` directly.

2. **`packages/icons` is the only other approved Lucide entry** (icon source until SVG generator ships).

3. **CI enforces the boundary** via `scripts/checks/check-dependency-boundaries.sh` (`pnpm check:deps`), run on every PR touching packages/apps.

4. **Replacements swap adapter implementations** (or delete adapters) while keeping public component APIs stable.

## Consequences

### Positive

- Single choke point per external family for migration to internal primitives.
- Clear audit surface for dependency inventory and security review.
- Apps can stay on `@ui-construction-library/*` imports only.

### Negative

- Thin adapter files add indirection until primitives land.
- Boundary script is string-based (`rg`); exotic import paths need script updates.

### Follow-ups

- Phase 1: internal motion + icon generator; remove Framer/Lucide from hot path.
- Phase 2: `@ui-construction-library/primitives` and `dnd`; drop Radix/dnd-kit from `core` dependencies.
- Extend enforcement to `apps/*/package.json` forbidden deps via `scripts/checks/check-app-dependency-policy.sh` (included in `pnpm check:deps`).

## References

- `packages/core/src/adapters/`
- `scripts/checks/check-dependency-boundaries.sh`
- [Dependency policy](../guides/dependency-policy.md)
