#!/usr/bin/env node
/**
 * generate-package-changelogs.js
 *
 * Rewrites CHANGELOG.md inside each workspace package based on git commit
 * history scoped to that package's directory.
 *
 * Strategy (mixed approach):
 *  1. Find all version tags for the package (e.g. @scope/pkg@x.y.z)
 *  2. For each version range between consecutive tags, collect commits
 *     that touch the package directory
 *  3. Classify commits by conventional-commit type
 *  4. Render a clean per-version changelog section
 *  5. Prepend to any existing human-written content that starts with
 *     a "# " heading (so legacy notes survive at the bottom)
 *
 * Usage:
 *   node scripts/generators/generate-package-changelogs.js          # all packages
 *   node scripts/generators/generate-package-changelogs.js core     # single package (name fragment)
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..', '..');

// ── workspace package registry ────────────────────────────────────────────────
const PACKAGES = [
  { name: '@ui-construction-library/core', dir: 'packages/core' },
  { name: '@ui-construction-library/dnd', dir: 'packages/dnd' },
  { name: '@ui-construction-library/export-core', dir: 'packages/export-core' },
  { name: '@ui-construction-library/icons', dir: 'packages/icons' },
  {
    name: '@ui-construction-library/integration-i18n',
    dir: 'packages/integrations/i18n',
  },
  {
    name: '@ui-construction-library/integration-next',
    dir: 'packages/integrations/next',
  },
  {
    name: '@ui-construction-library/react-hook-form',
    dir: 'packages/integrations/react-hook-form',
  },
  {
    name: '@ui-construction-library/integration-tanstack-query',
    dir: 'packages/integrations/tanstack-query',
  },
  {
    name: '@ui-construction-library/integration-tanstack-router',
    dir: 'packages/integrations/tanstack-router',
  },
  { name: '@ui-construction-library/motion', dir: 'packages/motion' },
  { name: '@ui-construction-library/primitives', dir: 'packages/primitives' },
  {
    name: '@ui-construction-library/prompt-engine',
    dir: 'packages/prompt-engine',
  },
  { name: '@ui-construction-library/registry', dir: 'packages/registry' },
  { name: '@ui-construction-library/schema', dir: 'packages/schema' },
  { name: '@ui-construction-library/styles', dir: 'packages/styles' },
  { name: '@ui-construction-library/tokens', dir: 'packages/tokens' },
  { name: '@ui-construction-library/utils', dir: 'packages/utils' },
];

// ── conventional-commit type labels ───────────────────────────────────────────
const TYPE_LABELS = {
  feat: '### Features',
  fix: '### Bug Fixes',
  perf: '### Performance',
  refactor: '### Refactoring',
  docs: '### Documentation',
  test: '### Tests',
  build: '### Build',
  chore: '### Chores',
  ci: '### CI',
  style: '### Styles',
  revert: '### Reverts',
};
const TYPE_ORDER = [
  'feat',
  'fix',
  'perf',
  'refactor',
  'docs',
  'test',
  'build',
  'chore',
  'ci',
  'style',
  'revert',
  'other',
];

// ── git helpers ───────────────────────────────────────────────────────────────
function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function tagsForPackage(pkgName) {
  const raw = git(['tag', '--list', `${pkgName}@*`, '--sort=version:refname']);
  return raw ? raw.split('\n').filter(Boolean) : [];
}

function tagDate(tag) {
  try {
    return git(['log', '-1', '--format=%as', tag]);
  } catch {
    return '';
  }
}

function commitsInRange(range, dir) {
  const raw = git(['log', range, '--pretty=format:%h|%s', '--', dir]);
  return raw ? raw.split('\n').filter(Boolean) : [];
}

// ── commit parser ─────────────────────────────────────────────────────────────
function parseCommit(line) {
  const [hash, ...rest] = line.split('|');
  const subject = rest.join('|');
  const m = subject.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s+(.+)$/);
  if (!m)
    return {
      hash,
      type: 'other',
      scope: '',
      breaking: false,
      description: subject,
    };
  return {
    hash,
    type: m[1].toLowerCase(),
    scope: m[2] || '',
    breaking: !!m[3],
    description: m[4],
  };
}

// ── renderer ──────────────────────────────────────────────────────────────────
function renderVersion(version, date, commits) {
  if (!commits.length) return null;

  const grouped = {};
  for (const c of commits) {
    const key = TYPE_LABELS[c.type] ? c.type : 'other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  }

  const lines = [`## ${version}${date ? ` — ${date}` : ''}`, ''];

  // breaking changes first
  const breaking = commits.filter((c) => c.breaking);
  if (breaking.length) {
    lines.push('### ⚠ Breaking Changes', '');
    for (const c of breaking) {
      lines.push(
        `- ${c.scope ? `**${c.scope}:** ` : ''}${c.description} ([${c.hash}](../../commit/${c.hash}))`
      );
    }
    lines.push('');
  }

  for (const type of TYPE_ORDER) {
    const entries = (grouped[type] || []).filter((c) => !c.breaking);
    if (!entries.length) continue;
    lines.push(TYPE_LABELS[type] || '### Other', '');
    for (const c of entries) {
      const scope = c.scope ? `**${c.scope}:** ` : '';
      lines.push(
        `- ${scope}${c.description} ([${c.hash}](../../commit/${c.hash}))`
      );
    }
    lines.push('');
  }

  return lines.join('\n').trim();
}

// ── per-package changelog builder ─────────────────────────────────────────────
function buildChangelog(pkg) {
  const pkgDir = path.join(ROOT, pkg.dir);
  if (!fs.existsSync(pkgDir)) return null;

  const tags = tagsForPackage(pkg.name);
  const sections = [];

  if (tags.length === 0) {
    // no tags yet — collect all commits touching this package
    const commits = commitsInRange('HEAD', pkg.dir).map(parseCommit);
    const version = (() => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')
        ).version;
      } catch {
        return 'unreleased';
      }
    })();
    const s = renderVersion(version, '', commits);
    if (s) sections.push(s);
  } else {
    // latest version (latest tag → HEAD)
    const latest = tags[tags.length - 1];
    const latestVer = latest.split('@').pop();
    const latestCommits = commitsInRange(`${latest}..HEAD`, pkg.dir).map(
      parseCommit
    );

    // check if there's unreleased work
    if (latestCommits.length) {
      try {
        const localVer = JSON.parse(
          fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')
        ).version;
        if (localVer !== latestVer) {
          const s = renderVersion(localVer, '', latestCommits);
          if (s) sections.push(s);
        }
      } catch {}
    }

    // each tagged version
    for (let i = tags.length - 1; i >= 0; i--) {
      const tag = tags[i];
      const ver = tag.split('@').pop();
      const date = tagDate(tag);
      const prevTag = tags[i - 1];
      const range = prevTag ? `${prevTag}..${tag}` : tag;
      const commits = commitsInRange(range, pkg.dir).map(parseCommit);
      const s = renderVersion(ver, date, commits);
      if (s) sections.push(s);
    }
  }

  if (!sections.length) return null;

  // preserve any existing human-written legacy content (starts with "# ")
  const changelogPath = path.join(pkgDir, 'CHANGELOG.md');
  let legacy = '';
  if (fs.existsSync(changelogPath)) {
    const existing = fs.readFileSync(changelogPath, 'utf8');
    // Keep only blocks that begin with a top-level "# " heading and
    // don't look auto-generated (no "Auto-generated" or "CODE_MISMATCH")
    const humanLines = existing.split('\n');
    let inHuman = false;
    const kept = [];
    for (const line of humanLines) {
      if (/^# /.test(line) && !line.includes('AUTO-GENERATED')) inHuman = true;
      if (inHuman) {
        if (/Auto-generated|CODE_MISMATCH|OUTDATED|UNPUBLISHED/.test(line)) {
          inHuman = false;
          continue;
        }
        kept.push(line);
      }
    }
    legacy = kept.join('\n').trim();
  }

  const header = `# ${pkg.name}\n\n<!-- AUTO-GENERATED — do not edit manually; run pnpm changelog:packages -->\n`;
  const body = sections.join('\n\n');
  return legacy
    ? `${header}\n${body}\n\n---\n\n${legacy}\n`
    : `${header}\n${body}\n`;
}

// ── main ──────────────────────────────────────────────────────────────────────
function main() {
  const filter = process.argv[2] ? process.argv[2].toLowerCase() : null;

  const targets = filter
    ? PACKAGES.filter((p) => p.name.includes(filter) || p.dir.includes(filter))
    : PACKAGES;

  if (!targets.length) {
    console.error(`[changelog] no packages matched "${filter}"`);
    process.exit(1);
  }

  let updated = 0;
  let index = 0;
  for (const pkg of targets) {
    index++;
    console.log(
      `[changelog] processing ${index}/${targets.length} ${pkg.name}`
    );
    const content = buildChangelog(pkg);
    if (!content) {
      console.log(`[changelog] skip  ${pkg.name} — no commits found`);
      continue;
    }
    const dest = path.join(ROOT, pkg.dir, 'CHANGELOG.md');
    fs.writeFileSync(dest, content, 'utf8');
    console.log(`[changelog] wrote ${path.relative(ROOT, dest)}`);
    updated++;
  }

  console.log(
    `[changelog] done — ${updated}/${targets.length} packages updated`
  );
}

main();
