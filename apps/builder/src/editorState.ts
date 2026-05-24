import type { BuilderProject, LayoutNode } from './types';

export type EditorState = {
  projects: BuilderProject[];
  history: BuilderProject[][];
  future: BuilderProject[][];
};

export function createInitialEditorState(
  projects: BuilderProject[]
): EditorState {
  return { projects, history: [], future: [] };
}

export function commitProjects(
  state: EditorState,
  projects: BuilderProject[]
): EditorState {
  return {
    projects,
    history: [...state.history.slice(-29), state.projects],
    future: [],
  };
}

export function undoProjects(state: EditorState): EditorState {
  if (state.history.length === 0) return state;
  const previous = state.history[state.history.length - 1];
  return {
    projects: previous,
    history: state.history.slice(0, -1),
    future: [state.projects, ...state.future].slice(0, 30),
  };
}

export function redoProjects(state: EditorState): EditorState {
  if (state.future.length === 0) return state;
  const next = state.future[0];
  return {
    projects: next,
    history: [...state.history.slice(-29), state.projects],
    future: state.future.slice(1),
  };
}

export function updatePageRoot(
  projects: BuilderProject[],
  projectId: string,
  pageId: string,
  updater: (root: LayoutNode) => LayoutNode
): BuilderProject[] {
  return projects.map((project) => {
    if (project.id !== projectId) return project;
    return {
      ...project,
      pages: project.pages.map((page) => {
        if (page.id !== pageId) return page;
        return { ...page, root: updater(page.root) };
      }),
    };
  });
}
