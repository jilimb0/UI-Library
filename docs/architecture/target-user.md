# Target User Persona

## Primary: Advanced Full-Stack TypeScript Developer

### Profile

- **Experience level:** Senior or staff engineer, 5+ years with React and TypeScript.
- **Scope:** Maintains 1–3 production products (SaaS dashboards, internal tools, admin panels).
- **Stack:** TypeScript-first. Uses Next.js or Vite + React. TanStack Query for data, react-hook-form for forms, i18next for localization.
- **Design relationship:** Works with a designer or owns design decisions. Needs a system, not one-off components.

### Pain Points This Library Solves

1. **Fragmented UI across products.** Each app drifts — different button styles, different form patterns, different data-table implementations. This library provides a single UI language enforced through tokens and typed component APIs.

2. **Integration glue is repetitive.** Every Next.js app needs SSR-safe theme providers. Every TanStack Query app needs loading/error/empty boundary wrappers. Every RHF app needs typed field bindings. These integrations are the library's first-class concern, not community add-ons.

3. **MUI/Ant are too heavy.** Full-featured frameworks bring their own styling system, bundle weight, and opinionated patterns. The target user wants composability — pick `core` + the integrations you need, nothing more.

4. **shadcn/Radix are too bare.** Headless primitives solve accessibility but leave design-system coherence, token management, and framework integration as homework. This library adds the opinionated layer on top.

### What the Target User Expects

- **Single entry point:** `pnpm add @ui-construction-library/core` and it works.
- **TypeScript-first:** Full type safety on component props, variants, and integration bindings.
- **Design tokens with light/dark:** Semantic tokens that map to CSS variables, swappable at runtime.
- **Integration packages that compose:** `integration-next` + `core` + `react-hook-form` should yield a working app shell in under an hour.
- **No lock-in:** Each package is independently installable. Using `tokens` alone is valid.

---

## Secondary: Library Maintainer / Platform Engineer

- Works on the builder, export pipeline, or prompt-engine tooling.
- Consumes internal packages (`schema`, `registry`, `export-core`, `prompt-engine`).
- Needs clear boundaries between public and internal surfaces.
- Values the machine-readable `config/package-surface.json` contract.

---

## Anti-Personas (Who This Library Is NOT For)

- **Marketing site builders.** The library is scoped to app shells and data UI, not landing pages or CMS-driven content sites.
- **Beginner React developers.** Assumes familiarity with providers, hooks, composition patterns, and TypeScript generics.
- **Teams wanting a full framework.** If you need routing, state management, and data fetching baked in, this is not the right tool.
