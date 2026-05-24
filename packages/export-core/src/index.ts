import { getComponentById } from '@ui-construction-library/registry';
import { validateRequiredShape } from '@ui-construction-library/schema';

export type ExportTarget =
  | 'react-single-page'
  | 'html-static'
  | 'web-components-static';
export type ExportPipelineStage =
  | 'normalize'
  | 'analyze'
  | 'enrich'
  | 'render'
  | 'post-process';

export type ExportRequest = {
  target: ExportTarget;
  project: ExportProjectInput;
};

export type ExportProjectInput = {
  id: string;
  name: string;
  pages: ExportPageInput[];
};

export type ExportPageInput = {
  id: string;
  name: string;
  path: string;
  rootNode: ExportNodeInput;
};

export type ExportNodeInput = {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  children: ExportNodeInput[];
};

export type BuilderLikeNode = {
  id: string;
  componentId: string;
  props: Record<string, unknown>;
  children: BuilderLikeNode[];
};

export type BuilderLikePage = {
  id: string;
  title: string;
  root: BuilderLikeNode;
};

export type BuilderLikeProject = {
  id: string;
  name: string;
  pages: BuilderLikePage[];
};

export type ExportDiagnosticLevel = 'info' | 'warning' | 'error';
export type ExportDiagnosticCode =
  | 'INVALID_PROJECT_SHAPE'
  | 'UNKNOWN_COMPONENT'
  | 'UNSUPPORTED_PROP_VALUE'
  | 'UNSUPPORTED_COMPONENT';

export type ExportDiagnostic = {
  level: ExportDiagnosticLevel;
  code: ExportDiagnosticCode;
  message: string;
  pageId?: string;
  nodeId?: string;
  componentId?: string;
  propName?: string;
};

export type ExportIRNode = {
  nodeId: string;
  componentId: string;
  exportKind: 'component' | 'unsupported';
  props: Record<string, string | number | boolean | null>;
  children: ExportIRNode[];
  unsupportedReason?: string;
};

export type ExportIRPage = {
  pageId: string;
  name: string;
  path: string;
  rootNode: ExportIRNode;
};

export type ExportIRProject = {
  projectId: string;
  name: string;
  target: ExportTarget;
  pages: ExportIRPage[];
};

export type NormalizeExportResult = {
  ir: ExportIRProject;
  diagnostics: ExportDiagnostic[];
};

export type AnalyzeExportResult = {
  ir: ExportIRProject;
  diagnostics: ExportDiagnostic[];
  imports: string[];
  dependencies: string[];
  unsupportedNodeIds: string[];
};

export type EnrichExportResult = AnalyzeExportResult & {
  metadata: {
    renderer: ExportTarget;
    generatedAt: string;
    pageCount: number;
  };
};

export type ExportFile = {
  path: string;
  content: string;
};

export type RenderExportResult = {
  files: ExportFile[];
  diagnostics: ExportDiagnostic[];
};

export type ExportAcceptanceChecklist = {
  hasPages: boolean;
  hasDiagnostics: boolean;
  deterministicRenderer: boolean;
  builderFixtureCompatible: boolean;
};

function normalizeScalarProp(
  value: unknown,
  pageId: string,
  nodeId: string,
  diagnostics: ExportDiagnostic[],
  propName: string
): string | number | boolean | null {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  diagnostics.push({
    level: 'warning',
    code: 'UNSUPPORTED_PROP_VALUE',
    message: `Prop ${propName} on node ${nodeId} cannot be exported as a scalar value.`,
    pageId,
    nodeId,
    propName,
  });

  return null;
}

