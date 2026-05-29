# @ui-construction-library/prompt-engine

Deterministic prompt-to-UI draft generation for builder-compatible projects.

## Status

Current maturity: **experimental / platform-ready**.

This package is intended to convert structured prompt input into builder-compatible draft projects with deterministic behavior, explicit safety rails, validation, repair, and explainability metadata. It is currently suitable as an internal platform subsystem and integration surface for the builder app, but it should not yet be treated as a broadly stable public API.

## Responsibilities

- Accept structured prompt requests.
- Choose a deterministic generation mode.
- Produce builder-compatible draft project output.
- Validate generated drafts against schema-required shapes.
- Repair common invalid draft structures.
- Surface explainability metadata such as assumptions, alternatives, recipe identifiers, and used components.

## Current public surface

Primary concepts currently exposed by the package:

- `PromptRequest`
- `PromptResponse`
- `PromptGenerationMode`
- `NormalizedPromptRequest`
- `PromptDraftReviewSummary`
- `PromptRecipeSummary`
- `normalizePromptRequest()`
- `generatePromptDraft()`
- `validatePromptDraftProject()`
- `repairPromptDraftProject()`
- `toBuilderCompatibleProject()`
- `getPromptGenerationSafetyRails()`
- `summarizePromptResponse()`
- `summarizePromptRecipe()`

## Design goals

- Deterministic output for the same structured input.
- Builder-first compatibility over freeform AI output.
- Safe degradation with explicit diagnostics and repair behavior.
- Explainability strong enough to support product UI and future governance features.

## Non-goals

- Freeform LLM orchestration.
- Pixel-perfect visual design generation.
- Runtime-specific app generation.
- Final export rendering.
- Replacement for builder editing or export validation.

## Current limitations

- Generation modes are intentionally narrow.
- Output recipes are still baseline and deterministic-first.
- The package is optimized for internal integration, not yet for wide external consumption.
- Broader section-repair and multi-step regeneration workflows are still future work.

## Intended evolution

Planned evolution areas include:

- richer registry-aware prompt recipes;
- section-level regeneration and protected-user-edit workflows;
- stronger explainability and clarification loops;
- improved package maturity with build, lint, typecheck, and release packaging parity.
