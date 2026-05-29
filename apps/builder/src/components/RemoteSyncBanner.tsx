import type { RepositoryConnectivityStatus } from '../types';

type Props = {
  repositoryConnectivity: RepositoryConnectivityStatus;
  onSwitchToLocal: () => void;
};

export function RemoteSyncBanner({
  repositoryConnectivity,
  onSwitchToLocal,
}: Props) {
  const { mode, state, allowsSafeRemoteActions, recovery, guidance } =
    repositoryConnectivity;

  // Show error banner when Supabase is configured but not safe
  const showRemoteError = mode === 'supabase' && !allowsSafeRemoteActions;

  // Show softer warning for ephemeral memory mode
  const showMemoryWarning = mode === 'memory' && state === 'ephemeral';

  if (!showRemoteError && !showMemoryWarning) return null;

  if (showRemoteError) {
    return (
      <div
        role="alert"
        aria-live="polite"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          display: 'grid',
          gap: 8,
          padding: '10px 16px',
          background: '#fef2f2',
          borderBottom: '1px solid #fca5a5',
          color: '#991b1b',
          fontSize: 13,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'grid', gap: 2 }}>
            <strong>Remote sync is unsafe</strong>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#7f1d1d' }}>
              {recovery}
            </span>
          </div>
          <button
            type="button"
            onClick={onSwitchToLocal}
            style={{
              flexShrink: 0,
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid #991b1b',
              background: '#991b1b',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Switch to local
          </button>
        </div>
        {guidance.length > 0 && (
          <ul
            style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 12,
              color: '#7f1d1d',
              display: 'grid',
              gap: 2,
            }}
          >
            {guidance.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Memory mode — softer informational banner
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        display: 'grid',
        gap: 6,
        padding: '8px 16px',
        background: '#e0f2fe',
        borderBottom: '1px solid #7dd3fc',
        color: '#075985',
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <strong>Ephemeral session — changes are not persisted</strong>
        <button
          type="button"
          onClick={onSwitchToLocal}
          style={{
            flexShrink: 0,
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid #0369a1',
            background: '#0369a1',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Switch to local
        </button>
      </div>
      {guidance.length > 0 && (
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 12,
            color: '#0c4a6e',
            display: 'grid',
            gap: 2,
          }}
        >
          {guidance.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
