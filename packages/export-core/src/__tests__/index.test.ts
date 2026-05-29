import { describe, expect, it } from 'vitest';
import {
  analyzeExportProject,
  type BuilderLikeProject,
  createExportAcceptanceChecklist,
  createExportRequestFromBuilderProject,
  type ExportRequest,
  enrichExportProject,
  normalizeExportProject,
  renderReactSinglePage,
} from '../index';

const baseRequest: ExportRequest = {
  target: 'react-single-page',
  project: {
    id: 'project-1',
    name: 'Demo Project',
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        path: '/',
        rootNode: {
          id: 'node-root',
          componentId: 'card',
          props: { padding: 'md', interactive: false },
          children: [
            {
              id: 'node-text',
              componentId: 'text',
              props: { children: 'Hello world', align: 'start' },
              children: [],
            },
          ],
        },
      },
    ],
  },
};

const builderFixture: BuilderLikeProject = {
  id: 'marketing-site',
  name: 'Marketing Site',
  pages: [
    {
      id: 'landing',
      title: 'Landing',
      root: {
        id: 'landing-root',
        componentId: 'card',
        props: { padding: 'md', shadow: 'sm', interactive: false },
        children: [
          {
            id: 'hero-heading',
            componentId: 'heading',
            props: { level: '1', children: 'Build faster' },
            children: [],
          },
          {
            id: 'hero-copy',
            componentId: 'text',
            props: {
              children:
                'Registry-backed page scaffolds with page comments and versions.',
            },
            children: [],
          },
        ],
      },
    },
    {
      id: 'pricing',
      title: 'Pricing',
      root: {
        id: 'pricing-root',
        componentId: 'card',
        props: { padding: 'lg', interactive: false },
        children: [
          {
            id: 'pricing-heading',
            componentId: 'heading',
            props: { level: '2', children: 'Simple pricing' },
            children: [],
          },
          {
            id: 'pricing-copy',
            componentId: 'text',
            props: { children: 'One workspace. Predictable exports.' },
            children: [],
          },
        ],
      },
    },
  ],
};

