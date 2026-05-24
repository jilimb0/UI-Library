# Prompt Generation Spec

## Problem statement
Users need text-to-draft generation, but output must remain deterministic and schema-valid.

## Scope
- Prompt input model.
- Intent taxonomy.
- Deterministic recipe-first generation flow.
- Optional AI adapter boundary.

## Non-goals
- End-to-end LLM orchestration implementation in this phase.

## Data model
Prompt request includes:
- product type, target audience, section/features, style/tone, density, domain, framework preference, detail level.

Prompt response includes:
- chosen intent/template,
- assembled sections,
- assumptions,
- alternatives,
- schema-valid layout draft.

## Public contracts
- `packages/prompt-engine` deterministic API.
- Validation gate that rejects outputs failing layout schema.

## Technical decisions
- No-AI path is mandatory baseline.
- AI adapter is optional and cannot bypass validation.
- Explainability metadata included by default.

## Migration path
- Phase 6: deterministic generator first.
- Then AI adapter for intent understanding and copy quality.

## Risks
- Prompt ambiguity and expectation mismatch.
- Regression risk as recipes evolve.

## Open questions
- Rule engine implementation approach.
- Versioning strategy for prompt taxonomy.
