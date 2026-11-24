# Architecture: UI-Library

## 1. Identity & Domain
UI-Library — Comprehensive accessible headless and styled design system for Telegram Mini Apps, mobile web, and responsive interfaces.
- **Status:** active
- **Remote:** `https://github.com/jilimb0/UI-Library.git`
- **Default Branch:** `main`

## 2. Stack & Runtime
- **Runtime:** TypeScript, React, Storybook, Biome, Vitest, Turbo.
- **Directories:** `apps`, `packages`, `scripts`, `tests`, `public`

## 3. Structural Invariants
- Components in `packages/core` must maintain full WAI-ARIA accessibility compliance.
- Design tokens in `packages/tokens` are the single source of truth for color, spacing, and typography.
- Never introduce browser-only globals without SSR guards (`typeof window !== 'undefined'`).

## 4. Data Flows & External Boundaries
- Inbound requests are validated at perimeter boundaries using strict schemas.
- Outbound third-party calls must employ timeouts, retries with backoff, and circuit breakers.
- Zero secrets or unredacted customer PII in logs or storage snapshots.

## 5. Active ADRs
- **[ADR-0001](.ai/adr/0001-wai-aria-tokens-and-stdio-mcp-snapshot.md)** (`packages/core/**`, `packages/tokens/**`, `scripts/**`): Mandatory WAI-ARIA compliance, `typeof window !== 'undefined'` SSR guards, `packages/tokens` single source of truth, and snapshot-backed `stdio` MCP server (`scripts/mcp-server.mjs`).
- **[ADR-0002](.ai/adr/0002-resilience-rate-limiting-and-privacy-telemetry.md)** (`packages/utils/**`, `packages/tokens/**`, `packages/core/**`, `apps/**`): Sliding window rate limiting, privacy-first telemetry with strict PII scrubbing, stable funnel selectors, and first-class `*-foreground` token parity with neutral theme support.
- **[ADR-0003](.ai/adr/0003-agent-control-room-and-contract-snapshot.md)** (`packages/core/src/components/templates/AgentControlRoom/**`, `packages/schema/src/**`): In UI-Library, facing the need to visualize multi-agent pipelines without purchasing affectUI Pro, we implement templates/AgentControlRoom on existing organisms and export its Zod contract in api-snapshot.json with integer micro-dollar pricing.
- **[ADR-0004](.ai/adr/0004-widget-link-bus-and-terminal-grammar.md)** (`packages/core/src/components/organisms/**`, `packages/schema/src/zod/widget-link.schema.ts`, `scripts/mcp-server.mjs`): Color-coded `WidgetLinkBus` (`?g_<color>` + guarded `BroadcastChannel`), `[Subject] [Mnemonic] <GO>` & ratio parser in `CommandPalette`, 6-panel `TilingWorkspace` (`Alt+1..6`), and pure-SVG `BigInt`-projected `SynchronizedChartGrid`.
- **[ADR-0005](.ai/adr/0005-architecture-floorplan-template-and-schema-contract.md)** (`packages/core/src/components/templates/ArchitectureFloorplan/**`, `packages/schema/src/zod/architecture-floorplan.schema.ts`, `scripts/mcp-server.mjs`): `templates/ArchitectureFloorplan` on `--ucl-*` tokens, SSR-guarded IndexedDB cache, integer-bps/BigInt KPIs, Zod 4 schema contract, and `architecture-floorplan` MCP recipe.
