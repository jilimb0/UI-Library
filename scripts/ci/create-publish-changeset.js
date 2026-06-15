#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const CHANGESET_DIR = path.join(ROOT_DIR, '.changeset');
const ALLOWED_STATUSES = new Set(['CODE_MISMATCH', 'OUTDATED', 'UNPUBLISHED']);
const ALLOWED_BUMP_TYPES = new Set(['patch', 'minor', 'major']);

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/@/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function resolveBumpType() {
  const arg = process.argv.find((value) => value.startsWith('--bump='));
  const bumpType = (arg ? arg.split('=')[1] : 'patch').toLowerCase();
  if (!ALLOWED_BUMP_TYPES.has(bumpType)) {
    throw new Error(
      `Unsupported bump type: ${bumpType}. Use one of: patch, minor, major.`
    );
  }
  return bumpType;
}

function buildFrontmatter(packages, bumpType) {
  return packages.map((name) => `"${name}": ${bumpType}`).join('\n');
}

function buildSummary(packages, statuses, bumpType) {
  const lines = [
    `Auto-generated ${bumpType} release changeset for packages whose published npm state is out of sync with the local publishable code.`,
    '',
    'Detected statuses:',
    ...packages.map((name) => `- ${name}: ${statuses.get(name)}`),
  ];
  return lines.join('\n');
}

async function main() {
  const bumpType = resolveBumpType();
  const raw = await readStdin();
  const results = JSON.parse(raw);
  const targets = results.filter((item) => ALLOWED_STATUSES.has(item.status));

  if (!targets.length) {
    console.log('[changeset] no packages require an auto-generated changeset');
    return;
  }

  const packageNames = [...new Set(targets.map((item) => item.name))].sort();
  const statuses = new Map(targets.map((item) => [item.name, item.status]));
  const hash = crypto
    .createHash('sha1')
    .update(`${bumpType}\n${packageNames.join('\n')}`)
    .digest('hex')
    .slice(0, 8);
  const slug = slugify(packageNames.slice(0, 3).join('-'));
  const fileName = `${slug || 'release'}-${bumpType}-${hash}.md`;
  const filePath = path.join(CHANGESET_DIR, fileName);

  if (!fs.existsSync(CHANGESET_DIR)) {
    fs.mkdirSync(CHANGESET_DIR, { recursive: true });
  }

  const content = `---\n${buildFrontmatter(packageNames, bumpType)}\n---\n\n${buildSummary(packageNames, statuses, bumpType)}\n`;
  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`[changeset] created ${path.relative(ROOT_DIR, filePath)}`);
  console.log(`[changeset] bump type ${bumpType}`);
  for (const packageName of packageNames) {
    console.log(
      `[changeset] ${bumpType} ${packageName} (${statuses.get(packageName)})`
    );
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
