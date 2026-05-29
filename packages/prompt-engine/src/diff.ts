import type { PromptDraftNode, PromptDraftProject } from './index';

export type NodeDiff = {
  nodeId: string;
  componentId: string;
  action: 'added' | 'removed' | 'modified';
  propChanges?: {
    name: string;
    before: unknown;
    after: unknown;
  }[];
};

export type PageDiff = {
  pageId: string;
  action: 'added' | 'removed' | 'modified';
  titleChanged?: boolean;
  nodeDiffs?: NodeDiff[];
};

export type ProjectDiff = {
  projectId: string;
  nameChanged: boolean;
  pageDiffs: PageDiff[];
  summary: string[];
};

function flattenNodes(
  node: PromptDraftNode,
  result: Map<string, PromptDraftNode> = new Map()
): Map<string, PromptDraftNode> {
  result.set(node.id, node);
  for (const child of node.children) {
    flattenNodes(child, result);
  }
  return result;
}

export function diffPromptDrafts(
  before: PromptDraftProject,
  after: PromptDraftProject
): ProjectDiff {
  const summary: string[] = [];
  const pageDiffs: PageDiff[] = [];

  const nameChanged = before.name !== after.name;
  if (nameChanged) {
    summary.push(`Renamed project from "${before.name}" to "${after.name}"`);
  }

  const beforePagesMap = new Map(before.pages.map((p) => [p.id, p]));
  const afterPagesMap = new Map(after.pages.map((p) => [p.id, p]));

  // Track page changes
  for (const [id, beforePage] of beforePagesMap) {
    const afterPage = afterPagesMap.get(id);
    if (!afterPage) {
      pageDiffs.push({ pageId: id, action: 'removed' });
      summary.push(`Removed page "${beforePage.title}"`);
    } else {
      const titleChanged = beforePage.title !== afterPage.title;
      const nodeDiffs: NodeDiff[] = [];

      const beforeNodes = flattenNodes(beforePage.root);
      const afterNodes = flattenNodes(afterPage.root);

      for (const [nodeId, beforeNode] of beforeNodes) {
        const afterNode = afterNodes.get(nodeId);
        if (!afterNode) {
          nodeDiffs.push({
            nodeId,
            componentId: beforeNode.componentId,
            action: 'removed',
          });
        } else {
          // Compare props
          const propChanges: {
            name: string;
            before: unknown;
            after: unknown;
          }[] = [];
          const allPropKeys = new Set([
            ...Object.keys(beforeNode.props),
            ...Object.keys(afterNode.props),
          ]);

          for (const key of allPropKeys) {
            const beforeVal = beforeNode.props[key];
            const afterVal = afterNode.props[key];
            if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
              propChanges.push({
                name: key,
                before: beforeVal,
                after: afterVal,
              });
            }
          }

          if (propChanges.length > 0) {
            nodeDiffs.push({
              nodeId,
              componentId: afterNode.componentId,
              action: 'modified',
              propChanges,
            });
          }
        }
      }

      for (const [nodeId, afterNode] of afterNodes) {
        if (!beforeNodes.has(nodeId)) {
          nodeDiffs.push({
            nodeId,
            componentId: afterNode.componentId,
            action: 'added',
          });
        }
      }

      if (titleChanged || nodeDiffs.length > 0) {
        pageDiffs.push({
          pageId: id,
          action: 'modified',
          titleChanged,
          nodeDiffs,
        });

        if (titleChanged) {
          summary.push(`Renamed page ID "${id}" to "${afterPage.title}"`);
        }

        const addedCount = nodeDiffs.filter((n) => n.action === 'added').length;
        const removedCount = nodeDiffs.filter(
          (n) => n.action === 'removed'
        ).length;
        const modifiedCount = nodeDiffs.filter(
          (n) => n.action === 'modified'
        ).length;

        if (addedCount > 0) {
          summary.push(
            `Added ${addedCount} components to page "${afterPage.title}"`
          );
        }
        if (removedCount > 0) {
          summary.push(
            `Removed ${removedCount} components from page "${afterPage.title}"`
          );
        }
        if (modifiedCount > 0) {
          summary.push(
            `Modified props of ${modifiedCount} components on page "${afterPage.title}"`
          );
        }
      }
    }
  }

  for (const [id, afterPage] of afterPagesMap) {
    if (!beforePagesMap.has(id)) {
      pageDiffs.push({ pageId: id, action: 'added' });
      summary.push(`Created new page "${afterPage.title}"`);
    }
  }

  return {
    projectId: after.id,
    nameChanged,
    pageDiffs,
    summary,
  };
}