function normalizeNode(
  node: ExportNodeInput,
  pageId: string,
  diagnostics: ExportDiagnostic[]
): ExportIRNode {
  const component = getComponentById(node.componentId);
  const exportKind = component ? 'component' : 'unsupported';

  if (!component) {
    diagnostics.push({
      level: 'error',
      code: 'UNKNOWN_COMPONENT',
      message: `Component ${node.componentId} is not registered for export.`,
      pageId,
      nodeId: node.id,
      componentId: node.componentId,
    });
  }

  const props = Object.fromEntries(
    Object.entries(node.props)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([propName, value]) => [
        propName,
        normalizeScalarProp(value, pageId, node.id, diagnostics, propName),
      ])
  );

  return {
    nodeId: node.id,
    componentId: node.componentId,
    exportKind,
    props,
    children: node.children.map((child) =>
      normalizeNode(child, pageId, diagnostics)
    ),
    unsupportedReason:
      exportKind === 'unsupported' ? 'component-not-registered' : undefined,
  };
}

function renderPropValue(value: string | number | boolean | null): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  return '{null}';
}

function renderNodeToJsx(node: ExportIRNode): string {
  if (node.exportKind === 'unsupported') {
    return `<div data-unsupported-component=${JSON.stringify(node.componentId)} />`;
  }

  const componentName = pascalCase(node.componentId);
  const propEntries = Object.entries(node.props)
    .map(([key, value]) => `${key}={${renderPropValue(value)}}`)
    .join(' ');
  const openTag =
    propEntries.length > 0
      ? `<${componentName} ${propEntries}>`
      : `<${componentName}>`;

  if (node.children.length === 0) {
    return `${openTag}</${componentName}>`;
  }

  const children = node.children
    .map((child) => renderNodeToJsx(child))
    .join('');
  return `${openTag}${children}</${componentName}>`;
}

