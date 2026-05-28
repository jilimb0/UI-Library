# Flagship Flows

This document defines the canonical proof flows for Phase G. Each flow must exist as a prompt input, a builder state, an exported artifact, and a runnable demo surface.

## 1. SaaS landing page

- **Prompt input:** conversion-focused landing page for a B2B analytics product
- **Builder state:** hero, proof strip, pricing teaser, and trial CTA with section-level regeneration
- **Exported artifact:** React single-page export with route-aware shell and deterministic tokens
- **Runnable demo:** showcase hero and architecture sections

## 2. Dashboard shell

- **Prompt input:** admin dashboard with KPI cards, dense tables, and quick filters
- **Builder state:** edit mode, tree operations, inspector editing, and batch-safe interactions
- **Exported artifact:** route-backed app shell export with table and layout primitives
- **Runnable demo:** data-heavy component gallery and live table interactions

## 3. Settings app

- **Prompt input:** account settings with profile editing, notification preferences, and security toggles
- **Builder state:** review mode with validation, comments, and protected edits
- **Exported artifact:** form-driven React or HTML export with typed state and accessible controls
- **Runnable demo:** form integration surface and modal interaction examples

## 4. Docs page

- **Prompt input:** docs page with sticky sidebar, section anchors, and code examples
- **Builder state:** review and publish modes that preserve the documented page structure
- **Exported artifact:** multi-page export with route structure and shared theme layer
- **Runnable demo:** architecture, integrations, and hooks sections in the showcase

## 5. Pricing site

- **Prompt input:** pricing page with clear plan tiers, comparison logic, and trust language
- **Builder state:** publish mode with role gating, version selection, and publish history
- **Exported artifact:** deterministic static or React export with pricing sections and theme tokens
- **Runnable demo:** theme playground and polished hero surface

## Release expectation

If a flow cannot be shown as prompt input, builder state, exported artifact, and runnable demo, it is not a flagship flow yet.

## Companion proof surface

The design-system showcase is represented by the demo showcase component gallery, theme playground, and this Storybook recipe page. It supports the flagship flows rather than replacing them.
