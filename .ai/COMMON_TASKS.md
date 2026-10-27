# Common Development Tasks: UI-Library

## 1. Standard Commands
- **Run Storybook:** `pnpm storybook` — Starts interactive component catalogue.
- **Typecheck:** `pnpm typecheck` — Executes workspace typechecking.
- **Run tests:** `pnpm test` — Executes component and accessibility unit tests.
- **Lint code:** `pnpm lint` — Validates Biome code standards.

## 2. Recipe: Adding a New Feature
1. Review requirements against invariants in `.ai/ARCHITECTURE.md`.
2. Write a failing test in test directory verifying expected behavior.
3. Implement minimal clean code to satisfy the test.
4. Run `pnpm typecheck` and `pnpm test`.
5. Run `pnpm lint` to ensure code style compliance.

## 3. Recipe: Fixing a Bug
1. Reproduce defect with an automated regression test.
2. Verify test failure matches reported symptoms.
3. Apply targeted fix without modifying unrelated code.
4. Verify all tests pass with `pnpm test`.
