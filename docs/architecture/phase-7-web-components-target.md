# Phase 7 Web Components Target

## Goal
Define the first richer runtime-style export target after `html-static` using a Web Components-compatible output shape.

## Why this target next
The existing framework expansion strategy explicitly places Web Components after static export and before deeper framework adapters such as Vue or Angular. This makes `web-components-static` the lowest-risk next target because it expands runtime semantics without forcing the platform to commit to another framework-specific component model yet.

## Target summary
`web-components-static` should:
- Accept the same normalized export IR as all other export-core targets.
- Render builder pages into custom-element markup instead of JSX.
- Emit a lightweight runtime module that registers baseline custom elements.
- Preserve deterministic file ordering and target-identifying README output.
- Reuse the same multi-page builder-shaped fixtures already used for other deterministic export tests.

## Minimum output contract
A valid `web-components-static` export should produce:
- `index.html` as the target entry point.
- `components.js` as the lightweight runtime registration layer.
- `README.md` identifying the target.

## Expected compatibility behavior
- Existing `react-single-page` output must remain unchanged.
- Existing `html-static` output must remain unchanged.
- Unsupported nodes should still degrade through explicit export diagnostics or visible unsupported placeholders.
- Generated custom elements are a runtime boundary, not a new builder authoring model.

## Future follow-up
If this target proves stable, the next Phase 7 decision can branch in one of two directions:
1. Build a richer framework adapter using lessons from the custom-element boundary.
2. Add an app/runtime shell on top of the now-expanded export target matrix.
