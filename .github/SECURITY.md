# Security Policy

## Reporting a Vulnerability

The UI Construction Library team takes security seriously. If you discover a security vulnerability, please report it privately.

**Do not report security vulnerabilities via public GitHub issues.**

### How to report

1. **Email**: security@ui-library.com (responses within 48 hours)
2. **PGP key**: [Download public key](https://ui-library.com/.well-known/pgp-key.asc) — fingerprint `3A2B 1C4D 5E6F 7890 ABCD 1234 5678 9ABC DEF0 1234`

If you cannot reach the team via email, open a GitHub issue with `[SECURITY]` in the title and mark it as confidential (GitHub private vulnerability reporting).

### What to include

- Type of vulnerability (XSS, CSRF, RCE, etc.)
- Steps to reproduce
- Affected package(s) and version(s)
- Impact description
- Optional: suggested fix or patch

### What to expect

1. **Acknowledgment**: within 48 hours of your report.
2. **Triage**: within 5 business days — severity assessment and remediation plan.
3. **Fix**: critical vulnerabilities are patched within 7 days of triage; high-severity within 14 days.
4. **Disclosure**: coordinated public disclosure after a fix is released (typically 30 days from triage).

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.3.x (latest) | ✅ Security fixes |
| 0.2.x | ✅ Critical security fixes only |
| < 0.2 | ❌ No longer supported |

We recommend always using the latest published version of each `@ui-construction-library/*` package.

## Security Process

### Vulnerability handling

1. Reporter submits vulnerability via email or private report.
2. Maintainers acknowledge receipt within 48 hours.
3. Maintainers triage and assign a CVSS score.
4. Fix is developed, reviewed, and tested on a private branch.
5. Patch is released as a new version on npm.
6. Advisory is published via GitHub Security Advisories and sent to the npm security mailing list.

### CVE assignment

We will request a CVE identifier for all confirmed vulnerabilities that meet the CNA criteria. The CVE is published at the time of public disclosure.

## Security best practices for consumers

- Always pin your `@ui-construction-library/*` dependencies to a specific version or use a lockfile.
- Run `pnpm audit` regularly — we aim for zero high-severity vulnerabilities in our dependency tree.
- Report any suspicious package behavior (unexpected network calls, crypto operations, etc.) immediately.

## Hall of Fame

We maintain a private list of security researchers who have responsibly disclosed vulnerabilities. If you would like public acknowledgment, please let us know when reporting.
