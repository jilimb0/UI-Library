#!/usr/bin/env bash
set -euo pipefail

echo "[release] preflight"
pnpm release:preflight

echo "[release] version packages (changesets)"
pnpm version-packages

echo "[release] sync versions into apps"
node scripts/sync-app-versions.js

echo "[release] install (update lockfile)"
pnpm install

echo "[release] publish"
pnpm release

echo "[release] done"
