#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

echo "[canary] platform preflight"
pnpm release:preflight
pnpm check:deps
pnpm check:api

echo "[canary] build workspace"
pnpm build

echo "[canary] publish to npm with dist-tag canary"
pnpm changeset publish --tag canary

echo "[canary] done — promote with: pnpm changeset publish --tag latest"
