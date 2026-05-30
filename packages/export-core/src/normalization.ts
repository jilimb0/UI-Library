import { getComponentById } from '@ui-construction-library/registry';
import { validateRequiredShape } from '@ui-construction-library/schema';
import type {
  BuilderLikePage,
  BuilderLikeProject,
  ExportDiagnostic,
  ExportIRNode,
  ExportNodeInput,
  ExportRequest,
  ExportTarget,
  NormalizeExportResult,
} from './types';

function normalizeScalarProp(
  value: unknown,
  pageId: string,
  nodeId: string,
  diagnostics: ExportDiagnostic[],
  propName: string,
  nodePath?: string
): string | number | boolean | null {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  diagnostics.push({
    level: 'warning',
    code: 'UNSUPPORTED_PROP_VALUE',
    message: `Prop "${propName}" on node "${nodeId}" has a non-scalar value (${typeof value}) that cannot be exported. Fix: convert it to a string, number, boolean, or null before exporting.`,
    pageId,
    nodeId,
    propName,
    nodePath,
  });

  return null;
}

function normalizeNode(
  node: ExportNodeInput,
  pageId: string,
  diagnostics: ExportDiagnostic[],
  nodePath = 'root'
): ExportIRNode {
  const component = getComponentById(node.componentId);
  const exportKind = component ? 'component' : 'unsupported';
  const currentPath = `${nodePath} > ${node.componentId}`;

  if (!component) {
    diagnostics.push({
      level: 'error',
      code: 'UNKNOWN_COMPONENT',
      message: `Component "${node.componentId}" (id: ${node.id}) is not registered for export. Remove it or replace it with a registered component.`,
      pageId,
      nodeId: node.id,
      componentId: node.componentId,
      nodePath: currentPath,
    });
  }

  const props = Object.fromEntries(
    Object.entries(node.props)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([propName, value]) => [
        propName,
        normalizeScalarProp(
          value,
          pageId,
          node.id,
          diagnostics,
          propName,
          currentPath
        ),
      ])
  );

  return {
    nodeId: node.id,
    componentId: node.componentId,
    exportKind,
    props,
    children: node.children.map((child) =>
      normalizeNode(child, pageId, diagnostics, currentPath)
    ),
    unsupportedReason:
      exportKind === 'unsupported' ? 'component-not-registered' : undefined,
  };
}

export function createPagePath(page: BuilderLikePage, index: number): string {
  if (index === 0) return '/';
  return `/${page.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
}

export function createExportRequestFromBuilderProject(
  project: BuilderLikeProject,
  target: ExportTarget
): ExportRequest {
  return {
    target,
    project: {
      id: project.id,
      name: project.name,
      pages: project.pages.map((page, index) => ({
        id: page.id,
        name: page.title,
        path: createPagePath(page, index),
        rootNode: page.root,
      })),
    },
  };
}

export function normalizeExportProject(
  request: ExportRequest
): NormalizeExportResult {
  const diagnostics: ExportDiagnostic[] = [];

  if (!validateRequiredShape('project', request.project)) {
    diagnostics.push({
      level: 'error',
      code: 'INVALID_PROJECT_SHAPE',
      message: 'Project does not satisfy required export shape.',
    });
  }

  const pages = request.project.pages.map((page) => ({
    pageId: page.id,
    name: page.name,
    path: page.path,
    rootNode: normalizeNode(page.rootNode, page.id, diagnostics),
  }));

  return {
    ir: {
      projectId: request.project.id,
      name: request.project.name,
      target: request.target,
      pages,
    },
    diagnostics,
  };
}
