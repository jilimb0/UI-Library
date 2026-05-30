import type { Dispatch, SetStateAction } from 'react';
import type { AnalyticsEvent } from './analytics';
import {
  buildCommentRecord,
  buildPublishEventNote,
  buildPublishRecord,
  createGovernanceEventId,
  formatRepositoryActionNotice,
  updateProjectPublish,
} from './builderMutations';
import { commitProjects, type EditorState } from './editorState';
import type { BuilderProject, CommentRecord, PageVersion } from './types';

export async function publishProject({
  editorContext,
  canManageLifecycle,
  publishGuardReason,
  latestVersion,
  sessionUserId,
  publishServiceCreateEvent,
  refreshActivity,
  clearRecoveryDraft,
  cancelAutosave,
  setEditorState,
  setNotice,
  recordAnalyticsEvent,
}: {
  editorContext: { project: BuilderProject; page: { id: string } } | null;
  canManageLifecycle: boolean;
  publishGuardReason: string | null;
  latestVersion: PageVersion | null;
  sessionUserId: string;
  publishServiceCreateEvent: (input: {
    id: string;
    projectId: string;
    pageId: string | null;
    type: 'published';
    actorId: string;
    createdAt: string;
    sourceVersionId: string | null;
    note: string | null;
  }) => Promise<void>;
  refreshActivity: (pageId: string) => Promise<void>;
  clearRecoveryDraft: () => void;
  cancelAutosave: () => void;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
  recordAnalyticsEvent: (
    name: string,
    category: AnalyticsEvent['category'],
    metadata?: AnalyticsEvent['metadata']
  ) => AnalyticsEvent;
}): Promise<void> {
  recordAnalyticsEvent('publish_attempted', 'builder', {
    projectId: editorContext?.project.id ?? null,
    pageId: editorContext?.page.id ?? null,
  });
  if (!editorContext) {
    setNotice('Open a project page before publishing.');
    return;
  }
  if (!canManageLifecycle) {
    setNotice('Only admins or owners can manage publish lifecycle actions.');
    return;
  }
  if (editorContext.project.publish.status === 'published') {
    setNotice(
      'Project is already live. Unpublish it before creating another release.'
    );
    return;
  }
  if (publishGuardReason) {
    setNotice(`Publish blocked: ${publishGuardReason}`);
    return;
  }
  const publish = buildPublishRecord({
    status: 'published',
    publishedBy: sessionUserId,
    sourceVersionId: latestVersion?.id ?? null,
  });
  setEditorState((prev) =>
    commitProjects(
      prev,
      updateProjectPublish(prev.projects, editorContext.project.id, publish)
    )
  );
  try {
    await publishServiceCreateEvent({
      id: createGovernanceEventId(),
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
      type: 'published',
      actorId: sessionUserId,
      createdAt: new Date().toISOString(),
      sourceVersionId: latestVersion?.id ?? null,
      note: buildPublishEventNote(
        publish,
        latestVersion?.label ?? null,
        'published'
      ),
    });
    await refreshActivity(editorContext.page.id);
    clearRecoveryDraft();
    cancelAutosave();
    setNotice(
      formatRepositoryActionNotice(
        publish.sourceVersionId
          ? `Project published from version ${latestVersion?.label ?? publish.sourceVersionId}.`
          : 'Project published.'
      )
    );
    recordAnalyticsEvent('publish_succeeded', 'builder', {
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
    });
  } catch {
    setNotice(
      'Project state updated locally, but the remote publish event could not be recorded. Retry or check your connection.'
    );
  }
}

