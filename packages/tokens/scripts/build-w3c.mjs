/**
 * W3C Design Tokens → artifact generator (canonical pipeline).
 *
 * Source of truth: src/tokens.w3c.json (W3C Design Tokens Format).
 * Emits into dist/w3c/:
 *   - tokens.css            — CSS custom properties, single --ucl- prefix,
 *                            non-color + primitive scales in :root,
 *                            semantic + component-state scoped to [data-theme].
 *   - tokens.ts             — resolved token tree as a typed const.
 *   - tokens.w3c.json       — canonical source (aliased) for tooling (Figma / Tokens Studio).
 *   - tokens.resolved.json  — fully resolved tree for tools that want values only.
 *
 * This is the target pipeline (see docs/design-system/TARGET-ARCHITECTURE.md).
 * It coexists with the legacy generateCSSVariables() output until the
 * breaking switchover in a later phase.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const srcPath = resolve(rootDir, 'src', 'tokens.w3c.json');
const outDir = resolve(rootDir, 'dist', 'w3c');

const raw = JSON.parse(readFileSync(srcPath, 'utf-8'));
const prefix = raw.$prefix ?? '--ucl-';

/** True if a node is a token leaf ({ $value, $type }). */
function isLeaf(node) {
  return (
    node !== null &&
    typeof node === 'object' &&
    !Array.isArray(node) &&
    Object.prototype.hasOwnProperty.call(node, '$value')
  );
}

/** Walk a dotted path through the root tree. */
function walk(root, pathArr) {
  let cur = root;
  for (const seg of pathArr) {
    cur = cur?.[seg];
    if (cur === undefined) return undefined;
  }
  return cur;
}

/** Resolve a leaf's $value, following {a.b.c} alias references recursively. */
function resolveValue(leaf, root, seen = new Set()) {
  const v = leaf.$value;
  if (typeof v === 'string' && v.startsWith('{') && v.endsWith('}')) {
    const ref = v.slice(1, -1);
    const refKey = ref;
    if (seen.has(refKey)) throw new Error(`Circular token alias: ${ref}`);
    const target = walk(root, ref.split('.'));
    if (!target || !isLeaf(target)) {
      throw new Error(`Unresolved token alias: ${ref}`);
    }
    return resolveValue(target, root, new Set(seen).add(refKey));
  }
  return v;
}

/** Derive the CSS custom-property name (without prefix) from a token path. */
function deriveName(parts) {
  const [head, a, b, ...rest] = parts;
  if (head === 'color') {
    if (a === 'primitive') return `color-${rest.length ? [b, ...rest].join('-') : b}`;
    if (a === 'semantic') {
      // parts: color, semantic, <theme>, ...rest
      const seg = parts.slice(3);
      if (seg[0] === 'intent') return `intent-${seg.slice(1).join('-')}`;
      return `color-${seg.join('-')}`;
    }
    if (a === 'component') {
      // parts: color, component, <theme>, ...rest
      return parts.slice(3).join('-');
    }
  }
  if (head === 'typography' || head === 'motion') return parts.slice(1).join('-');
  return parts.map((p) => (p === 'zIndex' ? 'z' : p)).join('-');
}

/** Determine theme scope: 'root' (theme-independent) | 'light' | 'dark'. */
function scopeOf(parts) {
  if (parts[0] === 'color' && parts[1] === 'semantic') return parts[2];
  if (parts[0] === 'color' && parts[1] === 'component') return parts[2];
  return 'root';
}

/** Flatten the tree into ordered token entries: { name, value, scope }. */
function flatten(node, path, out) {
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    const childPath = [...path, key];
    if (isLeaf(child)) {
      out.push({
        name: deriveName(childPath),
        value: resolveValue(child, raw),
        scope: scopeOf(childPath),
      });
    } else if (child !== null && typeof child === 'object') {
      flatten(child, childPath, out);
    }
  }
}

const entries = [];
flatten(raw, [], entries);

const rootEntries = entries.filter((e) => e.scope === 'root');
const lightEntries = entries.filter((e) => e.scope === 'light');
const darkEntries = entries.filter((e) => e.scope === 'dark');

function block(selector, items) {
  const lines = items.map((e) => `  ${prefix}${e.name}: ${e.value};`);
  return [`${selector} {`, ...lines, '}'].join('\n');
}

