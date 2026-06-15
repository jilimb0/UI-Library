#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

REPO_NAME="${GITHUB_REPOSITORY_NAME:-UI-Library}"
PAGES_DIR="${ROOT_DIR}/.pages"
SITE_DIR="${PAGES_DIR}/${REPO_NAME}"

rm -rf "$PAGES_DIR"
mkdir -p "${SITE_DIR}/docs" "${SITE_DIR}/storybook" "${SITE_DIR}/builder"

echo "[assemble] preparing internal workspace packages via root build graph..."
pnpm turbo run build --filter="./packages/*"

echo "[assemble] storybook..."
STORYBOOK_BASE_PATH="/${REPO_NAME}/storybook/" pnpm --filter @ui-app/storybook build-storybook

echo "[assemble] docs..."
DOCS_BASE_PATH="/${REPO_NAME}/docs/" pnpm --filter @ui-app/docs build

echo "[assemble] demo..."
DEMO_BASE_PATH="/${REPO_NAME}/" pnpm --filter @ui-app/demo-showcase build

echo "[assemble] builder..."
BUILDER_BASE_PATH="/${REPO_NAME}/builder/" pnpm --filter @ui-app/builder build

cp -R ./apps/demo-showcase/dist/. "${SITE_DIR}/"
cp -R ./apps/docs/dist/. "${SITE_DIR}/docs/"
cp -R ./apps/storybook/storybook-static/. "${SITE_DIR}/storybook/"
cp -R ./apps/builder/dist/. "${SITE_DIR}/builder/"

cat >"${PAGES_DIR}/serve.json" <<EOF
{
  "cleanUrls": false,
  "rewrites": [
    { "source": "/${REPO_NAME}", "destination": "/${REPO_NAME}/index.html" },
    { "source": "/${REPO_NAME}/", "destination": "/${REPO_NAME}/index.html" },
    { "source": "/${REPO_NAME}/docs", "destination": "/${REPO_NAME}/docs/index.html" },
    { "source": "/${REPO_NAME}/docs/", "destination": "/${REPO_NAME}/docs/index.html" },
    {
      "source": "/${REPO_NAME}/storybook",
      "destination": "/${REPO_NAME}/storybook/index.html"
    },
    {
      "source": "/${REPO_NAME}/storybook/",
      "destination": "/${REPO_NAME}/storybook/index.html"
    },
    {
      "source": "/${REPO_NAME}/builder",
      "destination": "/${REPO_NAME}/builder/index.html"
    },
    {
      "source": "/${REPO_NAME}/builder/",
      "destination": "/${REPO_NAME}/builder/index.html"
    },
    {
      "source": "/${REPO_NAME}/builder/**",
      "destination": "/${REPO_NAME}/builder/index.html"
    }
  ]
}
EOF

echo "Assembled Pages site at ${SITE_DIR} (http://127.0.0.1:\${PORT}/${REPO_NAME}/)"
