# UI Library Market Comparison

## Positioning

The library targets a balance of:

1. Strong accessibility defaults.
2. Source-distribution and preset-driven DX.
3. Strict CI quality gates across API, visual, performance, and dependency policy.

The Phase G positioning is more specific:

- deterministic structure over freeform UI generation
- governed editing over unconstrained canvas mutation
- production-trustworthy exports over best-effort handoffs
- collaboration-aware builder workflows over isolated component previews

## Comparison Matrix

| Capability | This Library | Typical UI Kit |
| --- | --- | --- |
| A11y contract tests in CI | Yes | Partial/optional |
| Source distribution mode | Yes | Rare |
| Preset bootstrap (enterprise/saas/marketing) | Yes | Rare |
| Dependency boundary policy | Enforced | Often undocumented |
| Visual regression gate | Enforced workflow | Usually optional |
| Bundle/perf budget gate | Enforced | Often advisory |

## Benchmark Rubric

The public benchmark should compare adjacent tools on:

| Axis | What to measure | Why it matters |
| --- | --- | --- |
| Reliability | Successful completion of prompt → edit → export → run | Proves the system can ship usable output |
| Editability | Time and friction to refine generated output safely | Shows whether generated drafts stay practical |
| Export quality | Fidelity, determinism, and runnable artifact success | Determines whether the handoff is trustworthy |

## Adjacent Tool Framing

- Generic UI kits usually win on breadth of raw primitives but do not own the workflow from prompt to export.
- Raw AI code generators usually win on novelty but not on deterministic edits, governance, or export reliability.
- This library’s differentiated claim is the full path: prompt input, governed builder refinement, deterministic export, and runnable proof.

## Strategic Differentiators

1. Policy-driven reliability (docs + CI).
2. Monorepo governance with explicit ownership and boundaries.
3. Integration-kit approach for real production stacks.
4. End-to-end flagship flows that can be shown, measured, and repeated.
