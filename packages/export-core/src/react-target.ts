import { createDesignTokenArtifactFiles } from './fidelity';
import {
  collectExportedComponentIds,
  createCoreComponentImportStatement,
  renderNodeToJsx,
} from './render-helpers';
import type {
  ExportDiagnostic,
  ExportFile,
  ExportIRProject,
  RenderExportResult,
} from './types';

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
