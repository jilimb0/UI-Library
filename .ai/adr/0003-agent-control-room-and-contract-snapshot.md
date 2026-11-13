# ADR-0003: Agent Control Room Template & Integer Micro-Unit Telemetry Contract

**Status:** Accepted  
**Date:** 2026-11-09  
**Deciders:** Core Engineering Team  
**Applies-To:** `packages/core/src/components/templates/AgentControlRoom/**`, `packages/schema/src/**`  
**Supersedes:** None  
**Overrides-Global:** None  

## Y-Summary
In UI-Library, facing the need to visualize multi-agent pipelines without purchasing affectUI Pro, we implement templates/AgentControlRoom on existing organisms and export its Zod contract in api-snapshot.json with integer micro-dollar pricing.

## Context and Problem Statement
Multi-agent pipelines (Gavel, Trader, create-ready-stack) require a standard Control Room. Third-party single-file code is rejected due to styling and Float cost violations.

## Decision Drivers
- WAI-ARIA accessibility
- Integer numeric precision (Axis 4)
- Zero runtime overhead in MCP snapshot

## Imperative Constraints for AI Agents (MUST / MUST NOT)
- **MUST:** Represent all LLM costs strictly as integer micro-dollars (costMicros) and context usage as basis points (contextUsageBps)
- **MUST:** Compose AgentControlRoom strictly from TreeView, Timeline, Drawer, and KpiCard
- **MUST:** Export contract to packages/core/api-snapshot.json and provide recipe in scripts/mcp-server.mjs
- **MUST NOT:** Never accept float cost_usd fields in schemas or props
- **MUST NOT:** Never call browser-only globals without typeof window !== "undefined" guards

## Considered Options & Rejected Alternatives
1. **Option 1 (Chosen): Template AgentControlRoom composed of existing accessible organisms with Zod schema and MCP recipe**
   - *Why chosen:* Satisfies all decision drivers and domain invariants.
2. **Option 2 (Rejected — DO NOT PROPOSE): Ad-hoc unvalidated implementation**
   - *Why rejected:* Violates deterministic contract and causes architectural drift.

## Consequences & Trade-offs
- **Positive:** Deterministic enforcement and zero architectural drift.
- **Negative / Cost:** Requires compliance across `packages/core/src/components/templates/AgentControlRoom/**`, `packages/schema/src/**`.

## Verification Gate
- **Check Command:** `pnpm typecheck && pnpm check:boundaries && pnpm test`
