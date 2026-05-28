import {
  generatePromptDraft,
  toBuilderCompatibleProject,
} from '@ui-construction-library/prompt-engine';
import { foundationalComponents } from '@ui-construction-library/registry';
import { validateRequiredShape } from '@ui-construction-library/schema';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { recordAnalyticsEvent } from './analytics';
import {
  canComment as canCommentOnProject,
  canEditLayout,
  canManagePublishLifecycle,
  canRestoreVersion,
  canSaveVersion,
  createSessionFromMember,
  createSessionRepository,
} from './auth';
import {
  cancelAutosave,
  clearRecoveryDraft,
  hasRecoverableDraft,
  loadRecoveryDraft,
  scheduleAutosave,
} from './autosave';
import { createDataServices } from './dataServices';
import {
  commitProjects,
  createInitialEditorState,
  redoProjects,
  undoProjects,
  updatePageRoot,
} from './editorState';
import { getInsertionBlockReason } from './insertionRules';
import {
  canAcceptProjectInvite,
  canAddProjectMember,
  canChangeProjectMemberRole,
  canRemoveProjectMember,
} from './memberPolicy';
import { mockProjects } from './mockData';
import { createBuilderSupabaseClient } from './repositoryFactory';
import { type BuilderRoute, parseEditorRoute, parseRoute } from './routes';
import {
  getSupabaseConnectionStatus,
  getSupabaseSessionIdentity,
} from './supabaseClient';
import {
  addChildNode,
  duplicateNode,
  findNode,
  removeNode,
  updateNodeProps,
} from './tree';
import type {
  BuilderMember,
  BuilderPage,
  BuilderProject,
  BuilderRole,
  CommentRecord,
  LayoutNode,
  PageVersion,
  PublishEventRecord,
  PublishRecord,
} from './types';

function walkNodes(root: LayoutNode): LayoutNode[] {
  return [root, ...root.children.flatMap(walkNodes)];
}

export function canPublishCurrentProject({
  editorContext,
  versionsCount,
}: {
  editorContext: { project: BuilderProject; page: BuilderPage } | null;
  versionsCount: number;
}): string | null {
  if (!editorContext) return 'Open a project page before publishing.';
  if (editorContext.project.publish.status === 'published')
    return 'Project is already published.';
  if (versionsCount === 0)
    return 'Save at least one version before publishing.';

  const hasInvalidNode = editorContext.project.pages.some((page) =>
    walkNodes(page.root).some((node) => {
      const meta = foundationalComponents.find(
        (component) => component.id === node.componentId
      );
      if (!meta) return false;
      return !validateRequiredShape('layout', node);
    })
  );

  if (hasInvalidNode)
    return 'Resolve required prop validation issues before publishing.';
  return null;
}

