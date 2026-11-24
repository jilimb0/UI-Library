# ADR-0005: ArchitectureFloorplan Template & Zod 4 Schema Contract

**Status:** Accepted  
**Date:** 2026-11-24  
**Deciders:** Core Engineering Team  
**Applies-To:** `packages/core/src/components/templates/ArchitectureFloorplan/**`, `packages/schema/src/zod/architecture-floorplan.schema.ts`, `scripts/mcp-server.mjs`  
**Supersedes:** None  
**Overrides-Global:** None  

## Y-Summary
In the context of visualizing multi-repo `gavel/floorplan@1` graphs across ecosystem dashboards, facing the need for WAI-ARIA compliance, SSR safety, integer-bps formatting, and strict package boundaries, we decided for `templates/ArchitectureFloorplan` on `--ucl-*` tokens and existing organisms (`Drawer`, `TreeView`, `KpiCard`, `Timeline`) with Zod 4 schema exports in `@ui-construction-library/schema`, neglecting standalone Vanilla JS HTML maps and cross-package internal imports, to achieve accessible zero-CDN rendering and MCP recipe discovery, accepting a local React 18 workspace test pin (`pnpm-workspace.yaml` Storybook compatibility) while exporting React 19+ `peerDependencies`.

## Context and Problem Statement
Ecosystem apps (`[4] RepoRadar`, `[16] Portfolio`, `[21] ReadMD`) require an interactive multi-zoom topology viewer for `gavel/floorplan@1` snapshots. Vendoring raw Vanilla JS HTML canvases violates design-token consistency, WAI-ARIA tree/drawer semantics, SSR guards, and package boundary checks.

## Decision Drivers
- **Axis 2 (Offline-First):** IndexedDB zoom-state persistence (`offlineCacheKey`) guarded for SSR.
- **Axis 4 (Numeric Precision):** Integer `bps` and `BigInt` micro-dollar formatting without IEEE 754 float math.
- **Axis 6 (Accessibility & SSR):** `typeof window !== 'undefined'` guards, `--ucl-*` tokens, WAI-ARIA landmarks, keyboard navigation, and 4 UI states (`Default`, `Loading`, `Empty`, `Error`).
- **Package Boundaries:** `packages/core` must not import `@ui-construction-library/schema` or `./src/*`/`./internal/*` paths.

## Imperative Constraints for AI Agents (MUST / MUST NOT)
- **MUST:** Keep `ArchitectureFloorplanProps` types mirrored in `packages/core/src/components/templates/ArchitectureFloorplan/types.ts` without importing `@ui-construction-library/schema`.
- **MUST:** Regenerate `packages/core/api-snapshot.json` via `pnpm update:api` whenever template exports change.
- **MUST NOT:** Use external fonts, CDNs, hardcoded colors, or unguarded `window`/`indexedDB` globals.
- **DO NOT RE-INTRODUCE:** Floating-point arithmetic for `assignedFilesBps`, `edgeResolutionCoverageBps`, or `aiLabelingCostMicroUsd`.

## Considered Options & Rejected Alternatives
1. **Option 1 (Chosen): `templates/ArchitectureFloorplan` on `--ucl-*` tokens + `packages/schema` Zod 4 contract**
   - *Why chosen:* Passes `check:boundaries`, `check:public-surface`, and `check:api` while staying React 18/19 peer-compatible (`>=18.0.0`) and Zod 4 (`^4.6.6`).
2. **Option 2 (Rejected — DO NOT PROPOSE): Custom HTML canvas or lifting `pnpm-workspace.yaml` `react: 18.3.1` override before Storybook/testing-library alignment**
   - *Why rejected:* Unpinning `react: 18.3.1` in `pnpm-workspace.yaml` currently splits React trees in Storybook 10 / `@testing-library/react` offline unit tests; `peerDependencies: ">=18.0.0"` already supports React 19 consumers cleanly.

## Consequences & Trade-offs
- **Positive:** Immediate drop-in template with subpath `@ui-construction-library/core/ArchitectureFloorplan` and MCP recipe `architecture-floorplan`.
- **Negative / Cost:** Consumers running React 19 keep `peerDependencies` compatibility while `ui-library` internal Storybook tests remain pinned at 18.3.1 until Storybook resolves its dual-React peer resolution.

## Verification Gate
- **Check Command:** `pnpm typecheck && pnpm check:boundaries && pnpm check:public-surface && pnpm check:api && pnpm test`
- **Code Anchors:** `packages/core/src/components/templates/ArchitectureFloorplan/ArchitectureFloorplan.tsx`, `packages/schema/src/zod/architecture-floorplan.schema.ts`, `packages/core/api-snapshot.json`.
