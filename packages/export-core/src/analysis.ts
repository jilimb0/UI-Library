import type {
  AnalyzeExportResult,
  EnrichExportResult,
  ExportIRNode,
  NormalizeExportResult,
} from './types';

// Component IDs that belong to packages beyond @ui-construction-library/core
const MOTION_COMPONENT_IDS = new Set([
  'animated-div',
  'fade-in',
  'slide-in',
  'scale-in',
  'motion-box',
  'animated-list',
  'animated-item',
  'stagger-children',
  'spring-box',
]);

const PRIMITIVES_COMPONENT_IDS = new Set([
  'dialog',
  'popover',
  'accordion',
  'tabs',
  'slider',
  'switch',
  'context-menu',
]);

const DND_COMPONENT_IDS = new Set([
  'draggable',
  'droppable',
  'drag-handle',
  'sortable-list',
  'sortable-item',
  'dnd-context',
]);

export function analyzeExportProject(
  result: NormalizeExportResult
): AnalyzeExportResult {
  const imports = new Set<string>();
  const dependencies = new Set<string>(['react', 'react-dom']);
  const unsupportedNodeIds: string[] = [];
  const componentCounts = new Map<string, number>();

  const visit = (node: ExportIRNode): void => {
    if (node.exportKind === 'unsupported') {
      unsupportedNodeIds.push(node.nodeId);
    } else {
      imports.add(node.componentId);
      componentCounts.set(
        node.componentId,
        (componentCounts.get(node.componentId) ?? 0) + 1
      );
    }

    for (const child of node.children) visit(child);
  };

  for (const page of result.ir.pages) {
    visit(page.rootNode);
  }

  if (imports.size > 0) {
    dependencies.add('@ui-construction-library/core');
  }

  if (componentCounts.size > 1) {
    dependencies.add('clsx');
  }

  // Deep package dependency detection — add sub-packages when their
  // component IDs appear in the tree so the exported package.json is complete.
  for (const id of imports) {
    const normalized = id.toLowerCase();
    if (MOTION_COMPONENT_IDS.has(normalized)) {
      dependencies.add('@ui-construction-library/motion');
    }
    if (PRIMITIVES_COMPONENT_IDS.has(normalized)) {
      dependencies.add('@ui-construction-library/primitives');
    }
    if (DND_COMPONENT_IDS.has(normalized)) {
      dependencies.add('@ui-construction-library/dnd');
    }
  }

  return {
    ir: result.ir,
    diagnostics: [...result.diagnostics],
    imports: [...imports].sort(),
    dependencies: [...dependencies].sort(),
    unsupportedNodeIds: unsupportedNodeIds.sort(),
  };
}

export function enrichExportProject(
  result: AnalyzeExportResult
): EnrichExportResult {
  return {
    ...result,
    metadata: {
      renderer: result.ir.target,
      generatedAt: 'deterministic-placeholder',
      pageCount: result.ir.pages.length,
    },
  };
}