function createVersionId() {
  return `version-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function updateProjectPublish(
  projects: BuilderProject[],
  projectId: string,
  publish: PublishRecord
): BuilderProject[] {
  return projects.map((project) =>
    project.id === projectId ? { ...project, publish } : project
  );
}

function createCommentId() {
  return `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatRepositoryActionNotice(base: string) {
  const status = getSupabaseConnectionStatus();

  if (status.mode === 'configured') {
    return `${base} ${status.summary}`;
  }

  if (status.mode === 'partial') {
    return `${base} Remote repository setup is incomplete, so this result should not be treated as authoritative yet.`;
  }

  return `${base} This change is only stored in the local Supabase stub until remote credentials are configured.`;
}

function markMemberActivity(
  projects: BuilderProject[],
  projectId: string,
  memberId: string,
  pageId: string | null
): BuilderProject[] {
  const timestamp = new Date().toISOString();

  return projects.map((project) =>
    project.id === projectId
      ? {
          ...project,
          members: project.members.map((member) =>
            member.userId === memberId
              ? {
                  ...member,
                  lastActiveAt: timestamp,
                  activePageId: pageId,
                }
              : member
          ),
        }
      : project
  );
}

function navigate(path: string) {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', buildBrowserBuilderUrl(parseRoute(path)));
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function getBrowserBuilderRoute(): BuilderRoute | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  const builderIndex = path.indexOf('/builder');
  if (builderIndex === -1) return null;

  const builderPath = path.slice(builderIndex + '/builder'.length) || '/';
  return parseRoute(builderPath);
}

function buildBrowserBuilderUrl(route: BuilderRoute): string {
  if (typeof window === 'undefined') return route;
  const path = window.location.pathname;
  const builderIndex = path.indexOf('/builder');
  const builderBase =
    builderIndex === -1
      ? '/builder'
      : path.slice(0, builderIndex + '/builder'.length);

  return route === '/' ? builderBase : `${builderBase}${route}`;
}

export function createPageScaffold(pageId: string, title: string): BuilderPage {
  return {
    id: pageId,
    title,
    root: {
      id: `${pageId}-root`,
      componentId: 'card',
      props: {
        title,
        body: 'New page scaffold',
      },
      children: [],
    },
  };
}

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

export type BuilderRoleCapabilities = {
  canEdit: boolean;
  canComment: boolean;
  canSaveVersions: boolean;
  canRestoreVersions: boolean;
  canManageLifecycle: boolean;
};

export function resolveBuilderRoleCapabilities(
  role: BuilderRole
): BuilderRoleCapabilities {
  const session = createSessionFromMember({
    userId: `cap-${role}`,
    email: `${role}@builder.dev`,
    role,
  });
  return {
    canEdit: canEditLayout(session),
    canComment: canCommentOnProject(session),
    canSaveVersions: canSaveVersion(session),
    canRestoreVersions: canRestoreVersion(session),
    canManageLifecycle: canManagePublishLifecycle(session),
  };
}

type PromptDraftOverrides = {
  productType?: string;
  targetAudience?: string;
  sections?: readonly string[];
  styleTone?: string;
  density?: 'balanced' | 'dense' | 'spacious';
  domain?: string;
  frameworkPreference?: 'react';
  detailLevel?: 'medium' | 'high';
  generationMode?:
    | 'landing-page'
    | 'dashboard'
    | 'docs-page'
    | 'pricing-page'
    | 'settings-page'
    | 'marketing-section';
};

type BuilderEditorController = {
  projectMembers: BuilderMember[];
  activeMember: BuilderMember | null;
  memberPresenceSummary: string;
  newMemberEmail: string;
  setNewMemberEmail: Dispatch<SetStateAction<string>>;
  newMemberRole: BuilderRole;
  setNewMemberRole: Dispatch<SetStateAction<BuilderRole>>;
  canPublishProject: boolean;
  canManageLifecycle: boolean;
  canSaveVersions: boolean;
  canRestoreVersions: boolean;
  isGeneratingDraft: boolean;
  sessionRole: BuilderRole;
  sessionMemberId: string;
  setSessionMemberId: Dispatch<SetStateAction<string>>;
  publishGuardReason: string | null;
  publishStateSummary: string;
  publishStateGuidance: string[];
  latestVersion: PageVersion | null;
  publishEvents: PublishEventRecord[];
  handlePublishProject: () => Promise<void>;
  handleUnpublishProject: () => Promise<void>;
  route: BuilderRoute;
  selectedNodeId: string | null;
  setSelectedNodeId: Dispatch<SetStateAction<string | null>>;
  projectRenameDraft: string;
  setProjectRenameDraft: Dispatch<SetStateAction<string>>;
  newPageTitle: string;
  setNewPageTitle: Dispatch<SetStateAction<string>>;
  commentDraft: string;
  setCommentDraft: Dispatch<SetStateAction<string>>;
  canEdit: boolean;
  canComment: boolean;
  editorContext: {
    project: ReturnType<typeof createInitialEditorState>['projects'][number];
    page: BuilderPage;
  } | null;
  selectedNode: LayoutNode | null;
  selectedMeta: (typeof foundationalComponents)[number] | null;
  navigate: (nextPath: string) => void;
  handleRenameProject: () => Promise<void>;
  handleCreatePage: () => Promise<void>;
  handleGenerateProjectDraft: (promptOverrides?: PromptDraftOverrides) => void;
  handleInsertComponent: (componentId: string) => void;
  handleDuplicateSelected: () => void;
  handleRemoveSelected: () => void;
  handleUpdateProps: (nodeId: string, key: string, value: string) => void;
  handleSaveVersion: () => Promise<void>;
  handleRestoreVersion: (versionId: string) => Promise<void>;
  handleAddComment: () => Promise<void>;
  handleResolveComment: (commentId: string) => Promise<void>;
  acceptedInviteEmail: string;
  setAcceptedInviteEmail: Dispatch<SetStateAction<string>>;
  handleAddMember: () => Promise<void>;
  handleAcceptInvite: () => Promise<void>;
  handleUpdateMemberRole: (
    memberId: string,
    role: BuilderRole
  ) => Promise<void>;
  handleRemoveMember: (memberId: string) => Promise<void>;
  pendingMemberAction: null | {
    type: 'add' | 'update' | 'remove';
    memberId?: string;
    email?: string;
    role?: BuilderRole;
  };
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

export function useBuilderEditorController({
  projects,
  setEditorState,
  setNotice,
  refreshActivity,
  versions,
  setVersions,
  setVersionsCount,
  comments: _comments,
  setComments,
  publishEvents,
  versionsCount,
  commentsCount: _commentsCount,
  versionDraft,
  commentDraft,
  setCommentDraft,
}: {
  projects: ReturnType<typeof createInitialEditorState>['projects'];
  setEditorState: Dispatch<
    SetStateAction<ReturnType<typeof createInitialEditorState>>
  >;
  setNotice: Dispatch<SetStateAction<string | null>>;
  refreshActivity: (pageId: string) => Promise<void>;
  versions: PageVersion[];
  setVersions: Dispatch<SetStateAction<PageVersion[]>>;
  setVersionsCount: Dispatch<SetStateAction<number>>;
  comments: CommentRecord[];
  setComments: Dispatch<SetStateAction<CommentRecord[]>>;
  publishEvents: PublishEventRecord[];
  versionsCount: number;
  commentsCount: number;
  versionDraft: string;
  commentDraft: string;
  setCommentDraft: Dispatch<SetStateAction<string>>;
}): BuilderEditorController {
  const sessionRepository = useMemo(() => createSessionRepository(), []);
  const [route, setRoute] = useState<BuilderRoute>(() => {
    const browserRoute = getBrowserBuilderRoute();
    // If the browser URL is just the bare builder root (/), don't use it as the route —
    // fall back to the last session route or default to /projects.
    if (browserRoute && browserRoute !== '/') return browserRoute;
    if (
      typeof window !== 'undefined' &&
      window.location.search.includes('landing=true')
    ) {
      return '/';
    }
    const savedRoute = sessionRepository.loadRoute();
    if (savedRoute) return parseRoute(savedRoute);
    return '/projects';
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [projectRenameDraft, setProjectRenameDraft] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<BuilderRole>('viewer');
  const [acceptedInviteEmail, setAcceptedInviteEmail] = useState('');
  const [pendingMemberAction, setPendingMemberAction] = useState<null | {
    type: 'add' | 'update' | 'remove';
    memberId?: string;
    email?: string;
    role?: BuilderRole;
  }>(null);
  const supabaseClient = createBuilderSupabaseClient();
  const services = createDataServices({ supabaseClient });
  const publishService = services.publishEvents;
  const [sessionMemberId, setSessionMemberId] = useState(
    () => sessionRepository.loadSessionMemberId() ?? 'local-owner'
  );

  const editorContext = useMemo(() => {
    const parsed = parseEditorRoute(route);
    if (!parsed) return null;
    const project = projects.find((item) => item.id === parsed.projectId);
    const page = project?.pages.find((item) => item.id === parsed.pageId);
    if (!project || !page) return null;
    return { project, page };
  }, [route, projects]);

  const projectMembers = editorContext?.project.members ?? [];
  const activeMember =
    projectMembers.find((member) => member.userId === sessionMemberId) ??
    projectMembers[0] ??
    null;

  const touchMemberActivity = (pageId: string | null) => {
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
  };
  const sessionRole =
    (globalThis as any).__E2E_ROLE__ ?? activeMember?.role ?? 'viewer';
  const session = useMemo(() => {
    const supabaseIdentity = getSupabaseSessionIdentity();

    if (activeMember) {
      return {
        ...createSessionFromMember(activeMember, supabaseIdentity.provider),
        role: (globalThis as any).__E2E_ROLE__ ?? activeMember.role,
      };
    }

    return createSessionFromMember(
      {
        userId:
          supabaseIdentity.status === 'authenticated'
            ? supabaseIdentity.userId
            : 'local-viewer',
        email:
          supabaseIdentity.status === 'authenticated'
            ? supabaseIdentity.email
            : 'viewer@builder.dev',
        role: (globalThis as any).__E2E_ROLE__ ?? 'viewer',
      },
      supabaseIdentity.provider
    );
  }, [activeMember]);
  const roleCapabilities = useMemo(
    () => resolveBuilderRoleCapabilities(sessionRole),
    [sessionRole]
  );
  const {
    canEdit,
    canComment,
    canManageLifecycle,
    canSaveVersions,
    canRestoreVersions,
  } = roleCapabilities;

  useEffect(() => {
    if (projectMembers.length === 0) {
      sessionRepository.clearSessionMemberId();
      return;
    }
    if (!projectMembers.some((member) => member.userId === sessionMemberId)) {
      const fallbackMemberId = projectMembers[0].userId;
      setSessionMemberId(fallbackMemberId);
      sessionRepository.saveSessionMemberId(fallbackMemberId);
      return;
    }
    sessionRepository.saveSessionMemberId(sessionMemberId);
  }, [projectMembers, sessionMemberId, sessionRepository]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const browserRoute = getBrowserBuilderRoute();
    if (browserRoute !== route) {
      window.history.replaceState(null, '', buildBrowserBuilderUrl(route));
    }
  }, [route]);

  useEffect(() => {
    if (!editorContext || !activeMember) return;
    touchMemberActivity(editorContext.page.id);
  }, [editorContext?.page.id, editorContext?.project.id, activeMember?.userId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = () => {
      setRoute(getBrowserBuilderRoute() ?? '/projects');
      setSelectedNodeId(null);
      setNotice(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [setNotice]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey;
      if (!modifier || event.key.toLowerCase() !== 'z') return;
      event.preventDefault();
      if (event.shiftKey) {
        setEditorState((prev) => redoProjects(prev));
      } else {
        setEditorState((prev) => undoProjects(prev));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setEditorState]);

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

  const selectedNode = useMemo(() => {
    if (!editorContext || !selectedNodeId) return null;
    return findNode(editorContext.page.root, selectedNodeId) ?? null;
  }, [editorContext, selectedNodeId]);

  const selectedMeta = useMemo(() => {
    if (!selectedNode) return null;
    return (
      foundationalComponents.find(
        (component) => component.id === selectedNode.componentId
      ) ?? null
    );
  }, [selectedNode]);

  const latestVersion = versions[0] ?? null;
  const publishGuardReason = useMemo(
    () => canPublishCurrentProject({ editorContext, versionsCount }),
    [editorContext, versionsCount]
  );
  const effectivePublishGuardReason = !canManageLifecycle
    ? 'Only admins or owners can manage publish lifecycle actions.'
    : publishGuardReason;
  const canPublishProject = canManageLifecycle && publishGuardReason === null;
  const publishStateSummary = !editorContext
    ? 'Open a project page to review release readiness.'
    : editorContext.project.publish.status === 'published'
      ? latestVersion
        ? `Published from version ${latestVersion.label}.`
        : 'Project is published and can be returned to draft if more edits are needed.'
      : latestVersion
        ? `Latest saved version: ${latestVersion.label}.`
        : 'No saved version yet. Create a version before publishing.';
  const publishStateGuidance = !editorContext
    ? ['Select a project page to unlock publish lifecycle actions.']
    : !canManageLifecycle
      ? [
          'Publishing is restricted to admins and owners in this workspace.',
          'Ask a project owner to publish or change your role if you need release access.',
        ]
      : editorContext.project.publish.status === 'published'
        ? [
            'Use unpublish to return the project to draft before making another release pass.',
            'Review publish history to confirm who shipped the current state and from which version.',
          ]
        : publishGuardReason
          ? [
              `Blocked: ${publishGuardReason}`,
              'Resolve the release blocker above, then try publishing again.',
            ]
          : [
              'Release checks passed. Publishing will stamp the current saved version onto the project.',
              'Use the publish history panel to verify the event after release.',
            ];

  const updateCurrentPage = (updater: (root: LayoutNode) => LayoutNode) => {
    if (!editorContext) return;
    setEditorState((prev) => {
      const nextProjects = updatePageRoot(
        prev.projects,
        editorContext.project.id,
        editorContext.page.id,
        updater
      );
      return commitProjects(prev, nextProjects);
    });
  };

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

  const handleGenerateProjectDraft = (
    promptOverrides?: PromptDraftOverrides
  ) => {
    if (isGeneratingDraft) return;

    const productType = promptOverrides?.productType ?? 'UI Starter';
    const targetAudience = promptOverrides?.targetAudience ?? 'product teams';
    const sections = promptOverrides?.sections ?? ['hero', 'features', 'cta'];
    const styleTone = promptOverrides?.styleTone ?? 'confident';
    const density = promptOverrides?.density ?? 'balanced';
    const domain = promptOverrides?.domain ?? 'ui tooling';
    const detailLevel = promptOverrides?.detailLevel ?? 'medium';
    const generationMode = promptOverrides?.generationMode ?? 'landing-page';

    setIsGeneratingDraft(true);
    setNotice('Generating prompt draft project...');

    window.setTimeout(() => {
      try {
        const result = generatePromptDraft({
          productType,
          targetAudience,
          sections: [...sections],
          styleTone,
          density: density === 'dense' ? 'compact' : density,
          domain,
          frameworkPreference: 'react',
          detailLevel,
          generationMode:
            generationMode === 'docs-page' || generationMode === 'settings-page'
              ? 'dashboard'
              : generationMode === 'pricing-page'
                ? 'landing-page'
                : generationMode,
        });
        const generatedProject = toBuilderCompatibleProject(result.draft);

        setEditorState((prev) => {
          const withoutExisting = prev.projects.filter(
            (project) => project.id !== generatedProject.id
          );
          return commitProjects(prev, [...withoutExisting, generatedProject]);
        });
        setNotice('Generated prompt draft project.');
        setRoute(
          parseRoute(
            `/projects/${generatedProject.id}/pages/${generatedProject.pages[0]?.id ?? 'generated-page-1'}`
          )
        );
        setSelectedNodeId(generatedProject.pages[0]?.root.id ?? null);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Failed to generate prompt draft project.';
        setNotice(message);
      } finally {
        setIsGeneratingDraft(false);
      }
    }, 0);
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

  const handleInsertComponent = (componentId: string) => {
    if (!editorContext) return;
    const reason = getInsertionBlockReason(
      foundationalComponents,
      componentId,
      editorContext.page.root
    );
    if (reason) {
      setNotice(reason);
      return;
    }
    const nextNode: LayoutNode = {
      id: `${componentId}-${Date.now()}`,
      componentId,
      props: {},
      children: [],
    };
    updateCurrentPage((root) => addChildNode(root, root.id, nextNode));
    touchMemberActivity(editorContext.page.id);
    setSelectedNodeId(nextNode.id);
    setNotice('Inserted component.');
  };

  const handleDuplicateSelected = () => {
    if (!editorContext || !selectedNodeId) return;
    updateCurrentPage((root) =>
      duplicateNode(root, selectedNodeId, Date.now().toString(36))
    );
    touchMemberActivity(editorContext.page.id);
    setNotice('Duplicated selected node.');
  };

  const handleRemoveSelected = () => {
    if (!editorContext || !selectedNodeId) return;
    updateCurrentPage((root) => removeNode(root, selectedNodeId));
    touchMemberActivity(editorContext.page.id);
    setSelectedNodeId(null);
    setNotice('Removed selected node.');
  };

  const handleUpdateProps = (nodeId: string, key: string, value: string) => {
    if (!editorContext) return;
    updateCurrentPage((root) =>
      updateNodeProps(root, nodeId, { [key]: value })
    );
    touchMemberActivity(editorContext.page.id);
  };

  const handleSaveVersion = async () => {
    if (!editorContext) return;
    if (!canSaveVersions) {
      setNotice('Current role cannot save versions.');
      return;
    }
    const versionName = versionDraft.trim() || `Version ${versionsCount + 1}`;
    const provisionalVersion: PageVersion = {
      id: createVersionId(),
      pageId: editorContext.page.id,
      label: versionName,
      snapshot: structuredClone(editorContext.page.root),
      authorId: session.userId,
      createdAt: new Date().toISOString(),
    };
    // Optimistic: show version immediately before remote confirms
    setVersions((prev) => [provisionalVersion, ...prev]);
    setVersionsCount((c) => c + 1);
    try {
      await services.versions.createVersion(provisionalVersion);
      await refreshActivity(editorContext.page.id);
      setNotice('Saved page version.');
    } catch {
      // Rollback provisional version on failure
      setVersions((prev) => prev.filter((v) => v.id !== provisionalVersion.id));
      setVersionsCount((c) => Math.max(0, c - 1));
      setNotice('Failed to save version. Please retry.');
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!editorContext) return;
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
    await publishService.createEvent({
      id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
      type: 'restored-version',
      actorId: session.userId,
      createdAt: new Date().toISOString(),
      sourceVersionId: version.id,
      note: `Restored version ${version.label}`,
    });
    await refreshActivity(editorContext.page.id);
    setSelectedNodeId(version.snapshot.id);
    setNotice(`Restored version: ${version.label}.`);
  };

  const handlePublishProject = async () => {
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
    const publish = {
      status: 'published' as const,
      publishedAt: new Date().toISOString(),
      publishedBy: session.userId,
      sourceVersionId: latestVersion?.id ?? null,
    };
    setEditorState((prev) => {
      const nextProjects = updateProjectPublish(
        prev.projects,
        editorContext.project.id,
        publish
      );
      return commitProjects(prev, nextProjects);
    });
    try {
      await publishService.createEvent({
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        projectId: editorContext.project.id,
        pageId: editorContext.page.id,
        type: 'published',
        actorId: session.userId,
        createdAt: new Date().toISOString(),
        sourceVersionId: latestVersion?.id ?? null,
        note: publish.sourceVersionId
          ? `Published from version ${publish.sourceVersionId}`
          : 'Published project',
      });
      await refreshActivity(editorContext.page.id);
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
  };

  const handleUnpublishProject = async () => {
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
    const publish = {
      status: 'draft' as const,
      publishedAt: null,
      publishedBy: null,
      sourceVersionId: null,
    };
    setEditorState((prev) => {
      const nextProjects = updateProjectPublish(
        prev.projects,
        editorContext.project.id,
        publish
      );
      return commitProjects(prev, nextProjects);
    });
    try {
      await publishService.createEvent({
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        projectId: editorContext.project.id,
        pageId: editorContext.page.id,
        type: 'unpublished',
        actorId: session.userId,
        createdAt: new Date().toISOString(),
        sourceVersionId: null,
        note: 'Returned project to draft',
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
  };

  const handleAddComment = async () => {
    if (!editorContext || !commentDraft.trim()) return;
    const provisional: CommentRecord = {
      id: createCommentId(),
      pageId: editorContext.page.id,
      nodeId: selectedNodeId ?? undefined,
      body: commentDraft.trim(),
      authorId: session.userId,
      resolved: false,
      createdAt: new Date().toISOString(),
    };
    // Optimistic: show comment immediately, clear the draft
    setComments((prev) => [...prev, provisional]);
    setCommentDraft('');
    try {
      await services.comments.createComment(provisional);
      await refreshActivity(editorContext.page.id);
      setNotice('Added comment.');
    } catch {
      // Rollback provisional comment on failure
      setComments((prev) => prev.filter((c) => c.id !== provisional.id));
      setCommentDraft(provisional.body);
      setNotice('Failed to add comment. Please retry.');
    }
  };

  const handleResolveComment = async (commentId: string) => {
    if (!editorContext) return;
    // Optimistic: toggle resolved state immediately
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      )
    );
    try {
      // Persist using upsert with the toggled resolved flag
      const target = _comments.find((c) => c.id === commentId);
      if (!target) return;
      const next = { ...target, resolved: !target.resolved };
      await services.comments.createComment(next);
      await refreshActivity(editorContext.page.id);
    } catch {
      // Rollback on failure
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, resolved: !c.resolved } : c
        )
      );
      setNotice('Failed to update comment. Please retry.');
    }
  };

  const handleAddMember = async () => {
    if (!editorContext) return;
    const email = newMemberEmail.trim().toLowerCase();
    const addMemberReason = canAddProjectMember(
      sessionRole,
      projectMembers,
      email
    );
    if (addMemberReason) {
      setNotice(addMemberReason);
      return;
    }
    const nextMember: BuilderMember = {
      userId: `member-${Date.now()}`,
      email,
      role: newMemberRole,
    };
    const nextMembers = [...projectMembers, nextMember];
    const nextProjects = projects.map((project) =>
      project.id === editorContext.project.id
        ? { ...project, members: nextMembers }
        : project
    );
    setPendingMemberAction({
      type: 'add',
      email,
      role: newMemberRole,
    });
    setEditorState((prev) => commitProjects(prev, nextProjects));
    try {
      await services.members.saveMembers(editorContext.project.id, nextMembers);
      await publishService.createEvent({
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        projectId: editorContext.project.id,
        pageId: editorContext.page.id,
        type: 'member-added',
        actorId: session.userId,
        createdAt: new Date().toISOString(),
        sourceVersionId: null,
        note: `Added member ${nextMember.email} as ${nextMember.role}`,
        payload: {
          kind: 'member-added',
          memberEmail: nextMember.email,
          memberId: nextMember.userId,
          toRole: nextMember.role,
        },
      });
      setNewMemberEmail('');
      await refreshActivity(editorContext.page.id);
      setNotice(
        formatRepositoryActionNotice(
          `Added ${nextMember.email} as ${nextMember.role}.`
        )
      );
    } catch {
      setNotice(
        `Added ${nextMember.email} locally, but remote member persistence failed. Retry or check your connection.`
      );
    } finally {
      setPendingMemberAction(null);
    }
  };

  const handleAcceptInvite = async () => {
    if (!editorContext) return;
    const acceptInviteReason = canAcceptProjectInvite(sessionRole);
    if (acceptInviteReason) {
      setNotice(acceptInviteReason);
      return;
    }
    const email = acceptedInviteEmail.trim().toLowerCase();
    if (!email) {
      setNotice('Enter an invite email to accept.');
      return;
    }
    const member = projectMembers.find(
      (entry) => entry.email.toLowerCase() === email
    );
    if (!member) {
      setNotice('Invite email was not found in this project.');
      return;
    }
    setSessionMemberId(member.userId);
    sessionRepository.saveSessionMemberId(member.userId);
    setAcceptedInviteEmail('');
    setNotice(
      formatRepositoryActionNotice(
        `Accepted invite as ${member.email} with ${member.role} access.`
      )
    );
  };

  const handleUpdateMemberRole = async (
    memberId: string,
    role: BuilderRole
  ) => {
    if (!editorContext) return;
    const currentMember = projectMembers.find(
      (member) => member.userId === memberId
    );
    if (!currentMember) {
      setNotice('Project member was not found.');
      return;
    }
    if (currentMember.role === role) {
      setNotice(`${currentMember.email} already has the ${role} role.`);
      return;
    }
    const changeRoleReason = canChangeProjectMemberRole(
      sessionRole,
      projectMembers,
      memberId,
      role
    );
    if (changeRoleReason) {
      setNotice(changeRoleReason);
      return;
    }
    const updatedMember: BuilderMember = { ...currentMember, role };
    const nextMembers = projectMembers.map((member) =>
      member.userId === memberId ? updatedMember : member
    );
    const nextProjects = projects.map((project) =>
      project.id === editorContext.project.id
        ? { ...project, members: nextMembers }
        : project
    );
    setPendingMemberAction({
      type: 'update',
      memberId,
      role,
    });
    setEditorState((prev) => commitProjects(prev, nextProjects));
    try {
      await services.members.saveMembers(editorContext.project.id, nextMembers);
      await publishService.createEvent({
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        projectId: editorContext.project.id,
        pageId: editorContext.page.id,
        type: 'member-role-updated',
        actorId: session.userId,
        createdAt: new Date().toISOString(),
        sourceVersionId: null,
        note: `Changed ${updatedMember.email} from ${currentMember.role} to ${updatedMember.role}`,
        payload: {
          kind: 'member-role-updated',
          memberEmail: updatedMember.email,
          memberId: updatedMember.userId,
          fromRole: currentMember.role,
          toRole: updatedMember.role,
        },
      });
      await refreshActivity(editorContext.page.id);
      setNotice(
        formatRepositoryActionNotice(
          `Changed ${updatedMember.email} from ${currentMember.role} to ${updatedMember.role}.`
        )
      );
    } catch {
      setNotice(
        `Role updated locally for ${updatedMember.email}, but remote persistence failed. Retry or check your connection.`
      );
    } finally {
      setPendingMemberAction(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!editorContext) return;
    const member = projectMembers.find((entry) => entry.userId === memberId);
    if (!member) {
      setNotice('Project member was not found.');
      return;
    }
    const removeMemberReason = canRemoveProjectMember(
      sessionRole,
      projectMembers,
      memberId
    );
    if (removeMemberReason) {
      setNotice(removeMemberReason);
      return;
    }
    const nextMembers = projectMembers.filter(
      (entry) => entry.userId !== memberId
    );
    const nextProjects = projects.map((project) =>
      project.id === editorContext.project.id
        ? { ...project, members: nextMembers }
        : project
    );
    setPendingMemberAction({
      type: 'remove',
      memberId,
    });
    setEditorState((prev) => commitProjects(prev, nextProjects));
    try {
      await services.members.saveMembers(editorContext.project.id, nextMembers);
      await publishService.createEvent({
        id: `event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        projectId: editorContext.project.id,
        pageId: editorContext.page.id,
        type: 'member-removed',
        actorId: session.userId,
        createdAt: new Date().toISOString(),
        sourceVersionId: null,
        note: `Removed member ${member.email}`,
        payload: {
          kind: 'member-removed',
          memberEmail: member.email,
          memberId: member.userId,
          fromRole: member.role,
        },
      });
      if (sessionMemberId === member.userId) {
        const fallbackMember = nextMembers[0] ?? null;
        setSessionMemberId(fallbackMember?.userId ?? null);
        sessionRepository.saveSessionMemberId(fallbackMember?.userId ?? null);
      }
      await refreshActivity(editorContext.page.id);
      setNotice(
        formatRepositoryActionNotice(
          `Removed ${member.email} from the project.`
        )
      );
    } catch {
      setNotice(
        `Removed ${member.email} locally, but remote persistence failed. Retry or check your connection.`
      );
    } finally {
      setPendingMemberAction(null);
    }
  };

  const activeEditors = projectMembers.filter((member) => member.activePageId);
  const recentlyActiveMembers = projectMembers.filter(
    (member) => !member.activePageId && member.lastActiveAt
  );
  const memberPresenceSummary = activeEditors.length
    ? `${activeEditors.length} collaborator${activeEditors.length === 1 ? '' : 's'} editing now · ${recentlyActiveMembers.length} recently active`
    : recentlyActiveMembers.length
      ? `${recentlyActiveMembers.length} collaborator${recentlyActiveMembers.length === 1 ? '' : 's'} recently active`
      : 'No recent collaborator activity yet';

  return {
    activeMember,
    memberPresenceSummary,
    route,
    selectedNodeId,
    setSelectedNodeId,
    projectRenameDraft,
    setProjectRenameDraft,
    newPageTitle,
    setNewPageTitle,
    commentDraft,
    setCommentDraft,
    canEdit,
    canComment,
    canManageLifecycle,
    canSaveVersions,
    canRestoreVersions,
    isGeneratingDraft,
    projectMembers,
    newMemberEmail,
    setNewMemberEmail,
    newMemberRole,
    acceptedInviteEmail,
    setAcceptedInviteEmail,
    setNewMemberRole,
    sessionRole,
    sessionMemberId,
    setSessionMemberId,
    canPublishProject,
    publishGuardReason: effectivePublishGuardReason,
    publishStateSummary,
    publishStateGuidance,
    latestVersion,
    editorContext,
    selectedNode,
    selectedMeta,
    navigate,
    handleRenameProject,
    handleCreatePage,
    handleGenerateProjectDraft,
    handleInsertComponent,
    handleDuplicateSelected,
    handleRemoveSelected,
    handleUpdateProps,
    handleSaveVersion,
    handleRestoreVersion,
    handleAddComment,
    handleResolveComment,
    handleAddMember,
    handleAcceptInvite,
    handleUpdateMemberRole,
    handleRemoveMember,
    pendingMemberAction,
    handlePublishProject,
    handleUnpublishProject,
    publishEvents,
  };
}
