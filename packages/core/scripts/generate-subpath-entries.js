/**
 * generate-subpath-entries.js — Create re-export shims for subpath imports
 *
 * Generates individual entry files in dist/subpath/ that re-export from
 * the main bundle, enabling imports like:
 *   import { Button } from '@ui-construction-library/core/Button'
 *
 * Each file in dist/subpath/<Component>.js re-exports the named export
 * from the main bundle (dist/index.esm.js).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');
const subpathDir = resolve(distDir, 'subpath');

// Read the main ESM bundle to discover all named exports
const bundlePath = resolve(distDir, 'index.esm.js');
if (!existsSync(bundlePath)) {
  console.error('Main bundle not found at', bundlePath);
  console.error('Run `pnpm build` first in the core package.');
  process.exit(1);
}

const bundleContent = readFileSync(bundlePath, 'utf-8');

// Parse exports from the bundle using the `export { ... }` statements
// and the `export function/class/const` declarations
const namedExports = new Set();

// Match: export { X, Y as Z };
const exportListRegex = /export\s*\{\s*([^}]+)\s*\};/g;
let listMatch = exportListRegex.exec(bundleContent);
while (listMatch !== null) {
  const exports = listMatch[1].split(',').map((s) => {
    const trimmed = s.trim();
    // Handle `as` renames — take the final name
    const parts = trimmed.split(/\s+as\s+/);
    return parts[parts.length - 1].trim();
  });
  for (const exp of exports) {
    if (exp && !exp.startsWith('type ')) {
      namedExports.add(exp);
    }
  }
  listMatch = exportListRegex.exec(bundleContent);
}

// Match: export function X, export class X, export const X, export type X
const exportDeclRegex =
  /export\s+(?:declare\s+)?(?:function|class|const|let|var|type|interface)\s+(\w+)/g;
let declMatch = exportDeclRegex.exec(bundleContent);
while (declMatch !== null) {
  namedExports.add(declMatch[1]);
  declMatch = exportDeclRegex.exec(bundleContent);
}

// Filter to likely component names (PascalCase with few exceptions)
const componentExports = [...namedExports].filter(
  (name) =>
    // Components are typically PascalCase and not utility types/hooks
    /^[A-Z]/.test(name) &&
    !name.startsWith('use') &&
    !name.endsWith('Props') &&
    !name.endsWith('Type') &&
    !name.endsWith('Variant') &&
    !name.endsWith('Options') &&
    name !== 'ThemeProvider' &&
    name !== 'ThemeContext'
);

// Also include explicitly known major components that might not be top-level exports
const knownComponents = [
  'Button',
  'Badge',
  'Card',
  'Dialog',
  'Input',
  'Select',
  'Switch',
  'Checkbox',
  'RadioButton',
  'Text',
  'Heading',
  'Link',
  'Code',
  'Kbd',
  'Divider',
  'Tag',
  'Spinner',
  'Icon',
  'Avatar',
  'Skeleton',
  'Progress',
  'Image',
  'TextArea',
  'Alert',
  'Toast',
  'Tooltip',
  'Popover',
  'Dropdown',
  'Accordion',
  'Tabs',
  'Modal',
  'Drawer',
  'Sidebar',
  'Table',
  'Form',
  'Field',
  'FileUpload',
  'Breadcrumb',
  'Pagination',
  'Slider',
  'Stepper',
  'Rating',
  'Calendar',
  'Timeline',
  'EmptyState',
  'DataTable',
  'CommandPalette',
  'TopNav',
  'Navigation',
  'TreeView',
  'ColorPicker',
  'ComboBox',
  'ContextMenu',
  'DatePicker',
  'MenuItem',
  'OTPInput',
  'SearchInput',
  'PageHeader',
  'Kanban',
  'AppShell',
  'Menu',
  'Nav',
];

// Intersect with known components
const exportsToGenerate = knownComponents.filter((name) =>
  namedExports.has(name)
);

if (exportsToGenerate.length === 0) {
  // Fallback: generate entries for all known components anyway
  // They'll throw at runtime if not actually exported, which is fine for
  // TypeScript resolution during development
  console.warn(
    'No named exports matched from bundle. Generating entries for known component list.'
  );
}

// Ensure subpath directory exists
if (!existsSync(subpathDir)) {
  mkdirSync(subpathDir, { recursive: true });
}

let generated = 0;

for (const componentName of exportsToGenerate.length > 0
  ? exportsToGenerate
  : knownComponents) {
  // ESM re-export
  const esmContent = `// Auto-generated subpath entry for @ui-construction-library/core/${componentName}
export { ${componentName} } from '../index.esm.js';
`;
  writeFileSync(
    resolve(subpathDir, `${componentName}.js`),
    esmContent,
    'utf-8'
  );

  // CJS re-export
  const cjsContent = `// Auto-generated subpath entry for @ui-construction-library/core/${componentName}
const { ${componentName} } = require('../index.js');
module.exports = { ${componentName} };
`;
  writeFileSync(
    resolve(subpathDir, `${componentName}.cjs`),
    cjsContent,
    'utf-8'
  );

  // .d.ts types
  const dtsContent = `// Auto-generated subpath entry for @ui-construction-library/core/${componentName}
export { ${componentName} } from '../index';
`;
  writeFileSync(
    resolve(subpathDir, `${componentName}.d.ts`),
    dtsContent,
    'utf-8'
  );

  generated++;
}

console.log(`✓ Generated ${generated} subpath entry files in dist/subpath/`);
