# @ui-construction-library/utils

Internal-first infrastructure package for the UI Construction Library. Contains shared helpers, hooks, DOM utilities, and type utilities used by `core` and extension packages.

## When to use

**This package is not part of the recommended consumer path.**

It is used internally by `@ui-construction-library/core` and extension packages. Its exports are not covered by the same stability guarantees as the public packages.

If you are building application code, start with `@ui-construction-library/core` instead.

If you are building a custom extension package that needs to share infrastructure with the library, you may use this package — but be aware that its API may change between minor versions.

## Installation

```bash
pnpm add @ui-construction-library/utils
```

No peer dependencies required.

## What's inside

- `slugify` — converts a string to a URL-safe slug
- DOM utilities — browser environment detection, element helpers
- Type utilities — generic TypeScript helpers used across packages
- Event composition helpers — for building accessible interactive components

## Usage

```ts
import { slugify } from '@ui-construction-library/utils';

slugify('Hello World'); // 'hello-world'
slugify('UI Construction Library'); // 'ui-construction-library'
```

## Compatibility

- Framework-agnostic
- TypeScript 5.x and 6.x

## Public API

```ts
import { slugify } from '@ui-construction-library/utils';
```

## Stability note

This package is published but treated as internal-first. Exports may change between minor versions without a migration guide entry. If you depend on a specific utility, consider copying it into your own codebase rather than taking a runtime dependency on this package.
