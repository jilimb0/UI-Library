import {
  generatePromptDraft,
  toBuilderCompatibleProject,
} from '@ui-construction-library/prompt-engine';
import { foundationalComponents } from '@ui-construction-library/registry';
import { validateRequiredShape } from '@ui-construction-library/schema';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  canComment as canCommentOnProject,
  canEditLayout,
  canManagePublishLifecycle,
  canRestoreVersion,
  canSaveVersion,
  createSessionFromMember,
  createSessionRepository,
} from './auth';
import { createDataServices } from './dataServices';
import {
  commitProjects,
  createInitialEditorState,
  redoProjects,
  undoProjects,
  updatePageRoot,
} from './editorState';
import { getInsertionBlockReason } from './insertionRules';
import { mockProjects } from './mockData';
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
  comments: CommentRecord[];
  publishEvents: PublishEventRecord[];
  versionsCount: number;
  commentsCount: number;
  versionDraft: string;
  setVersionDraft: Dispatch<SetStateAction<string>>;
  refreshActivity: (pageId: string) => Promise<void>;
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

type BuilderEditorController = {
  projectMembers: BuilderMember[];
  newMemberEmail: string;
  setNewMemberEmail: Dispatch<SetStateAction<string>>;
  newMemberRole: BuilderRole;
  setNewMemberRole: Dispatch<SetStateAction<BuilderRole>>;
  canPublishProject: boolean;
  canManageLifecycle: boolean;
  canSaveVersions: boolean;
  canRestoreVersions: boolean;
  sessionRole: BuilderRole;
  sessionMemberId: string;
  setSessionMemberId: Dispatch<SetStateAction<string>>;
  publishGuardReason: string | null;
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
  handleGenerateProjectDraft: () => void;
  handleInsertComponent: (componentId: string) => void;
  handleDuplicateSelected: () => void;
  handleRemoveSelected: () => void;
  handleUpdateProps: (nodeId: string, key: string, value: string) => void;
  handleSaveVersion: () => Promise<void>;
  handleRestoreVersion: (versionId: string) => Promise<void>;
  handleAddComment: () => Promise<void>;
  acceptedInviteEmail: string;
  setAcceptedInviteEmail: Dispatch<SetStateAction<string>>;
  handleAddMember: () => Promise<void>;
  handleAcceptInvite: () => Promise<void>;
  handleUpdateMemberRole: (
    memberId: string,
    role: BuilderRole
  ) => Promise<void>;
  handleRemoveMember: (memberId: string) => Promise<void>;
};

