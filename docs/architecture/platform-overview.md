# Platform Overview

## Problem statement
The repository currently provides a strong React-first UI library, but it lacks a platform-level architecture for a visual builder, machine-readable contracts, deterministic export pipelines, and collaboration-first product workflows.

## Scope
- Define layered platform architecture.
- Define package/app boundaries for foundation, runtime, builder, prompt engine, export engine.
- Define phased delivery strategy aligned with current monorepo.

## Non-goals
- Implementing full multi-framework runtimes in this phase.
- Rewriting existing core/primitives packages.

## Data model (high-level)
- `registry`: component metadata and recipes.
- `schema`: JSON schemas for layout/project/export/prompt.
- `layout document`: collaborative node tree.
- `project state`: persisted metadata, versions, publish snapshots.

## Public contracts
- Registry contract for components and recipes.
- Schema contract for builder/project/export/prompt payloads.
- Export contract with explicit target/version inputs.

## Technical decisions
- Keep React/Next as primary runtime.
- Introduce universal contracts before framework expansion.
- Builder remains deterministic without mandatory LLM dependency.
- CRDT-ready document model for realtime editor state.

## Migration path
1. Phase 0: architecture docs, naming strategy, current package audit.
2. Phase 1: foundation packages (`styles`, `schema`, `registry`) + token outputs.
3. Phase 2+: contract standardization, builder app, collaboration, export, prompt.

## Risks
- Over-expanding scope in early phases.
- Contract drift between runtime components and registry metadata.
- Export quality degradation without strict test gates.

## Open questions
- Preferred CRDT stack for builder state.
- Final storage model for snapshot/version history.
- Rollout strategy for package aliases when multi-runtime starts.
