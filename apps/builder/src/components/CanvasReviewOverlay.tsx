import type { LayoutNode } from '../types';

type ReviewState = 'pending' | 'accepted' | 'rejected';

type Props = {
  sections: LayoutNode[];
  sectionDecisions: Record<string, ReviewState>;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string) => void;
  onAccept: (nodeId: string) => void;
  onReject: (nodeId: string) => void;
  onReset: (nodeId: string) => void;
};

const STATE_STYLES: Record<
  ReviewState,
  {
    border: string;
    background: string;
    badge: string;
    badgeText: string;
    label: string;
  }
> = {
  pending: {
    border: '2px solid #fcd34d',
    background: '#fffbeb',
    badge: '#fef3c7',
    badgeText: '#92400e',
    label: 'Pending',
  },
  accepted: {
    border: '2px solid #6ee7b7',
    background: '#f0fdf4',
    badge: '#d1fae5',
    badgeText: '#065f46',
    label: 'Accepted',
  },
  rejected: {
    border: '2px solid #fca5a5',
    background: '#fef2f2',
    badge: '#fee2e2',
    badgeText: '#991b1b',
    label: 'Rejected',
  },
};

export function CanvasReviewOverlay({
  sections,
  sectionDecisions,
  selectedNodeId,
  onSelectNode,
  onAccept,
  onReject,
  onReset,
}: Props) {
  if (sections.length === 0) {
    return (
      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          border: '1px dashed #cbd5e1',
          background: '#f8fafc',
          color: '#64748b',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        No sections to review. Generate a draft first.
      </div>
    );
  }

  return (
    <section
      aria-label="Canvas review overlay"
      style={{ display: 'grid', gap: '10px' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <h3
          style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}
        >
          Section review
        </h3>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {sections.filter((s) => sectionDecisions[s.id] === 'accepted').length}{' '}
          accepted ·{' '}
          {sections.filter((s) => sectionDecisions[s.id] === 'rejected').length}{' '}
          rejected ·{' '}
          {
            sections.filter(
              (s) =>
                !sectionDecisions[s.id] || sectionDecisions[s.id] === 'pending'
            ).length
          }{' '}
          pending
        </span>
      </div>

      {sections.map((section) => {
        const state: ReviewState = sectionDecisions[section.id] ?? 'pending';
        const styles = STATE_STYLES[state];
        const isSelected = selectedNodeId === section.id;

        return (
          <article
            key={section.id}
            aria-label={`Section ${section.componentId}, ${styles.label}`}
            style={{
              border: isSelected ? '2px solid #0f766e' : styles.border,
              borderRadius: '10px',
              background: isSelected ? '#f0fdfa' : styles.background,
              padding: '12px 14px',
              display: 'grid',
              gap: '8px',
              cursor: 'pointer',
              transition: 'box-shadow 0.1s',
              boxShadow: isSelected
                ? '0 0 0 3px rgba(15,118,110,0.15)'
                : 'none',
            }}
            onClick={() => onSelectNode?.(section.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectNode?.(section.id);
              }
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
                {section.componentId}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                #{section.id}
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: styles.badge,
                  color: styles.badgeText,
                }}
              >
                {styles.label}
              </span>
            </div>

            {/* Child count */}
            {section.children.length > 0 && (
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {section.children.length} child node
                {section.children.length !== 1 ? 's' : ''}
              </span>
            )}

            {/* Action row */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                aria-label={`Accept section ${section.componentId}`}
                disabled={state === 'accepted'}
                onClick={() => onAccept(section.id)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: '1px solid #6ee7b7',
                  background: state === 'accepted' ? '#d1fae5' : '#ffffff',
                  color: '#065f46',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: state === 'accepted' ? 'default' : 'pointer',
                  opacity: state === 'accepted' ? 0.6 : 1,
                }}
              >
                ✓ Accept
              </button>
              <button
                type="button"
                aria-label={`Reject section ${section.componentId}`}
                disabled={state === 'rejected'}
                onClick={() => onReject(section.id)}
                style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: '1px solid #fca5a5',
                  background: state === 'rejected' ? '#fee2e2' : '#ffffff',
                  color: '#991b1b',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: state === 'rejected' ? 'default' : 'pointer',
                  opacity: state === 'rejected' ? 0.6 : 1,
                }}
              >
                ✗ Reject
              </button>
              {state !== 'pending' && (
                <button
                  type="button"
                  aria-label={`Reset section ${section.componentId} to pending`}
                  onClick={() => onReset(section.id)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ↺ Reset
                </button>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
