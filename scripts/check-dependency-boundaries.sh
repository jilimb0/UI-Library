#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PATTERN="from '@radix-ui/|from 'framer-motion|from '@dnd-kit/|from 'lucide-react"

violations=$(rg -n "$PATTERN" packages/core/src \
  -g '!**/adapters/**' \
  -g '!**/*.stories.tsx' || true)

if [[ -n "$violations" ]]; then
  echo "Dependency boundary violations found (use packages/core/src/adapters/*):"
  echo "$violations"
  exit 1
fi

echo "Dependency boundaries check passed."
