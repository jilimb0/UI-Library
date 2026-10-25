/**
 * Style Dictionary configuration for @ui-construction-library/tokens.
 *
 * Transforms the W3C Design Tokens source (src/tokens.w3c.json) into:
 *   - dist/sd/variables.css  — flat CSS custom properties (--ucl-*)
 *   - dist/sd/tokens.js      — ESM JS object
 *   - dist/sd/tokens.ios.swift — iOS/Swift color constants (optional)
 *
 * Usage:
 *   npx style-dictionary build --config style-dictionary.config.mjs
 *
 * Or add to package.json scripts:
 *   "build:sd": "style-dictionary build --config style-dictionary.config.mjs"
 *
 * Figma / Tokens Studio:
 *   Point Tokens Studio to packages/tokens/src/tokens.w3c.json
 *   (W3C Design Tokens Format, compatible out of the box).
 *
 * @see https://styledictionary.com/
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensPath = resolve(__dirname, 'src', 'tokens.w3c.json');
const raw = JSON.parse(readFileSync(tokensPath, 'utf-8'));

/** Flatten W3C token tree into Style Dictionary format. */
function flattenTokens(obj, prefix = '') {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const path = prefix ? `${prefix}-${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      result[path] = {
        value: val.$value,
        type: val.$type ?? 'other',
        comment: val.$description,
      };
    } else if (val && typeof val === 'object') {
      Object.assign(result, flattenTokens(val, path));
    }
  }
  return result;
}

const tokens = flattenTokens(raw);

export default {
  tokens,
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'ucl',
      buildPath: 'dist/sd/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: false,
            selector: ':root',
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/sd/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
};
