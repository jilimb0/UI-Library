import type { LayoutNode } from '../types';

type Props = {
  node: LayoutNode;
  depth?: number;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
};

export function CanvasTree({
  node,
  depth = 0,
  selectedNodeId,
  onSelectNode,
}: Props) {
  const isSelected = selectedNodeId === node.id;

  return (
    <div style={{ marginLeft: depth * 14 }}>
      <button
        type="button"
        className={isSelected ? 'node selected' : 'node'}
        onClick={() => onSelectNode?.(node.id)}
      >
        <strong>{node.componentId}</strong>{' '}
        <span className="muted">#{node.id}</span>
      </button>
      {node.children.map((child) => (
        <CanvasTree
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      ))}
    </div>
  );
}
