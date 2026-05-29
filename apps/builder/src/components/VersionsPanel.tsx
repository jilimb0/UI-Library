import type { PageVersion } from '../types';
import { PanelState } from './PanelState';

type Props = {
  versions: PageVersion[];
  versionDraft: string;
  canSaveVersion: boolean;
  canRestoreVersion: boolean;
  onDraftChange: (value: string) => void;
  onCreateVersion: () => void;
  onRestoreVersion: (versionId: string) => void;
  isLoading?: boolean;
  recoveryMessage?: string | null;
  onRecover?: () => void;
};

export function VersionsPanel({
  versions,
  versionDraft,
  canSaveVersion,
  canRestoreVersion,
  onDraftChange,
  onCreateVersion,
  onRestoreVersion,
  isLoading = false,
  recoveryMessage = null,
  onRecover,
}: Props) {
  const latestVersion = versions[0] ?? null;
  const promptLinkedVersionCount = versions.filter((version) =>
    version.label.startsWith('[Prompt] ')
  ).length;

  return (
    <section className="stack-panel">
      <div className="section-header">
        <div>
          <h3>Versions</h3>
          <p className="muted small">
            Capture named snapshots before risky edits or publish actions. Use a
            <code> [Prompt] </code> prefix when the snapshot should stay linked
            to a prompt-generated draft.
          </p>
          <p className="muted small">
            {versions.length} saved version{versions.length === 1 ? '' : 's'}
            {latestVersion ? ` · latest: ${latestVersion.label}` : ''}
            {promptLinkedVersionCount
              ? ` · ${promptLinkedVersionCount} prompt-linked snapshot${promptLinkedVersionCount === 1 ? '' : 's'}`
              : ''}
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
        {isLoading ? (
          <PanelState
            title="Loading versions"
            description="Fetching saved checkpoints for this page."
            tone="loading"
          />
        ) : recoveryMessage ? (
          <PanelState
            title="Version history needs recovery"
            description={recoveryMessage}
            tone="recovery"
            actionLabel={onRecover ? 'Retry versions' : undefined}
            onAction={onRecover}
          />
        ) : versions.length === 0 ? (
          <PanelState
            title="No saved versions yet"
            description="Save a checkpoint before major edits or prompt regenerations."
          />
        ) : (
          versions.map((version) => (
            <article key={version.id} className="version-card">
              <div>
                <strong>{version.label}</strong>
                <p className="muted small">
                  {new Date(version.createdAt).toLocaleString()}
                  {version.label.startsWith('[Prompt] ')
                    ? ' · prompt-linked snapshot'
                    : ''}
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
