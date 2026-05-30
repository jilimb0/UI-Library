#!/usr/bin/env node
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const https = require('node:https');

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
  for (const root of ROOTS) walkPackageJsons(root, packageJsonPaths);

  const deduped = new Map();
  for (const pkgJsonPath of packageJsonPaths) {
    const dir = path.dirname(pkgJsonPath);
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    if (!pkg.name?.startsWith(SCOPE) || !pkg.version) continue;
    if (!deduped.has(pkg.name)) {
      deduped.set(pkg.name, { dir, pkg });
    }
  }

  return [...deduped.values()].sort((a, b) =>
    a.pkg.name.localeCompare(b.pkg.name)
  );
}

function sha512(buffer) {
  return crypto.createHash('sha512').update(buffer).digest('hex');
}

function normalizePackFileList(files) {
  return files
    .filter((file) => file.path !== 'package/package.json')
    .map((file) => ({
      path: file.path.replace(/^package\//, ''),
      integrity: file.integrity || sha512(Buffer.from('')),
      size: file.size,
      mode: file.mode,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

function npmPackJson(cwd, spec = null) {
  const args = ['pack', '--json'];
  if (spec) args.splice(1, 0, spec);
  const stdout = execFileSync('npm', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(stdout);
}

function npmViewJson(name, field = null) {
  try {
    const args = ['view', name];
    if (field) args.push(field);
    args.push('--json');
    const stdout = execFileSync('npm', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}

function download(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          file.close();
          fs.unlink(destination, () =>
            download(res.headers.location, destination).then(resolve, reject)
          );
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(destination, () =>
            reject(new Error(`HTTP ${res.statusCode}`))
          );
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (error) => {
        file.close();
        fs.unlink(destination, () => reject(error));
      });
  });
}

async function packPublishedTarball(tmpDir, tarballUrl) {
  const tarballPath = path.join(tmpDir, 'published.tgz');
  await download(tarballUrl, tarballPath);
  return npmPackJson(tmpDir, tarballPath);
}

function compareFileLists(localFiles, remoteFiles) {
  const localMap = new Map(localFiles.map((file) => [file.path, file]));
  const remoteMap = new Map(remoteFiles.map((file) => [file.path, file]));

  const onlyLocal = [];
  const onlyRemote = [];
  const changed = [];

  for (const [filePath, localFile] of localMap) {
    const remoteFile = remoteMap.get(filePath);
    if (!remoteFile) {
      onlyLocal.push(filePath);
      continue;
    }
    if (localFile.integrity !== remoteFile.integrity) {
      changed.push(filePath);
    }
  }

  for (const [filePath] of remoteMap) {
    if (!localMap.has(filePath)) onlyRemote.push(filePath);
  }

  return {
    onlyLocal: onlyLocal.sort(),
    onlyRemote: onlyRemote.sort(),
    changed: changed.sort(),
  };
}

function formatDiffSummary(diff) {
  const parts = [];
  if (diff.changed.length)
    parts.push(
      `changed=${diff.changed.slice(0, 5).join(', ')}${diff.changed.length > 5 ? ', ...' : ''}`
    );
  if (diff.onlyLocal.length)
    parts.push(
      `only-local=${diff.onlyLocal.slice(0, 5).join(', ')}${diff.onlyLocal.length > 5 ? ', ...' : ''}`
    );
  if (diff.onlyRemote.length)
    parts.push(
      `only-npm=${diff.onlyRemote.slice(0, 5).join(', ')}${diff.onlyRemote.length > 5 ? ', ...' : ''}`
    );
  return parts.join(' | ');
}

async function checkPackage(entry) {
  const { dir, pkg } = entry;
  const npmInfo = npmViewJson(pkg.name, 'versions');

  if (!Array.isArray(npmInfo) || !npmInfo.length) {
    return {
      ok: false,
      status: 'UNPUBLISHED',
      name: pkg.name,
      version: pkg.version,
      summary: `${pkg.name}@${pkg.version}`,
      line: `UNPUBLISHED   ${pkg.name}@${pkg.version}`,
    };
  }

  const publishedVersion = npmViewJson(pkg.name, 'dist-tags.latest');
  if (!publishedVersion || typeof publishedVersion !== 'string') {
    return {
      ok: false,
      status: 'UNPUBLISHED',
      name: pkg.name,
      version: pkg.version,
      summary: `${pkg.name}@${pkg.version}`,
      line: `UNPUBLISHED   ${pkg.name}@${pkg.version}`,
    };
  }

  if (publishedVersion !== pkg.version) {
    return {
      ok: false,
      status: 'OUTDATED',
      name: pkg.name,
      version: pkg.version,
      summary: `${pkg.name} local=${pkg.version} npm=${publishedVersion}`,
      line: `OUTDATED      ${pkg.name} local=${pkg.version} npm=${publishedVersion}`,
    };
  }

  const tarballUrl = npmViewJson(
    `${pkg.name}@${publishedVersion}`,
    'dist.tarball'
  );
  if (!tarballUrl || typeof tarballUrl !== 'string') {
    return {
      ok: false,
      status: 'BROKEN_NPM',
      name: pkg.name,
      version: pkg.version,
      summary: `${pkg.name}@${pkg.version} missing tarball url`,
      line: `BROKEN_NPM    ${pkg.name}@${pkg.version} missing tarball url`,
    };
  }

  const tmpDir = await fsp.mkdtemp(
    path.join(os.tmpdir(), 'check-published-code-')
  );

  try {
    const localPack = npmPackJson(dir);
    const remotePack = await packPublishedTarball(tmpDir, tarballUrl);

    const localFiles = normalizePackFileList(localPack[0]?.files || []);
    const remoteFiles = normalizePackFileList(remotePack[0]?.files || []);
    const diff = compareFileLists(localFiles, remoteFiles);

    if (
      !diff.changed.length &&
      !diff.onlyLocal.length &&
      !diff.onlyRemote.length
    ) {
      return {
        ok: true,
        status: 'MATCH',
        name: pkg.name,
        version: pkg.version,
        summary: `${pkg.name}@${pkg.version}`,
        line: `MATCH         ${pkg.name}@${pkg.version}`,
      };
    }

    return {
      ok: false,
      status: 'CODE_MISMATCH',
      name: pkg.name,
      version: pkg.version,
      summary: `${pkg.name}@${pkg.version} ${formatDiffSummary(diff)}`,
      line: `CODE_MISMATCH ${pkg.name}@${pkg.version} ${formatDiffSummary(diff)}`,
    };
  } finally {
    await fsp.rm(tmpDir, { recursive: true, force: true });
  }
}

async function main() {
  const packages = listWorkspacePackages();
  const results = [];
  const jsonMode = process.argv.includes('--json');
  let failed = false;

  for (const entry of packages) {
    const result = await checkPackage(entry);
    results.push(result);
    if (!jsonMode) {
      console.log(result.line);
    }
    if (!result.ok) failed = true;
  }

  if (jsonMode) {
    process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
  }

  process.exit(failed ? 1 : 0);
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
