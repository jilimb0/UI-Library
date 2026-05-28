# SKU and Packaging Model

## Recommended packaging

| SKU | Audience | Included |
| --- | --- | --- |
| Open-source core | Individual contributors and evaluators | Builder, library packages, docs, demo showcase, baseline exports |
| Hosted builder | Teams that want managed editing | Collaboration, persistence, publish flows, identity, and usage diagnostics |
| Enterprise collaboration | Larger teams and regulated orgs | Governance controls, advanced roles, audit trails, supportability guarantees |
| Export packs | Teams shipping into multiple runtimes | Target-specific export pipelines and framework adapters |
| Template packs | Marketing, docs, SaaS, dashboard, pricing | Opinionated starting points and flagship flows |

## Boundary rules

- Keep the open-source core usable without a hosted backend.
- Treat hosted collaboration and enterprise governance as paid product surfaces.
- Package runtime targets separately when they require distinct support guarantees.
- Keep template packs opinionated, but never required for basic product adoption.

## Supportability standard

Every SKU should have:

1. documented inputs and outputs
2. a rollback or recovery story
3. validation or smoke coverage
4. a clear support tier

## Commercial framing

The business model should make it obvious which parts are free foundations and which parts are managed product experiences. The packaging boundary should reinforce the product story: deterministic core, governed builder, and trusted exports.
