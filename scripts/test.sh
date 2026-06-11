#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ARGS=()
for arg in "$@"; do
  case "$arg" in
    --runInBand) ;;
    *) ARGS+=("$arg") ;;
  esac
done

exec pnpm turbo run test -- "${ARGS[@]}"
