# Launch Tier Model

This document maps each SKU tier to its actual validation coverage, so the launch posture stays grounded in what is genuinely tested and ready — not aspirational claims.

---

## Current posture: internal alpha → design partner beta

The repository is ready for serious internal use and targeted design partner validation. The criteria for each tier are listed below alongside their current status.

---

## Tier 1 — Open-source core

**Audience:** Individual contributors, evaluators, open-source adopters.

**Included:** Builder app, all library packages, docs app, demo showcase, baseline exports.

| Validation criterion | Status |
|---|---|
| All packages typecheck clean | ✅ |
| Full test suite passes (≥ 200 tests) | ✅ 263 tests |
| Storybook stories for all components | ✅ |
| Public docs app deployed | ✅ |
| Integration kits documented | ✅ 5 kits |
| Migration guide for all breaking changes | ✅ |
| Accessibility contract documented | ✅ |
| Bundle sizes within budget | ✅ |

**Launch gate:** ✅ Ready for open-source release.

---

## Tier 2 — Hosted builder

**Audience:** Teams that want managed editing with collaboration and persistence.

**Included:** Everything in Tier 1 plus collaboration, persistence, publish flows, identity, and usage diagnostics.

| Validation criterion | Status |
|---|---|
| Supabase persistence end-to-end tested | ✅ |
| Role-based member management enforced | ✅ |
| Publish lifecycle gated by role | ✅ |
| Autosave recovery fingerprinted | ✅ |
| Remote sync banner warns on degraded state | ✅ |
| Audit trail covers all governance events | ✅ |
| Invite validation rejects malformed emails | ✅ |
| Beta-ready criteria checklist passing | ✅ |

**Launch gate:** ✅ Ready for design partner beta (initial cohort).

**Remaining before broad beta:**
- End-to-end flagship flows packaged as runnable demos
- Beta onboarding guide for design partners
- Feedback collection mechanism in place

---

## Tier 3 — Enterprise collaboration

**Audience:** Larger teams and regulated organisations.

**Included:** Everything in Tier 2 plus governance controls, advanced roles, audit trails, and supportability guarantees.

| Validation criterion | Status |
|---|---|
| Advanced role hierarchy (owner/admin/editor/commenter/viewer) | ✅ |
| Audit trail with recovery event types | ✅ |
| Support policy documented | ✅ |
| Compatibility matrix published | ✅ |
| SLA and escalation path defined | ❌ Not yet defined |
| Data residency and compliance documentation | ❌ Not yet defined |

**Launch gate:** ⚠️ Not ready. SLA and compliance docs required before enterprise positioning.

---

## Tier 4 — Export packs

**Audience:** Teams shipping into multiple runtimes.

**Included:** Target-specific export pipelines and framework adapters.

| Validation criterion | Status |
|---|---|
| `react-single-page` target — deterministic output | ✅ |
| `html-static` target — deterministic output | ✅ |
| `web-components-static` target — deterministic output | ✅ |
| `nextjs-app-router` target — deterministic output | ✅ |
| Acceptance checklist enforced in pipeline | ✅ |
| Deep dependency derivation correct | ✅ |
| Actionable diagnostics with node paths | ✅ |
| Additional targets (Vue, Angular, etc.) | ❌ Not yet implemented |

**Launch gate:** ✅ Ready for the four implemented targets. Additional targets require Phase 7 completion.

---

## Tier 5 — Template packs

**Audience:** Marketing, docs, SaaS, dashboard, and pricing teams.

**Included:** Opinionated starting points and flagship flows.

| Validation criterion | Status |
|---|---|
| SaaS landing page flow | ✅ Runnable demo packaged |
| Dashboard shell flow | ✅ Runnable demo packaged |
| Settings app flow | ✅ Runnable demo packaged |
| Docs page flow | ✅ Runnable demo packaged |
| Pricing site flow | ✅ Runnable demo packaged |
| Onboarding flow | ✅ Prompt recipe added |

**Launch gate:** ✅ Ready for template pack positioning.

---

## How to use this document

- Review before each design partner onboarding to confirm the tier they are being offered matches its gate status.
- Update status cells when validation coverage changes.
- Do not advance a tier's gate status without running `pnpm typecheck && pnpm test` and confirming the relevant criteria are met.
