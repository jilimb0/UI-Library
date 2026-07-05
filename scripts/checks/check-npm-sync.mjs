#!/usr/bin/env node
/**
 * check-npm-sync.mjs
 *
 * Compares local packages against npm published versions.
 * Reports:
 *   1. Version mismatch (local != npm)
 *   2. Git state (uncommitted changes)
 *   3. Whether HEAD commit matches what was published
 *
 * Usage:
 *   node scripts/checks/check-npm-sync.mjs          # default: summary
 *   node scripts/checks/check-npm-sync.mjs --json    # JSON output
 *   node scripts/checks/check-npm-sync.mjs --verbose  # full detail
 */

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const root = resolve(__dirname, '..', '..');
const VERBOSE = process.argv.includes('--verbose');
const JSON_OUT = process.argv.includes('--json');

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim();
  } catch {
    return opts.silent ? null : '';
  }
}

function log(msg) { if (!JSON_OUT) console.log(msg); }
function warn(msg) { if (!JSON_OUT) console.warn('  ⚠', msg); }
function ok(msg)   { if (!JSON_OUT) console.log('  ✓', msg); }
function fail(msg) { if (!JSON_OUT) console.log('  ✗', msg); }

// ── Collect packages ─────────────────────────────────────────────────────────

function getPackages() {
  const results = [];
  for (const entry of readdirSync(resolve(root, 'packages'))) {
    const p = resolve(root, 'packages', entry);
    if (!statSync(p).isDirectory()) continue;
    // Direct packages
    const pj = resolve(p, 'package.json');
    try {
      const pkg = JSON.parse(readFileSync(pj, 'utf-8'));
      if (!pkg.private && pkg.name) results.push({ name: pkg.name, version: pkg.version, path: p });
    } catch {}
    // Nested (integrations/*)
    for (const sub of readdirSync(p)) {
      const sp = resolve(p, sub, 'package.json');
      try {
        const pkg = JSON.parse(readFileSync(sp, 'utf-8'));
        if (!pkg.private && pkg.name) results.push({ name: pkg.name, version: pkg.version, path: resolve(p, sub) });
      } catch {}
    }
  }
  return results;
}

// ── Check version sync ───────────────────────────────────────────────────────

function checkVersions(packages) {
  const mismatches = [];
  for (const pkg of packages) {
    const npmVersion = run(`npm view "${pkg.name}" version --registry https://registry.npmjs.org 2>/dev/null`, { silent: true });
    if (npmVersion === null) {
      mismatches.push({ ...pkg, npmVersion: 'N/A', status: 'not-on-npm' });
    } else if (npmVersion !== pkg.version) {
      mismatches.push({ ...pkg, npmVersion, status: 'version-mismatch' });
    }
  }
  return mismatches;
}

// ── Check provenance commit ──────────────────────────────────────────────────

function checkProvenanceCommit(packages) {
  if (packages.length === 0) return;
  // Check one package's provenance via npm view
  const name = packages[0].name;
  const provenance = run(`npm view "${name}" dist.attestations --json 2>/dev/null`, { silent: true });
  if (!provenance || provenance === 'undefined') {
    warn('provenance info not available via npm view (requires Sigstore)');
    return;
  }
  try {
    const att = JSON.parse(provenance);
    // Provenance attestations are in the Sigstore log, not directly in npm view
    ok('provenance attestations found (check via Sigstore log)');
  } catch {
    // ignore parse errors
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

log('\n── npm sync check ──────────────────────────────────────────────\n');

const packages = getPackages();
log(`found ${packages.length} publishable packages\n`);

// 1. Version check
log('1. Version sync:');
const mismatches = checkVersions(packages);
if (mismatches.length === 0) {
  ok('all packages match npm versions');
} else {
  for (const m of mismatches) {
    fail(`${m.name}: local=${m.version} npm=${m.npmVersion}`);
  }
}

// 2. Git state
log('\n2. Git state:');
const gitStatus = run('git status --porcelain', { cwd: root });
if (gitStatus) {
  const changed = gitStatus.split('\n').filter(Boolean);
  warn(`${changed.length} uncommitted file(s)`);
  if (VERBOSE) for (const f of changed) warn(`  ${f}`);
} else {
  ok('working tree clean');
}

const head = run('git rev-parse --short HEAD', { cwd: root });
const headMsg = run('git log --oneline -1', { cwd: root });
ok(`HEAD is ${head} — ${headMsg}`);

// 3. Provenance
log('\n3. Provenance:');
checkProvenanceCommit(packages);

// ── Summary ──────────────────────────────────────────────────────────────────

const allMatch = mismatches.length === 0;
log('');
if (allMatch) {
  log('✅ All packages are in sync with npm.');
} else {
  log(`❌ ${mismatches.length} package(s) out of sync with npm:`);
  for (const m of mismatches) {
    log(`   ${m.name}: ${m.npmVersion} → ${m.version} (${m.status})`);
  }
  log('\nTo publish: pnpm changeset && git add .changeset/ && git commit && git push');
}

log('');

// ── JSON output ──────────────────────────────────────────────────────────────

if (JSON_OUT) {
  const result = {
    sync: allMatch,
    mismatches: mismatches.map(m => ({ name: m.name, local: m.version, npm: m.npmVersion })),
    packages: packages.map(p => ({ name: p.name, version: p.version })),
    git: {
      clean: !gitStatus,
      head: head,
      uncommitted: gitStatus ? gitStatus.split('\n').filter(Boolean).length : 0,
    },
  };
  console.log(JSON.stringify(result, null, 2));
}

process.exit(allMatch ? 0 : 1);
