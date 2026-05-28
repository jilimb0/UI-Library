import type { CommentRecord, RepositoryConnectivityStatus } from '../types';
import { PanelState } from './PanelState';

type Props = {
  comments: CommentRecord[];
  commentDraft: string;
  selectedNodeId: string | null;
  canComment: boolean;
  onDraftChange: (value: string) => void;
  onCreateComment: () => void;
  onResolveComment: (commentId: string) => void;
  isLoading?: boolean;
  recoveryMessage?: string | null;
  onRecover?: () => void;
  repositoryConnectivity?: RepositoryConnectivityStatus;
};

export function CommentsPanel({
  comments,
  commentDraft,
  selectedNodeId,
  canComment,
  onDraftChange,
  onCreateComment,
  onResolveComment,
  isLoading = false,
  recoveryMessage = null,
  onRecover,
  repositoryConnectivity,
}: Props) {
  const unresolvedCount = comments.filter(
    (comment) => !comment.resolved
  ).length;
  const commentingDisabledByRepository =
    repositoryConnectivity?.mode === 'supabase' &&
    !repositoryConnectivity.allowsSafeRemoteActions;
  const effectiveCanComment = canComment && !commentingDisabledByRepository;
  const repositoryPlaceholder = commentingDisabledByRepository
    ? 'Remote commenting is unavailable until the repository reconnects or leaves stub mode.'
    : canComment
      ? 'Add a review comment or implementation note…'
      : 'Commenting is disabled for this role';

  return (
    <section className="stack-panel">
      <div className="section-header">
        <div>
          <h3>Comments</h3>
          <p className="muted small">
            {unresolvedCount} open · scope:{' '}
            {selectedNodeId ? `node ${selectedNodeId}` : 'page-wide'}
          </p>
        </div>
      </div>

      {repositoryConnectivity ? (
        <PanelState
          title={`Repository state: ${repositoryConnectivity.label}`}
          description={repositoryConnectivity.summary}
          tone={
            repositoryConnectivity.allowsSafeRemoteActions
              ? 'empty'
              : 'recovery'
          }
        />
      ) : null}

      {!repositoryConnectivity?.allowsSafeRemoteActions ? (
        <PanelState
          title="Comment sync guidance"
          description={
            repositoryConnectivity?.recovery ??
            'Comment sync confidence is reduced until repository connectivity recovers.'
          }
          tone="recovery"
        />
      ) : null}

      <div className="comment-form">
        <textarea
          value={commentDraft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder={repositoryPlaceholder}
          rows={4}
          disabled={!effectiveCanComment}
        />
        <button
          type="button"
          onClick={onCreateComment}
          disabled={!effectiveCanComment || !commentDraft.trim()}
        >
          Add comment
        </button>
      </div>

      <div className="comment-list">
        {isLoading ? (
          <PanelState
            title="Loading comments"
            description="Syncing review discussion for this page."
            tone="loading"
          />
        ) : recoveryMessage ? (
          <PanelState
            title="Comments need recovery"
            description={recoveryMessage}
            tone="recovery"
            actionLabel={onRecover ? 'Retry comments' : undefined}
            onAction={onRecover}
          />
        ) : comments.length === 0 ? (
          <PanelState
            title="No comments yet"
            description="Start review on this page or leave an implementation note for collaborators."
          />
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className={`comment-card ${comment.resolved ? 'is-resolved' : ''}`}
            >
              <div className="comment-card__meta">
                <span>
                  {comment.nodeId ? `Node ${comment.nodeId}` : 'Page comment'}
                </span>
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p>{comment.body}</p>
              <div className="comment-card__actions">
                <span
                  className={`badge ${comment.resolved ? 'badge--resolved' : 'badge--open'}`}
                >
                  {comment.resolved ? 'Resolved' : 'Open'}
                </span>
                {!comment.resolved && effectiveCanComment ? (
                  <button
                    type="button"
                    onClick={() => onResolveComment(comment.id)}
                  >
                    Resolve
                  </button>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
