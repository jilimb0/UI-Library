# Contributing to UI Construction Library

Thank you for considering contributing! This document covers the practical how-to for submitting changes, plus the conventions we follow.

## Quick start

```bash
# Prerequisites
node >= 24
pnpm >= 11

# Setup
git clone <your-fork>
cd UI-Library
pnpm install
pnpm build
pnpm test
```

## How to contribute

1. **Fork** the repository
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
3. **Write tests** for your changes
4. **Run validation locally**:
   ```bash
   pnpm validate          # package scope
   pnpm validate:platform # when changing platform/apps
   ```
5. **Open a pull request** using the PR template

## Signed commits

We require all commits to be cryptographically signed with a key associated with your GitHub account. This ensures the authenticity of contributions and is enforced by branch protection rules.

### How to sign commits

1. [Generate a GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key) (or use an SSH key)
2. [Add the key to your GitHub account](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account)
3. Configure Git:
   ```bash
   git config --global user.signingkey <YOUR_KEY_ID>
   git config --global commit.gpgSign true
   ```
4. Verify with:
   ```bash
   git commit -S -m "feat: my signed commit"
   git log --show-signature
   ```

## Code style

We use **Biome** for linting and formatting (line width 80, single quotes). No ESLint or Prettier is involved.

```bash
pnpm lint        # check
pnpm format      # auto-fix
```

TypeScript strict mode is enforced. Avoid `any` — use `unknown` with narrowing or proper union types.

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add FormFieldArray component
fix: resolve Modal.Content SSR hydration mismatch
docs: update getting-started guide
chore: bump biome to 2.4.15
```

Every PR that modifies a public package **must include a Changeset**:

```bash
pnpm changeset
```

Select the change type (patch / minor / major) and describe what changed.

## Testing

- Unit tests: `pnpm test`
- E2E tests: `pnpm check:e2e`
- Performance tests: `pnpm check:perf`
- Accessibility: `jest-axe` in unit tests + `@axe-core/playwright` in E2E
- Visual regression: Chromatic (runs automatically in CI)

Add tests for every new component or behavior change. Aim for ≥80% coverage on modified files.

## Documentation

- New components need a Storybook story and a JSDoc `@example` block
- New features need an entry in the relevant `docs/` guide
- Breaking changes need an entry in `docs/migration/MIGRATION-GUIDE.md`

## Reporting issues

Use the issue templates in `.github/ISSUE_TEMPLATE`:

- **Bug report** — include reproduction steps, expected vs actual behavior, and environment details
- **Feature request** — describe the use case and proposed API
- **Question** — ask away

## Communication

- **GitHub Issues** — bug reports and feature requests
- **GitHub Discussions** — Q&A, ideas, and community conversations
- **Conduct** — be respectful and professional in all interactions. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
