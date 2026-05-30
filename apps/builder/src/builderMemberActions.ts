import type { Dispatch, SetStateAction } from 'react';
import type { AnalyticsEvent } from './analytics';
import {
  buildMemberEventNote,
  createGovernanceEventId,
  formatRepositoryActionNotice,
} from './builderMutations';
import { commitProjects, type EditorState } from './editorState';
import {
  getMemberByEmail,
  getMemberById,
  validateInviteAcceptance,
  validateMemberRemoval,
  validateMemberRoleChange,
  validateNewMember,
} from './memberActions';
import type { BuilderMember, BuilderProject, BuilderRole } from './types';

type EditorContext = { project: BuilderProject; page: { id: string } } | null;

export async function addMember({
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
  publishServiceCreateEvent,
  projects,
  recordAnalyticsEvent,
}: {
  editorContext: EditorContext;
  sessionRole: BuilderRole;
  projectMembers: BuilderMember[];
  newMemberRole: BuilderRole;
  newMemberEmail: string;
  sessionUserId: string;
  setPendingMemberAction: Dispatch<
    SetStateAction<null | {
      type: 'add' | 'update' | 'remove';
      memberId?: string;
      email?: string;
      role?: BuilderRole;
    }>
  >;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  setNewMemberEmail: Dispatch<SetStateAction<string>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
  refreshActivity: (pageId: string) => Promise<void>;
  servicesSaveMembers: (
    projectId: string,
    members: BuilderMember[]
  ) => Promise<void>;
  publishServiceCreateEvent: (input: {
    id: string;
    projectId: string;
    pageId: string | null;
    type: 'member-added';
    actorId: string;
    createdAt: string;
    sourceVersionId: string | null;
    note: string | null;
    payload: {
      kind: 'member-added';
      memberEmail: string;
      memberId: string;
      toRole: BuilderRole;
    };
  }) => Promise<void>;
  projects: BuilderProject[];
  recordAnalyticsEvent: (
    name: string,
    category: AnalyticsEvent['category'],
    metadata?: AnalyticsEvent['metadata']
  ) => AnalyticsEvent;
}): Promise<void> {
  if (!editorContext) return;
  const email = newMemberEmail.trim().toLowerCase();
  const addMemberReason = validateNewMember(sessionRole, projectMembers, email);
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
  setPendingMemberAction({ type: 'add', email, role: newMemberRole });
  setEditorState((prev) => commitProjects(prev, nextProjects));
  try {
    await servicesSaveMembers(editorContext.project.id, nextMembers);
    await publishServiceCreateEvent({
      id: createGovernanceEventId(),
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
      type: 'member-added',
      actorId: sessionUserId,
      createdAt: new Date().toISOString(),
      sourceVersionId: null,
      note: buildMemberEventNote(nextMember, 'added'),
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
    recordAnalyticsEvent('member_added', 'builder', {
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
    });
  } catch {
    setNotice(
      `Added ${nextMember.email} locally, but remote member persistence failed. Retry or check your connection.`
    );
  } finally {
    setPendingMemberAction(null);
  }
}

export function acceptInvite({
  editorContext,
  sessionRole,
  acceptedInviteEmail,
  projectMembers,
  setSessionMemberId,
  sessionRepositorySaveSessionMemberId,
  setAcceptedInviteEmail,
  setNotice,
}: {
  editorContext: EditorContext;
  sessionRole: BuilderRole;
  acceptedInviteEmail: string;
  projectMembers: BuilderMember[];
  setSessionMemberId: Dispatch<SetStateAction<string>>;
  sessionRepositorySaveSessionMemberId: (memberId: string) => void;
  setAcceptedInviteEmail: Dispatch<SetStateAction<string>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
}): void {
  if (!editorContext) return;
  const acceptInviteReason = validateInviteAcceptance(sessionRole);
  if (acceptInviteReason) {
    setNotice(acceptInviteReason);
    return;
  }
  const email = acceptedInviteEmail.trim().toLowerCase();
  if (!email) {
    setNotice('Enter an invite email to accept.');
    return;
  }
  const member = getMemberByEmail(projectMembers, email);
  if (!member) {
    setNotice('Invite email was not found in this project.');
    return;
  }
  setSessionMemberId(member.userId);
  sessionRepositorySaveSessionMemberId(member.userId);
  setAcceptedInviteEmail('');
  setNotice(
    formatRepositoryActionNotice(
      `Accepted invite as ${member.email} with ${member.role} access.`
    )
  );
}

export async function updateMemberRole({
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
  publishServiceCreateEvent,
  sessionUserId,
}: {
  editorContext: EditorContext;
  sessionRole: BuilderRole;
  projectMembers: BuilderMember[];
  memberId: string;
  role: BuilderRole;
  projects: BuilderProject[];
  setPendingMemberAction: Dispatch<
    SetStateAction<null | {
      type: 'add' | 'update' | 'remove';
      memberId?: string;
      email?: string;
      role?: BuilderRole;
    }>
  >;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
  refreshActivity: (pageId: string) => Promise<void>;
  servicesSaveMembers: (
    projectId: string,
    members: BuilderMember[]
  ) => Promise<void>;
  publishServiceCreateEvent: (input: {
    id: string;
    projectId: string;
    pageId: string | null;
    type: 'member-role-updated';
    actorId: string;
    createdAt: string;
    sourceVersionId: string | null;
    note: string | null;
    payload: {
      kind: 'member-role-updated';
      memberEmail: string;
      memberId: string;
      fromRole: BuilderRole;
      toRole: BuilderRole;
    };
  }) => Promise<void>;
  sessionUserId: string;
}): Promise<void> {
  if (!editorContext) return;
  const currentMember = getMemberById(projectMembers, memberId);
  if (!currentMember) {
    setNotice('Project member was not found.');
    return;
  }
  if (currentMember.role === role) {
    setNotice(`${currentMember.email} already has the ${role} role.`);
    return;
  }
  const changeRoleReason = validateMemberRoleChange(
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
  setPendingMemberAction({ type: 'update', memberId, role });
  setEditorState((prev) => commitProjects(prev, nextProjects));
  try {
    await servicesSaveMembers(editorContext.project.id, nextMembers);
    await publishServiceCreateEvent({
      id: createGovernanceEventId(),
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
      type: 'member-role-updated',
      actorId: sessionUserId,
      createdAt: new Date().toISOString(),
      sourceVersionId: null,
      note: buildMemberEventNote(updatedMember, 'updated', currentMember.role),
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
}

export async function removeMember({
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
  publishServiceCreateEvent,
  sessionUserId,
  sessionMemberId,
  setSessionMemberId,
  sessionRepositorySaveSessionMemberId,
}: {
  editorContext: EditorContext;
  sessionRole: BuilderRole;
  projectMembers: BuilderMember[];
  memberId: string;
  projects: BuilderProject[];
  setPendingMemberAction: Dispatch<
    SetStateAction<null | {
      type: 'add' | 'update' | 'remove';
      memberId?: string;
      email?: string;
      role?: BuilderRole;
    }>
  >;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  setNotice: Dispatch<SetStateAction<string | null>>;
  refreshActivity: (pageId: string) => Promise<void>;
  servicesSaveMembers: (
    projectId: string,
    members: BuilderMember[]
  ) => Promise<void>;
  publishServiceCreateEvent: (input: {
    id: string;
    projectId: string;
    pageId: string | null;
    type: 'member-removed';
    actorId: string;
    createdAt: string;
    sourceVersionId: string | null;
    note: string | null;
    payload: {
      kind: 'member-removed';
      memberEmail: string;
      memberId: string;
      fromRole: BuilderRole;
    };
  }) => Promise<void>;
  sessionUserId: string;
  sessionMemberId: string;
  setSessionMemberId: Dispatch<SetStateAction<string>>;
  sessionRepositorySaveSessionMemberId: (memberId: string) => void;
}): Promise<void> {
  if (!editorContext) return;
  const member = getMemberById(projectMembers, memberId);
  if (!member) {
    setNotice('Project member was not found.');
    return;
  }
  const removeMemberReason = validateMemberRemoval(
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
  setPendingMemberAction({ type: 'remove', memberId });
  setEditorState((prev) => commitProjects(prev, nextProjects));
  try {
    await servicesSaveMembers(editorContext.project.id, nextMembers);
    await publishServiceCreateEvent({
      id: createGovernanceEventId(),
      projectId: editorContext.project.id,
      pageId: editorContext.page.id,
      type: 'member-removed',
      actorId: sessionUserId,
      createdAt: new Date().toISOString(),
      sourceVersionId: null,
      note: buildMemberEventNote(member, 'removed'),
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
      sessionRepositorySaveSessionMemberId(fallbackMember?.userId ?? null);
    }
    await refreshActivity(editorContext.page.id);
    setNotice(
      formatRepositoryActionNotice(`Removed ${member.email} from the project.`)
    );
  } catch {
    setNotice(
      `Removed ${member.email} locally, but remote persistence failed. Retry or check your connection.`
    );
  } finally {
    setPendingMemberAction(null);
  }
}
