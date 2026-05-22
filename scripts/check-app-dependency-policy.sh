#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Runtime UI packages apps must not declare directly (use @ui-construction-library/*).
FORBIDDEN='@radix-ui/|@dnd-kit/|framer-motion|lucide-react|cmdk'

violations=$(rg -n "\"($FORBIDDEN)" apps/*/package.json || true)

if [[ -n "$violations" ]]; then
  echo "App package.json policy violations (forbidden direct UI runtime deps):"
  echo "$violations"
  exit 1
fi

echo "App dependency policy check passed."
