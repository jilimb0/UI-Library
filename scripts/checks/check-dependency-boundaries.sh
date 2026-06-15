#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

assert_no_dependency() {
  local from_pkg="$1"
  local forbidden_pkg="$2"
  local dep_file="$ROOT_DIR/packages/$from_pkg/package.json"
  local found

  found=$(rg -n "\"$forbidden_pkg\"" "$dep_file" || true)
  if [[ -n "$found" ]]; then
    echo "Dependency boundary violation: @ui-construction-library/$from_pkg must not depend on @ui-construction-library/$forbidden_pkg"
    echo "$found"
    exit 1
  fi
}

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

# Layered dependency boundaries:
# tokens -> primitives -> dnd/motion -> core -> integrations -> apps
assert_no_dependency "tokens" "primitives"
assert_no_dependency "tokens" "dnd"
assert_no_dependency "tokens" "motion"
assert_no_dependency "tokens" "core"
assert_no_dependency "tokens" "integrations/react-hook-form"

assert_no_dependency "primitives" "dnd"
assert_no_dependency "primitives" "motion"
assert_no_dependency "primitives" "core"
assert_no_dependency "primitives" "integrations/react-hook-form"

assert_no_dependency "dnd" "core"
assert_no_dependency "dnd" "integrations/react-hook-form"
assert_no_dependency "motion" "core"
assert_no_dependency "motion" "integrations/react-hook-form"

assert_no_dependency "core" "integrations/react-hook-form"

echo "Dependency boundaries check passed."