export function useBuilderDataController(): BuilderDataController {
  const supabaseClient = useMemo(() => createBuilderSupabaseClient(), []);
  const services = useMemo(
    () => createDataServices({ supabaseClient }),
    [supabaseClient]
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

  const projects = editorState.projects;

  useEffect(() => {
    let active = true;
    repository.loadProjects().then(async (loaded) => {
      if (!active || !loaded) return;
      const hydrated = await Promise.all(
        loaded.map(async (project) => {
          const persistedMembers = await services.members.listMembers(
            project.id
          );
          return persistedMembers.length > 0
            ? { ...project, members: persistedMembers }
            : project;
        })
      );
      setEditorState(createInitialEditorState(hydrated));
    });
    return () => {
      active = false;
    };
  }, [repository, services.members]);

  useEffect(() => {
    repository.saveProjects(projects);
  }, [projects, repository]);

  const refreshActivity = async (pageId: string) => {
    const projectId = projects.find((project) =>
      project.pages.some((page) => page.id === pageId)
    )?.id;
    const [nextVersions, nextComments, nextPublishEvents] = await Promise.all([
      services.versions.listVersions(pageId),
      services.comments.listComments(pageId),
      projectId
        ? services.publishEvents.listEvents(projectId)
        : Promise.resolve([]),
    ]);
    setVersions(nextVersions);
    setComments(nextComments);
    setPublishEvents(nextPublishEvents);
    setVersionsCount(nextVersions.length);
    setCommentsCount(nextComments.length);
    setVersionDraft(`Version ${nextVersions.length + 1}`);
  };

  return {
    editorState,
    setEditorState,
    projects,
    notice,
    setNotice,
    versions,
    comments: _comments,
    publishEvents,
    versionsCount,
    commentsCount: _commentsCount,
    versionDraft,
    setVersionDraft,
    refreshActivity,
  };
}

export function useBuilderEditorController({
  projects,
  setEditorState,
  setNotice,
  refreshActivity,
  versions,
  comments: _comments,
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
  comments: CommentRecord[];
  publishEvents: PublishEventRecord[];
  versionsCount: number;
  commentsCount: number;
  versionDraft: string;
  commentDraft: string;
  setCommentDraft: Dispatch<SetStateAction<string>>;
}): BuilderEditorController {
  const sessionRepository = useMemo(() => createSessionRepository(), []);
  const [route, setRoute] = useState<BuilderRoute>(() =>
    parseRoute(sessionRepository.loadRoute() ?? '/projects')
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [projectRenameDraft, setProjectRenameDraft] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<BuilderRole>('viewer');
  const [acceptedInviteEmail, setAcceptedInviteEmail] = useState('');
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
  const sessionRole = activeMember?.role ?? 'viewer';
  const session = useMemo(() => {
    const supabaseIdentity = getSupabaseSessionIdentity();

    if (activeMember) {
      return createSessionFromMember(activeMember, supabaseIdentity.provider);
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
        role: 'viewer',
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
    if (route === '/') {
      sessionRepository.clearRoute();
      return;
    }
    sessionRepository.saveRoute(route);
  }, [route, sessionRepository]);

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

  const handleGenerateProjectDraft = () => {
    const result = generatePromptDraft({
      productType: 'UI Starter',
      targetAudience: 'product teams',
      sections: ['hero', 'features', 'cta'],
      styleTone: 'confident',
      density: 'balanced',
      domain: 'ui tooling',
      frameworkPreference: 'react',
      detailLevel: 'medium',
      generationMode: 'landing-page',
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
    setSelectedNodeId(nextNode.id);
    setNotice('Inserted component.');
  };

  const handleDuplicateSelected = () => {
    if (!editorContext || !selectedNodeId) return;
    updateCurrentPage((root) =>
      duplicateNode(root, selectedNodeId, Date.now().toString(36))
    );
    setNotice('Duplicated selected node.');
  };

  const handleRemoveSelected = () => {
    if (!editorContext || !selectedNodeId) return;
    updateCurrentPage((root) => removeNode(root, selectedNodeId));
    setSelectedNodeId(null);
    setNotice('Removed selected node.');
  };

  const handleUpdateProps = (nodeId: string, key: string, value: string) => {
    if (!editorContext) return;
    updateCurrentPage((root) =>
      updateNodeProps(root, nodeId, { [key]: value })
    );
  };

  const handleSaveVersion = async () => {
    if (!editorContext) return;
    if (!canSaveVersions) {
      setNotice('Current role cannot save versions.');
      return;
    }
    const versionName = versionDraft.trim() || `Version ${versionsCount + 1}`;
    await services.versions.createVersion({
      id: createVersionId(),
      pageId: editorContext.page.id,
      label: versionName,
      snapshot: structuredClone(editorContext.page.root),
      authorId: session.userId,
      createdAt: new Date().toISOString(),
    });
    await refreshActivity(editorContext.page.id);
    setNotice('Saved page version.');
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
    if (!editorContext) return;
    if (effectivePublishGuardReason) {
      setNotice(effectivePublishGuardReason);
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
    setNotice('Project published.');
  };

  const handleUnpublishProject = async () => {
    if (!editorContext) return;
    if (!canManageLifecycle) {
      setNotice('Only admins or owners can manage publish lifecycle actions.');
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
    setNotice('Project returned to draft.');
  };

  const handleAddComment = async () => {
    if (!editorContext || !commentDraft.trim()) return;
    await services.comments.createComment({
      id: createCommentId(),
      pageId: editorContext.page.id,
      body: commentDraft.trim(),
      authorId: session.userId,
      resolved: false,
      createdAt: new Date().toISOString(),
    });
    setCommentDraft('');
    await refreshActivity(editorContext.page.id);
    setNotice('Added comment.');
  };

  const handleAddMember = async () => {
    if (!editorContext) return;
    if (!canManageLifecycle) {
      setNotice('Only admins or owners can manage project members.');
      return;
    }
    const email = newMemberEmail.trim().toLowerCase();
    if (!email) {
      setNotice('Enter an email address to invite.');
      return;
    }
    const exists = projectMembers.some(
      (member) => member.email.toLowerCase() === email
    );
    if (exists) {
      setNotice('Member already exists in this project.');
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
    setEditorState((prev) => commitProjects(prev, nextProjects));
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
    setNotice('Added project member.');
  };

  const handleAcceptInvite = async () => {
    if (!editorContext) return;
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
    setNotice(`Accepted invite as ${member.email}.`);
  };

  const handleUpdateMemberRole = async (
    memberId: string,
    role: BuilderRole
  ) => {
    if (!editorContext) return;
    if (!canManageLifecycle) {
      setNotice('Only admins or owners can change member roles.');
      return;
    }
    const currentMember = projectMembers.find(
      (member) => member.userId === memberId
    );
    if (!currentMember || currentMember.role === role) return;
    const updatedMember: BuilderMember = { ...currentMember, role };
    const nextMembers = projectMembers.map((member) =>
      member.userId === memberId ? updatedMember : member
    );
    const nextProjects = projects.map((project) =>
      project.id === editorContext.project.id
        ? { ...project, members: nextMembers }
        : project
    );
    setEditorState((prev) => commitProjects(prev, nextProjects));
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
    setNotice('Updated member role.');
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!editorContext) return;
    if (!canManageLifecycle) {
      setNotice('Only admins or owners can remove project members.');
      return;
    }
    const member = projectMembers.find((entry) => entry.userId === memberId);
    if (!member) return;
    const nextMembers = projectMembers.filter(
      (entry) => entry.userId !== memberId
    );
    const nextProjects = projects.map((project) =>
      project.id === editorContext.project.id
        ? { ...project, members: nextMembers }
        : project
    );
    setEditorState((prev) => commitProjects(prev, nextProjects));
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
    if (sessionMemberId === memberId) {
      const fallbackMemberId =
        editorContext.project.members.find((entry) => entry.userId !== memberId)
          ?.userId ?? 'local-owner';
      setSessionMemberId(fallbackMemberId);
      sessionRepository.saveSessionMemberId(fallbackMemberId);
    }
    await refreshActivity(editorContext.page.id);
    setNotice('Removed project member.');
  };

  const navigate = (nextPath: string) => {
    setRoute(parseRoute(nextPath));
    setSelectedNodeId(null);
    setNotice(null);
  };

  return {
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
    handleAddMember,
    handleAcceptInvite,
    handleUpdateMemberRole,
    handleRemoveMember,
    handlePublishProject,
    handleUnpublishProject,
    publishEvents,
  };
}
