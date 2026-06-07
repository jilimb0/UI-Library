import type { Dispatch, SetStateAction } from 'react';
import { useMemo } from 'react';
import { recordAnalyticsEvent } from './analytics';
import { cancelAutosave, clearRecoveryDraft } from './autosave';
import {
  getPublishGuardReason,
  getPublishStateGuidance,
  getPublishStateSummary,
} from './builderLifecycle';
import {
  publishProject,
  unpublishProject,
} from './builderPublishCommentActions';
import type { createInitialEditorState } from './editorState';
import type { PageVersion } from './types';

export function usePublishController({
  canManageLifecycle,
  createEvent,
  editorContext,
  latestVersion,
  refreshActivity,
  sessionUserId,
  setEditorState,
  setNotice,
  versionsCount,
}: {
  canManageLifecycle: boolean;
  createEvent: (input: {
    id: string;
    projectId: string;
    pageId: string | null;
    type: 'published' | 'unpublished';
    actorId: string;
    createdAt: string;
    sourceVersionId: string | null;
    note: string | null;
  }) => Promise<void>;
  editorContext: {
    project: ReturnType<typeof createInitialEditorState>['projects'][number];
    page: { id: string };
  } | null;
  latestVersion: PageVersion | null;
  refreshActivity: (pageId: string) => Promise<void>;
  sessionUserId: string;
  setEditorState: Dispatch<
    SetStateAction<ReturnType<typeof createInitialEditorState>>
  >;
  setNotice: Dispatch<SetStateAction<string | null>>;
  versionsCount: number;
}) {
  const publishGuardReason = useMemo(
    () =>
      getPublishGuardReason({
        editorContext,
        versionsCount,
        canManageLifecycle,
      }),
    [canManageLifecycle, editorContext, versionsCount]
  );

  const canPublishProject = canManageLifecycle && publishGuardReason === null;

  const publishStateSummary = getPublishStateSummary({
    editorContext,
    latestVersion,
  });

  const publishStateGuidance = getPublishStateGuidance({
    editorContext,
    canManageLifecycle,
    publishGuardReason,
  });

  const handlePublishProject = async () =>
    publishProject({
      editorContext,
      canManageLifecycle,
      publishGuardReason,
      latestVersion,
      sessionUserId,
      publishServiceCreateEvent: createEvent,
      refreshActivity,
      clearRecoveryDraft,
      cancelAutosave,
      setEditorState,
      setNotice,
      recordAnalyticsEvent,
    });

  const handleUnpublishProject = async () =>
    unpublishProject({
      editorContext,
      canManageLifecycle,
      sessionUserId,
      publishServiceCreateEvent: createEvent,
      refreshActivity,
      setEditorState,
      setNotice,
      recordAnalyticsEvent,
    });

  return {
    canPublishProject,
    handlePublishProject,
    handleUnpublishProject,
    publishGuardReason,
    publishStateGuidance,
    publishStateSummary,
  };
}
