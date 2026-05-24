import type { PageVersion } from '../types';

type Props = {
  versions: PageVersion[];
  versionDraft: string;
  canSaveVersion: boolean;
  canRestoreVersion: boolean;
  onDraftChange: (value: string) => void;
  onCreateVersion: () => void;
  onRestoreVersion: (versionId: string) => void;
};

export function VersionsPanel({
  versions,
  versionDraft,
  canSaveVersion,
  canRestoreVersion,
  onDraftChange,
  onCreateVersion,
  onRestoreVersion,
}: Props) {
  return (
    <section className="stack-panel">
      <div className="section-header">
        <div>
          <h3>Versions</h3>
          <p className="muted small">
            Capture named snapshots before risky edits or publish actions.
          </p>
        </div>
      </div>

      <div className="version-form">
        <input
          type="text"
          value={versionDraft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Version label"
          disabled={!canSaveVersion}
        />
        <button
          type="button"
          onClick={onCreateVersion}
          disabled={!canSaveVersion}
        >
          Save version
        </button>
      </div>

      <div className="version-list">
        {versions.length === 0 ? (
          <div className="empty-state-inline">No saved versions yet.</div>
        ) : (
          versions.map((version) => (
            <article key={version.id} className="version-card">
              <div>
                <strong>{version.label}</strong>
                <p className="muted small">
                  {new Date(version.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRestoreVersion(version.id)}
                disabled={!canRestoreVersion}
              >
                Restore
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
