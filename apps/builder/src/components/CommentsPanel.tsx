import type { CommentRecord } from '../types';

type Props = {
  comments: CommentRecord[];
  commentDraft: string;
  selectedNodeId: string | null;
  canComment: boolean;
  onDraftChange: (value: string) => void;
  onCreateComment: () => void;
  onResolveComment: (commentId: string) => void;
};

export function CommentsPanel({
  comments,
  commentDraft,
  selectedNodeId,
  canComment,
  onDraftChange,
  onCreateComment,
  onResolveComment,
}: Props) {
  const unresolvedCount = comments.filter(
    (comment) => !comment.resolved
  ).length;

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

      <div className="comment-form">
        <textarea
          value={commentDraft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder={
            canComment
              ? 'Add a review comment or implementation note…'
              : 'Commenting is disabled for this role'
          }
          rows={4}
          disabled={!canComment}
        />
        <button
          type="button"
          onClick={onCreateComment}
          disabled={!canComment || !commentDraft.trim()}
        >
          Add comment
        </button>
      </div>

      <div className="comment-list">
        {comments.length === 0 ? (
          <div className="empty-state-inline">
            No comments yet for this page.
          </div>
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
                {!comment.resolved && canComment ? (
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