function pascalCase(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

function createPagePath(page: BuilderLikePage, index: number): string {
  if (index === 0) return '/';
  return `/${page.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

export function createExportRequestFromBuilderProject(
  project: BuilderLikeProject,
  target: ExportTarget
): ExportRequest {
  return {
    target,
    project: {
      id: project.id,
      name: project.name,
      pages: project.pages.map((page, index) => ({
        id: page.id,
        name: page.title,
        path: createPagePath(page, index),
        rootNode: page.root,
      })),
    },
  };
}

export function normalizeExportProject(
  request: ExportRequest
): NormalizeExportResult {
  const diagnostics: ExportDiagnostic[] = [];

  if (!validateRequiredShape('project', request.project)) {
    diagnostics.push({
      level: 'error',
      code: 'INVALID_PROJECT_SHAPE',
      message: 'Project does not satisfy required export shape.',
    });
  }

  const pages = request.project.pages.map((page) => ({
    pageId: page.id,
    name: page.name,
    path: page.path,
    rootNode: normalizeNode(page.rootNode, page.id, diagnostics),
  }));

  return {
    ir: {
      projectId: request.project.id,
      name: request.project.name,
      target: request.target,
      pages,
    },
    diagnostics,
  };
}

export function analyzeExportProject(
  result: NormalizeExportResult
): AnalyzeExportResult {
  const imports = new Set<string>();
  const dependencies = new Set<string>(['react', 'react-dom']);
  const unsupportedNodeIds: string[] = [];
  const componentCounts = new Map<string, number>();

  const visit = (node: ExportIRNode): void => {
    if (node.exportKind === 'unsupported') {
      unsupportedNodeIds.push(node.nodeId);
    } else {
      imports.add(node.componentId);
      componentCounts.set(
        node.componentId,
        (componentCounts.get(node.componentId) ?? 0) + 1
      );
    }

    for (const child of node.children) visit(child);
  };

  for (const page of result.ir.pages) {
    visit(page.rootNode);
  }

  if (imports.size > 0) {
    dependencies.add('@ui-construction-library/core');
  }

  if (componentCounts.size > 1) {
    dependencies.add('clsx');
  }

  return {
    ir: result.ir,
    diagnostics: [...result.diagnostics],
    imports: [...imports].sort(),
    dependencies: [...dependencies].sort(),
    unsupportedNodeIds: unsupportedNodeIds.sort(),
  };
}

export function enrichExportProject(
  result: AnalyzeExportResult
): EnrichExportResult {
  return {
    ...result,
    metadata: {
      renderer: result.ir.target,
      generatedAt: 'deterministic-placeholder',
      pageCount: result.ir.pages.length,
    },
  };
}

function createRoutePathMap(ir: ExportIRProject): string {
  const entries = ir.pages.map(
    (page) => `  ${JSON.stringify(page.path)}: ${JSON.stringify(page.pageId)}`
  );
  return `\n{\n${entries.join(',\n')}\n}`;
}

function createPageViewMap(ir: ExportIRProject): string {
  const entries = ir.pages.map((page) => {
    const jsx = renderNodeToJsx(page.rootNode);
    return `  ${JSON.stringify(page.pageId)}: (\n    <main data-project-id=${JSON.stringify(ir.projectId)} data-page-id=${JSON.stringify(page.pageId)} data-page-path=${JSON.stringify(page.path)}>\n      ${jsx}\n    </main>\n  )`;
  });

  return `\n{\n${entries.join(',\n')}\n}`;
}

export function renderReactSinglePage(ir: ExportIRProject): RenderExportResult {
  const diagnostics: ExportDiagnostic[] = [];

  if (ir.pages.length === 0) {
    diagnostics.push({
      level: 'error',
      code: 'UNSUPPORTED_COMPONENT',
      message: 'Cannot render export without at least one page.',
    });

    return { files: [], diagnostics };
  }

  const files: ExportFile[] = [
    {
      path: 'package.json',
      content: `${JSON.stringify(
        {
          name: 'exported-ui-project',
          private: true,
          version: '0.1.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview',
          },
          dependencies: {
            '@ui-construction-library/core': '^0.0.0',
            react: '^18.3.1',
            'react-dom': '^18.3.1',
          },
          devDependencies: {
            typescript: '^5.6.3',
            vite: '^8.0.0',
          },
        },
        null,
        2
      )}\n`,
    },
    {
      path: 'tsconfig.json',
      content: `${JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'Bundler',
            allowImportingTsExtensions: false,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
          },
          include: ['src'],
        },
        null,
        2
      )}\n`,
    },
    {
      path: 'src/main.tsx',
      content:
        "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './styles.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n);\n",
    },
    {
      path: 'src/App.tsx',
      content: `import { useMemo, useState } from 'react';\n\nconst routePathMap = ${createRoutePathMap(ir)};\nconst pageViews = ${createPageViewMap(ir)};\n\nexport default function App() {\n  const paths = useMemo(() => Object.keys(routePathMap), []);\n  const [currentPath, setCurrentPath] = useState(paths[0] ?? '/');\n  const currentPageId = routePathMap[currentPath] ?? routePathMap[paths[0] ?? '/'];\n\n  return (\n    <div>\n      <nav aria-label="Exported pages" style={{ display: 'flex', gap: 12, padding: 24, borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>\n        {paths.map((path) => (\n          <button\n            key={path}\n            type="button"\n            onClick={() => setCurrentPath(path)}\n            style={{\n              borderRadius: 999,\n              border: path === currentPath ? '1px solid #111827' : '1px solid #d1d5db',\n              background: path === currentPath ? '#111827' : '#ffffff',\n              color: path === currentPath ? '#ffffff' : '#111827',\n              padding: '8px 12px',\n            }}\n          >\n            {path}\n          </button>\n        ))}\n      </nav>\n      {currentPageId ? pageViews[currentPageId] : null}\n    </div>\n  );\n}\n`,
    },
    {
      path: 'src/styles.css',
      content:
        ':root { color-scheme: light dark; }\nbody { margin: 0; font-family: Inter, system-ui, sans-serif; }\nmain { padding: 24px; }\n',
    },
    {
      path: 'README.md',
      content: `# ${ir.name}\n\nGenerated by @ui-construction-library/export-core for target ${ir.target}.\n`,
    },
  ];

  return { files, diagnostics };
}

