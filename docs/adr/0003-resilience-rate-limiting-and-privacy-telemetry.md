# ADR-0003: Sliding window rate limiting and privacy-first telemetry

**Status:** Accepted  
**Date:** 2026-11-02  
**Owners:** `@ui-construction-library/utils`, `@ui-construction-library/core`

## Context

As UI-Library expanded to support full-stack builder workflows, AI prompt generation, and public component showcases, two critical perimeter boundaries required architectural formalization:

1. **Endpoint Resilience:** Public APIs, AI code-generation calls, and authentication flows require protection against brute-force attacks, DoS, and quota exhaustion without forcing external distributed cache dependencies on simple deployments.
2. **Telemetry Privacy:** Product telemetry must provide clear conversion funnel observability without capturing Customer Personally Identifiable Information (PII) such as email addresses, authorization tokens, or sensitive payload parameters.

## Decision

1. **Implement In-Memory Sliding Window Rate Limiting in `@ui-construction-library/utils`:**
   - Sliding window counter algorithm tracking request timestamps.
   - Built-in presets: `createStandardApiLimiter` (60 req/min), `createHeavyAiLimiter` (10 req/min), and `createAuthLimiter` (5 req/min).
   - Standard HTTP 429 semantics with deterministic `Retry-After` calculation.

2. **Implement Zero-PII Telemetry Manager in `@ui-construction-library/utils`:**
   - Strict regex scrubbing (`redactPII`) for emails, Bearer/JWT tokens, API keys, and sensitive dictionary keys (`password`, `token`, `secret`, `apiKey`).
   - Browser `navigator.doNotTrack` support — tracking disabled automatically when DNT is set to `1`.
   - SSR-safe execution with `typeof window !== 'undefined'` guards.

3. **Standardize Funnel Observability Attributes across Core Components:**
   - Permanent `data-analytics-id` and `data-testid` attributes on conversion gates (PricingTable, AuthShell, CTA buttons).

## Consequences

### Positive
- Zero external infrastructure dependency needed for local or single-node rate limiting.
- Full compliance with privacy standards and automated masking of sensitive data.
- Stable selectors for Playwright/Cypress automated E2E tests.

### Negative
- Multi-instance distributed container deployments require an external Redis proxy if rate limits must be coordinated across multiple physical nodes.

## References
- `packages/utils/src/security/rateLimiter.ts`
- `packages/utils/src/telemetry/index.ts`
- `packages/core/src/components/organisms/PricingTable/PricingTable.tsx`
