import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  cancelAutosave,
  clearRecoveryDraft,
  flushAutosave,
  hasRecoverableDraft,
  loadRecoveryDraft,
  scheduleAutosave,
} from './autosave';
import { createDataServices } from './dataServices';
import { createInitialEditorState } from './editorState';
import { mockProjects } from './mockData';
import { createBuilderSupabaseClient } from './repositoryFactory';
import type { CommentRecord, PageVersion, PublishEventRecord } from './types';

export type BuilderDataController = {
  editorState: ReturnType<typeof createInitialEditorState>;
  setEditorState: Dispatch<
    SetStateAction<ReturnType<typeof createInitialEditorState>>
  >;
  projects: ReturnType<typeof createInitialEditorState>['projects'];
  notice: string | null;
  setNotice: Dispatch<SetStateAction<string | null>>;
  versions: PageVersion[];
  setVersions: Dispatch<SetStateAction<PageVersion[]>>;
  setVersionsCount: Dispatch<SetStateAction<number>>;
  comments: CommentRecord[];
  setComments: Dispatch<SetStateAction<CommentRecord[]>>;
  publishEvents: PublishEventRecord[];
  versionsCount: number;
  commentsCount: number;
  versionDraft: string;
  setVersionDraft: Dispatch<SetStateAction<string>>;
  refreshActivity: (pageId: string) => Promise<void>;
  /** Whether there is an autosave recovery draft available to restore */
  hasAutosaveRecovery: boolean;
  /** Restore projects from the autosave recovery draft and clear it */
  restoreAutosaveDraft: () => void;
  /** Discard the autosave recovery draft without restoring */
  discardAutosaveDraft: () => void;
};

export function useBuilderDataController(
  repositoryMode?: string
): BuilderDataController {
  const supabaseClient = useMemo(() => createBuilderSupabaseClient(), []);
  const services = useMemo(
    () => createDataServices({ supabaseClient }),
    [supabaseClient, repositoryMode]
  );
  const repository = services.projects;
  const [editorState, setEditorState] = useState(() =>
    createInitialEditorState(mockProjects)
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [versionDraft, setVersionDraft] = useState('');
  const [versionsCount, setVersionsCount] = useState(0);
  const [_commentsCount, setCommentsCount] = useState(0);
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [_comments, setComments] = useState<CommentRecord[]>([]);
  const [publishEvents, setPublishEvents] = useState<PublishEventRecord[]>([]);
  const [hasAutosaveRecovery, setHasAutosaveRecovery] = useState(() =>
    hasRecoverableDraft()
  );

  const projects = editorState.projects;

  useEffect(() => {
    let active = true;
    repository.loadProjects().then(async (loaded) => {
      if (!active) return;
      const hydrated = loaded
        ? await Promise.all(
            loaded.map(async (project) => {
              const persistedMembers = await services.members.listMembers(
                project.id
              );
              return persistedMembers.length > 0
                ? { ...project, members: persistedMembers }
                : project;
            })
          )
        : [];

      setEditorState((prev) => {
        const merged = [...hydrated];
        for (const existing of prev.projects) {
          if (!merged.some((p) => p.id === existing.id)) {
            merged.push(existing);
          }
        }
        return createInitialEditorState(
          merged.length > 0 ? merged : mockProjects
        );
      });
    });
    return () => {
      active = false;
    };
  }, [repository, services.members]);

  // Persist to repository and schedule autosave on every projects change.
  useEffect(() => {
    repository.saveProjects(projects);
    // Autosave a recovery draft — activePageId is unknown at this layer,
    // so we pass null and let the editor controller refine it if needed.
    scheduleAutosave(projects, null);
  }, [projects, repository]);

  useEffect(() => {
    return () => {
      flushAutosave(projects, null);
    };
  }, [projects]);

  const refreshActivity = useCallback(
    async (pageId: string) => {
      const projectId = projects.find((project) =>
        project.pages.some((page) => page.id === pageId)
      )?.id;
      const [nextVersions, nextComments, nextPublishEvents] = await Promise.all(
        [
          services.versions.listVersions(pageId),
          services.comments.listComments(pageId),
          projectId
            ? services.publishEvents.listEvents(projectId)
            : Promise.resolve([]),
        ]
      );
      setVersions(nextVersions);
      setComments(nextComments);
      setPublishEvents(nextPublishEvents);
      setVersionsCount(nextVersions.length);
      setCommentsCount(nextComments.length);
      setVersionDraft(`Version ${nextVersions.length + 1}`);
    },
    [projects, services]
  );

  const restoreAutosaveDraft = useCallback(() => {
    const draft = loadRecoveryDraft();
    if (!draft) return;
    setEditorState(createInitialEditorState(draft.projects));
    clearRecoveryDraft();
    cancelAutosave();
    setHasAutosaveRecovery(false);
    setNotice('Restored unsaved edits from autosave draft.');
  }, []);

  const discardAutosaveDraft = useCallback(() => {
    clearRecoveryDraft();
    cancelAutosave();
    setHasAutosaveRecovery(false);
    setNotice('Autosave draft discarded.');
  }, []);

  return {
    editorState,
    setEditorState,
    projects,
    notice,
    setNotice,
    versions,
    setVersions,
    setVersionsCount,
    comments: _comments,
    setComments,
    publishEvents,
    versionsCount,
    commentsCount: _commentsCount,
    versionDraft,
    setVersionDraft,
    refreshActivity,
    hasAutosaveRecovery,
    restoreAutosaveDraft,
    discardAutosaveDraft,
  };
}
