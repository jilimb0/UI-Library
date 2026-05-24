import type { LayoutNode } from '../types';

type Props = {
  root: LayoutNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode: (id: string) => void;
};

export function LayersTree({
  root,
  selectedNodeId,
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
  onSelectNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onDuplicateNode: (id: string) => void;
};

function TreeNode({
  node,
  depth,
  selectedNodeId,
  onSelectNode,
  onDeleteNode,
  onDuplicateNode,
}: TreeNodeProps) {
  return (
    <div style={{ marginLeft: depth * 12 }}>
      <div className="layer-row">
        <button
          type="button"
          className={selectedNodeId === node.id ? 'node selected' : 'node'}
          onClick={() => onSelectNode(node.id)}
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
          onSelectNode={onSelectNode}
          onDeleteNode={onDeleteNode}
          onDuplicateNode={onDuplicateNode}
        />
      ))}
    </div>
  );
}
