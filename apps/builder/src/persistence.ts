import type {
  BuilderMember,
  BuilderPage,
  BuilderProject,
  LayoutNode,
  SupabaseLikeClient,
} from './types';

// ---------------------------------------------------------------------------
// Corruption guard helpers
// ---------------------------------------------------------------------------

/**
 * Recursively validates a LayoutNode.
 * Accepts the node only when it has a non-empty string id, a non-empty
 * componentId, a props object, and a children array.
 * Any child that fails validation is stripped rather than accepted.
 */
export function isValidLayoutNode(node: unknown): node is LayoutNode {
  if (!node || typeof node !== 'object') return false;
  const n = node as Record<string, unknown>;
  return (
    typeof n.id === 'string' &&
    n.id.trim().length > 0 &&
    typeof n.componentId === 'string' &&
    n.componentId.trim().length > 0 &&
    typeof n.props === 'object' &&
    n.props !== null &&
    Array.isArray(n.children)
  );
}

/**
 * Recursively cleans a LayoutNode: strips children that fail validation
 * and applies the same cleaning to every surviving child.
 */
export function sanitizeLayoutNode(node: LayoutNode): LayoutNode {
  return {
    ...node,
    children: node.children.filter(isValidLayoutNode).map(sanitizeLayoutNode),
  };
}

/**
 * Validates and sanitizes a BuilderPage.
 * Returns null if the page cannot be recovered (missing id, title, or root).
 */
export function sanitizePage(raw: unknown): BuilderPage | null {
  if (!raw || typeof raw !== 'object') return null;
  const source = raw as Record<string, unknown>;

  const id = typeof source.id === 'string' ? source.id.trim() : '';
  const title =
    typeof source.title === 'string' ? source.title : 'Untitled page';

  if (!id) return null;
  if (!isValidLayoutNode(source.root)) return null;

  return {
    id,
    title,
    root: sanitizeLayoutNode(source.root as LayoutNode),
  };
}

export type ProjectRepository = {
  loadProjects: () => Promise<BuilderProject[] | null>;
  saveProjects: (projects: BuilderProject[]) => Promise<void>;
  listProjects: () => Promise<BuilderProject[]>;
  renameProject: (projectId: string, name: string) => Promise<BuilderProject[]>;
  savePage: (projectId: string, page: BuilderPage) => Promise<BuilderProject[]>;
};

function createDefaultMembers(): BuilderMember[] {
  return [
    { userId: 'local-owner', email: 'owner@builder.dev', role: 'owner' },
    { userId: 'local-admin', email: 'admin@builder.dev', role: 'admin' },
    { userId: 'local-editor', email: 'editor@builder.dev', role: 'editor' },
    {
      userId: 'local-commenter',
      email: 'commenter@builder.dev',
      role: 'commenter',
    },
    { userId: 'local-viewer', email: 'viewer@builder.dev', role: 'viewer' },
  ];
}

function createDefaultPublishRecord() {
  return {
    status: 'draft' as const,
    publishedAt: null,
    publishedBy: null,
    sourceVersionId: null,
  };
}

function updateProjectNameInMemory(
  projects: BuilderProject[],
  projectId: string,
  name: string
): BuilderProject[] {
  return projects.map((project) =>
    project.id === projectId ? { ...project, name } : project
  );
}

function upsertPageInMemory(
  projects: BuilderProject[],
  projectId: string,
  page: BuilderPage
): BuilderProject[] {
  return projects.map((project) => {
    if (project.id !== projectId) return project;
    const existing = project.pages.find((item) => item.id === page.id);
    if (!existing) return { ...project, pages: [...project.pages, page] };
    return {
      ...project,
      pages: project.pages.map((item) => (item.id === page.id ? page : item)),
    };
  });
}

