import type { LayoutNode } from '../types';

type Props = {
  node: LayoutNode;
  depth?: number;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onUpdateProps?: (nodeId: string, key: string, value: string) => void;
};

export function CanvasTree({
  node,
  depth = 0,
  selectedNodeId,
  onSelectNode,
  onUpdateProps,
}: Props) {
  const isSelected = selectedNodeId === node.id;
  const reviewState = node.props.reviewState as string | undefined;

  const getReviewBadgeStyle = (state: string) => {
    const base = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 500,
      marginLeft: '8px',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.04em',
    };

    if (state === 'accepted') {
      return { ...base, backgroundColor: '#d1fae5', color: '#065f46' };
    }
    if (state === 'rejected') {
      return { ...base, backgroundColor: '#fee2e2', color: '#991b1b' };
    }
    return { ...base, backgroundColor: '#fef3c7', color: '#92400e' };
  };

  return (
    <div style={{ marginLeft: depth * 14, marginBottom: '8px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          className={isSelected ? 'node selected' : 'node'}
          onClick={() => onSelectNode?.(node.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: isSelected
              ? 'var(--export-accent, #0f766e)'
              : '#ffffff',
            color: isSelected ? '#ffffff' : '#0f172a',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '6px 12px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <strong>{node.componentId}</strong>{' '}
          <span style={{ marginLeft: '4px', opacity: 0.7, fontSize: '12px' }}>
            #{node.id}
          </span>
        </button>

        {reviewState && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={getReviewBadgeStyle(reviewState)}>{reviewState}</span>
            <button
              type="button"
              onClick={() =>
                onUpdateProps?.(node.id, 'reviewState', 'accepted')
              }
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                background: '#ffffff',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: '12px',
                color: '#16a34a',
              }}
              title="Accept Section"
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() =>
                onUpdateProps?.(node.id, 'reviewState', 'rejected')
              }
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                background: '#ffffff',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: '12px',
                color: '#dc2626',
              }}
              title="Reject Section"
            >
              ✗
            </button>
          </div>
        )}
      </div>

      {node.children.map((child) => (
        <CanvasTree
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onUpdateProps={onUpdateProps}
        />
      ))}
    </div>
  );
}
