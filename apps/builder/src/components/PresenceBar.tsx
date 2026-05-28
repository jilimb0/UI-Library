import type { BuilderMember } from '../types';

type PresenceBarProps = {
  members: BuilderMember[];
  activeMemberId: string | null;
};

type PresenceTier = 'editing' | 'recent' | 'idle';

function getMemberTier(member: BuilderMember): PresenceTier {
  if (member.activePageId) return 'editing';
  if (member.lastActiveAt) {
    const elapsed = Date.now() - new Date(member.lastActiveAt).getTime();
    if (elapsed < 5 * 60 * 1000) return 'recent';
  }
  return 'idle';
}

const TIER_STYLES: Record<
  PresenceTier,
  { ring: string; dot: string; label: string }
> = {
  editing: {
    ring: '2px solid #0d9488',
    dot: '#10b981',
    label: 'Editing now',
  },
  recent: {
    ring: '2px solid #f59e0b',
    dot: '#f59e0b',
    label: 'Recently active',
  },
  idle: {
    ring: '2px solid #cbd5e1',
    dot: '#94a3b8',
    label: 'Inactive',
  },
};

function initials(email: string): string {
  const parts = email.split('@')[0].split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function avatarColor(email: string): string {
  // Deterministic hue from email hash
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 42%)`;
}

function formatRecencyLabel(member: BuilderMember): string {
  if (member.activePageId) return 'Editing now';
  if (!member.lastActiveAt) return 'No recent activity';
  const elapsed = Date.now() - new Date(member.lastActiveAt).getTime();
  const minutes = Math.max(1, Math.round(elapsed / 60000));
  if (minutes <= 5) return 'Active just now';
  return `Active ${minutes}m ago`;
}

export function PresenceBar({ members, activeMemberId }: PresenceBarProps) {
  const visible = members.filter(
    (m) => getMemberTier(m) !== 'idle' || m.userId === activeMemberId
  );

  if (visible.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 11,
          color: '#94a3b8',
          padding: '4px 0',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#cbd5e1',
            display: 'inline-block',
          }}
        />
        No active collaborators
      </div>
    );
  }

  const editingNow = members.filter((m) => m.activePageId);
  const recentCount = members.filter(
    (m) => getMemberTier(m) === 'recent'
  ).length;

  return (
    <section
      aria-label="Collaborator presence"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 0',
        flexWrap: 'wrap',
      }}
    >
      {/* Avatar stack */}
      <div style={{ display: 'flex', alignItems: 'center', gap: -4 }}>
        {visible.map((member, i) => {
          const tier = getMemberTier(member);
          const style = TIER_STYLES[tier];
          const isYou = member.userId === activeMemberId;
          const bg = avatarColor(member.email);

          return (
            <div
              key={member.userId}
              title={`${member.email} — ${formatRecencyLabel(member)}${isYou ? ' (you)' : ''}`}
              style={{
                position: 'relative',
                marginLeft: i === 0 ? 0 : -6,
                zIndex: visible.length - i,
              }}
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: bg,
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: style.ring,
                  outlineOffset: 1,
                  boxShadow: '0 0 0 2px #fff',
                  letterSpacing: 0.5,
                  cursor: 'default',
                  userSelect: 'none',
                  opacity: tier === 'idle' ? 0.5 : 1,
                }}
              >
                {initials(member.email)}
              </div>
              {/* Presence dot */}
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: style.dot,
                  border: '1.5px solid #fff',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Summary text */}
      <span style={{ fontSize: 11, color: '#64748b', lineHeight: 1.3 }}>
        {editingNow.length > 0 ? (
          <>
            <span style={{ color: '#0d9488', fontWeight: 600 }}>
              {editingNow.length} editing now
            </span>
            {recentCount > 0 && (
              <span style={{ color: '#94a3b8' }}>
                {' '}
                · {recentCount} recently active
              </span>
            )}
          </>
        ) : recentCount > 0 ? (
          <span style={{ color: '#f59e0b', fontWeight: 500 }}>
            {recentCount} recently active
          </span>
        ) : null}
      </span>
    </section>
  );
}
