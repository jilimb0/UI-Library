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
