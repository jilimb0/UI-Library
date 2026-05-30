#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const ROOTS = ['packages', 'packages/integrations', 'apps'];
const SCOPE = '@ui-construction-library/';
const CHANGESET_DIR = path.join(ROOT_DIR, '.changeset');
const ARG_BUMP = process.argv.find((arg) => arg.startsWith('--bump='));
const DEFAULT_BUMP = ARG_BUMP ? ARG_BUMP.split('=')[1] : 'patch';
const COMMIT_LIMIT = 200;
const ALLOWED_TYPES = new Set([
  'feat',
  'fix',
  'refactor',
  'perf',
  'docs',
  'test',
  'build',
  'chore',
]);

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
    if (!deduped.has(pkg.name)) {
      deduped.set(pkg.name, {
        name: pkg.name,
        dir,
        relativeDir: path.relative(ROOT_DIR, dir).replace(/\\/g, '/'),
      });
    }
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

function parseCommitSubject(subject) {
  const conventionalMatch = subject.match(/^(\w+)(?:\(([^)]+)\))?:\s+(.+)$/);
  if (!conventionalMatch) {
    return { type: 'other', scope: '', description: subject };
  }
  return {
    type: conventionalMatch[1].toLowerCase(),
    scope: (conventionalMatch[2] || '').toLowerCase(),
    description: conventionalMatch[3].trim(),
  };
}

function findLatestTagForPackage(name) {
  try {
    return (
      runGit(['tag', '--list', `${name}@*`, '--sort=-creatordate']).split(
        '\n'
      )[0] || null
    );
  } catch {
    return null;
  }
}

function listCommitEntries(fromRef, packageInfo) {
  const range = fromRef ? `${fromRef}..HEAD` : 'HEAD';
  const output = runGit([
    'log',
    range,
    `--max-count=${COMMIT_LIMIT}`,
    '--pretty=format:%H%x09%s',
    '--',
    packageInfo.relativeDir,
  ]);

  if (!output) return [];

  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, subject] = line.split('\t');
      const parsed = parseCommitSubject(subject || '');
      return {
        hash,
        shortHash: hash.slice(0, 7),
        subject,
        ...parsed,
      };
    });
}

function readPendingChangesets() {
  if (!fs.existsSync(CHANGESET_DIR)) return [];
  return fs
    .readdirSync(CHANGESET_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => ({
      name,
      content: fs.readFileSync(path.join(CHANGESET_DIR, name), 'utf8'),
    }));
}

function parseChangesetMarkdown(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!match) return null;
  const frontmatter = match[1];
  const summary = match[2].trim();
  const releases = [];

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    const pkgMatch = trimmed.match(
      /^['"]?(@ui-construction-library\/[^'"]+)['"]?:\s*(major|minor|patch)$/
    );
    if (pkgMatch) {
      releases.push({ name: pkgMatch[1], bump: pkgMatch[2] });
    }
  }

  if (!releases.length) return null;
  return { releases, summary };
}

function buildCommitSection(commits) {
  if (!commits.length) return '';

  const groups = new Map();
  for (const commit of commits) {
    const key = ALLOWED_TYPES.has(commit.type) ? commit.type : 'other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(commit);
  }

  const order = [
    'feat',
    'fix',
    'refactor',
    'perf',
    'docs',
    'test',
    'build',
    'chore',
    'other',
  ];
  const labels = {
    feat: 'Features',
    fix: 'Fixes',
    refactor: 'Refactors',
    perf: 'Performance',
    docs: 'Docs',
    test: 'Tests',
    build: 'Build',
    chore: 'Chores',
    other: 'Other',
  };

  const lines = ['### Commits', ''];
  for (const key of order) {
    const entries = groups.get(key);
    if (!entries?.length) continue;
    lines.push(`#### ${labels[key]}`);
    lines.push('');
    for (const commit of entries) {
      const scopeText = commit.scope ? `**${commit.scope}**: ` : '';
      lines.push(
        `- ${scopeText}${commit.description} (\`${commit.shortHash}\`)`
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

function buildChangesetSection(pkgName, parsedChangesets, fallbackBump) {
  const related = parsedChangesets.filter((entry) =>
    entry.releases.some((release) => release.name === pkgName)
  );
  if (!related.length) {
    return {
      bump: fallbackBump,
      markdown:
        '### Pending changesets\n\n- No manual changeset notes were found; changelog generated from commit history.\n',
    };
  }

  const bumpPriority = { patch: 1, minor: 2, major: 3 };
  let strongestBump = fallbackBump;
  const lines = ['### Pending changesets', ''];

  for (const entry of related) {
    const release = entry.releases.find((item) => item.name === pkgName);
    if (release && bumpPriority[release.bump] > bumpPriority[strongestBump]) {
      strongestBump = release.bump;
    }
    lines.push(`- ${entry.summary || 'No summary provided.'}`);
  }
  lines.push('');

  return { bump: strongestBump, markdown: lines.join('\n') };
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createChangesetFile(targetPackages, bumpType, summary) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${timestamp}-${slugify(targetPackages[0].replace(/^@ui-construction-library\//, ''))}.md`;
  const filePath = path.join(CHANGESET_DIR, fileName);
  const frontmatter = targetPackages
    .map((name) => `"${name}": ${bumpType}`)
    .join('\n');
  const content = `---\n${frontmatter}\n---\n\n${summary.trim()}\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

function main() {
  const input = fs.readFileSync(0, 'utf8').trim();
  if (!input) {
    console.error(
      '[changeset] expected JSON input from check-published-code.js --json'
    );
    process.exit(1);
  }

  const actionable = JSON.parse(input).filter((entry) => !entry.ok);
  if (!actionable.length) {
    console.log('[changeset] nothing to publish');
    return;
  }

  const packages = listWorkspacePackages();
  const packagesByName = new Map(packages.map((pkg) => [pkg.name, pkg]));
  const parsedChangesets = readPendingChangesets()
    .map((entry) => ({
      ...entry,
      parsed: parseChangesetMarkdown(entry.content),
    }))
    .filter((entry) => entry.parsed);

  const generatedFiles = [];

  for (const item of actionable) {
    const pkg = packagesByName.get(item.name);
    if (!pkg) continue;

    const latestTag = findLatestTagForPackage(item.name);
    const commits = listCommitEntries(latestTag, pkg);
    const changesetInfo = buildChangesetSection(
      item.name,
      parsedChangesets.map((entry) => entry.parsed),
      DEFAULT_BUMP
    );
    const commitSection = buildCommitSection(commits);
    const summaryParts = [
      `Auto-generated release notes for ${item.name}.`,
      '',
      changesetInfo.markdown,
      commitSection ||
        '### Commits\n\n- No package-specific commits were found since the latest tag.\n',
    ];

    const filePath = createChangesetFile(
      [item.name],
      changesetInfo.bump || DEFAULT_BUMP,
      summaryParts.join('\n').trim()
    );
    generatedFiles.push(path.relative(ROOT_DIR, filePath));
  }

  for (const file of generatedFiles) {
    console.log(`[changeset] created ${file}`);
  }
}

main();
