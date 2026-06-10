import type { Dispatch, SetStateAction } from 'react';
import { addComment, resolveComment } from './builderPublishCommentActions';
import type { createInitialEditorState } from './editorState';
import type { CommentRecord } from './types';

export function useCommentController({
  commentDraft,
  comments,
  createComment,
  editorContext,
  refreshActivity,
  selectedNodeId,
  sessionUserId,
  setCommentDraft,
  setComments,
  setNotice,
}: {
  commentDraft: string;
  comments: CommentRecord[];
  createComment: (comment: CommentRecord) => Promise<void>;
  editorContext: {
    project: ReturnType<typeof createInitialEditorState>['projects'][number];
    page: { id: string };
  } | null;
  refreshActivity: (pageId: string) => Promise<void>;
  selectedNodeId: string | null;
  sessionUserId: string;
  setCommentDraft: Dispatch<SetStateAction<string>>;
  setComments: Dispatch<SetStateAction<CommentRecord[]>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
}) {
  const handleAddComment = async () =>
    addComment({
      editorContext,
      commentDraft,
      selectedNodeId,
      sessionUserId,
      setComments,
      setCommentDraft,
      createComment,
      refreshActivity,
      setNotice,
    });

  const handleResolveComment = async (commentId: string) =>
    resolveComment({
      editorContext,
      commentId,
      comments,
      setComments,
      createComment,
      refreshActivity,
      setNotice,
    });

  return {
    handleAddComment,
    handleResolveComment,
  };
}
