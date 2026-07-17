/**
 * build-css.js — Bundle CSS sources into dist/styles.css
 *
 * 1. Reads base.css, components.css (from core), and utilities.css
 * 2. Generates ucl- prefixed class selectors for backward compatibility
 * 3. Outputs a single concatenated dist/styles.css
 *
 * The components.css source uses unprefixed class names (.button, .card, etc.).
 * This script generates the canonical ucl- prefixed versions (.ucl-button, etc.)
 * and emits both, so consumers can use either naming convention.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = resolve(root, 'dist');

// ---------------------------------------------------------------------------
// 1. Read source CSS files
// ---------------------------------------------------------------------------
const baseCss = readFileSync(resolve(root, 'src/base.css'), 'utf-8');
const utilitiesCss = readFileSync(resolve(root, 'src/utilities.css'), 'utf-8');
const motionCss = readFileSync(resolve(root, 'src/motion.css'), 'utf-8');

// Components CSS lives in the core package (the canonical source of truth)
const componentsCssPath = resolve(root, '../core/src/styles/components.css');
const componentsCss = readFileSync(componentsCssPath, 'utf-8');

// ---------------------------------------------------------------------------
// 2. Generate ucl- prefixed selectors from components CSS
// ---------------------------------------------------------------------------

/**
 * Add `ucl-` prefix to a class name in a CSS selector.
 * Handles compound selectors like `.button--sm`, `.switch[data-state='checked']`,
 * `.table th`, `.dropdown-menu__item:hover`, etc.
 *
 * Only prefixes class selectors (starting with `.`), leaving element selectors,
 * pseudo-classes, attribute selectors, and combinators untouched.
 */
function prefixSelector(selector) {
  // Don't prefix selectors that start with @ (at-rules)
  if (selector.trim().startsWith('@')) return selector;

  // Replace `.classname` with `.ucl-classname`
  // Match `.` followed by a valid CSS class name (letters, digits, hyphens, underscores)
  return selector.replace(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g, '.ucl-$1');
}

/**
 * Process CSS: for each rule with class selectors, replace the selector
 * with a comma-separated list containing both the ucl- prefixed and original.
 * Handles multi-line selectors like `.input,\n.select,\n.textarea {`
 */
function generatePrefixedCss(css) {
  const lines = css.split('\n');
  const output = [];
  let inAtRule = false;
  let atRuleDepth = 0;
  let inBlock = false;
  let blockDepth = 0;
  // Buffer for collecting multi-line selectors
  let selectorBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track at-rules (@media, @keyframes)
    if (trimmed.startsWith('@media') || trimmed.startsWith('@keyframes')) {
      flushSelectorBuffer(output);
      output.push(line);
      inAtRule = true;
      atRuleDepth =
        (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
      continue;
    }

    if (inAtRule) {
      atRuleDepth += (line.match(/{/g) || []).length;
      atRuleDepth -= (line.match(/}/g) || []).length;

      if (atRuleDepth <= 0) {
        flushSelectorBuffer(output);
        output.push(line);
        inAtRule = false;
        continue;
      }

      // Inside at-rule, look for selector lines (not inside a nested block)
      if (!inBlock) {
        if (
          trimmed.startsWith('/*') ||
          trimmed.startsWith('*') ||
          trimmed === ''
        ) {
          flushSelectorBuffer(output);
          output.push(line);
        } else if (trimmed.includes('{')) {
          // Line with opening brace — could be a single-line or end of multi-line selector
          const indent = line.match(/^(\s*)/)[1];
          const braceIdx = trimmed.indexOf('{');
          const selectorPart = trimmed.slice(0, braceIdx).trim();
          const rest = trimmed.slice(braceIdx);

          // Collect multi-line selector
          selectorBuffer.push(selectorPart);
          const fullSelector = selectorBuffer
            .map((s) => s.replace(/,\s*$/, '').trim())
            .filter(Boolean)
            .join(', ');
          selectorBuffer = [];

          const combined = combineSelectors(fullSelector);
          output.push(`${indent}${combined} ${rest}`);

          inBlock = true;
          blockDepth = 1;
          blockDepth -= (rest.match(/}/g) || []).length;
          if (blockDepth <= 0) inBlock = false;
        } else if (trimmed.includes(',')) {
          // Continuation of a multi-line selector
          selectorBuffer.push(trimmed);
        } else {
          flushSelectorBuffer(output);
          if (inBlock) {
            blockDepth += (line.match(/{/g) || []).length;
            blockDepth -= (line.match(/}/g) || []).length;
            if (blockDepth <= 0) inBlock = false;
          }
          output.push(line);
        }
      } else {
        blockDepth += (line.match(/{/g) || []).length;
        blockDepth -= (line.match(/}/g) || []).length;
        if (blockDepth <= 0) inBlock = false;
        output.push(line);
      }
      continue;
    }

    // Regular (top-level) rule processing
    if (!inBlock) {
      if (
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*') ||
        trimmed === '' ||
        trimmed.startsWith('@')
      ) {
        flushSelectorBuffer(output);
        output.push(line);
      } else if (trimmed.includes('{')) {
        // Line with opening brace
        const braceIdx = trimmed.indexOf('{');
        const selectorPart = trimmed.slice(0, braceIdx).trim();
        const rest = trimmed.slice(braceIdx);

        // Collect multi-line selector
        selectorBuffer.push(selectorPart);
        const fullSelector = selectorBuffer
          .map((s) => s.replace(/,\s*$/, '').trim())
          .filter(Boolean)
          .join(', ');
        selectorBuffer = [];

        if (fullSelector === '') {
          output.push(line);
          continue;
        }

        const combined = combineSelectors(fullSelector);
        output.push(`${combined} ${rest}`);

        inBlock = true;
        blockDepth = 1;
        blockDepth -= (rest.match(/}/g) || []).length;
        if (blockDepth <= 0) inBlock = false;
      } else if (trimmed.includes(',')) {
        // Continuation of a multi-line selector (e.g., ".input,")
        selectorBuffer.push(trimmed);
      } else {
        flushSelectorBuffer(output);
        output.push(line);
      }
    } else {
      blockDepth += (line.match(/{/g) || []).length;
      blockDepth -= (line.match(/}/g) || []).length;
      output.push(line);
      if (blockDepth <= 0) inBlock = false;
    }
  }

  flushSelectorBuffer(output);
  return output.join('\n');
}

