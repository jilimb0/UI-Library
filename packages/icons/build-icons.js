
const fs = require('fs');
const path = require('path');

const iconsDir = path.resolve(__dirname, 'src/icons');
const outputFile = path.resolve(__dirname, 'src/Icon.tsx');

function generateExports(dir, importPath = './icons') {
  const icons = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  return icons.map(icon => `export { default as ${icon.replace('.tsx', '')} } from '${importPath}/${icon.replace('.tsx', '')}';`).join('
');
}

const exportStatements = generateExports(iconsDir);

fs.writeFileSync(outputFile, `import * as React from 'react';

${exportStatements}
`);
