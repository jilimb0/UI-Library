---
"@ui-construction-library/core": patch
"@ui-construction-library/react-hook-form": patch
"@ui-construction-library/export-core": patch
"@ui-construction-library/prompt-engine": patch
---

fix: post-release patch fixes for build reliability and TypeScript correctness

- **core**: correct `tsconfig.json` include globs — scoped test patterns to `src/` to prevent accidental inclusion of files outside source tree
- **react-hook-form**: fix TS2322 in `FormField` — cast `Input` to plain FC signature to avoid `RefAttributes<any>` type collapse under TS6 + strict project references
- **export-core**: fix import path in smoke test script
- **prompt-engine**: update diagnostic level from `warn` to `warning`, add `NOT_IMPLEMENTED` code
