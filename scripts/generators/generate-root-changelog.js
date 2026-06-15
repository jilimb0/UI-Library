#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const CHANGELOG_PATH = path.join(ROOT_DIR, 'CHANGELOG.md');
const ROOTS = ['packages', 'packages/integrations', 'apps'];
const SCOPE = '@ui-construction-library/';

function walkPackageJsons(startDir, results) {
  if (!fs.existsSync(startDir)) return;
  for (const entry of fs.readdirSync(startDir, { withFileTypes: true })) {
    const full = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      const pkgJson = path.join(full, 'package.json');
      if (fs.existsSync(pkgJson)) results.push(pkgJson);
      walkPackageJsons(full, results);
    }
  }
}

function listWorkspacePackages() {
  const packageJsonPaths = [];
  for (const root of ROOTS)
    walkPackageJsons(path.join(ROOT_DIR, root), packageJsonPaths);
  const deduped = new Map();
  for (const pkgJsonPath of packageJsonPaths) {
    const dir = path.dirname(pkgJsonPath);
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    if (!pkg.name?.startsWith(SCOPE) || !pkg.version) continue;
    if (!deduped.has(pkg.name)) deduped.set(pkg.name, { name: pkg.name, dir });
  }
  return [...deduped.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function runGit(args) {
  return execFileSync('git', args, {
    cwd: ROOT_DIR,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function latestTagForPackage(name) {
  try {
    const tags = runGit(['tag', '--list', `${name}@*`, '--sort=-creatordate']);
    return tags ? tags.split('\n')[0] : null;
  } catch {
    return null;
  }
}

function parseCommit(subject) {
  const match = subject.match(/^(\w+)(?:\(([^)]+)\))?:\s+(.+)$/);
  if (!match) return { type: 'other', scope: '', description: subject };
  return {
    type: match[1].toLowerCase(),
    scope: match[2] || '',
    description: match[3],
  };
}

function commitsSince(tag, dir) {
  const range = tag ? `${tag}..HEAD` : 'HEAD';
  const output = runGit([
    'log',
    range,
    '--max-count=200',
    '--pretty=format:%s',
    '--',
    dir,
  ]);
  if (!output) return [];
  return output
    .split('\n')
    .filter(Boolean)
    .map((subject) => parseCommit(subject));
}

function _currentRootChangelog() {
  if (!fs.existsSync(CHANGELOG_PATH)) return '# Changelog\n\n';
  return fs.readFileSync(CHANGELOG_PATH, 'utf8');
}

function groupByType(commits) {
  const map = new Map();
  for (const commit of commits) {
    const key = [
      'feat',
      'fix',
      'refactor',
      'perf',
      'docs',
      'test',
      'build',
      'chore',
    ].includes(commit.type)
      ? commit.type
      : 'other';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(commit);
  }
  return map;
}

function renderEntry(pkg) {
  const tag = latestTagForPackage(pkg.name);
  const commits = commitsSince(tag, pkg.dir);
  if (!commits.length) return null;
  const grouped = groupByType(commits);
  const lines = [`## ${pkg.name}`, ''];
  for (const [type, entries] of grouped) {
    lines.push(`### ${type}`);
    lines.push('');
    for (const commit of entries) {
      const scope = commit.scope ? `(${commit.scope}) ` : '';
      lines.push(`- ${scope}${commit.description}`);
    }
    lines.push('');
  }
  return lines.join('\n').trim();
}

function main() {
  const sections = listWorkspacePackages().map(renderEntry).filter(Boolean);

  const header =
    '# Changelog\n\n<!-- AUTO-GENERATED FROM COMMITS + CHANGESETS -->\n\n';
  const body = sections.length
    ? `${sections.join('\n\n')}\n`
    : 'No package-level updates detected.\n';
  fs.writeFileSync(CHANGELOG_PATH, `${header}${body}`, 'utf8');
  console.log(`[changelog] updated ${path.relative(ROOT_DIR, CHANGELOG_PATH)}`);
}

main();