describe('export-core pipeline', () => {
  it('normalizes a golden-path project into deterministic IR', () => {
    const first = normalizeExportProject(baseRequest);
    const second = normalizeExportProject(baseRequest);

    expect(first).toEqual(second);
    expect(first.diagnostics).toEqual([]);
    expect(first.ir.pages[0]?.rootNode.componentId).toBe('card');
    expect(first.ir.pages[0]?.rootNode.children[0]?.componentId).toBe('text');
    expect(Object.keys(first.ir.pages[0]!.rootNode.props)).toEqual([
      'interactive',
      'padding',
    ]);
  });

  it('creates an export request from a real builder-shaped fixture', () => {
    const request = createExportRequestFromBuilderProject(
      builderFixture,
      'react-single-page'
    );

    expect(request).toEqual({
      target: 'react-single-page',
      project: {
        id: 'marketing-site',
        name: 'Marketing Site',
        pages: [
          {
            id: 'landing',
            name: 'Landing',
            path: '/',
            rootNode: builderFixture.pages[0]!.root,
          },
          {
            id: 'pricing',
            name: 'Pricing',
            path: '/pricing',
            rootNode: builderFixture.pages[1]!.root,
          },
        ],
      },
    });
  });

  it('analyzes imports, dependencies, and unsupported nodes deterministically', () => {
    const normalized = normalizeExportProject(baseRequest);
    const first = analyzeExportProject(normalized);
    const second = analyzeExportProject(normalized);

    expect(first).toEqual(second);
    expect(first.imports).toEqual(['card', 'text']);
    expect(first.dependencies).toEqual([
      '@ui-construction-library/core',
      'clsx',
      'react',
      'react-dom',
    ]);
    expect(first.unsupportedNodeIds).toEqual([]);
  });

  it('enriches analyzed output with deterministic metadata', () => {
    const normalized = normalizeExportProject(baseRequest);
    const analyzed = analyzeExportProject(normalized);
    const enriched = enrichExportProject(analyzed);

    expect(enriched.metadata).toEqual({
      renderer: 'react-single-page',
      generatedAt: 'deterministic-placeholder',
      pageCount: 1,
    });
  });

  it('emits diagnostics for unknown components and tracks unsupported nodes', () => {
    const result = normalizeExportProject({
      ...baseRequest,
      project: {
        ...baseRequest.project,
        pages: [
          {
            ...baseRequest.project.pages[0]!,
            rootNode: {
              id: 'node-unknown',
              componentId: 'missing-component',
              props: {
                onClick: () => undefined,
              },
              children: [],
            },
          },
        ],
      },
    });

    expect(result.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'UNKNOWN_COMPONENT',
          componentId: 'missing-component',
        }),
        expect.objectContaining({
          code: 'UNSUPPORTED_PROP_VALUE',
          propName: 'onClick',
        }),
      ])
    );

    const analyzed = analyzeExportProject(result);
    expect(analyzed.unsupportedNodeIds).toEqual(['node-unknown']);
  });

  it('renders a deterministic route-aware React file manifest', () => {
    const normalized = normalizeExportProject(
      createExportRequestFromBuilderProject(builderFixture, 'react-single-page')
    );
    const first = renderReactSinglePage(normalized.ir);
    const second = renderReactSinglePage(normalized.ir);

    expect(first).toEqual(second);
    const appFile = first.files.find((file) => file.path === 'src/App.tsx');
    expect(appFile?.content).toContain('const routePathMap =');
    expect(appFile?.content).toContain('"/pricing": "pricing"');
    expect(appFile?.content).toContain('Exported pages');
    expect(appFile?.content).toContain('pageViews[currentPageId]');
  });

  it('renders a deterministic single-page React file manifest', () => {
    const normalized = normalizeExportProject(baseRequest);
    const first = renderReactSinglePage(normalized.ir);
    const second = renderReactSinglePage(normalized.ir);

    expect(first).toEqual(second);
    expect(first.diagnostics).toEqual([]);
    expect(first.files.map((file) => file.path)).toEqual([
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
    const appFile = first.files.find((file) => file.path === 'src/App.tsx');
    expect(appFile?.content).toContain('const pageLayouts =');
    expect(appFile?.content).toContain('className="app-shell"');

    const tokensJson = first.files.find(
      (file) => file.path === 'tokens/design-tokens.json'
    );
    expect(tokensJson?.content).toContain('"stylesheets"');
    expect(tokensJson?.content).toContain(
      '@ui-construction-library/styles/dist/themes.css'
    );
    expect(tokensJson?.content).toContain(
      '@ui-construction-library/styles/dist/variables.css'
    );

    const tokensCss = first.files.find(
      (file) => file.path === 'tokens/design-tokens.css'
    );
    expect(tokensCss?.content).toContain(
      ':root:not([data-theme]), [data-theme="light"]'
    );
    expect(tokensCss?.content).toContain(
      ':root:not([data-theme]), [data-theme="dark"]'
    );
    expect(tokensCss?.content).toContain('/* export overrides */');
    expect(tokensCss?.content).toContain('--export-font-sans:');
  });

  it('creates a closeout checklist from enriched and rendered output', () => {
    const normalized = normalizeExportProject(
      createExportRequestFromBuilderProject(builderFixture, 'react-single-page')
    );
    const analyzed = analyzeExportProject(normalized);
    const enriched = enrichExportProject(analyzed);
    const rendered = renderReactSinglePage(enriched.ir);
    const checklist = createExportAcceptanceChecklist(enriched, rendered);

    expect(checklist).toEqual({
      hasPages: true,
      hasDiagnostics: false,
      deterministicRenderer: true,
      builderFixtureCompatible: true,
    });
  });
});
