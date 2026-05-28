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

function eventLabel(event: PublishEventRecord) {
  switch (event.type) {
    case 'published':
      return 'Publish';
    case 'unpublished':
      return 'Unpublish';
    case 'member-added':
      return 'Invite';
    case 'member-role-updated':
      return 'Role change';
    case 'member-removed':
      return 'Member removal';
    case 'restored-version':
      return 'Restore version';
    default:
      return 'Prompt regenerate';
  }
}

export function EventTimelinePanel({
  events,
  repositoryStatusLabel,
  repositoryStatusSummary,
  repositoryStatusRecovery = null,
  repositoryConnectivity,
}: Props) {
  const repositoryMode = repositoryConnectivity?.mode ?? 'local';
  const _disconnectedRemote =
    repositoryMode === 'supabase' &&
    !repositoryConnectivity?.allowsSafeRemoteActions;
  const _disconnectedMessage = repositoryConnectivity?.recovery ?? null;
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

      <div style={{ display: 'grid', gap: 10 }}>
        {events.length ? (
          events.map((event) => (
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
              <strong>{eventLabel(event)}</strong>
              <span style={{ fontSize: 12, color: '#475569' }}>
                {event.createdAt}
              </span>
              <span style={{ fontSize: 13, color: '#0f172a' }}>
                {event.note}
              </span>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                Actor: {event.actorId} · Page: {event.pageId ?? 'project-level'}
              </span>
            </article>
          ))
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
