import { describe, expect, it } from 'vitest';
import {
  analyzeExportProject,
  type ExportRequest,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
} from '../index';

const multiPageRequest: ExportRequest = {
  target: 'react-single-page',
  project: {
    id: 'project-multi',
    name: 'Multi page fixture',
    pages: [
      {
        id: 'home',
        name: 'Home',
        path: '/',
        rootNode: {
          id: 'root-home',
          componentId: 'stack',
          props: { gap: 'lg', align: 'stretch' },
          children: [
            {
              id: 'hero-heading',
              componentId: 'text',
              props: { as: 'h1', children: 'Welcome home' },
              children: [],
            },
            {
              id: 'hero-cta',
              componentId: 'button',
              props: { children: 'Get started', variant: 'primary' },
              children: [],
            },
          ],
        },
      },
      {
        id: 'pricing',
        name: 'Pricing',
        path: '/pricing',
        rootNode: {
          id: 'root-pricing',
          componentId: 'stack',
          props: { gap: 'md' },
          children: [
            {
              id: 'pricing-title',
              componentId: 'text',
              props: { as: 'h2', children: 'Pricing tiers' },
              children: [],
            },
            {
              id: 'pricing-grid',
              componentId: 'grid',
              props: { columns: 3 },
              children: [],
            },
          ],
        },
      },
      {
        id: 'docs',
        name: 'Docs',
        path: '/docs',
        rootNode: {
          id: 'root-docs',
          componentId: 'stack',
          props: { gap: 'sm' },
          children: [
            {
              id: 'docs-title',
              componentId: 'text',
              props: { as: 'h2', children: 'Documentation' },
              children: [],
            },
            {
              id: 'docs-copy',
              componentId: 'text',
              props: { as: 'p', children: 'API guides and examples' },
              children: [],
            },
          ],
        },
      },
    ],
  },
};

describe('multi-page export artifacts', () => {
  it('produces deterministic pipeline artifacts for larger multi-page fixtures', () => {
    const normalized = normalizeExportProject(multiPageRequest);
    const analyzed = analyzeExportProject(normalized);
    const enriched = enrichExportProject(analyzed);
    const rendered = renderExportProject(enriched);

    expect(normalized.ir.pages.map((page) => page.path)).toEqual([
      '/',
      '/pricing',
      '/docs',
    ]);
    expect(analyzed.imports).toEqual(['button', 'text']);
    expect(analyzed.dependencies).toEqual([
      '@ui-construction-library/core',
      'clsx',
      'react',
      'react-dom',
    ]);
    expect(analyzed.unsupportedNodeIds).toEqual([
      'pricing-grid',
      'root-docs',
      'root-home',
      'root-pricing',
    ]);
    expect(enriched.metadata).toEqual({
      renderer: 'react-single-page',
      generatedAt: 'deterministic-placeholder',
      pageCount: 3,
    });
    expect(rendered.files.map((file) => file.path)).toEqual([
      'package.json',
      'index.html',
      'tsconfig.json',
      'src/main.tsx',
      'src/App.tsx',
      'src/styles.css',
      'src/theme.css',
      'tokens/design-tokens.json',
      'tokens/design-tokens.css',
      'assets/icons/placeholder-app-icon.svg',
      'README.md',
    ]);
    expect(rendered.diagnostics).toEqual([]);
  });

  it('keeps multi-page route artifacts stable in the rendered app shell', () => {
    const rendered = renderExportProject(
      enrichExportProject(
        analyzeExportProject(normalizeExportProject(multiPageRequest))
      )
    );

    const appFile = rendered.files.find((file) => file.path === 'src/App.tsx');
    expect(appFile?.content).toContain('const routePathMap');
    expect(appFile?.content).toContain('const pageLayouts =');
    expect(appFile?.content).toContain('"/": "home"');
    expect(appFile?.content).toContain('"/pricing": "pricing"');
    expect(appFile?.content).toContain('"/docs": "docs"');
    expect(appFile?.content).toContain('data-page-id="home"');
    expect(appFile?.content).toContain('data-page-id="pricing"');
    expect(appFile?.content).toContain('data-page-id="docs"');
    expect(appFile?.content).toContain('className="app-shell"');
    expect(appFile?.content).toContain('className="app-sidebar"');
    expect(appFile?.content).toContain(
      'Route-aware React export with shared theme layer and app shell navigation.'
    );
    expect(appFile?.content).toContain('<header className="page-header">');
    expect(appFile?.content).toContain('data-unsupported-component="stack"');

    const themeFile = rendered.files.find(
      (file) => file.path === 'src/theme.css'
    );
    expect(themeFile?.content).toContain('--export-accent: #0f766e');
    expect(themeFile?.content).toContain('--export-surface: #ffffff');

    const tokensJson = rendered.files.find(
      (file) => file.path === 'tokens/design-tokens.json'
    );
    expect(tokensJson?.content).toContain('"stylesheets"');
    expect(tokensJson?.content).toContain(
      '@ui-construction-library/styles/dist/themes.css'
    );

    const tokensCss = rendered.files.find(
      (file) => file.path === 'tokens/design-tokens.css'
    );
    expect(tokensCss?.content).toContain(
      ':root:not([data-theme]), [data-theme="light"]'
    );
    expect(tokensCss?.content).toContain(
      ':root:not([data-theme]), [data-theme="dark"]'
    );
    expect(tokensCss?.content).toContain('/* export overrides */');
  });
});