function flushSelectorBuffer(_output) {
  // If there's anything in the buffer, output as-is (shouldn't normally happen)
  // This is a no-op since the buffer is always flushed before reaching here
}

/**
 * Given a CSS selector string, return a combined selector with both
 * the ucl- prefixed version and the original.
 * e.g., ".button:hover, .btn" → ".ucl-button:hover, .ucl-btn, .button:hover, .btn"
 */
function combineSelectors(selectorStr) {
  // Split comma-separated selectors
  const parts = selectorStr
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const prefixed = parts.map(prefixSelector).filter((p) => p !== '');
  const originals = parts;

  // Only add prefixed versions if at least one was actually changed
  const hasChanges = parts.some((p, i) => prefixed[i] !== p);
  if (!hasChanges) return selectorStr;

  return [...prefixed, ...originals].join(', ');
}

// ---------------------------------------------------------------------------
// 3. Assemble and write output
// ---------------------------------------------------------------------------

const prefixedComponents = generatePrefixedCss(componentsCss);

const header = `/* ==========================================================================
   @ui-construction-library/styles — Universal CSS Layer
   Auto-generated by build-css.js. Do not edit directly.

   This stylesheet provides:
   1. Base reset and semantic token aliases (--ucl-* namespace)
   2. Component classes with ucl- prefix (.ucl-button, .ucl-card, etc.)
   3. Backward-compat unprefixed classes (.button, .card, etc.)
   4. Utility classes (.ucl-stack, .ucl-cluster, density presets, etc.)
   ========================================================================== */
`;

const separator =
  '\n\n/* ======================================================================== */\n\n';

const layerPrelude = `@layer uicl-reset, uicl-base, uicl-components;

`;

const finalCss = [
  layerPrelude,
  header,
  '@layer uicl-reset {',
  baseCss,
  '}',
  separator,
  '/* ── Motion Layer (unlayered) ── */',
  motionCss,
  separator,
  '@layer uicl-components {',
  '/* ── Component Layer (ucl- prefixed) ── */',
  prefixedComponents,
  '}',
  separator,
  '/* ── Utilities Layer (unlayered, highest specificity) ── */',
  utilitiesCss,
].join('\n');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

writeFileSync(resolve(distDir, 'styles.css'), finalCss, 'utf-8');

// Count classes for reporting
const uclClasses = (finalCss.match(/\.ucl-[a-zA-Z]/g) || []).length;
const totalLines = finalCss.split('\n').length;
console.log(
  `✓ dist/styles.css written (${totalLines} lines, ~${uclClasses} ucl- class references)`
);

// Copy layers.css standalone file
const layersCss = readFileSync(resolve(root, 'src/layers.css'), 'utf-8');
writeFileSync(resolve(distDir, 'layers.css'), layersCss, 'utf-8');
console.log('✓ dist/layers.css written');
