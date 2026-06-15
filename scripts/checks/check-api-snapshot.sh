#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

SNAPSHOT="packages/core/api-snapshot.json"
GENERATED="$(mktemp)"

node scripts/checks/generate-api-snapshot.mjs > "$GENERATED"

if [[ ! -f "$SNAPSHOT" ]]; then
  cp "$GENERATED" "$SNAPSHOT"
  echo "API snapshot created at $SNAPSHOT"
  exit 0
fi

# Compare structure without volatile generatedAt timestamp
node -e "
const fs = require('fs');
const strip = (p) => {
  const o = JSON.parse(fs.readFileSync(p, 'utf8'));
  delete o.generatedAt;
  return JSON.stringify(o, null, 2);
};
const a = strip('$SNAPSHOT');
const b = strip('$GENERATED');
if (a !== b) process.exit(1);
" || {
  echo "API snapshot mismatch. Run: pnpm update:api"
  exit 1
}

echo "API snapshot check passed."
