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
        className="flex items-center gap-2"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-5 text-left text-slate-500"
          >
            {open ? '▾' : '▸'}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <button
          type="button"
          onClick={() => onSelect?.(node)}
          className="rounded px-1 py-0.5 text-sm text-slate-700 hover:bg-slate-100"
        >
          {node.label}
        </button>
      </div>
      {hasChildren && open ? (
        <ul>
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
    <ul className={cn('space-y-1', className)}>
      {nodes.map((node) => (
        <TreeBranch key={node.id} node={node} depth={0} onSelect={onSelect} />
      ))}
    </ul>
  );
}
