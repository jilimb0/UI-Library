#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[stable] platform preflight"
pnpm release:preflight
pnpm check:deps
pnpm check:api

echo "[stable] build workspace"
pnpm build

echo "[stable] publish to npm with dist-tag latest"
pnpm changeset publish --tag latest

echo "[stable] done"