const css = [
  '/* AUTO-GENERATED from tokens.w3c.json — do not edit. */',
  '/* Source of truth: tokens.w3c.json */',
  `/* Single ${prefix} prefix. Non-color + primitive scales live in :root;`,
  '   semantic + component-state are scoped to [data-theme]. */',
  '',
  block(':root', rootEntries),
  '',
  block(':root:not([data-theme]), [data-theme="light"]', lightEntries),
  '',
  block('[data-theme="dark"]', darkEntries),
  '',
].join('\n');

/** Produce a resolved tree (values inlined) mirroring the source shape. */
function resolveTree(node, root) {
  if (isLeaf(node)) {
    return { $type: node.$type, $value: resolveValue(node, root) };
  }
  if (node !== null && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$') && k !== '$value' && k !== '$type') {
        out[k] = v;
      } else if (k === '$value' || k === '$type') {
        out[k] = v;
      } else {
        out[k] = resolveTree(v, root);
      }
    }
    return out;
  }
  return node;
}

const resolved = resolveTree(raw, raw);

const ts =
  '/* AUTO-GENERATED from tokens.w3c.json — do not edit. */\n' +
  '/* Resolved design tokens (aliases inlined). */\n' +
  'export const designTokens = ' +
  JSON.stringify(resolved, null, 2) +
  ' as const;\n\n' +
  'export type DesignTokens = typeof designTokens;\n\n' +
  'export default designTokens;\n';

mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'tokens.css'), css + '\n', 'utf-8');
writeFileSync(resolve(outDir, 'tokens.ts'), ts, 'utf-8');
writeFileSync(
  resolve(outDir, 'tokens.w3c.json'),
  JSON.stringify(raw, null, 2) + '\n',
  'utf-8'
);
writeFileSync(
  resolve(outDir, 'tokens.resolved.json'),
  JSON.stringify(resolved, null, 2) + '\n',
  'utf-8'
);

// ---------------------------------------------------------------------------
// Runtime module — packages/tokens/src/tokens.runtime.generated.ts
// ---------------------------------------------------------------------------

const runtimeOutPath = resolve(
  rootDir,
  'src',
  'tokens.runtime.generated.ts'
);

// Emit the LIGHT_CSS / DARK_CSS / ROOT_CSS blocks as standalone strings.
const lightCSSBlock = block(
  ':root:not([data-theme]), [data-theme="light"]',
  lightEntries
);
const darkCSSBlock = block('[data-theme="dark"]', darkEntries);
const rootCSSBlock = block(':root', rootEntries);

// Serialize lightEntries for use as a baseline inside generateThemeCSS.
const lightEntriesJSON = JSON.stringify(
  lightEntries.map((e) => ({ name: e.name, value: e.value })),
  null,
  2
);

