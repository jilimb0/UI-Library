#!/usr/bin/env node
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');

const trackedFiles = execFileSync('git', ['ls-files'], {
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

const forbiddenPathPatterns = [
  { name: 'macOS metadata', pattern: /(^|\/)\.DS_Store$/ },
  { name: 'local env file', pattern: /(^|\/)\.env(\..*)?$/ },
  { name: 'Supabase temp metadata', pattern: /^supabase\/\.temp\// },
  { name: 'package tarball', pattern: /\.tgz$/ },
  { name: 'TypeScript build info', pattern: /\.tsbuildinfo$/ },
  { name: 'Rollup cache', pattern: /(^|\/)\.rollup\.cache\// },
];

const secretPatterns = [
  { name: 'Chromatic project token', pattern: /chpt_[A-Za-z0-9_ -]{8,}/ },
];

const allowSecretScan = new Set(['scripts/checks/check-repo-hygiene.js']);
const allowedArtifactPaths = new Set(['.env.example']);
const failures = [];

for (const file of trackedFiles) {
  if (!fs.existsSync(file)) continue;

  for (const rule of forbiddenPathPatterns) {
    if (!allowedArtifactPaths.has(file) && rule.pattern.test(file)) {
      failures.push(`${file}: tracked ${rule.name} is not allowed`);
    }
  }

  if (allowSecretScan.has(file)) continue;

  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  for (const rule of secretPatterns) {
    if (rule.pattern.test(content)) {
      failures.push(`${file}: possible ${rule.name} committed`);
    }
  }
}

if (failures.length > 0) {
  console.error('[repo-hygiene] FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  '[repo-hygiene] PASS: no tracked secrets or local artifacts found.'
);
