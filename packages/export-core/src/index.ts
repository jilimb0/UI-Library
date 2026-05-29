import { getComponentById } from '@ui-construction-library/registry';
import { validateRequiredShape } from '@ui-construction-library/schema';
import { recordExportAnalyticsEvent } from './analytics';
import { createDesignTokenArtifactFiles } from './fidelity';

export type ExportTarget =
  | 'react-single-page'
  | 'html-static'
  | 'web-components-static'
  | 'nextjs-app-router'
  | 'vue3';
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
  /** Dot-separated path from the page root to the node, e.g. "root > card > heading". */
  nodePath?: string;
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
  propName: string,
  nodePath?: string
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
    message: `Prop "${propName}" on node "${nodeId}" has a non-scalar value (${typeof value}) that cannot be exported. Fix: convert it to a string, number, boolean, or null before exporting.`,
    pageId,
    nodeId,
    propName,
    nodePath,
  });

  return null;
}

function normalizeNode(
  node: ExportNodeInput,
  pageId: string,
  diagnostics: ExportDiagnostic[],
  nodePath = 'root'
): ExportIRNode {
  const component = getComponentById(node.componentId);
  const exportKind = component ? 'component' : 'unsupported';
  const currentPath = `${nodePath} > ${node.componentId}`;

  if (!component) {
    diagnostics.push({
      level: 'error',
      code: 'UNKNOWN_COMPONENT',
      message: `Component "${node.componentId}" (id: ${node.id}) is not registered for export. Remove it or replace it with a registered component.`,
      pageId,
      nodeId: node.id,
      componentId: node.componentId,
      nodePath: currentPath,
    });
  }

  const props = Object.fromEntries(
    Object.entries(node.props)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([propName, value]) => [
        propName,
        normalizeScalarProp(
          value,
          pageId,
          node.id,
          diagnostics,
          propName,
          currentPath
        ),
      ])
  );

  return {
    nodeId: node.id,
    componentId: node.componentId,
    exportKind,
    props,
    children: node.children.map((child) =>
      normalizeNode(child, pageId, diagnostics, currentPath)
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

// Component IDs that belong to packages beyond @ui-construction-library/core
const MOTION_COMPONENT_IDS = new Set([
  'animated-div',
  'fade-in',
  'slide-in',
  'scale-in',
  'motion-box',
  'animated-list',
  'animated-item',
  'stagger-children',
  'spring-box',
]);

const PRIMITIVES_COMPONENT_IDS = new Set([
  'dialog',
  'popover',
  'accordion',
  'tabs',
  'slider',
  'switch',
  'context-menu',
]);

const DND_COMPONENT_IDS = new Set([
  'draggable',
  'droppable',
  'drag-handle',
  'sortable-list',
  'sortable-item',
  'dnd-context',
]);

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

  // Deep package dependency detection — add sub-packages when their
  // component IDs appear in the tree so the exported package.json is complete.
  for (const id of imports) {
    const normalized = id.toLowerCase();
    if (MOTION_COMPONENT_IDS.has(normalized)) {
      dependencies.add('@ui-construction-library/motion');
    }
    if (PRIMITIVES_COMPONENT_IDS.has(normalized)) {
      dependencies.add('@ui-construction-library/primitives');
    }
    if (DND_COMPONENT_IDS.has(normalized)) {
      dependencies.add('@ui-construction-library/dnd');
    }
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

function createPageLayoutMap(ir: ExportIRProject): string {
  const entries = ir.pages.map(
    (page, index) =>
      `  ${JSON.stringify(page.pageId)}: { title: ${JSON.stringify(
        page.name
      )}, path: ${JSON.stringify(page.path)}, sectionLabel: ${JSON.stringify(
        `Page ${index + 1}`
      )} }`
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

function collectExportedComponentIds(ir: ExportIRProject): string[] {
  const ids = new Set<string>();

  const visit = (node: ExportIRNode) => {
    if (node.exportKind === 'component') ids.add(node.componentId);
    for (const child of node.children) visit(child);
  };

  for (const page of ir.pages) {
    visit(page.rootNode);
  }

  return [...ids].sort();
}

function createCoreComponentImportStatement(componentIds: string[]): string {
  const names = componentIds.map(pascalCase);
  if (names.length === 0) return '';
  return `import { ${names.join(', ')} } from '@ui-construction-library/core';\n`;
}

function createReactTargetDependencyManifest(
  componentIds: string[]
): Record<string, string> {
  const dependencies = new Set<string>(['react', 'react-dom']);
  if (componentIds.length > 0)
    dependencies.add('@ui-construction-library/core');
  if (componentIds.length > 1) dependencies.add('clsx');
  return Object.fromEntries(
    [...dependencies].sort().map((name) => [name, '^0.0.0'])
  );
}

export function renderReactSinglePage(ir: ExportIRProject): RenderExportResult {
  const diagnostics: ExportDiagnostic[] = [];
  const componentIds = collectExportedComponentIds(ir);
  const componentImports = createCoreComponentImportStatement(componentIds);
  const dependencyManifest = createReactTargetDependencyManifest(componentIds);

  if (ir.pages.length === 0) {
    diagnostics.push({
      level: 'error',
      code: 'UNSUPPORTED_COMPONENT',
      message: 'Cannot render export without at least one page.',
    });

    return { files: [], diagnostics };
  }

  const dependencyVersions: Record<string, string> = {
    ...Object.fromEntries(
      Object.keys(dependencyManifest).map((name) => [name, '^0.0.0'])
    ),
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    vite: '^8.0.0',
    typescript: '^5.6.3',
    clsx: '^2.1.1',
    next: '^15.3.0',
  };

  const resolvedDependencies = Object.fromEntries(
    Object.entries(dependencyManifest)
      .map(([name]) => [name, dependencyVersions[name] ?? '^0.0.0'])
      .sort(([a], [b]) => a.localeCompare(b))
  );

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
          dependencies: resolvedDependencies,
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
      path: 'index.html',
      content:
        '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Exported UI Project</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n',
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
      content: `import { useMemo, useState } from 'react';\n${componentImports}import './theme.css';\n\nconst routePathMap = ${createRoutePathMap(ir)};\nconst pageLayouts = ${createPageLayoutMap(ir)};\nconst pageViews = ${createPageViewMap(ir)};\n\nexport default function App() {\n  const paths = useMemo(() => Object.keys(routePathMap), []);\n  const [currentPath, setCurrentPath] = useState(paths[0] ?? '/');\n  const currentPageId = routePathMap[currentPath] ?? routePathMap[paths[0] ?? '/'];\n  const currentLayout = currentPageId ? pageLayouts[currentPageId] : null;\n\n  return (\n    <div className="app-shell" data-export-target="react-single-page">\n      <aside className="app-sidebar">\n        <div>\n          <p className="app-eyebrow">Exported project</p>\n          <h1>${ir.name}</h1>\n          <p className="app-description">Route-aware React export with shared theme layer and app shell navigation.</p>\n        </div>\n        <nav aria-label="Exported pages" className="app-nav">\n          {paths.map((path) => {\n            const pageId = routePathMap[path];\n            const page = pageLayouts[pageId];\n            const active = path === currentPath;\n            return (\n              <button\n                key={path}\n                type="button"\n                onClick={() => setCurrentPath(path)}\n                className={active ? 'app-nav-link active' : 'app-nav-link'}\n              >\n                <span>{page.title}</span>\n                <small>{page.path}</small>\n              </button>\n            );\n          })}\n        </nav>\n      </aside>\n      <section className="app-content">\n        {currentLayout ? (\n          <header className="page-header">\n            <div>\n              <p className="app-eyebrow">{currentLayout.sectionLabel}</p>\n              <h2>{currentLayout.title}</h2>\n            </div>\n            <code>{currentLayout.path}</code>\n          </header>\n        ) : null}\n        <div className="page-canvas">{currentPageId ? pageViews[currentPageId] : null}</div>\n      </section>\n    </div>\n  );\n}\n`,
    },
    {
      path: 'src/styles.css',
      content:
        '.app-shell { display: grid; grid-template-columns: 280px minmax(0, 1fr); min-height: 100vh; font-family: var(--export-font-sans); color: var(--export-text); background: var(--export-bg); }\n.app-sidebar { padding: 32px 24px; border-right: 1px solid var(--export-border); background: var(--export-surface); display: grid; gap: 24px; align-content: start; }\n.app-content { display: grid; gap: 24px; padding: 32px; }\n.app-description { color: var(--export-muted); line-height: 1.5; }\n.app-eyebrow { margin: 0 0 8px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--export-muted); }\n.app-nav { display: grid; gap: 12px; }\n.app-nav-link { display: grid; gap: 4px; padding: 12px 14px; border-radius: 16px; border: 1px solid var(--export-border); background: transparent; color: var(--export-text); text-align: left; }\n.app-nav-link small { color: var(--export-muted); }\n.app-nav-link.active { background: var(--export-accent); color: white; border-color: var(--export-accent); }\n.app-nav-link.active small { color: rgba(255,255,255,0.8); }\n.page-header { display: flex; justify-content: space-between; gap: 16px; align-items: end; padding-bottom: 16px; border-bottom: 1px solid var(--export-border); }\n.page-header code { padding: 6px 10px; border-radius: 999px; background: var(--export-surface); color: var(--export-muted); }\n.page-canvas { padding: 8px 0 32px; }\nmain { padding: 0; }\n@media (max-width: 960px) { .app-shell { grid-template-columns: 1fr; } .app-sidebar { border-right: none; border-bottom: 1px solid var(--export-border); } .page-header { flex-direction: column; align-items: start; } }\n',
    },
    {
      path: 'src/theme.css',
      content:
        ':root { --export-font-sans: Inter, system-ui, sans-serif; --export-bg: #f8fafc; --export-surface: #ffffff; --export-border: #e2e8f0; --export-text: #0f172a; --export-muted: #475569; --export-accent: #0f766e; }\n* { box-sizing: border-box; }\nhtml, body, #root { margin: 0; min-height: 100%; }\nbody { background: var(--export-bg); }\nbutton { font: inherit; cursor: pointer; }\nh1, h2, p { margin: 0; }\n',
    },
    ...createDesignTokenArtifactFiles(),
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
    ...createDesignTokenArtifactFiles(),
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
    ...createDesignTokenArtifactFiles(),
    {
      path: 'README.md',
      content: `# ${ir.name}\n\nGenerated by @ui-construction-library/export-core for target ${ir.target}.\n`,
    },
  ];

  return { files, diagnostics };
}

function createNextAppRouterFilePath(pagePath: string): string {
  const normalized = pagePath.trim();
  if (normalized === '/' || normalized === '') return 'app/page.tsx';
  const segments = normalized
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) =>
      segment
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '')
    )
    .filter(Boolean);
  if (segments.length === 0) return 'app/page.tsx';
  return `app/${segments.join('/')}/page.tsx`;
}