const runtimeTs =
  '/* AUTO-GENERATED from tokens.w3c.json — do not edit.           */\n' +
  '/* Re-generate: node packages/tokens/scripts/build-w3c.mjs       */\n' +
  '\n' +
  'export const BASE_CSS: string =\n' +
  '  ' +
  JSON.stringify(css) +
  ';\n' +
  '\n' +
  'export const LIGHT_CSS: string =\n' +
  '  ' +
  JSON.stringify(lightCSSBlock) +
  ';\n' +
  '\n' +
  'export const DARK_CSS: string =\n' +
  '  ' +
  JSON.stringify(darkCSSBlock) +
  ';\n' +
  '\n' +
  'export const ROOT_CSS: string =\n' +
  '  ' +
  JSON.stringify(rootCSSBlock) +
  ';\n' +
  '\n' +
  'export const designTokens = ' +
  JSON.stringify(resolved, null, 2) +
  ' as const;\n' +
  '\n' +
  'export type ThemeName = string;\n' +
  'export type BrandOverride = Record<string, Record<string, string>>;\n' +
  'export type SemanticOverride = Record<string, string>;\n' +
  '\n' +
  'const _LIGHT_ENTRIES: Array<{ name: string; value: string }> =\n' +
  lightEntriesJSON +
  ';\n' +
  '\n' +
  'export function generateThemeCSS(opts: {\n' +
  '  name: string;\n' +
  '  brand?: BrandOverride;\n' +
  '  semantic?: SemanticOverride;\n' +
  '  component?: Record<string, Record<string, string>>;\n' +
  '}): string {\n' +
  '  const lines: string[] = [];\n' +
  '  // Baseline: all light semantic + component entries.\n' +
  '  for (const entry of _LIGHT_ENTRIES) {\n' +
  '    lines.push(\'  --ucl-\' + entry.name + \': \' + entry.value + \';\');\n' +
  '  }\n' +
  '  // Brand overrides: Record<scaleName, Record<tone, value>>\n' +
  '  if (opts.brand) {\n' +
  '    for (const [scaleName, tones] of Object.entries(opts.brand)) {\n' +
  '      for (const [tone, value] of Object.entries(tones)) {\n' +
  '        lines.push(\'  --ucl-color-\' + scaleName + \'-\' + tone + \': \' + value + \';\');\n' +
  '      }\n' +
  '    }\n' +
  '  }\n' +
  '  // Semantic overrides: Record<varName, value>\n' +
  '  if (opts.semantic) {\n' +
  '    for (const [varName, value] of Object.entries(opts.semantic)) {\n' +
  '      lines.push(\'  --ucl-\' + varName + \': \' + value + \';\');\n' +
  '    }\n' +
  '  }\n' +
  '  // Component overrides: Record<componentName, Record<tokenName, value>>\n' +
  '  if (opts.component) {\n' +
  '    for (const [componentName, tokens] of Object.entries(opts.component)) {\n' +
  '      for (const [tokenName, value] of Object.entries(tokens)) {\n' +
  '        lines.push(\n' +
  '          \'  --ucl-\' + componentName + \'-\' + tokenName + \': \' + value + \';\'\n' +
  '        );\n' +
  '      }\n' +
  '    }\n' +
  '  }\n' +
  // Use string concatenation in the emitted function to avoid backtick
  // escaping issues: build the selector via concatenation, not template lit.
  '  const selector = \'[data-theme="\' + opts.name + \'"]\' + \' {\';\n' +
  '  return selector + \'\\n\' + lines.join(\'\\n\') + \'\\n}\';\n' +
  '}\n';

writeFileSync(runtimeOutPath, runtimeTs, 'utf-8');

// ---------------------------------------------------------------------------
// Tailwind v4 @theme bridge — dist/w3c/tailwind-theme.css
// Maps Tailwind theme namespace (--color-*, --spacing-*, --radius-*, etc.)
// to --ucl-* CSS variables so utilities like bg-primary, text-muted-foreground
// resolve and follow runtime theme switching.
// ---------------------------------------------------------------------------

const twLines = [];

// Root entries (primitives): map --ucl-<name> → --<name> (Tailwind namespace)
for (const e of rootEntries) {
  twLines.push(`  --${e.name}: var(--ucl-${e.name});`);
}

// Light entries (semantic + intent): only color-* and intent-* (skip
// component-state tokens — they're CSS-only, not Tailwind utilities)
for (const e of lightEntries) {
  if (e.name.startsWith('color-')) {
    twLines.push(`  --${e.name}: var(--ucl-${e.name});`);
  } else if (e.name.startsWith('intent-')) {
    twLines.push(`  --color-${e.name}: var(--ucl-${e.name});`);
  }
}

const tailwindThemeCss = [
  '/* AUTO-GENERATED from tokens.w3c.json — do not edit. */',
  '/* Tailwind v4 @theme bridge: maps Tailwind utilities to --ucl- CSS vars. */',
  '/* Import after `@import "tailwindcss"` to activate bg-primary, */',
  '/* text-muted-foreground, border-border, etc. that follow runtime themes. */',
  '',
  '@theme {',
  ...twLines,
  '}',
  '',
].join('\n');

writeFileSync(
  resolve(outDir, 'tailwind-theme.css'),
  tailwindThemeCss + '\n',
  'utf-8'
);

console.log(
  `✓ W3C tokens → dist/w3c/ (${rootEntries.length} root, ${lightEntries.length} light, ${darkEntries.length} dark)`
);
console.log(
  `✓ runtime module → src/tokens.runtime.generated.ts`
);
console.log(
  `✓ tailwind theme → dist/w3c/tailwind-theme.css (${twLines.length} mappings)`
);
