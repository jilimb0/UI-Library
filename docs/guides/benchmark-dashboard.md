# Benchmark Dashboard

This guide describes the benchmark reporting surface used for release validation.

## Purpose

- Track bundle-size, performance, and regression signals across major packages.
- Provide a stable check for release readiness and platform changes.

## Suggested metrics

- Package build time
- Bundle size
- Render latency on key demo and builder paths
- Test/runtime health on changed packages

## Review cadence

- Update the dashboard when release-critical packages change.
- Re-run the dashboard before promotion to stable.
- Keep historical deltas visible so regressions are easy to spot.
