# Framework Expansion Strategy

## Problem statement
Platform must support additional frameworks without destabilizing React-first delivery.

## Scope
- Define prerequisites for expansion.
- Define adapter/exporter sequence.

## Non-goals
- Immediate full feature parity across all frameworks.

## Data model
- Compatibility matrix keyed by component/recipe/export target.
- Target capability flags for props/events/slots/theming.

## Public contracts
- Export target contract with explicit version and support level.
- Adapter mapping contracts for non-React runtimes.

## Technical decisions
- Expansion after registry/schema/styles contracts stabilize.
- Additive adapters, no rewrite of React core packages.
- Static export and web components targets are implemented; deeper framework adapters require Phase 7 completion.

## Migration path
1. ✅ Stabilize universal contracts.
2. ✅ Add static export (`html-static`).
3. ✅ Add web components runtime (`web-components-static`).
4. ✅ Add Next.js app router target (`nextjs-app-router`).
5. Add Vue/Angular adapters with clear caveats (pending Phase 7).

## Risks
- Support burden growing faster than test capacity.
- Mismatch between framework idioms and shared contracts.

## Open questions
- Prioritization criteria for framework rollout.
- Ownership boundaries across adapter packages.
