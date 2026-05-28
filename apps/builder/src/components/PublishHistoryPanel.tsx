import type {
  PublishEventRecord,
  RepositoryConnectivityStatus,
} from '../types';
import { PanelState } from './PanelState';

type Props = {
  events: PublishEventRecord[];
  isLoading?: boolean;
  recoveryMessage?: string | null;
  onRecover?: () => void;
  repositoryStatusLabel?: string;
  repositoryStatusSummary?: string;
  repositoryStatusRecovery?: string | null;
  repositoryConnectivity?: RepositoryConnectivityStatus;
};

export function PublishHistoryPanel({
  events,
  isLoading = false,
  recoveryMessage = null,
  onRecover,
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
    <section className="stack-panel">
      <div className="section-header">
        <div>
          <h3>Publish history</h3>
          <p className="muted small">
            Track publish lifecycle and membership governance actions for this
            project.
          </p>
        </div>
      </div>

      {repositoryStatusLabel ? (
        <PanelState
          title={`Repository state: ${repositoryStatusLabel}`}
          description={
            repositoryStatusSummary ?? 'Repository status is unavailable.'
          }
          tone={repositoryStatusRecovery ? 'recovery' : 'empty'}
          actionLabel={undefined}
          onAction={undefined}
        />
      ) : null}

      {repositoryStatusRecovery ? (
        <PanelState
          title="Publish confidence guidance"
          description={repositoryStatusRecovery}
          tone="recovery"
        />
      ) : null}

      {repositoryMode === 'memory' ? (
        <PanelState
          title="Publish history is session-local"
          description="This session is using an in-memory repository. Publish events disappear after reload unless you reconnect a persisted repository."
          tone="recovery"
        />
      ) : null}

      {repositoryMode === 'local' ? (
        <PanelState
          title="Publish history is local-only"
          description="Lifecycle events are stored only on this device until a remote-backed repository is connected."
          tone="empty"
        />
      ) : null}

      {disconnectedRemote ? (
        <PanelState
          title="Remote publish history is degraded"
          description={
            disconnectedMessage ??
            'Remote repository connectivity is unavailable, so publish history may be stale or incomplete until the connection recovers.'
          }
          tone="recovery"
        />
      ) : null}

      <div className="version-list">
        {isLoading ? (
          <PanelState
            title="Loading publish history"
            description="Refreshing remote and local lifecycle events for this project."
            tone="loading"
          />
        ) : recoveryMessage ? (
          <PanelState
            title="Publish history needs recovery"
            description={recoveryMessage}
            tone="recovery"
            actionLabel={onRecover ? 'Retry publish history' : undefined}
            onAction={onRecover}
          />
        ) : events.length === 0 ? (
          <PanelState
            title="No lifecycle events yet"
            description="Publish actions, restores, and membership governance events appear here once they are recorded."
          />
        ) : (
          events.map((event) => (
            <article key={event.id} className="version-card">
              <div>
                <strong>{event.type}</strong>
                <p className="muted small">
                  {new Date(event.createdAt).toLocaleString()} · {event.actorId}
                  {event.sourceVersionId ? ` · ${event.sourceVersionId}` : ''}
                </p>
                {event.note ? (
                  <p className="muted small">{event.note}</p>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
