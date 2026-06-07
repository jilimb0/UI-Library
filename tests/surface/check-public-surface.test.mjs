/**
 * Unit tests for scripts/surface-checker.mjs
 *
 * Each test builds a minimal fixture workspace in a temp directory, calls
 * checkSurface(root), and asserts the violation list.  No process spawning —
 * we import the checker logic directly.
 */

import { mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// Resolve checker relative to this test file's location.
const SCRIPTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../scripts');
const { checkSurface, importPattern, INTERNAL_NOTICE } = await import(
  `${SCRIPTS_DIR}/surface-checker.mjs`
);

// ─── Fixture helpers ─────────────────────────────────────────────────────────

function write(root, relPath, content) {
  const full = join(root, relPath);
  mkdirSync(join(full, '..'), { recursive: true });
  writeFileSync(
    full,
    typeof content === 'object' ? JSON.stringify(content, null, 2) : content,
    'utf8',
  );
}

/** Minimal surface matrix used in all fixture workspaces. */
const BASE_MATRIX = {
  $schema: './package-surface.schema.json',
  description: 'fixture',
  packages: {
    '@ui-construction-library/public-pkg': {
      surface: 'public',
      role: 'primary',
      mode: 'library',
      recommended: true,
    },
    '@ui-construction-library/internal-pkg': {
      surface: 'internal',
      role: 'infrastructure',
      mode: 'library',
      recommended: false,
    },
  },
  libraryApps: ['apps/docs'],
  platformApps: ['apps/builder'],
  platformPaths: ['apps/builder'],
};

/**
 * Write a fully-valid fixture workspace to `root`.
 * Individual tests mutate specific files to introduce violations.
 */
function buildValidFixture(root) {
  write(root, 'config/package-surface.json', BASE_MATRIX);
  write(root, 'config/package-surface.schema.json', { type: 'object' });

  // Public package — no extra metadata needed
  write(root, 'packages/public-pkg/package.json', {
    name: '@ui-construction-library/public-pkg',
    version: '0.1.0',
  });
  write(root, 'packages/public-pkg/README.md', '# Public Package\n');

  // Internal package — must have ui-construction metadata + INTERNAL-ONLY notice
  write(root, 'packages/internal-pkg/package.json', {
    name: '@ui-construction-library/internal-pkg',
    version: '0.1.0',
    'ui-construction': { surface: 'internal', mode: 'library' },
  });
  write(
    root,
    'packages/internal-pkg/README.md',
    `# Internal Package\n\n${INTERNAL_NOTICE}\n`,
  );

  // Library app — clean source file (no internal imports)
  write(
    root,
    'apps/docs/src/index.ts',
    `import { Foo } from '@ui-construction-library/public-pkg';\n`,
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('checkSurface', () => {
  let tmp;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'surface-test-'));
    buildValidFixture(tmp);
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  it('returns no violations for a correctly set-up workspace', () => {
    expect(checkSurface(tmp)).toEqual([]);
  });

  // ── Metadata checks ────────────────────────────────────────────────────────

  it('flags an internal package missing ui-construction metadata entirely', () => {
    write(tmp, 'packages/internal-pkg/package.json', {
      name: '@ui-construction-library/internal-pkg',
      version: '0.1.0',
      // no 'ui-construction' key
    });
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('MISSING INTERNAL METADATA'))).toBe(true);
  });

  it('flags an internal package whose metadata surface value is not "internal"', () => {
    write(tmp, 'packages/internal-pkg/package.json', {
      name: '@ui-construction-library/internal-pkg',
      version: '0.1.0',
      'ui-construction': { surface: 'public', mode: 'library' },
    });
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('MISSING INTERNAL METADATA'))).toBe(true);
  });

  it('flags a mode mismatch between package.json metadata and the surface matrix', () => {
    write(tmp, 'packages/internal-pkg/package.json', {
      name: '@ui-construction-library/internal-pkg',
      version: '0.1.0',
      'ui-construction': { surface: 'internal', mode: 'platform' }, // matrix says 'library'
    });
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('MODE MISMATCH'))).toBe(true);
  });

  // ── README notice checks ───────────────────────────────────────────────────

  it('flags an internal package README that is missing the INTERNAL-ONLY notice', () => {
    write(tmp, 'packages/internal-pkg/README.md', '# Internal Package\n\nNo notice here.\n');
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('MISSING INTERNAL NOTICE'))).toBe(true);
  });

  it('flags an internal package with no README file', () => {
    unlinkSync(join(tmp, 'packages/internal-pkg/README.md'));
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('MISSING README'))).toBe(true);
  });

  // ── Matrix completeness ────────────────────────────────────────────────────

  it('flags a workspace package that is not listed in the surface matrix', () => {
    write(tmp, 'packages/mystery-pkg/package.json', {
      name: '@ui-construction-library/mystery-pkg',
      version: '0.1.0',
    });
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('UNLISTED PACKAGE'))).toBe(true);
  });

  it('flags a stale matrix entry whose workspace package directory was removed', () => {
    rmSync(join(tmp, 'packages/public-pkg'), { recursive: true, force: true });
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('STALE MATRIX ENTRY'))).toBe(true);
  });

  // ── Import boundary checks ─────────────────────────────────────────────────

  it('flags a library app that imports an internal package via static import', () => {
    write(
      tmp,
      'apps/docs/src/index.ts',
      `import { helper } from '@ui-construction-library/internal-pkg';\n`,
    );
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('INTERNAL IMPORT'))).toBe(true);
  });

  it('flags a library app importing an internal package subpath', () => {
    write(
      tmp,
      'apps/docs/src/index.ts',
      `import { x } from '@ui-construction-library/internal-pkg/utils';\n`,
    );
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('INTERNAL IMPORT'))).toBe(true);
  });

  it('flags a library app importing an internal package via dynamic import', () => {
    write(
      tmp,
      'apps/docs/src/index.ts',
      `const mod = await import('@ui-construction-library/internal-pkg');\n`,
    );
    const v = checkSurface(tmp);
    expect(v.some((msg) => msg.startsWith('INTERNAL IMPORT'))).toBe(true);
  });

  it('does not flag a platform app importing an internal package', () => {
    // apps/builder is in platformApps, NOT in libraryApps — it is not scanned
    write(
      tmp,
      'apps/builder/src/index.ts',
      `import { helper } from '@ui-construction-library/internal-pkg';\n`,
    );
    expect(checkSurface(tmp)).toEqual([]);
  });

  it('does not produce INTERNAL IMPORT violations when library apps use only public packages', () => {
    // The valid fixture already has this — double-check explicitly
    const v = checkSurface(tmp);
    expect(v.filter((msg) => msg.startsWith('INTERNAL IMPORT'))).toEqual([]);
  });
});

// ─── importPattern unit tests ─────────────────────────────────────────────────

describe('importPattern', () => {
  const re = () => importPattern('@ui-construction-library/utils');

  it('matches a static named import', () => {
    expect(re().test(`import { cn } from '@ui-construction-library/utils'`)).toBe(true);
  });

  it('matches a static default import', () => {
    expect(re().test(`import utils from '@ui-construction-library/utils'`)).toBe(true);
  });

  it('matches a subpath import', () => {
    expect(re().test(`import { x } from '@ui-construction-library/utils/helpers'`)).toBe(true);
  });

  it('matches a dynamic import call', () => {
    expect(re().test(`const m = await import('@ui-construction-library/utils')`)).toBe(true);
  });

  it('matches a require call', () => {
    expect(re().test(`const u = require('@ui-construction-library/utils')`)).toBe(true);
  });

  it('does not match a package that shares a name prefix (utils-extra)', () => {
    expect(re().test(`import { x } from '@ui-construction-library/utils-extra'`)).toBe(false);
  });

  it('does not match a plain comment mentioning the package name', () => {
    expect(re().test(`// see @ui-construction-library/utils for helpers`)).toBe(false);
  });
});
