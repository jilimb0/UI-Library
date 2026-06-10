import { useMemo } from 'react';
import type { createInitialEditorState } from './editorState';
import type { BuilderRoute } from './routes';
import { parseEditorRoute } from './routes';

export type EditorContext = {
  project: ReturnType<typeof createInitialEditorState>['projects'][number];
  page: ReturnType<
    typeof createInitialEditorState
  >['projects'][number]['pages'][number];
};

export function useEditorContext({
  projects,
  route,
}: {
  projects: ReturnType<typeof createInitialEditorState>['projects'];
  route: BuilderRoute;
}): EditorContext | null {
  return useMemo(() => {
    const parsed = parseEditorRoute(route);
    if (!parsed) return null;
    const project = projects.find((item) => item.id === parsed.projectId);
    const page = project?.pages.find((item) => item.id === parsed.pageId);
    if (!project || !page) return null;
    return { project, page };
  }, [route, projects]);
}
