import type {
  BuilderMember,
  BuilderPage,
  BuilderProject,
  BuilderRole,
  LayoutNode,
  PublishRecord,
} from './types';

const builderRoles = [
  'owner',
  'admin',
  'editor',
  'commenter',
  'viewer',
] as const satisfies readonly BuilderRole[];

function isBuilderRole(value: unknown): value is BuilderRole {
  return (
    typeof value === 'string' &&
    (builderRoles as readonly string[]).includes(value)
  );
}

export function sanitizeProject(input: unknown): {
  project: BuilderProject;
  issues: string[];
} {
  const issues: string[] = [];

  const fallbackProject = (): BuilderProject => ({
    id: 'recovered-project',
    name: 'Recovered Project',
    pages: [],
    publish: {
      status: 'draft',
      publishedAt: null,
      publishedBy: null,
      sourceVersionId: null,
    },
    members: [],
  });

  if (!input || typeof input !== 'object') {
    issues.push(
      'Project root is not an object. Loaded fallback empty project.'
    );
    return { project: fallbackProject(), issues };
  }

  const obj = input as Record<string, unknown>;

  const id =
    typeof obj.id === 'string' && obj.id.trim()
      ? obj.id.trim()
      : 'recovered-project';
  if (typeof obj.id !== 'string' || !obj.id.trim()) {
    issues.push('Project missing valid ID. Assigned default ID.');
  }

  const name =
    typeof obj.name === 'string' && obj.name.trim()
      ? obj.name.trim()
      : 'Recovered Project';
  if (typeof obj.name !== 'string' || !obj.name.trim()) {
    issues.push('Project missing valid name. Assigned fallback name.');
  }

  // Sanitize Publish Record
  let publish: PublishRecord = {
    status: 'draft',
    publishedAt: null,
    publishedBy: null,
    sourceVersionId: null,
  };
  if (obj.publish && typeof obj.publish === 'object') {
    const pubObj = obj.publish as Record<string, unknown>;
    publish = {
      status: pubObj.status === 'published' ? 'published' : 'draft',
      publishedAt:
        typeof pubObj.publishedAt === 'string' ? pubObj.publishedAt : null,
      publishedBy:
        typeof pubObj.publishedBy === 'string' ? pubObj.publishedBy : null,
      sourceVersionId:
        typeof pubObj.sourceVersionId === 'string'
          ? pubObj.sourceVersionId
          : null,
    };
  } else {
    issues.push('Missing or invalid project publish record. Reset to draft.');
  }

  // Sanitize Members
  const members: BuilderMember[] = [];
  if (Array.isArray(obj.members)) {
    for (const rawMember of obj.members) {
      if (rawMember && typeof rawMember === 'object') {
        const memObj = rawMember as Record<string, unknown>;
        const userId = typeof memObj.userId === 'string' ? memObj.userId : '';
        const email = typeof memObj.email === 'string' ? memObj.email : '';
        const role = isBuilderRole(memObj.role) ? memObj.role : 'viewer';

        if (userId && email) {
          members.push({
            userId,
            email,
            role,
            lastActiveAt:
              typeof memObj.lastActiveAt === 'string'
                ? memObj.lastActiveAt
                : null,
            activePageId:
              typeof memObj.activePageId === 'string'
                ? memObj.activePageId
                : null,
          });
        } else {
          issues.push('Filtered out a malformed member entry.');
        }
      }
    }
  }

  // Sanitize Pages
  const pages: BuilderPage[] = [];
  const visitedNodes = new Set<string>();

  function sanitizeNode(nodeInput: unknown): LayoutNode | null {
    if (!nodeInput || typeof nodeInput !== 'object') return null;
    const nodeObj = nodeInput as Record<string, unknown>;

    const nodeId =
      typeof nodeObj.id === 'string' && nodeObj.id.trim()
        ? nodeObj.id.trim()
        : '';
    const componentId =
      typeof nodeObj.componentId === 'string' && nodeObj.componentId.trim()
        ? nodeObj.componentId.trim()
        : '';

    if (!nodeId || !componentId) {
      issues.push(
        `Filtered out a malformed node with missing id (${nodeId}) or componentId (${componentId}).`
      );
      return null;
    }

    if (visitedNodes.has(nodeId)) {
      issues.push(
        `Circular reference or duplicate node ID detected: ${nodeId}. Stripped branch.`
      );
      return null;
    }
    visitedNodes.add(nodeId);

    // Sanitize props: strip non-scalars and objects/functions that could crash canvas
    const props: Record<string, unknown> = {};
    if (nodeObj.props && typeof nodeObj.props === 'object') {
      const rawProps = nodeObj.props as Record<string, unknown>;
      for (const [key, val] of Object.entries(rawProps)) {
        if (
          val === null ||
          typeof val === 'string' ||
          typeof val === 'number' ||
          typeof val === 'boolean'
        ) {
          props[key] = val;
        } else {
          issues.push(
            `Stripped non-scalar prop "${key}" on node "${nodeId}" to prevent canvas crash.`
          );
        }
      }
    }

    // Recursively sanitize children
    const children: LayoutNode[] = [];
    if (Array.isArray(nodeObj.children)) {
      for (const childInput of nodeObj.children) {
        const cleanedChild = sanitizeNode(childInput);
        if (cleanedChild) {
          children.push(cleanedChild);
        }
      }
    }

    return {
      id: nodeId,
      componentId,
      props,
      children,
    };
  }

  if (Array.isArray(obj.pages)) {
    for (const rawPage of obj.pages) {
      if (rawPage && typeof rawPage === 'object') {
        const pageObj = rawPage as Record<string, unknown>;
        const pageId =
          typeof pageObj.id === 'string' && pageObj.id.trim()
            ? pageObj.id.trim()
            : '';
        const title =
          typeof pageObj.title === 'string' && pageObj.title.trim()
            ? pageObj.title.trim()
            : 'Untitled Page';

        if (!pageId) {
          issues.push('Filtered out a page with missing ID.');
          continue;
        }

        const root = sanitizeNode(pageObj.root);
        if (!root) {
          issues.push(
            `Page "${title}" had a missing or corrupt root node. Created fallback root.`
          );
          pages.push({
            id: pageId,
            title,
            root: {
              id: `${pageId}-root`,
              componentId: 'card',
              props: { title: 'Fallback Canvas' },
              children: [],
            },
          });
        } else {
          pages.push({
            id: pageId,
            title,
            root,
          });
        }
      }
    }
  } else {
    issues.push(
      'Missing or invalid page list. Loaded fallback blank page layout.'
    );
  }

  return {
    project: {
      id,
      name,
      pages,
      publish,
      members,
    },
    issues,
  };
}
