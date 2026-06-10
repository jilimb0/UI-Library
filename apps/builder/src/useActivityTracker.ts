import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect } from 'react';
import { markMemberActivity } from './builderCapabilities';
import { commitProjects, type createInitialEditorState } from './editorState';
import type { BuilderMember } from './types';
import type { EditorContext } from './useEditorContext';

export function useActivityTracker({
  activeMember,
  editorContext,
  refreshActivity,
  setEditorState,
  setNotice,
}: {
  activeMember: BuilderMember | null;
  editorContext: EditorContext | null;
  refreshActivity: (pageId: string) => Promise<void>;
  setEditorState: Dispatch<
    SetStateAction<ReturnType<typeof createInitialEditorState>>
  >;
  setNotice: Dispatch<SetStateAction<string | null>>;
}) {
  const touchMemberActivity = useCallback(
    (pageId: string | null) => {
      if (!editorContext || !activeMember) return;
      setEditorState((prev) =>
        commitProjects(
          prev,
          markMemberActivity(
            prev.projects,
            editorContext.project.id,
            activeMember.userId,
            pageId
          )
        )
      );
    },
    [activeMember, editorContext, setEditorState]
  );

  useEffect(() => {
    if (!editorContext || !activeMember) return;
    touchMemberActivity(editorContext.page.id);
  }, [editorContext?.page.id, editorContext?.project.id, activeMember?.userId]);

  useEffect(() => {
    if (!editorContext) return;
    let active = true;
    refreshActivity(editorContext.page.id).catch(() => {
      if (active) {
        setNotice('Failed to load page activity.');
      }
    });
    return () => {
      active = false;
    };
  }, [editorContext, refreshActivity, setNotice]);

  return { touchMemberActivity };
}
