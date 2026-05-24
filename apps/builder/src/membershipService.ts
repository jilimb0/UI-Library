import { createGovernanceEvent } from './eventFactories';
import {
  canAcceptProjectInvite,
  canAddProjectMember,
  canChangeProjectMemberRole,
  canInviteProjectMember,
  canRemoveProjectMember,
} from './memberPolicy';
import type { MemberRepository } from './memberRepository';
import type { BuilderMember, BuilderRole } from './types';

export type MembershipService = {
  inviteMember: (input: {
    projectId: string;
    actorId: string;
    actorRole: BuilderRole;
    members: BuilderMember[];
    email: string;
    role: BuilderRole;
  }) => Promise<{
    members: BuilderMember[];
    event: ReturnType<typeof createGovernanceEvent> | null;
    notice: string | null;
  }>;

  acceptInvite: (input: {
    projectId: string;
    actorId: string;
    actorRole: BuilderRole;
    members: BuilderMember[];
    email: string;
    role: BuilderRole;
  }) => Promise<{
    members: BuilderMember[];
    event: ReturnType<typeof createGovernanceEvent> | null;
    notice: string | null;
  }>;
  addMember: (input: {
    projectId: string;
    actorId: string;
    actorRole: BuilderRole;
    members: BuilderMember[];
    email: string;
    role: BuilderRole;
  }) => Promise<{
    members: BuilderMember[];
    event: ReturnType<typeof createGovernanceEvent> | null;
    notice: string | null;
  }>;
  changeMemberRole: (input: {
    projectId: string;
    actorId: string;
    actorRole: BuilderRole;
    members: BuilderMember[];
    memberId: string;
    role: BuilderRole;
  }) => Promise<{
    members: BuilderMember[];
    event: ReturnType<typeof createGovernanceEvent> | null;
    notice: string | null;
  }>;
  removeMember: (input: {
    projectId: string;
    actorId: string;
    actorRole: BuilderRole;
    members: BuilderMember[];
    memberId: string;
  }) => Promise<{
    members: BuilderMember[];
    event: ReturnType<typeof createGovernanceEvent> | null;
    notice: string | null;
  }>;
};

export function createMembershipService({
  membersRepository,
}: {
  membersRepository: MemberRepository;
}): MembershipService {
  return {
    async inviteMember({
      projectId,
      actorId,
      actorRole,
      members,
      email,
      role,
    }) {
      const reason = canInviteProjectMember(actorRole, members, email);
      if (reason) return { members, event: null, notice: reason };
      const invitedMember = {
        userId: `invite-${Date.now()}`,
        email: email.trim().toLowerCase(),
        role,
      };
      return {
        members,
        event: createGovernanceEvent({
          projectId,
          actorId,
          kind: 'member-added',
          member: invitedMember,
        }),
        notice: null,
      };
    },

    async acceptInvite({
      projectId,
      actorId,
      actorRole,
      members,
      email,
      role,
    }) {
      const reason = canAcceptProjectInvite(actorRole);
      if (reason) return { members, event: null, notice: reason };
      const normalizedEmail = email.trim().toLowerCase();
      const target = members.find(
        (member) => member.email.toLowerCase() === normalizedEmail
      );
      if (!target)
        return { members, event: null, notice: 'Invitation was not found.' };
      if (target.role === role) return { members, event: null, notice: null };
      const nextMembers = members.map((member) =>
        member.email.toLowerCase() === normalizedEmail
          ? { ...member, role }
          : member
      );
      await membersRepository.saveMembers(projectId, nextMembers);
      return {
        members: nextMembers,
        event: createGovernanceEvent({
          projectId,
          actorId,
          kind: 'member-role-updated',
          member: target,
          nextRole: role,
        }),
        notice: null,
      };
    },
    async addMember({ projectId, actorId, actorRole, members, email, role }) {
      const reason = canAddProjectMember(actorRole, members, email);
      if (reason) return { members, event: null, notice: reason };
      const nextMember = {
        userId: `member-${Date.now()}`,
        email: email.trim().toLowerCase(),
        role,
      };
      const nextMembers = [...members, nextMember];
      await membersRepository.saveMembers(projectId, nextMembers);
      return {
        members: nextMembers,
        event: createGovernanceEvent({
          projectId,
          actorId,
          kind: 'member-added',
          member: nextMember,
        }),
        notice: null,
      };
    },
    async changeMemberRole({
      projectId,
      actorId,
      actorRole,
      members,
      memberId,
      role,
    }) {
      const target = members.find((member) => member.userId === memberId);
      if (!target)
        return {
          members,
          event: null,
          notice: 'Project member was not found.',
        };
      const reason = canChangeProjectMemberRole(
        actorRole,
        members,
        memberId,
        role
      );
      if (reason) return { members, event: null, notice: reason };
      const nextMember = { ...target, role };
      const nextMembers = members.map((member) =>
        member.userId === memberId ? nextMember : member
      );
      await membersRepository.saveMembers(projectId, nextMembers);
      return {
        members: nextMembers,
        event: createGovernanceEvent({
          projectId,
          actorId,
          kind: 'member-role-updated',
          member: target,
          nextRole: role,
        }),
        notice: null,
      };
    },
    async removeMember({ projectId, actorId, actorRole, members, memberId }) {
      const target = members.find((member) => member.userId === memberId);
      if (!target)
        return {
          members,
          event: null,
          notice: 'Project member was not found.',
        };
      const reason = canRemoveProjectMember(actorRole, members, memberId);
      if (reason) return { members, event: null, notice: reason };
      const nextMembers = members.filter(
        (member) => member.userId !== memberId
      );
      await membersRepository.saveMembers(projectId, nextMembers);
      return {
        members: nextMembers,
        event: createGovernanceEvent({
          projectId,
          actorId,
          kind: 'member-removed',
          member: target,
        }),
        notice: null,
      };
    },
  };
}
