#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const componentsRoot = path.join(root, 'packages', 'core', 'src', 'components');
const categories = ['atoms', 'molecules', 'organisms'];

/** @type {{file: string, issue: string}[]} */
const issues = [];

function checkComponentFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const hasClassName = /\bclassName\b/.test(source);
  const hasStyle = /\bstyle\b/.test(source);
  const hasSize = /\bsize\??:\s*['"`]/.test(source);
  const hasValue = /\bvalue\??:/.test(source);
  const hasDefaultValue = /\bdefaultValue\??:/.test(source);
  const hasOnValueChange = /\bonValueChange\??:/.test(source);
  const hasOnChange = /\bonChange\??:/.test(source);

  if (!hasClassName) {
    issues.push({ file: filePath, issue: 'Missing className support' });
  }
  if (!hasStyle) {
    issues.push({ file: filePath, issue: 'Missing style support' });
  }

  if (hasSize && !/sm|default|lg/.test(source)) {
    issues.push({
      file: filePath,
      issue: 'Size prop detected without sm/default/lg contract',
    });
  }

  if (hasValue && hasDefaultValue && !(hasOnValueChange || hasOnChange)) {
    issues.push({
      file: filePath,
      issue:
        'Controlled/uncontrolled props detected without onValueChange/onChange handler',
    });
  }
}

for (const category of categories) {
  const categoryPath = path.join(componentsRoot, category);
  if (!fs.existsSync(categoryPath)) continue;

  for (const componentName of fs.readdirSync(categoryPath)) {
    const componentDir = path.join(categoryPath, componentName);
    if (!fs.statSync(componentDir).isDirectory()) continue;

    const componentFile = path.join(componentDir, `${componentName}.tsx`);
    if (fs.existsSync(componentFile)) {
      checkComponentFile(componentFile);
    }
  }
}

if (issues.length === 0) {
  console.log('[upgrade-doctor] PASS: no contract issues found.');
  process.exit(0);
}

console.log('[upgrade-doctor] Found contract issues:');
for (const item of issues) {
  const relative = path.relative(root, item.file);
  console.log(`- ${relative}: ${item.issue}`);
}
process.exit(1);
