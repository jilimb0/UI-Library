import { useState } from 'react';
import { cn } from '../../../utils/cn';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  className?: string;
}

function TreeBranch({
  node,
  depth,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  onSelect?: (node: TreeNode) => void;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!node.children?.length;

  return (
    <li>
      <div
        className="tree-view__row"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="tree-view__toggle"
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="tree-view__toggle" aria-hidden />
        )}
        <button
          type="button"
          onClick={() => onSelect?.(node)}
          className="tree-view__node"
        >
          {node.label}
        </button>
      </div>
      {hasChildren && open ? (
        <ul className="tree-view">
          {node.children?.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function TreeView({ nodes, onSelect, className }: TreeViewProps) {
  return (
    <ul className={cn('tree-view', className)}>
      {nodes.map((node) => (
        <TreeBranch key={node.id} node={node} depth={0} onSelect={onSelect} />
      ))}
    </ul>
  );
}
