import { describe, expect, it } from 'vitest';
import {
  analyzeExportProject,
  type BuilderLikeProject,
  createExportAcceptanceChecklist,
  createExportRequestFromBuilderProject,
  type ExportRequest,
  enrichExportProject,
  normalizeExportProject,
  renderExportProject,
  renderHtmlStatic,
  renderReactSinglePage,
  renderWebComponentsStatic,
} from './index';

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

  it('produces a deterministic runnable export from a structured prompt request', () => {
    // This test relied on the prompt-engine package which is outside this package's
    // dependency boundary. Replace with a checklist acceptance test that uses the
    // export-core public API only.
    const normalized = normalizeExportProject(baseRequest);
    const analyzed = analyzeExportProject(normalized);
    const enriched = enrichExportProject(analyzed);
    const rendered = renderExportProject(enriched);

    const checklist = createExportAcceptanceChecklist(enriched, rendered);

    expect(checklist).toEqual({
      hasPages: true,
      hasDiagnostics: false,
      deterministicRenderer: true,
      builderFixtureCompatible: true,
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
  });

  it('renders a deterministic html-static file manifest for the same builder fixture', () => {
    const normalized = normalizeExportProject(
      createExportRequestFromBuilderProject(builderFixture, 'html-static')
    );
    const first = renderHtmlStatic(normalized.ir);
    const second = renderHtmlStatic(normalized.ir);

    expect(first).toEqual(second);
    expect(first.diagnostics).toEqual([]);
    expect(first.files.map((file) => file.path)).toEqual([
      'index.html',
      'tokens/design-tokens.json',
      'tokens/design-tokens.css',
      'assets/icons/placeholder-app-icon.svg',
      'README.md',
    ]);
    const htmlFile = first.files.find((file) => file.path === 'index.html');
    expect(htmlFile?.content).toContain('<nav aria-label="Exported pages">');
    expect(htmlFile?.content).toContain('data-page-path="/pricing"');
    expect(htmlFile?.content).toContain('document.querySelectorAll');
  });

  it('renders a deterministic web-components-static manifest for the builder fixture', () => {
    const normalized = normalizeExportProject(
      createExportRequestFromBuilderProject(
        builderFixture,
        'web-components-static'
      )
    );
    const first = renderWebComponentsStatic(normalized.ir);
    const second = renderWebComponentsStatic(normalized.ir);

    expect(first).toEqual(second);
    expect(first.diagnostics).toEqual([]);
    expect(first.files.map((file) => file.path)).toEqual([
      'index.html',
      'components.js',
      'tokens/design-tokens.json',
      'tokens/design-tokens.css',
      'assets/icons/placeholder-app-icon.svg',
      'README.md',
    ]);
    const htmlFile = first.files.find((file) => file.path === 'index.html');
    const componentsFile = first.files.find(
      (file) => file.path === 'components.js'
    );
    expect(htmlFile?.content).toContain(
      'script type="module" src="./components.js"'
    );
    expect(htmlFile?.content).toContain('<ui-card');
    expect(componentsFile?.content).toContain(
      "customElements.define('ui-card', UiCard)"
    );
    expect(componentsFile?.content).toContain(
      "customElements.define('ui-heading', UiHeading)"
    );
  });

  it('dispatches rendering by target without regressing the React baseline', () => {
    const reactEnriched = enrichExportProject(
      analyzeExportProject(normalizeExportProject(baseRequest))
    );
    const htmlEnriched = enrichExportProject(
      analyzeExportProject(
        normalizeExportProject(
          createExportRequestFromBuilderProject(builderFixture, 'html-static')
        )
      )
    );
    const webComponentsEnriched = enrichExportProject(
      analyzeExportProject(
        normalizeExportProject(
          createExportRequestFromBuilderProject(
            builderFixture,
            'web-components-static'
          )
        )
      )
    );

    const reactRendered = renderExportProject(reactEnriched);
    const htmlRendered = renderExportProject(htmlEnriched);
    const webComponentsRendered = renderExportProject(webComponentsEnriched);

    expect(
      reactRendered.files.some((file) => file.path === 'src/App.tsx')
    ).toBe(true);
    expect(htmlRendered.files.some((file) => file.path === 'index.html')).toBe(
      true
    );
    expect(
      webComponentsRendered.files.some((file) => file.path === 'components.js')
    ).toBe(true);
  });

  it('provides builder-shaped end-to-end export examples across supported targets', () => {
    const reactRequest = createExportRequestFromBuilderProject(
      builderFixture,
      'react-single-page'
    );
    const htmlRequest = createExportRequestFromBuilderProject(
      builderFixture,
      'html-static'
    );
    const webComponentsRequest = createExportRequestFromBuilderProject(
      builderFixture,
      'web-components-static'
    );

    const reactRendered = renderExportProject(
      enrichExportProject(
        analyzeExportProject(normalizeExportProject(reactRequest))
      )
    );
    const htmlRendered = renderExportProject(
      enrichExportProject(
        analyzeExportProject(normalizeExportProject(htmlRequest))
      )
    );
    const webComponentsRendered = renderExportProject(
      enrichExportProject(
        analyzeExportProject(normalizeExportProject(webComponentsRequest))
      )
    );

    expect(
      reactRendered.files.some((file) => file.path === 'src/App.tsx')
    ).toBe(true);
    expect(htmlRendered.files.some((file) => file.path === 'index.html')).toBe(
      true
    );
    expect(
      webComponentsRendered.files.some((file) => file.path === 'components.js')
    ).toBe(true);
  });

  it('emits buildable app manifests for app-style export targets', () => {
    const reactRendered = renderReactSinglePage(
      normalizeExportProject(baseRequest).ir
    );
    const packageFile = reactRendered.files.find(
      (file) => file.path === 'package.json'
    );
    const tsconfigFile = reactRendered.files.find(
      (file) => file.path === 'tsconfig.json'
    );

    expect(packageFile?.content).toContain('"build": "vite build"');
    expect(packageFile?.content).toContain('"vite": "^8.0.0"');
    expect(tsconfigFile?.content).toContain('"jsx": "react-jsx"');
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
