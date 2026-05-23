# Benchmark Dashboard

## Current Baseline

| Metric | Result | Gate |
| --- | --- | --- |
| Core bundle gzip | 28.23 KB | <= 50 KB |
| Core CSS gzip | 6.35 KB | <= 20 KB |
| Performance test suite | 4/4 passed | required |
| Critical a11y regressions | 0 (contract + e2e gates) | required |

## Data Sources

- `pnpm check:bundle`
- `pnpm check:perf`
- CI runs (`ci.yml`, `chromatic.yml`)

## Update Procedure

1. Run `pnpm validate`.
2. Update baseline table if budgets are intentionally changed.
3. Link release notes to this page when metrics shift.
