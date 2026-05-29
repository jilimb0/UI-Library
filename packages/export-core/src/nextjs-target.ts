/**
 * Next.js App Router export target plugin.
 *
 * Produces a runnable Next.js 15 App Router project from the export IR.
 * Each IR page maps to an `app/<route>/page.tsx` file. A shared
 * `app/layout.tsx` and `app/globals.css` are generated alongside a
 * `package.json`, `tsconfig.json`, and `next.config.mjs`.
 *
 * This module is intentionally target-agnostic at the IR layer — it only
 * consumes `EnrichExportResult` and produces `RenderExportResult`.
 */

import { createDesignTokenArtifactFiles } from './fidelity';
import type {
  EnrichExportResult,
  ExportIRNode,
  ExportIRProject,
} from './index';
import { createExportTargetPlugin, createStaticRenderResult } from './targets';

// ---------------------------------------------------------------------------
// Internal helpers (duplicated from index.ts to keep this module self-contained
// and avoid circular imports — the canonical implementations live in index.ts)
// ---------------------------------------------------------------------------

function pascalCase(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
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
  if (node.children.length === 0) return `${openTag}</${componentName}>`;
  const children = node.children
    .map((child) => renderNodeToJsx(child))
    .join('');
  return `${openTag}${children}</${componentName}>`;
}

function collectExportedComponentIds(ir: ExportIRProject): string[] {
  const ids = new Set<string>();
  const visit = (node: ExportIRNode) => {
    if (node.exportKind === 'component') ids.add(node.componentId);
    for (const child of node.children) visit(child);
  };
  for (const page of ir.pages) visit(page.rootNode);
  return [...ids].sort();
}

function createCoreComponentImportStatement(componentIds: string[]): string {
  const names = componentIds.map(pascalCase);
  if (names.length === 0) return '';
  return `import { ${names.join(', ')} } from '@ui-construction-library/core';\n`;
}

function createNextAppRouterFilePath(pagePath: string): string {
  const normalized = pagePath.trim();
  if (normalized === '/' || normalized === '') return 'app/page.tsx';
  const segments = normalized
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-|-$/g, '')
    )
    .filter(Boolean);
  if (segments.length === 0) return 'app/page.tsx';
  return `app/${segments.join('/')}/page.tsx`;
}

// ---------------------------------------------------------------------------
// Next.js App Router target plugin
// ---------------------------------------------------------------------------

export const nextjsAppRouterTarget = createExportTargetPlugin({
  target: 'nextjs-app-router',
  version: '1',
  displayName: 'Next.js App Router',
  supportedStages: ['normalize', 'analyze', 'enrich', 'render'],

  render(enriched: EnrichExportResult) {
    const { ir } = enriched;
    const diagnostics = [...enriched.diagnostics];
    const componentIds = collectExportedComponentIds(ir);
    const componentImports = createCoreComponentImportStatement(componentIds);

    if (ir.pages.length === 0) {
      return createStaticRenderResult(
        [],
        [
          ...diagnostics,
          {
            level: 'error',
            code: 'UNSUPPORTED_COMPONENT',
            message: 'Cannot render Next.js export without at least one page.',
          },
        ]
      );
    }

    // Build dependency manifest
    const baseDependencies = new Set<string>(['next', 'react', 'react-dom']);
    if (componentIds.length > 0)
      baseDependencies.add('@ui-construction-library/core');
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

    const files = [
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
      // One page file per IR page
      ...ir.pages
        .map((page) => ({
          path: createNextAppRouterFilePath(page.path),
          content: `${componentImports}\nexport default function Page() {\n  return (\n    <main data-project-id=${JSON.stringify(ir.projectId)} data-page-id=${JSON.stringify(page.pageId)} data-page-path=${JSON.stringify(page.path)}>\n      ${renderNodeToJsx(page.rootNode)}\n    </main>\n  );\n}\n`,
        }))
        .sort((a, b) => a.path.localeCompare(b.path)),
      ...createDesignTokenArtifactFiles(),
      {
        path: 'README.md',
        content: `# ${ir.name}\n\nGenerated by @ui-construction-library/export-core — Next.js App Router target.\n\nRun \`npm install && npm run dev\` to start the development server.\n`,
      },
    ];

    return createStaticRenderResult(files, diagnostics);
  },
});
