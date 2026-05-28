# Deterministic vs AI-Assisted Decisions

## Purpose

This document records the intended boundary between deterministic platform behavior and future AI-assisted behavior so the product remains governable, debuggable, and trustworthy.

## Deterministic by design

The following system areas should remain deterministic for the same structured input:

- Schema validation and required shape checks.
- Registry metadata lookup and component resolution.
- Builder document normalization and editing invariants.
- Export pipeline stages: normalize, analyze, enrich, render, post-process.
- Export diagnostics and unsupported-node handling.
- Prompt-engine baseline recipes when given the same structured `PromptRequest`.
- Builder-to-export compatibility checks.
- Dependency manifests and generated artifact structure for stable export targets.

## AI-assisted or probabilistic candidates

The following areas may use AI assistance in the future, but only behind explicit product boundaries:

- Prompt expansion from freeform user text into structured prompt requests.
- Clarification question generation for underspecified user intent.
- Suggestion systems for layout alternatives, copy variants, or component swaps.
- Repair suggestions expressed in natural language.
- Asset suggestions, content suggestions, and optional enhancement proposals.

## Guardrails

Any AI-assisted layer should follow these rules:

- It must feed deterministic downstream contracts instead of bypassing schema, registry, or export validation.
- It must surface uncertainty, assumptions, and alternatives explicitly.
- It must not silently mutate accepted user-authored builder state.
- It must fail closed when output cannot be converted into builder-compatible structure.
- It must preserve explainability sufficient for diagnostics and review.

## Product implication

The product should be marketed and designed around a hybrid model:

- AI can help propose or clarify.
- Deterministic systems decide structure, validity, compatibility, and exportability.

That boundary is a product advantage, not a limitation. It is what makes the system safer than raw AI page generation while still faster than manual builder-only workflows.
