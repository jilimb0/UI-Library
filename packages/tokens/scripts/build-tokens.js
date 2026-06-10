/**
 * Build design tokens artifact pipeline.
 *
 * Reads the compiled ESM bundle and emits:
 *   - dist/tokens.raw.json      (primitive tokens)
 *   - dist/tokens.semantic.json (semantic light + dark)
 *   - dist/tokens.component.json (component light + dark)
 *
 * Must run AFTER `rollup -c` so dist/index.esm.js exists.
 */

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

async function main() {
  const mod = await import(resolve(distDir, 'index.esm.js'));

  const raw = mod.rawTokens;
  const semantic = mod.semanticTokens;
  const component = mod.componentTokens;

  if (!raw || !semantic || !component) {
    console.error('Missing aggregated token exports from dist/index.esm.js');
    process.exit(1);
  }

  const opts = { spaces: 2 };

  writeFileSync(
    resolve(distDir, 'tokens.raw.json'),
    `${JSON.stringify(raw, null, opts)}\n`
  );
  writeFileSync(
    resolve(distDir, 'tokens.semantic.json'),
    `${JSON.stringify(semantic, null, opts)}\n`
  );
  writeFileSync(
    resolve(distDir, 'tokens.component.json'),
    `${JSON.stringify(component, null, opts)}\n`
  );

  if (typeof mod.generateCSSVariables !== 'function') {
    console.error('Missing generateCSSVariables export from dist/index.esm.js');
    process.exit(1);
  }

  const css = mod.generateCSSVariables();
  writeFileSync(
    resolve(distDir, 'tokens.css'),
    css.endsWith('\n') ? css : `${css}\n`,
    'utf-8'
  );

  console.log(
    '✓ Emitted tokens.raw.json, tokens.semantic.json, tokens.component.json' +
      ', tokens.css'
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
