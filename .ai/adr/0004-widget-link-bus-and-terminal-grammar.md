# ADR-0004: WidgetLinkBus, Terminal Command Grammar, Tiling Workspace & Synchronized Chart Grid

**Status:** Accepted  
**Date:** 2026-11-21  
**Deciders:** Core Engineering Team  
**Applies-To:** `packages/core/src/components/organisms/WidgetLinkBus/**`, `packages/core/src/components/organisms/CommandPalette/**`, `packages/core/src/components/organisms/TilingWorkspace/**`, `packages/core/src/components/organisms/SynchronizedChartGrid/**`, `packages/schema/src/zod/widget-link.schema.ts`, `scripts/mcp-server.mjs`  
**Supersedes:** None  
**Overrides-Global:** None (`GLOBAL-UI-01`, `GLOBAL-TS-03`, `GLOBAL-PRIV-01`)  

## Y-Summary
In the context of `@ui-construction-library/core` and `@ui-construction-library/schema`, facing fragmented multi-panel terminal workflows without cross-widget linking, command grammar, tiled workspaces, or synchronized multi-domain charts, we decided for **a `WidgetLinkProvider` context + `?g_<color>` URL sync + guarded `BroadcastChannel('ucl-widget-link')`, deterministic `[Subject] [Mnemonic] <GO>` / ratio parser in `CommandPalette`, 6-panel `TilingWorkspace`, and pure-SVG `BigInt`-projected `SynchronizedChartGrid`**, neglecting external charting libraries and float data series, to achieve zero-bloat bundle budgets, SSR safety, WAI-ARIA compliance, and exact integer precision, accepting localized CSS layout rules and `api-snapshot.json` updates.

## Context and Problem Statement
Financial, telemetry, and operations terminals (`Trader`, `MyPersFin`, `RepoRadar`, `Gavel`, `C&TLab`) require coordinated multi-panel layouts where selecting an entity in one widget updates peer widgets in the same color group (`G/B/R/A`), keyboard-first command execution (`AAPL DES`, `SOLUSDT / BTCUSDT`), `Alt+1..6` tiled focus cycling, and synchronized multi-domain time-series crosshairs without importing heavy third-party chart dependencies or violating SSR/precision invariants.

## Decision Drivers
- Zero IEEE 754 floating-point arithmetic on money, prices, bps, or scaled chart series (Axis 4)
- Strict SSR safety (`typeof window !== 'undefined'`) across URL sync, `BroadcastChannel`, `localStorage`, and global keyboard shortcuts (Axis 6)
- Zero-bloat bundle size (`< 70KB` gz JS, `< 20KB` gz CSS) and WAI-ARIA keyboard compliance across all 4 UI states (`default`, `loading`, `empty`, `error`) (Axes 6–7)
- Privacy-first cross-tab messaging transmitting only entity identifiers and timestamps without PII or tokens (Axis 5)

## Imperative Constraints for AI Agents (MUST / MUST NOT)
- **MUST:** Guard every reference to `window`, `document`, `localStorage`, `history.replaceState`, and `BroadcastChannel` with `typeof window !== 'undefined'` and wrap browser persistence/channel APIs in `try/catch`.
- **MUST:** Represent chart series points in `SynchronizedChartGrid` strictly via integer `valueScaled` + `scaleDecimals` + `BigInt` projection and validate link payloads with `LinkedEntityPayloadSchema`.
- **MUST:** Deduplicate incoming `BroadcastChannel` payloads by `(group, sourceWidgetId, updatedAtMs)` and never re-broadcast inside `onmessage`.
- **MUST:** Support all 4 UI states (`default`, `loading`, `empty`, `error` with `onRetry`) and `@media (prefers-reduced-motion: reduce)` across `LinkedPanel`, `TilingWorkspace`, and `SynchronizedChartGrid`.
- **MUST NOT:** Never introduce external charting libraries (`recharts`, `d3`, `echarts`, `chart.js`) or floating-point `cost_usd` / price math into `@ui-construction-library/core`.
- **MUST NOT:** Never emit PII, credentials, or balances over `BroadcastChannel('ucl-widget-link')` or URL query parameters.

## Considered Options & Rejected Alternatives
1. **Option 1 (Chosen): Native React Context + guarded `BroadcastChannel` + pure-SVG `BigInt` charts + zero-dependency grammar parser**
   - *Why chosen:* Keeps `@ui-construction-library/core` under its 70KB gzip budget, avoids dependency bloat, guarantees SSR and `BigInt` numeric safety, and integrates seamlessly with existing `CommandPalette`, `Skeleton`, `EmptyState`, and `Kbd` atoms/organisms.
2. **Option 2 (Rejected — DO NOT PROPOSE): Third-party chart library (`d3` / `recharts` / `lightweight-charts`) and global Redux/Zustand store**
   - *Why rejected:* Exceeds bundle-size budgets, introduces SSR/canvas hydration hazards, and forces float number series onto consumers.

## Consequences & Trade-offs
- **Positive:** Immediate cross-panel synchronization, full keyboard accessibility (`Alt+1..6`, `/` / `` ` `` / `Mod+k`, `ArrowLeft`/`ArrowRight`, `radiogroup` arrows), and ready-to-use MCP recipes (`terminal-workspace`, `widget-link-cockpit`).
- **Negative / Cost:** Pure SVG grid assumes moderate point counts per panel (suited for multi-domain fundamental/KPI/candle sparkline and terminal panels rather than raw tick-level WebGL millions of points).

## Verification Gate
- **Check Command:** `pnpm --filter @ui-construction-library/schema test && pnpm --filter @ui-construction-library/core test && node --test scripts/mcp-server.test.mjs && pnpm run check:api && pnpm run check:boundaries && pnpm run check:public-surface && pnpm lint && pnpm typecheck && pnpm build`
- **Code Anchors:** `packages/core/src/components/organisms/WidgetLinkBus/WidgetLinkBus.tsx`, `packages/core/src/components/organisms/CommandPalette/commandGrammar.ts`, `packages/core/src/components/organisms/CommandPalette/CommandPalette.tsx`, `packages/core/src/components/organisms/TilingWorkspace/TilingWorkspace.tsx`, `packages/core/src/components/organisms/SynchronizedChartGrid/SynchronizedChartGrid.tsx`, `packages/schema/src/zod/widget-link.schema.ts`, `scripts/mcp-server.mjs`
