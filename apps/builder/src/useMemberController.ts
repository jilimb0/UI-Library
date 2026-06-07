import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { AnalyticsEvent } from './analytics';
import { recordAnalyticsEvent } from './analytics';
import {
  acceptInvite,
  addMember,
  removeMember,
  updateMemberRole,
} from './builderMemberActions';
import type { createInitialEditorState } from './editorState';
import type {
  BuilderMember,
  BuilderPage,
  BuilderProject,
  BuilderRole,
  PublishEventRecord,
} from './types';

export function useMemberController({
  editorContext,
  projectMembers,
  projects,
  publishServiceCreateEvent,
  servicesSaveMembers,
  sessionMemberId,
  sessionRepositorySaveSessionMemberId,
  sessionRole,
  sessionUserId,
  setEditorState,
  setSessionMemberId,
  setNotice,
  refreshActivity,
}: {
  editorContext: {
    project: ReturnType<typeof createInitialEditorState>['projects'][number];
    page: BuilderPage;
  } | null;
  projectMembers: BuilderMember[];
  projects: BuilderProject[];
  publishServiceCreateEvent: (event: PublishEventRecord) => Promise<void>;
  servicesSaveMembers: Parameters<typeof addMember>[0]['servicesSaveMembers'];
  sessionMemberId: string;
  sessionRepositorySaveSessionMemberId: (memberId: string) => void;
  sessionRole: BuilderRole;
  sessionUserId: string;
  setEditorState: Parameters<typeof addMember>[0]['setEditorState'];
  setSessionMemberId: Dispatch<SetStateAction<string>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
  refreshActivity: (pageId: string) => Promise<void>;
}) {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<BuilderRole>('viewer');
  const [acceptedInviteEmail, setAcceptedInviteEmail] = useState('');
  const [pendingMemberAction, setPendingMemberAction] = useState<null | {
    type: 'add' | 'update' | 'remove';
    memberId?: string;
    email?: string;
    role?: BuilderRole;
  }>(null);

  const handleAddMember = async () =>
    addMember({
      editorContext,
      sessionRole,
      projectMembers,
      newMemberRole,
      newMemberEmail,
      sessionUserId,
      setPendingMemberAction,
      setEditorState,
      setNewMemberEmail,
      setNotice,
      refreshActivity,
      servicesSaveMembers,
      publishServiceCreateEvent: publishServiceCreateEvent as Parameters<
        typeof addMember
      >[0]['publishServiceCreateEvent'],
      projects,
      recordAnalyticsEvent: (
        name: string,
        category: AnalyticsEvent['category'],
        metadata?: AnalyticsEvent['metadata']
      ) => recordAnalyticsEvent(name, category, metadata),
    });

  const handleAcceptInvite = async () =>
    acceptInvite({
      editorContext,
      sessionRole,
      acceptedInviteEmail,
      projectMembers,
      setSessionMemberId,
      sessionRepositorySaveSessionMemberId,
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
      servicesSaveMembers,
      publishServiceCreateEvent: publishServiceCreateEvent as Parameters<
        typeof updateMemberRole
      >[0]['publishServiceCreateEvent'],
      sessionUserId,
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
      servicesSaveMembers,
      publishServiceCreateEvent: publishServiceCreateEvent as Parameters<
        typeof removeMember
      >[0]['publishServiceCreateEvent'],
      sessionUserId,
      sessionMemberId,
      setSessionMemberId,
      sessionRepositorySaveSessionMemberId,
    });

  return {
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
  };
}
