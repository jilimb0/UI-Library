import { foundationalComponents } from '@ui-construction-library/registry';
import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { createSessionRepository } from './auth';
import { getMemberPresenceSummary } from './builderLifecycle';
import { navigate } from './builderNavigation';
import { createDataServices } from './dataServices';
import type { createInitialEditorState } from './editorState';
import type { PromptDraftOverrides } from './promptDraftOverrides';
import { createBuilderSupabaseClient } from './repositoryFactory';
import type { BuilderRoute } from './routes';
import type {
  BuilderMember,
  BuilderPage,
  BuilderRole,
  CommentRecord,
  LayoutNode,
  PageVersion,
  PublishEventRecord,
} from './types';
import { useActivityTracker } from './useActivityTracker';
import { useCommentController } from './useCommentController';
import { useEditorContext } from './useEditorContext';
import { useMemberController } from './useMemberController';
import { useNodeEditor } from './useNodeEditor';
import { useProjectController } from './useProjectController';
import { usePromptController } from './usePromptController';
import { usePublishController } from './usePublishController';
import { useRouteController } from './useRouteController';
import { useSessionController } from './useSessionController';
import { useVersionController } from './useVersionController';

export type { PromptDraftOverrides } from './promptDraftOverrides';

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
  const selectionResetRef = useRef<null | (() => void)>(null);
  const handlePopState = useCallback(() => {
    selectionResetRef.current?.();
    setNotice(null);
  }, [setNotice]);
  const { route, setRoute } = useRouteController({
    sessionRepository,
    onPopState: handlePopState,
  });
  const supabaseClient = createBuilderSupabaseClient();
  const services = createDataServices({ supabaseClient });
  const publishService = services.publishEvents;

  const editorContext = useEditorContext({ route, projects });

  const projectMembers = editorContext?.project.members ?? [];
  const {
    activeMember,
    roleCapabilities,
    session,
    sessionMemberId,
    sessionRole,
    setSessionMemberId,
  } = useSessionController({ projectMembers, sessionRepository });
  const {
    acceptedInviteEmail,
    handleAcceptInvite,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    newMemberEmail,
    newMemberRole,
    pendingMemberAction,
    setAcceptedInviteEmail,
    setNewMemberEmail,
    setNewMemberRole,
  } = useMemberController({
    editorContext,
    projectMembers,
    projects,
    publishServiceCreateEvent: publishService.createEvent,
    servicesSaveMembers: services.members.saveMembers,
    sessionMemberId,
    sessionRepositorySaveSessionMemberId: sessionRepository.saveSessionMemberId,
    sessionRole,
    sessionUserId: session.userId,
    setEditorState,
    setSessionMemberId,
    setNotice,
    refreshActivity,
  });

  const {
    canEdit,
    canComment,
    canManageLifecycle,
    canSaveVersions,
    canRestoreVersions,
  } = roleCapabilities;
  const { touchMemberActivity } = useActivityTracker({
    activeMember,
    editorContext,
    refreshActivity,
    setEditorState,
    setNotice,
  });
  const componentLibrary = useMemo(() => [...foundationalComponents], []);
  const {
    handleDuplicateSelected,
    handleInsertComponent,
    handleRemoveSelected,
    handleUpdateProps,
    selectedMeta,
    selectedNode,
    selectedNodeId,
    setSelectedNodeId,
    updateCurrentPage,
  } = useNodeEditor({
    editorContext,
    setEditorState,
    setNotice,
    componentLibrary,
    touchMemberActivity,
  });
  selectionResetRef.current = () => setSelectedNodeId(null);
  const { handleGenerateProjectDraft, isGeneratingDraft } = usePromptController(
    {
      setEditorState,
      setNotice,
      setRoute,
      setSelectedNodeId,
    }
  );
  const {
    handleCreatePage,
    handleRenameProject,
    newPageTitle,
    projectRenameDraft,
    setNewPageTitle,
    setProjectRenameDraft,
  } = useProjectController({
    editorContext,
    projects,
    setEditorState,
    setNotice,
    setRoute,
    setSelectedNodeId,
  });

  const { handleRestoreVersion, handleSaveVersion, latestVersion } =
    useVersionController({
      canRestoreVersions,
      canSaveVersions,
      createEvent: publishService.createEvent,
      createVersion: services.versions.createVersion,
      editorContext,
      refreshActivity,
      sessionUserId: session.userId,
      setNotice,
      setSelectedNodeId,
      setVersions,
      setVersionsCount,
      updateCurrentPage,
      versionDraft,
      versions,
      versionsCount,
    });
  const {
    canPublishProject,
    handlePublishProject,
    handleUnpublishProject,
    publishGuardReason,
    publishStateGuidance,
    publishStateSummary,
  } = usePublishController({
    canManageLifecycle,
    createEvent: publishService.createEvent,
    editorContext,
    latestVersion,
    refreshActivity,
    sessionUserId: session.userId,
    setEditorState,
    setNotice,
    versionsCount,
  });

  const { handleAddComment, handleResolveComment } = useCommentController({
    commentDraft,
    comments: _comments,
    createComment: services.comments.createComment,
    editorContext,
    refreshActivity,
    selectedNodeId,
    sessionUserId: session.userId,
    setCommentDraft,
    setComments,
    setNotice,
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
    publishGuardReason,
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