function normalizeProjects(rows: unknown): BuilderProject[] {
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => {
    if (!row || typeof row !== 'object') return [];
    const source = row as Record<string, unknown>;
    const publishSource =
      source.publish && typeof source.publish === 'object'
        ? (source.publish as Record<string, unknown>)
        : {};

    const id = String(source.id ?? '');
    if (!id) return [];

    // Validate and sanitize every page — strip pages with corrupt root nodes
    // rather than letting them crash the canvas renderer.
    const rawPages = Array.isArray(source.pages) ? source.pages : [];
    const sanitizedPages: BuilderProject['pages'] = rawPages
      .map(sanitizePage)
      .filter((page): page is BuilderPage => page !== null);

    const project = {
      id,
      name: String(source.name ?? 'Untitled project'),
      pages: sanitizedPages,
      publish: {
        status: publishSource.status === 'published' ? 'published' : 'draft',
        publishedAt:
          typeof publishSource.publishedAt === 'string'
            ? publishSource.publishedAt
            : null,
        publishedBy:
          typeof publishSource.publishedBy === 'string'
            ? publishSource.publishedBy
            : null,
        sourceVersionId:
          typeof publishSource.sourceVersionId === 'string'
            ? publishSource.sourceVersionId
            : null,
      },
      members: Array.isArray(source.members)
        ? (source.members as BuilderMember[])
        : createDefaultMembers(),
    } satisfies BuilderProject;

    return [project];
  });
}

export function createLocalProjectRepository(
  storageKey = 'ui-library-builder-projects'
): ProjectRepository {
  const loadRaw = async (): Promise<BuilderProject[]> => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    try {
      return normalizeProjects(JSON.parse(raw));
    } catch {
      return [];
    }
  };

  const saveRaw = async (projects: BuilderProject[]) => {
    window.localStorage.setItem(storageKey, JSON.stringify(projects));
  };

  return {
    loadProjects: async () => {
      const projects = await loadRaw();
      return projects.length ? projects : null;
    },
    saveProjects: saveRaw,
    listProjects: loadRaw,
    renameProject: async (projectId, name) => {
      const nextProjects = updateProjectNameInMemory(
        await loadRaw(),
        projectId,
        name
      );
      await saveRaw(nextProjects);
      return nextProjects;
    },
    savePage: async (projectId, page) => {
      const nextProjects = upsertPageInMemory(await loadRaw(), projectId, page);
      await saveRaw(nextProjects);
      return nextProjects;
    },
  };
}

export function createInMemoryProjectRepository(
  seed: BuilderProject[] = []
): ProjectRepository {
  let state: BuilderProject[] = seed;

  return {
    loadProjects: async () => (state.length ? state : null),
    saveProjects: async (projects) => {
      state = projects;
    },
    listProjects: async () => state,
    renameProject: async (projectId, name) => {
      state = updateProjectNameInMemory(state, projectId, name);
      return state;
    },
    savePage: async (projectId, page) => {
      state = upsertPageInMemory(state, projectId, page);
      return state;
    },
  };
}

export function createSupabaseProjectRepository(
  client: SupabaseLikeClient
): ProjectRepository {
  return {
    loadProjects: async () => {
      const { data, error } = await client
        .from('builder_projects')
        .select('id, name, pages, publish');
      if (error) throw error;
      const projects = normalizeProjects(data);
      return projects.length ? projects : null;
    },
    saveProjects: async (projects) => {
      const rows = projects.map((project) => ({
        id: project.id,
        name: project.name,
        pages: project.pages,
        publish: project.publish,
      }));
      const { error } = await client.from('builder_projects').upsert(rows);
      if (error) throw error;
    },
    listProjects: async () => {
      const { data, error } = await client
        .from('builder_projects')
        .select('id, name, pages, publish');
      if (error) throw error;
      return normalizeProjects(data);
    },
    renameProject: async (projectId, name) => {
      const projects = normalizeProjects(
        (
          await client
            .from('builder_projects')
            .select('id, name, pages, publish')
        ).data
      );
      const nextProjects = updateProjectNameInMemory(projects, projectId, name);
      const { error } = await client.from('builder_projects').upsert(
        nextProjects.map((project) => ({
          id: project.id,
          name: project.name,
          pages: project.pages,
          publish: project.publish,
        }))
      );
      if (error) throw error;
      return nextProjects;
    },
    savePage: async (projectId, page) => {
      const projects = normalizeProjects(
        (
          await client
            .from('builder_projects')
            .select('id, name, pages, publish')
        ).data
      );
      const nextProjects = upsertPageInMemory(projects, projectId, page);
      const { error } = await client.from('builder_projects').upsert(
        nextProjects.map((project) => ({
          id: project.id,
          name: project.name,
          pages: project.pages,
          publish: project.publish,
        }))
      );
      if (error) throw error;
      return nextProjects;
    },
  };
}

export { createDefaultMembers, createDefaultPublishRecord };
