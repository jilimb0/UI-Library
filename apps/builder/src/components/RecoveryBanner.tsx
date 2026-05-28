/**
 * RecoveryBanner
 *
 * Shown when the autosave system detected unsaved edits from a previous
 * session. Gives the user two clear choices: restore or discard.
 * Renders as a sticky, attention-coloured bar below the top of the viewport.
 */

type RecoveryBannerProps = {
  summary: string;
  onRestore: () => void;
  onDiscard: () => void;
};

export function RecoveryBanner({
  summary,
  onRestore,
  onDiscard,
}: RecoveryBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        padding: '10px 16px',
        background: '#fffbeb',
        borderBottom: '1px solid #fbbf24',
        color: '#78350f',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <span>
        ⚠️ <strong>Unsaved edits detected.</strong> {summary}
      </span>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          id="autosave-restore-btn"
          type="button"
          onClick={onRestore}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            border: '1px solid #d97706',
            background: '#d97706',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Restore edits
        </button>
        <button
          id="autosave-discard-btn"
          type="button"
          onClick={onDiscard}
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            border: '1px solid #92400e',
            background: 'transparent',
            color: '#92400e',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Discard
        </button>
      </div>
    </div>
  );
}
