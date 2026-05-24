import type { PublishEventRecord } from '../types';

type Props = {
  events: PublishEventRecord[];
};

export function PublishHistoryPanel({ events }: Props) {
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

      <div className="version-list">
        {events.length === 0 ? (
          <div className="empty-state-inline">No lifecycle events yet.</div>
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
