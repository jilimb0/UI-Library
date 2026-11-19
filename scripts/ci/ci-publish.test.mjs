import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseCatalogFromWorkspaceYaml,
  restorePublishDeps,
  rewritePublishDeps,
} from './ci-publish.mjs';

test('parseCatalogFromWorkspaceYaml extracts quoted and unquoted catalog entries while ignoring overrides', () => {
  const yaml = `
packages:
  - 'packages/*'

overrides:
  tailwind-variants: '99.0.0'
  esbuild: '>=0.28.1'

packageExtensions:
  'next@*':
    dependencies:
      postcss: '>=8.5.29'

catalog:
  '@biomejs/biome': '2.4.15'
  react: ^18.3.1
  tailwind-variants: ^3.1.0 # inline comment
  '@types/react': ^18.3.27
  "vitest": "^4.1.8"
`;

  const catalog = parseCatalogFromWorkspaceYaml(yaml);
  assert.deepEqual(catalog, {
    '@biomejs/biome': '2.4.15',
    react: '^18.3.1',
    'tailwind-variants': '^3.1.0',
    '@types/react': '^18.3.27',
    vitest: '^4.1.8',
  });
});

test('rewritePublishDeps rewrites workspace:* and catalog: specs and restorePublishDeps restores originals', () => {
  const pkgObj = {
    name: '@ui-construction-library/core',
    version: '0.10.1',
    dependencies: {
      '@ui-construction-library/tokens': 'workspace:*',
      '@ui-construction-library/utils': 'workspace:^',
      'tailwind-variants': 'catalog:',
      clsx: '^2.0.0',
    },
    devDependencies: {
      '@types/react': 'catalog:',
      vitest: 'catalog:',
    },
    peerDependencies: {
      react: 'catalog:',
    },
    optionalDependencies: {
      '@ui-construction-library/schema': 'workspace:*',
    },
  };

  const versionMap = {
    '@ui-construction-library/tokens': '0.6.0',
    '@ui-construction-library/utils': '0.5.1',
    '@ui-construction-library/schema': '0.4.0',
  };

  const catalogMap = {
    'tailwind-variants': '^3.1.0',
    '@types/react': '^18.3.27',
    vitest: '^4.1.8',
    react: '^18.3.1',
  };

  const { changed, original } = rewritePublishDeps(
    pkgObj,
    versionMap,
    catalogMap
  );

  assert.equal(changed, true);
  assert.equal(pkgObj.dependencies['@ui-construction-library/tokens'], '^0.6.0');
  assert.equal(pkgObj.dependencies['@ui-construction-library/utils'], '^0.5.1');
  assert.equal(pkgObj.dependencies['tailwind-variants'], '^3.1.0');
  assert.equal(pkgObj.dependencies.clsx, '^2.0.0');
  assert.equal(pkgObj.devDependencies['@types/react'], '^18.3.27');
  assert.equal(pkgObj.devDependencies.vitest, '^4.1.8');
  assert.equal(pkgObj.peerDependencies.react, '^18.3.1');
  assert.equal(
    pkgObj.optionalDependencies['@ui-construction-library/schema'],
    '^0.4.0'
  );

  restorePublishDeps(pkgObj, original);

  assert.equal(
    pkgObj.dependencies['@ui-construction-library/tokens'],
    'workspace:*'
  );
  assert.equal(
    pkgObj.dependencies['@ui-construction-library/utils'],
    'workspace:^'
  );
  assert.equal(pkgObj.dependencies['tailwind-variants'], 'catalog:');
  assert.equal(pkgObj.devDependencies['@types/react'], 'catalog:');
  assert.equal(pkgObj.peerDependencies.react, 'catalog:');
});

test('rewritePublishDeps throws if a runtime catalog dependency is missing from catalogMap', () => {
  for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    const pkgObj = {
      name: '@ui-construction-library/test',
      version: '0.1.0',
      [field]: {
        'missing-pkg': 'catalog:',
      },
    };

    assert.throws(
      () => rewritePublishDeps(pkgObj, {}, {}),
      /Missing catalog version for missing-pkg/
    );
  }
});
