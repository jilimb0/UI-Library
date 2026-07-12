# External Setup (GitHub + npm)

These platform settings support the canonical release process documented in [`README.md`](./README.md) and [`RELEASE_RUNBOOK.md`](./RELEASE_RUNBOOK.md).

## GitHub Repository Settings

## 1) Pages

1. Go to `Settings -> Pages`.
2. Set `Source` to `GitHub Actions`.
3. Run `Demo Showcase Deploy` workflow.

## 2) Required Secrets

Go to `Settings -> Secrets and variables -> Actions` and add:

- `NPM_TOKEN`: npm automation token with publish access
- `CHROMATIC_PROJECT_TOKEN`: Chromatic project token. Keep this only in GitHub
  Actions secrets or a local shell environment; never commit it in
  `package.json`, `.env*`, or documentation.
- `CODECOV_TOKEN`: token for private repositories (optional for public)

## 3) Branch Protection (main)

Go to `Settings -> Branches -> Branch protection rules`:

- Require a pull request before merging
- Require status checks to pass before merging:
  - `CI`
  - `Performance`
  - `Security Audit` (if run on push/PR)
- Require branches to be up to date before merging
- Include administrators (recommended)

## npm Organization Setup

1. `npm whoami`
2. Ensure package access and org membership are correct.
3. Enable 2FA for publish account.
4. Create automation token for CI:

```bash
npm token create --type=automation
```

Use token value as `NPM_TOKEN` in GitHub secrets.

## Chromatic

### Token Setup
1. Go to [Chromatic](https://www.chromatic.com) → project settings
2. Copy `CHROMATIC_PROJECT_TOKEN`
3. Add to GitHub repo: Settings → Secrets and variables → Actions → New repository secret
   - Name: `CHROMATIC_PROJECT_TOKEN`
   - Value: paste the token

### Troubleshooting
If Chromatic redirects to sign-in on the PR check, the token is stale. Generate a new one.

## Verification Checklist

- [ ] `Release` workflow can publish packages
- [ ] `Demo Showcase Deploy` publishes and URL opens
- [ ] `Chromatic` workflow uploads Storybook
- [ ] `CI` + `Performance` workflows pass on PR
