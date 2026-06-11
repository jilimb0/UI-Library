#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# run-local-ci.sh — mirrors the GitHub CI gate (ci.yml + validate:platform)
#
# Usage:
#   bash scripts/run-local-ci.sh              # full (validate:platform)
#   bash scripts/run-local-ci.sh --no-platform # code-only (validate)
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."
cd "$ROOT"

PLATFORM=true
[[ "${1:-}" == "--no-platform" ]] && PLATFORM=false

# ── Colour helpers ──────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BOLD='\033[1m'; RESET='\033[0m'

PASS="${GREEN}✔${RESET}"; FAIL="${RED}✘${RESET}"; SKIP="${YELLOW}~${RESET}"

# ── Step runner ─────────────────────────────────────────────────────────────
RESULTS=()
FAILED=0

step() {
  local label="$1"; shift
  printf "\n${BOLD}▶ %s${RESET}\n" "$label"
  if "$@"; then
    RESULTS+=("PASS|$label")
    printf "  ${PASS} %s\n" "$label"
  else
    RESULTS+=("FAIL|$label")
    printf "  ${FAIL} %s${RED} — FAILED${RESET}\n" "$label"
    FAILED=1
  fi
}

# soft step: failure is logged but doesn't stop the run (mirrors continue-on-error: true in ci.yml)
soft_step() {
  local label="$1"; shift
  printf "\n${BOLD}▶ %s${RESET} ${YELLOW}(non-blocking)${RESET}\n" "$label"
  if "$@"; then
    RESULTS+=("PASS|$label")
    printf "  ${PASS} %s\n" "$label"
  else
    RESULTS+=("WARN|$label")
    printf "  ${SKIP} %s${YELLOW} — warning (non-blocking)${RESET}\n" "$label"
  fi
}

# ── Summary printer ─────────────────────────────────────────────────────────
print_summary() {
  local mode
  $PLATFORM && mode="FULL (validate:platform)" || mode="CODE ONLY (validate)"
  printf "\n${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"
  printf "${BOLD}  LOCAL CI REPORT — %s${RESET}\n" "$mode"
  printf "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"
  for entry in "${RESULTS[@]}"; do
    local status="${entry%%|*}"
    local label="${entry#*|}"
    case $status in
      PASS) printf "  ${PASS} %s\n" "$label" ;;
      FAIL) printf "  ${FAIL} ${RED}%s${RESET}\n" "$label" ;;
      WARN) printf "  ${SKIP} ${YELLOW}%s (non-blocking)${RESET}\n" "$label" ;;
    esac
  done
  printf "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n"
  if [[ $FAILED -eq 0 ]]; then
    printf "  ${GREEN}${BOLD}All checks passed — safe to push.${RESET}\n"
  else
    printf "  ${RED}${BOLD}Some checks failed — fix before pushing.${RESET}\n"
  fi
  printf "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n\n"
}

trap print_summary EXIT

# ── Steps ───────────────────────────────────────────────────────────────────

# — Static / structural checks —
step "repo hygiene"            node scripts/check-repo-hygiene.js
step "workspace scripts"       node scripts/check-workspace-scripts.js
step "package boundaries"      node scripts/check-package-boundaries.mjs
step "public surface"          node scripts/check-public-surface.mjs
step "surface tests"           pnpm exec vitest run --config tests/surface/vitest.config.mjs
step "dependency boundaries"   bash scripts/check-dependency-boundaries.sh
step "app dependency policy"   bash scripts/check-app-dependency-policy.sh
step "api snapshot"            bash scripts/check-api-snapshot.sh
step "source registry"         node scripts/check-source-registry.js
step "preset docs"             node scripts/check-preset-docs.js
step "gold kits"               node scripts/check-gold-kits.js
step "launch readiness"        node scripts/check-launch-readiness.js

# — Code quality —
step "lint"                    pnpm exec biome check .

# — Build (force — no turbo cache, identical to CI runner) —
step "build"                   pnpm exec turbo run build --force

# — Type check & tests —
step "typecheck"               pnpm exec turbo run typecheck
step "unit tests"              pnpm exec turbo run test

# — Apps —
step "build storybook"         pnpm --filter @ui-app/storybook build-storybook

# — Bundle & performance —
step "bundle size"             node scripts/check-bundle-size.js
step "performance"             pnpm exec vitest run --config tests/performance/vitest.config.js

# ── Platform-only steps (skipped with --no-platform) ────────────────────────
if $PLATFORM; then
  step "supabase schema"       node scripts/check-supabase-schema-skeleton.js
  soft_step "security audit"   pnpm audit --audit-level=high
  step "contract compliance"   bash scripts/check-contract-compliance.sh
  soft_step "published versions" node scripts/check-published-versions.js
  step "e2e tests"             bash -c 'playwright install chromium --with-deps 2>/dev/null; playwright test'
fi

# summary printed by trap
[[ $FAILED -eq 0 ]]
