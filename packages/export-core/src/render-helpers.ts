import type { ExportIRNode, ExportIRProject } from './types';

export function renderPropValue(
  value: string | number | boolean | null
): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  return '{null}';
}

export function pascalCase(value: string): string {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

export function renderNodeToJsx(node: ExportIRNode): string {
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

  if (node.children.length === 0) {
    return `${openTag}</${componentName}>`;
  }

  const children = node.children
    .map((child) => renderNodeToJsx(child))
    .join('');
  return `${openTag}${children}</${componentName}>`;
}

export function collectExportedComponentIds(ir: ExportIRProject): string[] {
  const ids = new Set<string>();

  const visit = (node: ExportIRNode) => {
    if (node.exportKind === 'component') ids.add(node.componentId);
    for (const child of node.children) visit(child);
  };

  for (const page of ir.pages) {
    visit(page.rootNode);
  }

  return [...ids].sort();
}

export function createCoreComponentImportStatement(
  componentIds: string[]
): string {
  const names = componentIds.map(pascalCase);
  if (names.length === 0) return '';
  return `import { ${names.join(', ')} } from '@ui-construction-library/core';\n`;
}
