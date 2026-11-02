# ADR-0002: Sliding Window Rate Limiting, Privacy-First Telemetry & Semantic Tokens

**Status:** Accepted  
**Date:** 2026-11-02  
**Deciders:** Core Engineering Team  
**Applies-To:** `packages/utils/**`, `packages/tokens/**`, `packages/core/**`, `apps/**`  
**Supersedes:** None  
**Overrides-Global:** None (`GLOBAL-RESIL-01`, `GLOBAL-PRIV-01`, `GLOBAL-UI-01`)  

## Y-Summary
In the context of `@ui-construction-library/utils`, `packages/tokens`, and `packages/core`, facing public API abuse, LLM quota exhaustion, PII leakage in telemetry, and theme token discrepancies, we decided for **in-memory Sliding Window Rate Limiting, strict regex-based PII redaction with Do-Not-Track compliance, data-analytics-id/data-testid funnel attributes, and first-class *-foreground semantic token pairs with neutral theme support**, to guarantee resilience against DoS, 100% PII-free telemetry, and cross-theme consistency, accepting timestamp tracking memory usage.

## Context and Problem Statement
UI-Library provides headless/styled components, interactive builder tools, and showcase apps. Without request rate limiting, public endpoints and AI generation calls are vulnerable to DoS attacks, credential brute-forcing, and vendor budget overruns. Concurrently, product telemetry without strict client-side sanitization risks capturing customer PII (emails, OAuth tokens, API keys) in analytics streams. Additionally, design tokens lacked `*-foreground` pairs in TypeScript types, and `ThemeProvider` lacked first-class support for the `neutral` theme.

## Decision Drivers
- Protection of computational and AI generation resources (`GLOBAL-RESIL-01`)
- Zero-leakage privacy guarantee for logs and event telemetry (`GLOBAL-PRIV-01`)
- APG accessibility and stable E2E/analytics selector stability (`GLOBAL-UI-01`)
- Complete single-source parity between CSS variables and TypeScript token interfaces

## Imperative Constraints for AI Agents (MUST / MUST NOT)
- **MUST:** Protect public API and AI/heavy operations with sliding window rate limiting returning HTTP 429 and `Retry-After`.
- **MUST:** Redact emails, auth tokens, passwords, and API keys via `redactPII` before emitting telemetry events.
- **MUST:** Respect `navigator.doNotTrack === '1'` and disable tracking when DNT is active or user opt-out is received.
- **MUST:** Provide stable `data-testid` and `data-analytics-id` on conversion/pricing/auth interactive elements.
- **MUST NOT:** Never expose unredacted user credentials, full emails in URLs, or secret keys in application event streams or stdout.

## Considered Options & Rejected Alternatives
1. **Option 1 (Chosen): In-memory Sliding Window Rate Limiter + Zero-PII Telemetry Manager + Semantic Token Expansion**
   - *Why chosen:* Zero external infrastructure dependencies; microseconds latency; strict deterministic scrubbing of PII before any network dispatch; seamless SSR guards.
2. **Option 2 (Rejected — DO NOT PROPOSE): Third-party Redis-backed rate limiting for frontend/isomorphic utilities**
   - *Why rejected:* Adds unnecessary server infrastructure overhead for standalone libraries and isomorphic runtime components.

## Consequences & Trade-offs
- **Positive:** Protection against DoS and credential stuffing; clean conversion funnel analytics without privacy violations; 100% alignment between design tokens and runtime CSS.
- **Negative / Cost:** High-throughput clusters require centralized rate limiting at API perimeter gateways if running multi-instance backend containers.

## Verification Gate
- **Check Command:** `pnpm test && pnpm lint && pnpm check:boundaries`
- **Code Anchors:** `packages/utils/src/security/rateLimiter.ts`, `packages/utils/src/telemetry/index.ts`, `packages/tokens/src/colors.ts`, `packages/core/src/themes/ThemeProvider.tsx`
