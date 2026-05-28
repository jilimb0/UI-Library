import type { LayoutNode } from './types';

export function findNode(
  root: LayoutNode,
  targetId: string
): LayoutNode | null {
  if (root.id === targetId) return root;
  for (const child of root.children) {
    const found = findNode(child, targetId);
    if (found) return found;
  }
  return null;
}

export function updateNodeProps(
  root: LayoutNode,
  targetId: string,
  patch: Record<string, unknown>
): LayoutNode {
  if (root.id === targetId) {
    return { ...root, props: { ...root.props, ...patch } };
  }

  return {
    ...root,
    children: root.children.map((child) =>
      updateNodeProps(child, targetId, patch)
    ),
  };
}

export function addChildNode(
  root: LayoutNode,
  parentId: string,
  child: LayoutNode
): LayoutNode {
  if (root.id === parentId) {
    return { ...root, children: [...root.children, child] };
  }

  return {
    ...root,
    children: root.children.map((item) => addChildNode(item, parentId, child)),
  };
}

export function removeNode(root: LayoutNode, targetId: string): LayoutNode {
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== targetId)
      .map((child) => removeNode(child, targetId)),
  };
}

function cloneSubtree(node: LayoutNode, suffix: string): LayoutNode {
  return {
    ...node,
    id: `${node.id}-${suffix}`,
    children: node.children.map((child) => cloneSubtree(child, suffix)),
  };
}

export function duplicateNode(
  root: LayoutNode,
  targetId: string,
  suffix: string
): LayoutNode {
  return {
    ...root,
    children: root.children.flatMap((child) => {
      const next = duplicateNode(child, targetId, suffix);
      if (child.id === targetId) {
        return [next, cloneSubtree(child, suffix)];
      }
      return [next];
    }),
  };
}

export function replaceNode(
  root: LayoutNode,
  targetId: string,
  nextNode: LayoutNode
): LayoutNode {
  if (root.id === targetId) {
    return nextNode;
  }

  return {
    ...root,
    children: root.children.map((child) =>
      replaceNode(child, targetId, nextNode)
    ),
  };
}

export function listNodeIdsDepthFirst(root: LayoutNode): string[] {
  return [
    root.id,
    ...root.children.flatMap((child) => listNodeIdsDepthFirst(child)),
  ];
}

export function findParentNode(
  root: LayoutNode,
  targetId: string
): LayoutNode | null {
  for (const child of root.children) {
    if (child.id === targetId) return root;
    const nested = findParentNode(child, targetId);
    if (nested) return nested;
  }
  return null;
}
