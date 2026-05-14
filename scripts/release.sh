#!/usr/bin/env bash
set -euo pipefail

echo "[release] preflight"
pnpm release:preflight

echo "[release] version packages (changesets)"
pnpm version-packages

echo "[release] publish"
pnpm release

echo "[release] done"
