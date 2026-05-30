import {
  canAcceptProjectInvite,
  canAddProjectMember,
  canChangeProjectMemberRole,
  canRemoveProjectMember,
} from './memberPolicy';
import type { BuilderMember, BuilderRole } from './types';

export function validateNewMember(
  sessionRole: BuilderRole,
  members: BuilderMember[],
  email: string
): string | null {
  return canAddProjectMember(sessionRole, members, email);
}

export function validateInviteAcceptance(
  sessionRole: BuilderRole
): string | null {
  return canAcceptProjectInvite(sessionRole);
}

export function validateMemberRoleChange(
  sessionRole: BuilderRole,
  members: BuilderMember[],
  memberId: string,
  role: BuilderRole
): string | null {
  return canChangeProjectMemberRole(sessionRole, members, memberId, role);
}

export function validateMemberRemoval(
  sessionRole: BuilderRole,
  members: BuilderMember[],
  memberId: string
): string | null {
  return canRemoveProjectMember(sessionRole, members, memberId);
}

export function getMemberByEmail(
  members: BuilderMember[],
  email: string
): BuilderMember | null {
  return members.find((entry) => entry.email.toLowerCase() === email) ?? null;
}

export function getMemberById(
  members: BuilderMember[],
  memberId: string
): BuilderMember | null {
  return members.find((entry) => entry.userId === memberId) ?? null;
}
