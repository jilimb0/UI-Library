const fs = require('fs');
const path = require('path');

const foundationsPath = '/Users/jilimbo/Documents/PersonalProjects/UI-Library/packages/registry/src/components/foundations.ts';
const content = fs.readFileSync(foundationsPath, 'utf8');

// Find start of foundationalComponents array
const arrayStartMarker = 'export const foundationalComponents: RegistryComponent[] = [';
const startIndex = content.indexOf(arrayStartMarker);
if (startIndex === -1) {
  console.error('Could not find start of foundationalComponents array');
  process.exit(1);
}

// Slice the array content
const arrayContent = content.slice(startIndex + arrayStartMarker.length);

// Parse individual components by tracking curly braces
const components = [];
let braceCount = 0;
let currentComponent = '';
let inString = false;
let stringChar = '';

for (let i = 0; i < arrayContent.length; i++) {
  const char = arrayContent[i];
  
  if (inString) {
    if (char === stringChar && arrayContent[i - 1] !== '\\') {
      inString = false;
    }
    currentComponent += char;
    continue;
  }
  
  if (char === "'" || char === '"' || char === '`') {
    inString = true;
    stringChar = char;
    currentComponent += char;
    continue;
  }
  
  if (char === '{') {
    braceCount++;
  }
  
  if (braceCount > 0) {
    currentComponent += char;
  }
  
  if (char === '}') {
    braceCount--;
    if (braceCount === 0) {
      components.push(currentComponent.trim());
      currentComponent = '';
    }
  }
}

console.log(`Parsed ${components.length} components.`);

// Group components by category
const categories = {};
for (const comp of components) {
  // Extract category using regex
  const catMatch = comp.match(/category:\s*['"]([^'"]+)['"]/);
  if (!catMatch) {
    console.error('Could not find category for component:', comp.slice(0, 100));
    continue;
  }
  const category = catMatch[1];
  if (!categories[category]) {
    categories[category] = [];
  }
  categories[category].push(comp);
}

// Map category folders/files
const componentCategories = Object.keys(categories);
console.log('Categories found:', componentCategories);

for (const category of componentCategories) {
  const categoryFile = `/Users/jilimbo/Documents/PersonalProjects/UI-Library/packages/registry/src/components/${category}.ts`;
  
  // Find which shared imports are used in this category
  const sharedImports = ['RegistryComponent'];
  const allCompText = categories[category].join('\n');
  
  const possibleImports = [
    'baseCompatibility', 'interactiveRule',
    'commonVariantProp', 'commonSizeProp', 'commonToneProp',
    'commonDisabledProp', 'commonLoadingProp', 'commonFullWidthProp',
    'commonAsProp', 'commonClassNameProp', 'commonChildrenProp',
    'commonIconProp', 'commonLabelProp', 'commonDescriptionProp',
    'commonErrorProp', 'commonRequiredProp', 'commonValueProp',
    'commonDefaultValueProp', 'commonOnChangeProp'
  ];
  
  for (const imp of possibleImports) {
    if (allCompText.includes(imp)) {
      sharedImports.push(imp);
    }
  }
  
  const fileContent = `import {
  ${sharedImports.map(x => `type ${x}`.startsWith('type type') || !x.endsWith('Prop') && !x.endsWith('Rule') && !x.endsWith('Compatibility') ? `type ${x}` : x).join(',\n  ')}
} from './shared';

export const ${category}Components: RegistryComponent[] = [
  ${categories[category].join(',\n  ')}
];
`;
  
  fs.writeFileSync(categoryFile, fileContent, 'utf8');
  console.log(`Wrote ${categoryFile} with ${categories[category].length} components.`);
}

// Generate the foundations.ts re-export barrel
const barrelImports = componentCategories.map(cat => `import { ${cat}Components } from './${cat}';`).join('\n');
const barrelMerge = `export const foundationalComponents: RegistryComponent[] = [
  ${componentCategories.map(cat => `...${cat}Components`).join(',\n  ')}
];`;

const barrelContent = `import { RegistryComponent } from './shared';
${barrelImports}

export * from './shared';

${barrelMerge}
`;

fs.writeFileSync(foundationsPath, barrelContent, 'utf8');
console.log('Successfully updated foundations.ts');
