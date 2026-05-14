#!/usr/bin/env bash
set -euo pipefail

echo "[preflight] install"
pnpm install --frozen-lockfile

echo "[preflight] lint"
pnpm lint

echo "[preflight] typecheck"
pnpm typecheck

echo "[preflight] test"
pnpm test

echo "[preflight] build"
pnpm build

echo "[preflight] demo typecheck"
pnpm demo:typecheck

echo "[preflight] demo build"
pnpm demo:build

echo "[preflight] done"
