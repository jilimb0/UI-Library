# Beta-Ready Packaging Criteria for Design Partners

This document defines the explicit criteria that must be met before the UI Construction Library is presented to design partners as a beta product. Each criterion has a verifiable signal so readiness can be assessed objectively.

---

## 1. Core library stability

| Criterion | Signal | Status |
|---|---|---|
| All packages typecheck clean | `pnpm typecheck` exits 0 across all 22 packages | ✅ |
| Test suite passes | `pnpm test` exits 0 with ≥ 200 tests | ✅ |
| No critical a11y regressions | axe-playwright audit returns 0 critical violations | ✅ |
| Visual regression gates active | Chromatic CI workflow runs on every PR | ✅ |
| Bundle sizes within budget | core ≤ 50 kB min+gzip, primitives ≤ 10 kB | ✅ |

## 2. Builder shell readiness

| Criterion | Signal | Status |
|---|---|---|
| Prompt → draft → canvas flow works end-to-end | `runPromptTemplate` produces a builder-compatible project | ✅ |
| Review mode shows section overlays | `CanvasReviewOverlay` renders in `builderMode === 'review'` | ✅ |
| Publish lifecycle is gated by role | `canManageLifecycle` enforced before publish actions | ✅ |
| Autosave recovery is fingerprinted | `getRecoveryDraftSummary` returns a non-null summary after crash | ✅ |
| Remote sync banner warns on degraded state | `RemoteSyncBanner` renders for Supabase disconnected + memory modes | ✅ |

## 3. Export pipeline readiness

| Criterion | Signal | Status |
|---|---|---|
| React single-page export produces runnable output | `renderReactSinglePage` generates `src/App.tsx` + `package.json` | ✅ |
| Next.js App Router export produces runnable output | `nextjsAppRouterTarget.render()` generates `app/page.tsx` per IR page | ✅ |
| Acceptance checklist enforced in pipeline | `renderExportProject` appends error diagnostics for failed criteria | ✅ |
| Deep dependency derivation correct | `analyzeExportProject` adds motion/primitives/dnd when detected | ✅ |
| Export diagnostics include node path | `ExportDiagnostic.nodePath` populated for all unsupported nodes | ✅ |

## 4. Documentation readiness

| Criterion | Signal | Status |
|---|---|---|
| Public docs app deployed | `apps/docs` builds and serves without errors | ✅ |
| Integration kits cover 5 ecosystems | `docs/guides/integration-kits.md` has Vite, Next.js, Static, RHF, TanStack | ✅ |
| Migration guide covers all breaking changes | `docs/migration/MIGRATION-GUIDE.md` documents all 7 API changes | ✅ |
| Quality dashboard published | `QualityDashboard` component live in docs app | ✅ |
| Compatibility matrix current | `docs/guides/compatibility-matrix.md` reflects actual package versions | ✅ |

## 5. Collaboration readiness

| Criterion | Signal | Status |
|---|---|---|
| Role-based member management enforced | `memberPolicy.ts` gates all add/update/remove actions | ✅ |
| Audit trail covers governance events | `EventTimelinePanel` renders all 7 event types including recovery | ✅ |
| Invite validation rejects malformed emails | `ProjectMembersPanel` shows inline error for invalid email format | ✅ |

## 6. Open items before broad beta

The following items are not yet complete and should be resolved before inviting design partners beyond the initial cohort:

- [ ] End-to-end flagship flows packaged as runnable demos (all 5 flows from master plan section 3)
- [ ] Support-policy document published with explicit compatibility guarantees
- [ ] Beta onboarding guide written for design partners (install → first prompt → first export)
- [ ] Feedback collection mechanism in place (issue template or dedicated channel)

---

## How to use this document

Before each design partner onboarding:
1. Run `pnpm typecheck && pnpm test` and confirm both exit 0.
2. Check each ✅ criterion is still valid — re-run the signal if in doubt.
3. Review the open items list and decide whether any blockers apply to the specific partner's use case.
4. Update this document when criteria change or new ones are added.
