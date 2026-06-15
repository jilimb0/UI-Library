#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const requiredScripts = ['build', 'lint', 'typecheck', 'test'];
const workspaceRoots = ['apps', 'packages'];
const packageJsonPaths = [];

function collectPackageJsons(dir) {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const packagePath = path.join(dir, entry.name, 'package.json');
    if (fs.existsSync(packagePath)) packageJsonPaths.push(packagePath);
    const nestedRoot = path.join(dir, entry.name);
    if (!fs.existsSync(packagePath)) collectPackageJsons(nestedRoot);
  }
}

for (const workspaceRoot of workspaceRoots) {
  collectPackageJsons(path.join(root, workspaceRoot));
}

const failures = [];

for (const packagePath of packageJsonPaths.sort()) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const scripts = pkg.scripts ?? {};
  const missing = requiredScripts.filter((script) => !scripts[script]);

  if (missing.length > 0) {
    failures.push(
      `${path.relative(root, packagePath)} (${pkg.name}): missing ${missing.join(', ')}`
    );
  }
}

if (failures.length > 0) {
  console.error('[workspace-scripts] FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `[workspace-scripts] PASS: ${packageJsonPaths.length} workspace packages expose build, lint, typecheck, and test scripts.`
);