export function renderHtmlStatic(ir: ExportIRProject): RenderExportResult {
  const diagnostics: ExportDiagnostic[] = [];

  if (ir.pages.length === 0) {
    diagnostics.push({
      level: 'error',
      code: 'UNSUPPORTED_COMPONENT',
      message: 'Cannot render export without at least one page.',
    });

    return { files: [], diagnostics };
  }

  const navigationButtons = ir.pages
    .map(
      (page) =>
        `        <button type="button" data-route=${JSON.stringify(page.path)}>${page.name}</button>`
    )
    .join('\n');

  const pageSections = ir.pages
    .map((page, index) => {
      const sectionBody = renderNodeToJsx(page.rootNode);
      const hiddenAttribute = index === 0 ? '' : ' hidden';

      return `      <section data-page-id=${JSON.stringify(page.pageId)} data-page-path=${JSON.stringify(page.path)}${hiddenAttribute}>${sectionBody}</section>`;
    })
    .join('\n');

  const files: ExportFile[] = [
    {
      path: 'index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ir.name}</title>
    <style>
      :root { color-scheme: light; font-family: Inter, system-ui, sans-serif; }
      body { margin: 0; background: #f8fafc; color: #0f172a; }
      header { padding: 24px; border-bottom: 1px solid #e2e8f0; background: #ffffff; }
      nav { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
      button { border-radius: 999px; border: 1px solid #cbd5e1; background: #ffffff; padding: 8px 14px; cursor: pointer; }
      main { padding: 24px; }
      section[hidden] { display: none; }
    </style>
  </head>
  <body>
    <header>
      <strong>${ir.name}</strong>
      <nav aria-label="Exported pages">
${navigationButtons}
      </nav>
    </header>
    <main data-project-id=${JSON.stringify(ir.projectId)}>
${pageSections}
    </main>
    <script>
      const buttons = Array.from(document.querySelectorAll('[data-route]'));
      const sections = Array.from(document.querySelectorAll('section[data-page-id]'));
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const nextRoute = button.getAttribute('data-route');
          sections.forEach((section) => {
            section.hidden = section.getAttribute('data-page-path') !== nextRoute;
          });
        });
      });
    </script>
  </body>
</html>
`,
    },
    {
      path: 'README.md',
      content: `# ${ir.name}\n\nGenerated by @ui-construction-library/export-core for target ${ir.target}.\n`,
    },
  ];

  return { files, diagnostics };
}

