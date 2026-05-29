import type {
  PublishEventRecord,
  RepositoryConnectivityStatus,
} from '../types';
import { PanelState } from './PanelState';

type Props = {
  events: PublishEventRecord[];
  repositoryStatusLabel?: string;
  repositoryStatusSummary?: string;
  repositoryStatusRecovery?: string | null;
  repositoryConnectivity?: RepositoryConnectivityStatus;
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
}

function eventTag(event: PublishEventRecord) {
  if (event.type === 'published') return 'Publish';
  if (event.type === 'unpublished') return 'Draft';
  if (event.type === 'restored-version') return 'Restore';
  if (event.type === 'layout-recovery') return 'Recovery';
  if (event.type === 'autosave-recovery') return 'Autosave';
  if (event.type === 'member-added') return 'Invite';
  if (event.type === 'member-role-updated') return 'Role';
  if (event.type === 'member-removed') return 'Remove';
  return 'Event';
}

function eventTagStyle(tag: string) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  };
  if (tag === 'Publish')
    return { ...base, background: '#dcfce7', color: '#166534' };
  if (tag === 'Draft')
    return { ...base, background: '#fee2e2', color: '#991b1b' };
  if (tag === 'Restore')
    return { ...base, background: '#dbeafe', color: '#1d4ed8' };
  if (tag === 'Recovery')
    return { ...base, background: '#fef3c7', color: '#92400e' };
  if (tag === 'Autosave')
    return { ...base, background: '#e0f2fe', color: '#075985' };
  if (tag === 'Invite')
    return { ...base, background: '#cffafe', color: '#155e75' };
  if (tag === 'Role')
    return { ...base, background: '#fef3c7', color: '#92400e' };
  if (tag === 'Remove')
    return { ...base, background: '#ffe4e6', color: '#9f1239' };
  return { ...base, background: '#e2e8f0', color: '#334155' };
}

function summarizeEvent(event: PublishEventRecord) {
  if (event.type === 'published') {
    const version = event.sourceVersionId;
    return {
      title: 'Project published',
      description: version
        ? `Published from version ${version}.`
        : (event.note ?? 'Published project.'),
    };
  }
  if (event.type === 'unpublished') {
    return {
      title: 'Project returned to draft',
      description: event.note ?? 'Unpublished project.',
    };
  }
  if (event.type === 'restored-version') {
    const version = event.sourceVersionId;
    return {
      title: 'Version restored',
      description: version
        ? `Restored version ${version}.`
        : (event.note ?? 'Restored a prior version.'),
    };
  }
  if (event.type === 'layout-recovery') {
    return {
      title: 'Layout recovered',
      description:
        event.note ??
        'A previous layout state was recovered after an unexpected interruption. Review the canvas to confirm the recovered structure is correct.',
    };
  }
  if (event.type === 'autosave-recovery') {
    return {
      title: 'Autosave draft restored',
      description:
        event.note ??
        'An autosave draft was detected and restored into the editor. The recovered draft reflects the last autosaved checkpoint before the session ended.',
    };
  }
  if (event.type === 'member-added') {
    const email = event.payload?.memberEmail;
    return {
      title: email ? `Invited ${email}` : 'Member invited',
      description: event.note ?? 'Added a project member.',
    };
  }
  if (event.type === 'member-role-updated') {
    const email = event.payload?.memberEmail;
    const fromRole = event.payload?.fromRole;
    const toRole = event.payload?.toRole;
    return {
      title: email ? `Updated ${email} role` : 'Member role updated',
      description:
        fromRole && toRole
          ? `Role changed from ${fromRole} to ${toRole}.`
          : (event.note ?? 'Updated member role.'),
    };
  }
  if (event.type === 'member-removed') {
    const email = event.payload?.memberEmail;
    return {
      title: email ? `Removed ${email}` : 'Member removed',
      description: event.note ?? 'Removed a project member.',
    };
  }
  return {
    title: 'Project event',
    description: event.note ?? 'An event was recorded.',
  };
}

export function EventTimelinePanel({
  events,
  repositoryStatusLabel,
  repositoryStatusSummary,
  repositoryStatusRecovery = null,
  repositoryConnectivity,
}: Props) {
  const repositoryMode = repositoryConnectivity?.mode ?? 'local';
  const disconnectedRemote =
    repositoryMode === 'supabase' &&
    !repositoryConnectivity?.allowsSafeRemoteActions;
  const disconnectedMessage = repositoryConnectivity?.recovery ?? null;
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <div>
        <p className="title">Event timeline</p>
        <p className="muted">
          Audit-style record of publish and governance actions.
        </p>
      </div>

      {repositoryStatusLabel ? (
        <PanelState
          title={`Repository state: ${repositoryStatusLabel}`}
          description={
            repositoryStatusSummary ?? 'Repository status is unavailable.'
          }
          tone={repositoryStatusRecovery ? 'recovery' : 'empty'}
        />
      ) : null}

      {repositoryStatusRecovery ? (
        <PanelState
          title="Timeline confidence guidance"
          description={repositoryStatusRecovery}
          tone="recovery"
        />
      ) : null}

      {disconnectedRemote && disconnectedMessage ? (
        <PanelState
          title="Remote timeline sync is degraded"
          description={disconnectedMessage}
          tone="recovery"
        />
      ) : null}

      <div style={{ display: 'grid', gap: 10 }}>
        {events.length ? (
          events.map((event) =>
            (() => {
              const tag = eventTag(event);
              const summary = summarizeEvent(event);
              return (
                <article
                  key={event.id}
                  style={{
                    display: 'grid',
                    gap: 4,
                    padding: 12,
                    borderRadius: 12,
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={eventTagStyle(tag)}>{tag}</span>
                    <span style={{ fontSize: 12, color: '#475569' }}>
                      {formatTimestamp(event.createdAt)}
                    </span>
                  </div>
                  <strong style={{ color: '#0f172a' }}>{summary.title}</strong>
                  <span style={{ fontSize: 13, color: '#334155' }}>
                    {summary.description}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    Actor: {event.actorId} · Scope:{' '}
                    {event.pageId ?? 'project-level'}
                  </span>
                </article>
              );
            })()
          )
        ) : (
          <PanelState
            title="No governance events recorded yet"
            description="Publish actions, membership changes, and restore activity will appear here once recorded."
          />
        )}
      </div>
    </section>
  );
}
