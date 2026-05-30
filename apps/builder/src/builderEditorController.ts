import {
  generatePromptDraft,
  toBuilderCompatibleProject,
} from '@ui-construction-library/prompt-engine';
import { foundationalComponents } from '@ui-construction-library/registry';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { recordAnalyticsEvent } from './analytics';
import { createSessionFromMember, createSessionRepository } from './auth';
import { cancelAutosave, clearRecoveryDraft } from './autosave';
import {
  createPageScaffold,
  getE2ERoleOverride,
  markMemberActivity,
  resolveBuilderRoleCapabilities,
} from './builderCapabilities';
import {
  getMemberPresenceSummary,
  getPublishGuardReason,
  getPublishStateGuidance,
  getPublishStateSummary,
} from './builderLifecycle';
import {
  acceptInvite,
  addMember,
  removeMember,
  updateMemberRole,
} from './builderMemberActions';
import {
  buildBrowserBuilderUrl,
  getBrowserBuilderRoute,
  navigate,
} from './builderNavigation';
import {
  addComment,
  publishProject,
  resolveComment,
  unpublishProject,
} from './builderPublishCommentActions';
import { restoreVersion, saveVersion } from './builderVersionActions';
import { createDataServices } from './dataServices';
import {
  commitProjects,
  type createInitialEditorState,
  redoProjects,
  undoProjects,
  updatePageRoot,
} from './editorState';
import { getInsertionBlockReason } from './insertionRules';
import { createBuilderSupabaseClient } from './repositoryFactory';
import { type BuilderRoute, parseEditorRoute, parseRoute } from './routes';
import { getSupabaseSessionIdentity } from './supabaseClient';
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
  BuilderRole,
  CommentRecord,
  LayoutNode,
  PageVersion,
  PublishEventRecord,
} from './types';

export type PromptDraftOverrides = {
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

export type BuilderEditorController = {
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
  const e2eRoleOverride = getE2ERoleOverride();
  const sessionRole = e2eRoleOverride ?? activeMember?.role ?? 'viewer';
  const session = useMemo(() => {
    const supabaseIdentity = getSupabaseSessionIdentity();

    if (activeMember) {
      return {
        ...createSessionFromMember(activeMember, supabaseIdentity.provider),
        role: e2eRoleOverride ?? activeMember.role,
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
        role: e2eRoleOverride ?? 'viewer',
      },
      supabaseIdentity.provider
    );
  }, [activeMember, e2eRoleOverride]);
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
    () =>
      getPublishGuardReason({
        editorContext,
        versionsCount,
        canManageLifecycle,
      }),
    [canManageLifecycle, editorContext, versionsCount]
  );
  const effectivePublishGuardReason = publishGuardReason;
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
        const generatedProjectWithReviewState: typeof generatedProject = {
          ...generatedProject,
          pages: generatedProject.pages.map((page) => ({
            ...page,
            root: {
              ...page.root,
              children: page.root.children.map((child) => {
                const existingReviewState = (
                  child.props as Record<string, unknown>
                ).reviewState;
                if (existingReviewState) return child;
                return {
                  ...child,
                  props: {
                    ...child.props,
                    reviewState: 'pending',
                  },
                };
              }),
            },
          })),
        };

        setEditorState((prev) => {
          const withoutExisting = prev.projects.filter(
            (project) => project.id !== generatedProjectWithReviewState.id
          );
          return commitProjects(prev, [
            ...withoutExisting,
            generatedProjectWithReviewState,
          ]);
        });
        setNotice('Generated prompt draft project.');
        setRoute(
          parseRoute(
            `/projects/${generatedProjectWithReviewState.id}/pages/${generatedProjectWithReviewState.pages[0]?.id ?? 'generated-page-1'}`
          )
        );
        setSelectedNodeId(
          generatedProjectWithReviewState.pages[0]?.root.id ?? null
        );
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
    await saveVersion({
      canSaveVersions,
      versionDraft,
      versionsCount,
      editorPageId: editorContext.page.id,
      editorPageRoot: editorContext.page.root,
      sessionUserId: session.userId,
      setVersions,
      setVersionsCount,
      createVersion: services.versions.createVersion,
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
      sessionUserId: session.userId,
      updateCurrentPage,
      createEvent: publishService.createEvent,
      refreshActivity,
      setSelectedNodeId,
      setNotice,
    });
  };

  const handlePublishProject = async () =>
    publishProject({
      editorContext,
      canManageLifecycle,
      publishGuardReason,
      latestVersion,
      sessionUserId: session.userId,
      publishServiceCreateEvent: publishService.createEvent,
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
      sessionUserId: session.userId,
      publishServiceCreateEvent: publishService.createEvent,
      refreshActivity,
      setEditorState,
      setNotice,
      recordAnalyticsEvent,
    });

  const handleAddComment = async () =>
    addComment({
      editorContext,
      commentDraft,
      selectedNodeId,
      sessionUserId: session.userId,
      setComments,
      setCommentDraft,
      createComment: services.comments.createComment,
      refreshActivity,
      setNotice,
    });

  const handleResolveComment = async (commentId: string) =>
    resolveComment({
      editorContext,
      commentId,
      comments: _comments,
      setComments,
      createComment: services.comments.createComment,
      refreshActivity,
      setNotice,
    });

  const handleAddMember = async () =>
    addMember({
      editorContext,
      sessionRole,
      projectMembers,
      newMemberRole,
      newMemberEmail,
      sessionUserId: session.userId,
      setPendingMemberAction,
      setEditorState,
      setNewMemberEmail,
      setNotice,
      refreshActivity,
      servicesSaveMembers: services.members.saveMembers,
      publishServiceCreateEvent: publishService.createEvent,
      projects,
      recordAnalyticsEvent,
    });

  const handleAcceptInvite = async () =>
    acceptInvite({
      editorContext,
      sessionRole,
      acceptedInviteEmail,
      projectMembers,
      setSessionMemberId,
      sessionRepositorySaveSessionMemberId:
        sessionRepository.saveSessionMemberId,
      setAcceptedInviteEmail,
      setNotice,
    });

  const handleUpdateMemberRole = async (memberId: string, role: BuilderRole) =>
    updateMemberRole({
      editorContext,
      sessionRole,
      projectMembers,
      memberId,
      role,
      projects,
      setPendingMemberAction,
      setEditorState,
      setNotice,
      refreshActivity,
      servicesSaveMembers: services.members.saveMembers,
      publishServiceCreateEvent: publishService.createEvent,
      sessionUserId: session.userId,
    });

  const handleRemoveMember = async (memberId: string) =>
    removeMember({
      editorContext,
      sessionRole,
      projectMembers,
      memberId,
      projects,
      setPendingMemberAction,
      setEditorState,
      setNotice,
      refreshActivity,
      servicesSaveMembers: services.members.saveMembers,
      publishServiceCreateEvent: publishService.createEvent,
      sessionUserId: session.userId,
      sessionMemberId,
      setSessionMemberId,
      sessionRepositorySaveSessionMemberId:
        sessionRepository.saveSessionMemberId,
    });

  const memberPresenceSummary = getMemberPresenceSummary(projectMembers);

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
