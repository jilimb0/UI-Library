#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

PORT="${PORT:-4173}"
export PORT
REPO_NAME="${GITHUB_REPOSITORY_NAME:-UI-Library}"

if lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port ${PORT} is already in use. Stop the other process or run PORT=4174 $0"
  exit 1
fi

./scripts/pages/assemble-pages-site.sh

cd "$ROOT_DIR/.pages"
echo "Serving http://127.0.0.1:${PORT}/${REPO_NAME}/ (Ctrl+C to stop)"
exec pnpm exec serve --listen "${PORT}" --config "${ROOT_DIR}/.pages/serve.json" --no-request-logging
