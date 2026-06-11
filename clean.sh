#!/bin/bash

# Clean all builds, caches, and temporary files for the UI Library project

echo "🗑️  Cleaning all builds, caches, and temporary files..."

# Clean turbo cache
echo "  - Clearing turbo cache..."
rm -rf node_modules/.turbo

# Clean vite cache
echo "  - Clearing vite cache..."
rm -rf apps/storybook/node_modules/.vite

# Clean general node_modules cache
echo "  - Clearing node_modules cache..."
rm -rf node_modules/.cache

# Clean rollup cache
echo "  - Clearing rollup cache..."
rm -rf packages/*/node_modules/.rollup.cache
rm -rf packages/*/.rollup.cache

# Clean turbo per-package
echo "  - Clearing per-package turbo caches..."
rm -rf packages/*/.turbo

# Clean dist directories
echo "  - Removing dist directories..."
rm -rf packages/*/dist
rm -rf apps/*/dist

# Clean storybook static
echo "  - Removing storybook static..."
rm -rf apps/storybook/storybook-static

# Clean TypeScript build info
echo "  - Removing TypeScript build info..."
rm -rf packages/*/*.tsbuildinfo

# Clean tgz files
echo "  - Removing packaged tgz files..."
rm -rf packages/*/*.tgz

echo "✅ All builds, caches, and temporary files cleaned!"
echo ""
echo "Next step: Run 'pnpm run build' to rebuild everything"
