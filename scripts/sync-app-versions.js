#!/usr/bin/env node

// Syncs @ui-construction-library/* versions in apps/*/package.json
// to match the currently published versions in packages/*/package.json.
//
// Run after `changeset version` to keep apps in sync.
// Usage: node scripts/sync-app-versions.js [--dry-run]

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dryRun = process.argv.includes('--dry-run');

// --- 1. Collect published package versions from packages/*/package.json ---

function getPackageJsonPaths(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      const pkgPath = resolve(full, 'package.json');
      try {
        results.push(pkgPath);
      } catch {}
      // one level deeper (integrations)
      for (const sub of readdirSync(full)) {
        const subFull = resolve(full, sub);
        if (statSync(subFull).isDirectory()) {
          results.push(resolve(subFull, 'package.json'));
        }
      }
    }
  }
  return results;
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

// Build map: { "@ui-construction-library/core": "0.2.0", ... }
const publishedVersions = {};
for (const pkgPath of getPackageJsonPaths(resolve(root, 'packages'))) {
  const pkg = readJson(pkgPath);
  if (pkg?.name?.startsWith('@ui-construction-library/') && pkg.version) {
    publishedVersions[pkg.name] = pkg.version;
  }
}

console.log('\n📦 Published package versions:');
for (const [name, ver] of Object.entries(publishedVersions)) {
  console.log(`  ${name}: ${ver}`);
}

// --- 2. Update apps/*/package.json ---

const appsDir = resolve(root, 'apps');
let totalUpdates = 0;

for (const appName of readdirSync(appsDir)) {
  const pkgPath = resolve(appsDir, appName, 'package.json');
  const pkg = readJson(pkgPath);
  if (!pkg) continue;

  let changed = false;
  const depFields = ['dependencies', 'devDependencies', 'peerDependencies'];

  for (const field of depFields) {
    if (!pkg[field]) continue;
    for (const [dep, ver] of Object.entries(pkg[field])) {
      if (publishedVersions[dep] && ver !== publishedVersions[dep]) {
        console.log(
          `\n  ${appName}: ${dep}  ${ver} → ${publishedVersions[dep]}`
        );
        pkg[field][dep] = publishedVersions[dep];
        changed = true;
        totalUpdates++;
      }
    }
  }

  if (changed && !dryRun) {
    writeFileSync(
      pkgPath,
      `${JSON.stringify(pkg, null, 2)}
`,
      'utf-8'
    );
    console.log(`  ✅ Written: apps/${appName}/package.json`);
  }
}

if (totalUpdates === 0) {
  console.log('\n✨ All apps already up to date.');
} else if (dryRun) {
  console.log(`\n🔍 Dry run: ${totalUpdates} update(s) would be applied.`);
} else {
  console.log(`\n✅ Done: ${totalUpdates} update(s) applied.`);
  console.log('   Run `pnpm install` to update pnpm-lock.yaml.');
}
