# ADR-0001: WAI-ARIA Accessibility, SSR Guards & Snapshot-Driven MCP Server

**Status:** Accepted  
**Date:** 2026-10-29  
**Deciders:** Core Engineering Team  
**Applies-To:** `packages/core/**`, `packages/tokens/**`, `scripts/**`  
**Supersedes:** None  
**Overrides-Global:** None (`GLOBAL-UI-01`, `GLOBAL-TS-03`, `GLOBAL-PRIV-01`)  

## Y-Summary
In the context of `@ui-construction-library/core` and `packages/tokens`, facing SSR hydration crashes, accessibility regressions, and LLM prop hallucinations, we decided for **mandatory WAI-ARIA roles, `typeof window !== 'undefined'` SSR guards, token-only styling from `packages/tokens`, and a zero-dependency `stdio` MCP server reading `packages/core/api-snapshot.json`**, to guarantee <10ms contract lookup and SSR-safe accessible components, accepting snapshot regeneration on API changes.

## Context and Problem Statement
UI-Library provides 80+ components for Telegram Mini Apps, SSR web apps, and mobile interfaces. Direct access to browser globals (`window`, `document`) crashes Next.js SSR, hardcoded CSS values break theme switching, and AI coding agents frequently hallucinate non-existent component props unless given a fast, authoritative contract source.

## Decision Drivers
- Full WAI-ARIA and keyboard navigation compliance across all components (`GLOBAL-UI-01`)
- Safe execution under SSR and Node.js test environments (`GLOBAL-UI-01`)
- Sub-10ms MCP contract queries without heavy runtime AST parsing

## Imperative Constraints for AI Agents (MUST / MUST NOT)
- **MUST:** Guard every browser-only API (`window`, `document`, `localStorage`, `matchMedia`, `ResizeObserver`) with `typeof window !== 'undefined'`.
- **MUST:** Source all color, spacing, radius, and typography values exclusively from `packages/tokens`.
- **MUST:** Maintain package boundary rules (`pnpm check:boundaries`) and update `packages/core/api-snapshot.json` when component props change.
- **MUST NOT:** Never write logs to `stdout` inside `scripts/mcp-server.mjs` (`stdio` JSON-RPC 2.0 stream).

## Considered Options & Rejected Alternatives
1. **Option 1 (Chosen): Pre-built `api-snapshot.json` + zero-dependency `scripts/mcp-server.mjs` + SSR guards**
   - *Why chosen:* Responds to `uilibrary_get_component_contract` in <10ms with zero runtime dependencies (`node:readline` + `node:fs`).
2. **Option 2 (Rejected — DO NOT PROPOSE): Live TypeScript compiler AST parsing inside MCP requests**
   - *Why rejected:* Adds >1.5s latency per MCP tool call and bloats memory footprint.

## Consequences & Trade-offs
- **Positive:** Zero prop hallucinations by coding agents; 100% SSR and WAI-ARIA safety.
- **Negative / Cost:** Public prop changes require keeping `api-snapshot.json` synchronized.

## Verification Gate
- **Check Command:** `pnpm typecheck && pnpm check:boundaries && pnpm test`
- **Code Anchors:** `scripts/mcp-server.mjs`, `packages/core/api-snapshot.json`
