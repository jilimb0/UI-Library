# Internal Packages

This document describes packages that are **internal to the library platform** and should not be imported in consumer application code.

---

## Why Some Packages Are Internal

The `@ui-construction-library` monorepo contains both public packages (published to npm for consumers) and internal packages (used by the builder, export pipeline, and AI tooling). Internal packages power platform features but are not part of the consumer API contract. Importing them directly in application code is unsupported and may break between releases without notice.

The machine-readable source of truth is `config/package-surface.json`.

---

## Internal Package Reference

### `@ui-construction-library/utils`

**Role:** Internal infrastructure — DOM helpers, type utilities, shared hooks used by `core` and extension packages.

**Why internal:** These are implementation details that change as `core` evolves. Depending on them directly creates brittle coupling. If a utility is stable enough for consumers, it gets promoted to `core`'s public exports.

---

### `@ui-construction-library/schema`

**Role:** Internal platform contract — JSON schemas for builder documents, export formats, and prompt-engine input validation.

**Why internal:** Schema definitions are a contract between the builder and export pipeline, not a consumer-facing API. Changes are coordinated with builder releases, not consumer semver.

---

### `@ui-construction-library/registry`

**Role:** Internal platform registry — component metadata catalog used by the builder, docs generator, and export pipeline.

**Why internal:** The registry maps component IDs to metadata (props schema, categories, variants). This powers the visual builder and AI generation tools. Consumers interact with components through `core`, not through registry lookups.

---

### `@ui-construction-library/export-core`

**Role:** Internal platform export pipeline — deterministic rendering of builder documents to React code.

**Why internal:** Export-core transforms builder JSON into component trees. It is used by the builder app's export and preview features. Consumers use the output (generated React code), never the pipeline itself.

---

### `@ui-construction-library/prompt-engine`

**Role:** Internal AI tooling — deterministic prompt-to-builder draft generation for AI-assisted UI creation.

**Why internal:** The prompt engine powers the builder's AI generation features. It is an experimental internal devtool, not a consumer library. Its API changes frequently as generation strategies evolve.

---

## Import Rules Summary

```ts
// Consumer application code — always from public packages
import { Button, ThemeProvider } from '@ui-construction-library/core';
import { SearchIcon } from '@ui-construction-library/icons';
import { FormField } from '@ui-construction-library/react-hook-form';

// Never import from internal packages in application code
// import { ... } from '@ui-construction-library/utils';      // NO
// import { ... } from '@ui-construction-library/schema';     // NO
// import { ... } from '@ui-construction-library/registry';   // NO
// import { ... } from '@ui-construction-library/export-core'; // NO
// import { ... } from '@ui-construction-library/prompt-engine'; // NO
```

If you find yourself needing an internal utility, open an issue — it may be a candidate for promotion to `core`'s public API.
