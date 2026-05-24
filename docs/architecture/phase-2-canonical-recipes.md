# Phase 2 — Canonical Recipes

## Goal

Define reusable, machine-readable component recipes that stay aligned with builder insertion defaults, export expectations, and prompt generation examples.

## Recipe rules

- Every recipe must have a stable `id`, human-readable `label`, and a concise `description`.
- `requiredProps` must name the minimum inputs needed for a meaningful instance.
- `recommendedDefaults` must be deterministic and safe to serialize.
- `a11yCaveats` should document risks or extra authoring work required by the recipe.
- `doExample` and `dontExample` should be short and practical, not marketing copy.

## Coverage target

Phase 2 recipes should cover the most common foundational compositions:

- action button variants;
- text input states;
- section/container scaffolds;
- inline feedback/status messaging;
- common layout primitives used by the builder starter canvas.
