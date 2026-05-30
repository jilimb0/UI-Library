import type { Dispatch, SetStateAction } from 'react';
import { buildVersionRecord } from './builderMutations';
import type { LayoutNode, PageVersion } from './types';

export async function saveVersion({
  canSaveVersions,
  versionDraft,
  versionsCount,
  editorPageId,
  editorPageRoot,
  sessionUserId,
  setVersions,
  setVersionsCount,
  createVersion,
  refreshActivity,
  clearRecoveryDraft,
  cancelAutosave,
  setNotice,
}: {
  canSaveVersions: boolean;
  versionDraft: string;
  versionsCount: number;
  editorPageId: string;
  editorPageRoot: LayoutNode;
  sessionUserId: string;
  setVersions: Dispatch<SetStateAction<PageVersion[]>>;
  setVersionsCount: Dispatch<SetStateAction<number>>;
  createVersion: (version: PageVersion) => Promise<void>;
  refreshActivity: (pageId: string) => Promise<void>;
  clearRecoveryDraft: () => void;
  cancelAutosave: () => void;
  setNotice: Dispatch<SetStateAction<string | null>>;
}): Promise<PageVersion | null> {
  if (!canSaveVersions) {
    setNotice('Current role cannot save versions.');
    return null;
  }
  const versionName = versionDraft.trim() || `Version ${versionsCount + 1}`;
  const provisionalVersion = buildVersionRecord({
    pageId: editorPageId,
    label: versionName,
    snapshot: editorPageRoot,
    authorId: sessionUserId,
  });
  setVersions((prev) => [provisionalVersion, ...prev]);
  setVersionsCount((c) => c + 1);
  try {
    await createVersion(provisionalVersion);
    await refreshActivity(editorPageId);
    clearRecoveryDraft();
    cancelAutosave();
    setNotice('Saved page version.');
    return provisionalVersion;
  } catch {
    setVersions((prev) => prev.filter((v) => v.id !== provisionalVersion.id));
    setVersionsCount((c) => Math.max(0, c - 1));
    setNotice('Failed to save version. Please retry.');
    return null;
  }
}

export async function restoreVersion({
  canRestoreVersions,
  versionId,
  versions,
  editorPageId,
  editorProjectId,
  sessionUserId,
  updateCurrentPage,
  createEvent,
  refreshActivity,
  setSelectedNodeId,
  setNotice,
}: {
  canRestoreVersions: boolean;
  versionId: string;
  versions: PageVersion[];
  editorPageId: string;
  editorProjectId: string;
  sessionUserId: string;
  updateCurrentPage: (updater: (root: LayoutNode) => LayoutNode) => void;
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
  refreshActivity: (pageId: string) => Promise<void>;
  setSelectedNodeId: Dispatch<SetStateAction<string | null>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
}): Promise<void> {
  if (!canRestoreVersions) {
    setNotice('Current role cannot restore saved versions.');
    return;
  }
  const version = versions.find((entry) => entry.id === versionId);
  if (!version) {
    setNotice('Selected version was not found.');
    return;
  }
  updateCurrentPage(() => structuredClone(version.snapshot));
  await createEvent({
    id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    projectId: editorProjectId,
    pageId: editorPageId,
    type: 'restored-version',
    actorId: sessionUserId,
    createdAt: new Date().toISOString(),
    sourceVersionId: version.id,
    note: `Restored version ${version.label}`,
  });
  await refreshActivity(editorPageId);
  setSelectedNodeId(version.snapshot.id);
  setNotice(`Restored version: ${version.label}.`);
}