export function renderNextjsAppRouter(ir: ExportIRProject): RenderExportResult {
  const diagnostics: ExportDiagnostic[] = [];
  const componentIds = collectExportedComponentIds(ir);
  const componentImports = createCoreComponentImportStatement(componentIds);

  if (ir.pages.length === 0) {
    diagnostics.push({
      level: 'error',
      code: 'UNSUPPORTED_COMPONENT',
      message: 'Cannot render export without at least one page.',
    });

    return { files: [], diagnostics };
  }

  const baseDependencies = new Set<string>(['next', 'react', 'react-dom']);
  for (const id of componentIds) {
    if (id) baseDependencies.add('@ui-construction-library/core');
  }
  if (componentIds.length > 1) baseDependencies.add('clsx');
  const dependencyVersions: Record<string, string> = {
    next: '^15.3.0',
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    '@ui-construction-library/core': '^0.0.0',
    clsx: '^2.1.1',
  };
  const dependencies = Object.fromEntries(
    [...baseDependencies]
      .sort()
      .map((name) => [name, dependencyVersions[name] ?? '^0.0.0'])
  );

  const files: ExportFile[] = [
    {
      path: 'package.json',
      content: `${JSON.stringify(
        {
          name: 'exported-ui-project-next',
          private: true,
          version: '0.1.0',
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
          },
          dependencies,
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
            lib: ['DOM', 'DOM.Iterable', 'ES2020'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: 'ESNext',
            moduleResolution: 'Bundler',
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: 'preserve',
            incremental: true,
          },
          include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
          exclude: ['node_modules'],
        },
        null,
        2
      )}\n`,
    },
    {
      path: 'next-env.d.ts',
      content:
        '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n\n// NOTE: This file should not be edited\n\n',
    },
    {
      path: 'next.config.mjs',
      content: 'export default {};\n',
    },
    {
      path: 'app/globals.css',
      content:
        ':root { --export-font-sans: Inter, system-ui, sans-serif; --export-bg: #f8fafc; --export-surface: #ffffff; --export-border: #e2e8f0; --export-text: #0f172a; --export-muted: #475569; --export-accent: #0f766e; }\n* { box-sizing: border-box; }\nhtml, body { margin: 0; min-height: 100%; font-family: var(--export-font-sans); background: var(--export-bg); color: var(--export-text); }\nmain { padding: 32px; }\n',
    },
    {
      path: 'app/layout.tsx',
      content:
        'import \'./globals.css\';\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n',
    },
    ...ir.pages
      .map((page) => {
        const jsx = renderNodeToJsx(page.rootNode);
        const filePath = createNextAppRouterFilePath(page.path);
        return {
          path: filePath,
          content: `${componentImports}\nexport default function Page() {\n  return (\n    <main data-project-id=${JSON.stringify(ir.projectId)} data-page-id=${JSON.stringify(page.pageId)} data-page-path=${JSON.stringify(page.path)}>\n      ${jsx}\n    </main>\n  );\n}\n`,
        };
      })
      .sort((a, b) => a.path.localeCompare(b.path)),
    ...createDesignTokenArtifactFiles(),
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
  recordExportAnalyticsEvent('export_render_started', enriched.ir.target, {
    pageCount: enriched.metadata.pageCount,
  });

  let result: RenderExportResult;
  switch (enriched.ir.target) {
    case 'react-single-page':
      result = finishExportRender(
        enriched.ir.target,
        renderReactSinglePage(enriched.ir)
      );
      break;
    case 'nextjs-app-router':
      result = finishExportRender(
        enriched.ir.target,
        renderNextjsAppRouter(enriched.ir)
      );
      break;
    case 'html-static':
      result = finishExportRender(
        enriched.ir.target,
        renderHtmlStatic(enriched.ir)
      );
      break;
    case 'web-components-static':
      result = finishExportRender(
        enriched.ir.target,
        renderWebComponentsStatic(enriched.ir)
      );
      break;
    default:
      result = finishExportRender(enriched.ir.target, {
        files: [],
        diagnostics: [
          {
            level: 'error',
            code: 'UNSUPPORTED_COMPONENT',
            message: `Renderer ${enriched.ir.target} is not implemented.`,
          },
        ],
      });
  }

  // Enforce acceptance checklist — append error diagnostics for failed criteria
  const checklist = createExportAcceptanceChecklist(enriched, result);
  const checklistDiagnostics: ExportDiagnostic[] = [];

  if (!checklist.hasPages) {
    checklistDiagnostics.push({
      level: 'error',
      code: 'INVALID_PROJECT_SHAPE',
      message: 'Acceptance checklist failed: export has no pages.',
    });
  }
  if (!checklist.deterministicRenderer) {
    checklistDiagnostics.push({
      level: 'error',
      code: 'INVALID_PROJECT_SHAPE',
      message:
        'Acceptance checklist failed: no deterministic renderer entry point found in output files.',
    });
  }
  if (!checklist.builderFixtureCompatible) {
    checklistDiagnostics.push({
      level: 'error',
      code: 'INVALID_PROJECT_SHAPE',
      message:
        'Acceptance checklist failed: one or more pages have an empty root node ID.',
    });
  }

  if (checklistDiagnostics.length > 0) {
    return {
      ...result,
      diagnostics: [...result.diagnostics, ...checklistDiagnostics],
    };
  }

  return result;
}

function finishExportRender(
  target: ExportTarget,
  result: RenderExportResult
): RenderExportResult {
  recordExportAnalyticsEvent('export_render_finished', target, {
    fileCount: result.files.length,
  });
  return result;
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
      (file) =>
        file.path === 'src/App.tsx' ||
        file.path === 'index.html' ||
        file.path === 'app/page.tsx'
    ),
    builderFixtureCompatible: enriched.ir.pages.every(
      (page) => page.rootNode.nodeId.length > 0
    ),
  };
}

export {
  appendDoctorArtifacts,
  createDesignTokenArtifactFiles,
  createExportAssetManifest,
  createExportDoctorMarkdown,
  createExportDoctorReport,
  type ExportAssetManifest,
  type ExportDoctorReport,
} from './fidelity';
export { nextjsAppRouterTarget } from './nextjs-target';
export type {
  ExportPipelineArtifacts,
  ExportPublicApiSnapshot,
  ExportTargetPlugin,
} from './targets';
export {
  createExportPublicApiSnapshot,
  createExportTargetPlugin,
  createStaticRenderResult,
} from './targets';
export { vue3Target } from './targets/vue3-target';
export {
  createBuilderVisualSnapshot,
  createExportVisualFidelityReport,
  type ExportVisualFidelityReport,
  type VisualFidelitySnapshot,
} from './visualFidelity';
