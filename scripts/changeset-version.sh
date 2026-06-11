#!/usr/bin/env bash
# changeset-version.sh
# Called by changesets/action `version:` command.
#
# 1. Runs `pnpm changeset version` — bumps package.json versions and
#    updates CHANGELOG.md files for all publishable packages.
# 2. Runs sync-app-versions.js — updates @ui-construction-library/* semver
#    ranges in apps/*/package.json so the Version PR is self-consistent.
#    Apps use published semver ranges (not workspace:*) so they resolve
#    correctly when users install from npm.
set -euo pipefail

echo "[changeset-version] running changeset version"
pnpm changeset version

echo "[changeset-version] syncing app dependency versions"
node scripts/sync-app-versions.js

echo "[changeset-version] done"