export async function unpublishProject({
  editorContext,
  canManageLifecycle,
  sessionUserId,
  publishServiceCreateEvent,
  refreshActivity,
  setEditorState,
  setNotice,
  recordAnalyticsEvent,
}: {
  editorContext: { project: BuilderProject; page: { id: string } } | null;
  canManageLifecycle: boolean;
  sessionUserId: string;
  publishServiceCreateEvent: (input: {
    id: string;
    projectId: string;
    pageId: string | null;
    type: 'unpublished';
    actorId: string;
    createdAt: string;
    sourceVersionId: string | null;
    note: string | null;
  }) => Promise<void>;
  refreshActivity: (pageId: string) => Promise<void>;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
  recordAnalyticsEvent: (
    name: string,
    category: AnalyticsEvent['category'],
    metadata?: AnalyticsEvent['metadata']
  ) => AnalyticsEvent;
}): Promise<void> {
  recordAnalyticsEvent('unpublish_attempted', 'builder', {
    projectId: editorContext?.project.id ?? null,
    pageId: editorContext?.page.id ?? null,
  });
  if (!editorContext) {
    setNotice('Open a project page before changing publish status.');
    return;
  }
  if (!canManageLifecycle) {
    setNotice('Only admins or owners can manage publish lifecycle actions.');
    return;
  }
  if (editorContext.project.publish.status !== 'published') {
    setNotice('Project is already in draft mode.');
    return;
  }
  const publish = buildPublishRecord({
    status: 'draft',
    publishedBy: null,
    sourceVersionId: null,
  });
  setEditorState((prev) =>
    commitProjects(
      prev,
      updateProjectPublish(prev.projects, editorContext.project.id, publish)
    )
  );
  try {
    await publishServiceCreateEvent({
      id: createGovernanceEventId(),
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
      type: 'unpublished',
      actorId: sessionUserId,
      createdAt: new Date().toISOString(),
      sourceVersionId: null,
      note: buildPublishEventNote(publish, null, 'unpublished'),
    });
    await refreshActivity(editorContext.page.id);
    setNotice(
      formatRepositoryActionNotice(
        'Project returned to draft so release changes can continue.'
      )
    );
    recordAnalyticsEvent('unpublish_succeeded', 'builder', {
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
    });
  } catch {
    setNotice(
      'Project returned to draft locally, but the remote unpublish event could not be recorded. Retry or check your connection.'
    );
  }
}

export async function addComment({
  editorContext,
  commentDraft,
  selectedNodeId,
  sessionUserId,
  setComments,
  setCommentDraft,
  createComment,
  refreshActivity,
  setNotice,
}: {
  editorContext: { page: { id: string } } | null;
  commentDraft: string;
  selectedNodeId: string | null;
  sessionUserId: string;
  setComments: Dispatch<SetStateAction<CommentRecord[]>>;
  setCommentDraft: Dispatch<SetStateAction<string>>;
  createComment: (comment: CommentRecord) => Promise<void>;
  refreshActivity: (pageId: string) => Promise<void>;
  setNotice: Dispatch<SetStateAction<string | null>>;
}): Promise<void> {
  if (!editorContext || !commentDraft.trim()) return;
  const provisional = buildCommentRecord({
    pageId: editorContext.page.id,
    nodeId: selectedNodeId,
    body: commentDraft.trim(),
    authorId: sessionUserId,
  });
  setComments((prev) => [...prev, provisional]);
  setCommentDraft('');
  try {
    await createComment(provisional);
    await refreshActivity(editorContext.page.id);
    setNotice('Added comment.');
  } catch {
    setComments((prev) => prev.filter((c) => c.id !== provisional.id));
    setCommentDraft(provisional.body);
    setNotice('Failed to add comment. Please retry.');
  }
}

export async function resolveComment({
  editorContext,
  commentId,
  comments,
  setComments,
  createComment,
  refreshActivity,
  setNotice,
}: {
  editorContext: { page: { id: string } } | null;
  commentId: string;
  comments: CommentRecord[];
  setComments: Dispatch<SetStateAction<CommentRecord[]>>;
  createComment: (comment: CommentRecord) => Promise<void>;
  refreshActivity: (pageId: string) => Promise<void>;
  setNotice: Dispatch<SetStateAction<string | null>>;
}): Promise<void> {
  if (!editorContext) return;
  setComments((prev) =>
    prev.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c))
  );
  try {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;
    const next = { ...target, resolved: !target.resolved };
    await createComment(next);
    await refreshActivity(editorContext.page.id);
  } catch {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      )
    );
    setNotice('Failed to update comment. Please retry.');
  }
}
