import type { LayoutNode } from '../types';

type Props = {
  root: LayoutNode;
  selectedNodeId: string | null;
  selectedNodeIds?: string[];
  onSelectNode: (id: string, additive?: boolean) => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode: (id: string) => void;
};

export function LayersTree({
  root,
  selectedNodeId,
  selectedNodeIds = [],
  onSelectNode,
  onDeleteNode,
  onDuplicateNode,
}: Props) {
  return (
    <div>
      <p className="title">Layers</p>
      <TreeNode
        node={root}
        depth={0}
        selectedNodeId={selectedNodeId}
        selectedNodeIds={selectedNodeIds}
        onSelectNode={onSelectNode}
        onDeleteNode={onDeleteNode}
        onDuplicateNode={onDuplicateNode}
      />
    </div>
  );
}

type TreeNodeProps = {
  node: LayoutNode;
  depth: number;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  onSelectNode: (id: string, additive?: boolean) => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode: (id: string) => void;
};

function TreeNode({
  node,
  depth,
  selectedNodeId,
  selectedNodeIds,
  onSelectNode,
  onDeleteNode,
  onDuplicateNode,
}: TreeNodeProps) {
  const isSelected =
    selectedNodeIds.includes(node.id) || selectedNodeId === node.id;
  return (
    <div style={{ marginLeft: depth * 12 }}>
      <div className="layer-row">
        <button
          type="button"
          className={isSelected ? 'node selected' : 'node'}
          onClick={(event) =>
            onSelectNode(node.id, event.metaKey || event.ctrlKey)
          }
        >
          {node.componentId} <span className="muted">#{node.id}</span>
        </button>
        <button
          type="button"
          className="mini"
          onClick={() => onDuplicateNode(node.id)}
        >
          Dup
        </button>
        {depth > 0 && (
          <button
            type="button"
            className="mini danger"
            onClick={() => onDeleteNode(node.id)}
          >
            Del
          </button>
        )}
      </div>
      {node.children.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedNodeId={selectedNodeId}
          selectedNodeIds={selectedNodeIds}
          onSelectNode={onSelectNode}
          onDeleteNode={onDeleteNode}
          onDuplicateNode={onDuplicateNode}
        />
      ))}
    </div>
  );
}
