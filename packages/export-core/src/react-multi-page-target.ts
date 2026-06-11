import { createDesignTokenArtifactFiles } from './fidelity';
import {
  collectExportedComponentIds,
  createCoreComponentImportStatement,
  renderNodeToJsx,
} from './render-helpers';
import type {
  ExportDiagnostic,
  ExportFile,
  ExportIRPage,
  ExportIRProject,
  RenderExportResult,
} from './types';

function toPageComponentName(page: ExportIRPage): string {
  // Derive a valid PascalCase component name from the page name
  return (
    page.name
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('') || `Page${page.pageId.replace(/[^a-zA-Z0-9]/g, '')}`
  );
}

function createPageFile(
  page: ExportIRPage,
  componentImports: string
): ExportFile {
  const componentName = toPageComponentName(page);
  const jsx = renderNodeToJsx(page.rootNode);

  return {
    path: `src/pages/${componentName}.tsx`,
    content:
      `import React from 'react';\n` +
      componentImports +
      `\nexport default function ${componentName}() {\n` +
      `  return (\n` +
      `    <main\n` +
      `      data-project-id=${JSON.stringify(page.pageId)}\n` +
      `      data-page-id=${JSON.stringify(page.pageId)}\n` +
      `      data-page-path=${JSON.stringify(page.path)}\n` +
      `    >\n` +
      `      ${jsx}\n` +
      `    </main>\n` +
      `  );\n` +
      `}\n`,
  };
}

function createAppFile(ir: ExportIRProject): ExportFile {
  const pageEntries = ir.pages.map((page) => {
    const name = toPageComponentName(page);
    return `import ${name} from './pages/${name}';`;
  });

  const routeEntries = ir.pages.map((page) => {
    const name = toPageComponentName(page);
    return `  { path: ${JSON.stringify(page.path)}, label: ${JSON.stringify(page.name)}, component: ${name} }`;
  });

  return {
    path: 'src/App.tsx',
    content:
      `import { useState } from 'react';\n` +
      pageEntries.join('\n') +
      `\n` +
      `import './theme.css';\n\n` +
      `const routes = [\n${routeEntries.join(',\n')}\n];\n\n` +
      `export default function App() {\n` +
      `  const [currentPath, setCurrentPath] = useState(routes[0]?.path ?? '/');\n` +
      `  const current = routes.find((r) => r.path === currentPath) ?? routes[0];\n` +
      `  const Page = current?.component;\n\n` +
      `  return (\n` +
      `    <div className="app-shell" data-export-target="react-multi-page">\n` +
      `      <aside className="app-sidebar">\n` +
      `        <div>\n` +
      `          <p className="app-eyebrow">Exported project</p>\n` +
      `          <h1>${ir.name}</h1>\n` +
      `        </div>\n` +
      `        <nav aria-label="Exported pages" className="app-nav">\n` +
      `          {routes.map((route) => (\n` +
      `            <button\n` +
      `              key={route.path}\n` +
      `              type="button"\n` +
      `              onClick={() => setCurrentPath(route.path)}\n` +
      `              className={route.path === currentPath ? 'app-nav-link active' : 'app-nav-link'}\n` +
      `            >\n` +
      `              {route.label}\n` +
      `            </button>\n` +
      `          ))}\n` +
      `        </nav>\n` +
      `      </aside>\n` +
      `      <section className="app-content">\n` +
      `        {Page ? <Page /> : <p>No page found.</p>}\n` +
      `      </section>\n` +
      `    </div>\n` +
      `  );\n` +
      `}\n`,
  };
}

export function renderReactMultiPage(ir: ExportIRProject): RenderExportResult {
  const diagnostics: ExportDiagnostic[] = [];

  if (ir.pages.length === 0) {
    diagnostics.push({
      level: 'error',
      code: 'UNSUPPORTED_COMPONENT',
      message: 'Cannot render export without at least one page.',
    });
    return { files: [], diagnostics };
  }

  const componentIds = collectExportedComponentIds(ir);
  const componentImports = createCoreComponentImportStatement(componentIds);

  const dependencyVersions: Record<string, string> = {
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    vite: '^8.0.0',
    typescript: '^5.6.3',
    clsx: '^2.1.1',
  };

  const baseDeps = new Set<string>(['react', 'react-dom']);
  if (componentIds.length > 0) baseDeps.add('@ui-construction-library/core');
  if (componentIds.length > 1) baseDeps.add('clsx');

  const resolvedDependencies = Object.fromEntries(
    [...baseDeps]
      .sort()
      .map((name) => [name, dependencyVersions[name] ?? '^0.0.0'])
  );

  const pageFiles = ir.pages.map((page) =>
    createPageFile(page, componentImports)
  );
  const tokenFiles = createDesignTokenArtifactFiles();

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
          devDependencies: { typescript: '^5.6.3', vite: '^8.0.0' },
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
    createAppFile(ir),
    ...pageFiles,
    ...tokenFiles,
  ];

  return { files, diagnostics };
}
