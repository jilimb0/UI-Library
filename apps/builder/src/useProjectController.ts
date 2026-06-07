import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { createPageScaffold } from './builderCapabilities';
import { commitProjects, type createInitialEditorState } from './editorState';
import type { BuilderRoute } from './routes';
import { parseRoute } from './routes';
import type { BuilderPage } from './types';

export function useProjectController({
  editorContext,
  projects: _projects,
  setEditorState,
  setNotice,
  setRoute,
  setSelectedNodeId,
}: {
  editorContext: {
    project: ReturnType<typeof createInitialEditorState>['projects'][number];
    page: BuilderPage;
  } | null;
  projects: ReturnType<typeof createInitialEditorState>['projects'];
  setEditorState: Dispatch<
    SetStateAction<ReturnType<typeof createInitialEditorState>>
  >;
  setNotice: Dispatch<SetStateAction<string | null>>;
  setRoute: Dispatch<SetStateAction<BuilderRoute>>;
  setSelectedNodeId: Dispatch<SetStateAction<string | null>>;
}) {
  const [projectRenameDraft, setProjectRenameDraft] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');

  const handleRenameProject = async () => {
    if (!editorContext || !projectRenameDraft.trim()) return;
    const nextName = projectRenameDraft.trim();
    setEditorState((prev) => {
      const nextProjects = prev.projects.map((project) =>
        project.id === editorContext.project.id
          ? { ...project, name: nextName }
          : project
      );
      return commitProjects(prev, nextProjects);
    });
    setProjectRenameDraft('');
    setNotice('Project renamed.');
  };

  const handleCreatePage = async () => {
    if (!editorContext || !newPageTitle.trim()) return;
    const title = newPageTitle.trim();
    const pageId =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `page-${Date.now()}`;
    const nextPage = createPageScaffold(pageId, title);
    setEditorState((prev) => {
      const nextProjects = prev.projects.map((project) =>
        project.id === editorContext.project.id
          ? { ...project, pages: [...project.pages, nextPage] }
          : project
      );
      return commitProjects(prev, nextProjects);
    });
    setNewPageTitle('');
    setNotice('Created page scaffold.');
    setRoute(
      parseRoute(`/projects/${editorContext.project.id}/pages/${pageId}`)
    );
    setSelectedNodeId(null);
  };

  return {
    handleCreatePage,
    handleRenameProject,
    newPageTitle,
    projectRenameDraft,
    setNewPageTitle,
    setProjectRenameDraft,
  };
}
