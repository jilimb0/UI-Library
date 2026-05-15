#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const componentName = process.argv[2];

if (!componentName) {
  console.error('Please provide a component name');
  process.exit(1);
}

const componentDir = path.join(
  __dirname,
  '..',
  'packages',
  'components',
  componentName
);

if (fs.existsSync(componentDir)) {
  console.error('Component already exists');
  process.exit(1);
}

fs.mkdirSync(componentDir, { recursive: true });

const componentContent = `import React from 'react';

interface ${componentName}Props {
  children?: ReactNode;
}

const ${componentName}: FC<${componentName}Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default ${componentName};
`;

fs.writeFileSync(
  path.join(componentDir, `${componentName}.tsx`),
  componentContent
);

console.log(`${componentName} component created successfully.`);
