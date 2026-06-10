import type { Dispatch, SetStateAction } from 'react';
import { useMemo } from 'react';
import { cancelAutosave, clearRecoveryDraft } from './autosave';
import { restoreVersion, saveVersion } from './builderVersionActions';
import type { createInitialEditorState } from './editorState';
import type { BuilderPage, LayoutNode, PageVersion } from './types';

export function useVersionController({
  canRestoreVersions,
  canSaveVersions,
  createEvent,
  createVersion,
  editorContext,
  refreshActivity,
  sessionUserId,
  setNotice,
  setSelectedNodeId,
  setVersions,
  setVersionsCount,
  updateCurrentPage,
  versionDraft,
  versions,
  versionsCount,
}: {
  canRestoreVersions: boolean;
  canSaveVersions: boolean;
  createEvent: (input: {
    id: string;
    projectId: string;
    pageId: string | null;
    type: 'restored-version';
    actorId: string;
    createdAt: string;
    sourceVersionId: string | null;
    note: string | null;
  }) => Promise<void>;
  createVersion: (version: PageVersion) => Promise<void>;
  editorContext: {
    project: ReturnType<typeof createInitialEditorState>['projects'][number];
    page: BuilderPage;
  } | null;
  refreshActivity: (pageId: string) => Promise<void>;
  sessionUserId: string;
  setNotice: Dispatch<SetStateAction<string | null>>;
  setSelectedNodeId: Dispatch<SetStateAction<string | null>>;
  setVersions: Dispatch<SetStateAction<PageVersion[]>>;
  setVersionsCount: Dispatch<SetStateAction<number>>;
  updateCurrentPage: (updater: (root: LayoutNode) => LayoutNode) => void;
  versionDraft: string;
  versions: PageVersion[];
  versionsCount: number;
}) {
  const latestVersion = useMemo(() => versions[0] ?? null, [versions]);

  const handleSaveVersion = async () => {
    if (!editorContext) return;
    await saveVersion({
      canSaveVersions,
      versionDraft,
      versionsCount,
      editorPageId: editorContext.page.id,
      editorPageRoot: editorContext.page.root,
      sessionUserId,
      setVersions,
      setVersionsCount,
      createVersion,
      refreshActivity,
      clearRecoveryDraft,
      cancelAutosave,
      setNotice,
    });
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!editorContext) return;
    await restoreVersion({
      canRestoreVersions,
      versionId,
      versions,
      editorPageId: editorContext.page.id,
      editorProjectId: editorContext.project.id,
      sessionUserId,
      updateCurrentPage,
      createEvent,
      refreshActivity,
      setSelectedNodeId,
      setNotice,
    });
  };

  return {
    handleRestoreVersion,
    handleSaveVersion,
    latestVersion,
  };
}