function createCustomElementTag(componentId: string): string {
  return `ui-${componentId.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

function renderPropsToDataset(
  props: Record<string, string | number | boolean | null>
): string {
  const entries = Object.entries(props)
    .filter(([, value]) => value !== null)
    .map(
      ([key, value]) =>
        ` data-prop-${key.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}=${JSON.stringify(String(value))}`
    );

  return entries.join('');
}

function renderNodeToCustomElement(node: ExportIRNode): string {
  if (node.exportKind === 'unsupported') {
    return `<div data-unsupported-component=${JSON.stringify(node.componentId)}></div>`;
  }

  const tagName = createCustomElementTag(node.componentId);
  const dataset = renderPropsToDataset(node.props);
  const children = node.children
    .map((child) => renderNodeToCustomElement(child))
    .join('');

  return `<${tagName}${dataset}>${children}</${tagName}>`;
}

export function renderWebComponentsStatic(
  ir: ExportIRProject
): RenderExportResult {
  const diagnostics: ExportDiagnostic[] = [];

  if (ir.pages.length === 0) {
    diagnostics.push({
      level: 'error',
      code: 'UNSUPPORTED_COMPONENT',
      message: 'Cannot render export without at least one page.',
    });

    return { files: [], diagnostics };
  }

  const pageButtons = ir.pages
    .map(
      (page) =>
        `        <button type="button" data-route=${JSON.stringify(page.path)}>${page.name}</button>`
    )
    .join('\n');

  const pageMarkup = ir.pages
    .map((page, index) => {
      const hiddenAttribute = index === 0 ? '' : ' hidden';
      return `      <section data-page-id=${JSON.stringify(page.pageId)} data-page-path=${JSON.stringify(page.path)}${hiddenAttribute}>${renderNodeToCustomElement(page.rootNode)}</section>`;
    })
    .join('\n');

  const files: ExportFile[] = [
    {
      path: 'index.html',
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ir.name}</title>
    <script type="module" src="./components.js"></script>
    <style>
      :root { color-scheme: light; font-family: Inter, system-ui, sans-serif; }
      body { margin: 0; background: #f8fafc; color: #0f172a; }
      header { padding: 24px; border-bottom: 1px solid #e2e8f0; background: #ffffff; }
      nav { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px; }
      button { border-radius: 999px; border: 1px solid #cbd5e1; background: #ffffff; padding: 8px 14px; cursor: pointer; }
      main { padding: 24px; }
      section[hidden] { display: none; }
      ui-card, ui-heading, ui-text { display: block; }
    </style>
  </head>
  <body>
    <header>
      <strong>${ir.name}</strong>
      <nav aria-label="Exported pages">
${pageButtons}
      </nav>
    </header>
    <main data-project-id=${JSON.stringify(ir.projectId)}>
${pageMarkup}
    </main>
    <script>
      const buttons = Array.from(document.querySelectorAll('[data-route]'));
      const sections = Array.from(document.querySelectorAll('section[data-page-id]'));
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          const nextRoute = button.getAttribute('data-route');
          sections.forEach((section) => {
            section.hidden = section.getAttribute('data-page-path') !== nextRoute;
          });
        });
      });
    </script>
  </body>
</html>
`,
    },
    {
      path: 'components.js',
      content: `class UiCard extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    this.style.padding = '16px';
    this.style.border = '1px solid #cbd5e1';
    this.style.borderRadius = '16px';
    this.style.background = '#ffffff';
  }
}

class UiHeading extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('data-prop-children') ?? '';
    const level = this.getAttribute('data-prop-level') ?? '2';
    this.innerHTML = '<h' + level + '>' + text + '</h' + level + '>';
  }
}

class UiText extends HTMLElement {
  connectedCallback() {
    const text = this.getAttribute('data-prop-children') ?? '';
    this.innerHTML = '<p>' + text + '</p>';
  }
}

customElements.define('ui-card', UiCard);
customElements.define('ui-heading', UiHeading);
customElements.define('ui-text', UiText);
`,
    },
    {
      path: 'README.md',
      content: `# ${ir.name}\n\nGenerated by @ui-construction-library/export-core for target ${ir.target}.\n`,
    },
  ];

  return { files, diagnostics };
}

export function renderExportProject(
  enriched: EnrichExportResult
): RenderExportResult {
  switch (enriched.ir.target) {
    case 'react-single-page':
      return renderReactSinglePage(enriched.ir);
    case 'html-static':
      return renderHtmlStatic(enriched.ir);
    case 'web-components-static':
      return renderWebComponentsStatic(enriched.ir);
    default:
      return {
        files: [],
        diagnostics: [
          {
            level: 'error',
            code: 'UNSUPPORTED_COMPONENT',
            message: `Renderer ${enriched.ir.target} is not implemented.`,
          },
        ],
      };
  }
}

export function createExportAcceptanceChecklist(
  enriched: EnrichExportResult,
  rendered: RenderExportResult
): ExportAcceptanceChecklist {
  return {
    hasPages: enriched.metadata.pageCount > 0,
    hasDiagnostics:
      rendered.diagnostics.length > 0 || enriched.diagnostics.length > 0,
    deterministicRenderer: rendered.files.some(
      (file) => file.path === 'src/App.tsx' || file.path === 'index.html'
    ),
    builderFixtureCompatible: enriched.ir.pages.every(
      (page) => page.rootNode.nodeId.length > 0
    ),
  };
}
