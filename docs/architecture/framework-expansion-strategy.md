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
- Start with static export and web components before deeper framework adapters.

## Migration path
1. Stabilize universal contracts.
2. Add static export.
3. Add web components runtime.
4. Add Vue/Angular adapters with clear caveats.

## Risks
- Support burden growing faster than test capacity.
- Mismatch between framework idioms and shared contracts.

## Open questions
- Prioritization criteria for framework rollout.
- Ownership boundaries across adapter packages.
