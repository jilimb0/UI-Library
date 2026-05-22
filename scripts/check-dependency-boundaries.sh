#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

TIER1_PATTERN="from '@radix-ui/|from 'framer-motion|from '@dnd-kit/|from 'lucide-react"

violations=$(rg -n "$TIER1_PATTERN" packages/core/src \
  -g '!**/*.stories.tsx' || true)

if [[ -n "$violations" ]]; then
  echo "Tier-1 UI import violations in packages/core (use @ui-construction-library/*):"
  echo "$violations"
  exit 1
fi

pkg_violations=$(rg -n "\"@radix-ui/|\"@dnd-kit/|\"framer-motion\"|\"lucide-react\"|\"cmdk\"|\"date-fns\"" packages/core/package.json || true)

import_violations=$(rg -n "from 'cmdk'|from \"cmdk\"|from 'date-fns'|from \"date-fns\"" packages/core/src \
  -g '!**/*.stories.tsx' || true)

if [[ -n "$import_violations" ]]; then
  echo "Forbidden utility imports in packages/core (use @ui-construction-library/utils):"
  echo "$import_violations"
  exit 1
fi

if [[ -n "$pkg_violations" ]]; then
  echo "Tier-1 runtime dependencies still declared in packages/core/package.json:"
  echo "$pkg_violations"
  exit 1
fi

echo "Dependency boundaries check passed."
