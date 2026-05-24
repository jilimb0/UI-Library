import type { BuilderMember, BuilderRole } from './types';

export function canManageMembers(role: BuilderRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function canAddProjectMember(
  role: BuilderRole,
  members: BuilderMember[],
  email: string
): string | null {
  if (!canManageMembers(role))
    return 'Only admins or owners can manage project members.';
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return 'Enter an email for the new project member.';
  if (members.some((member) => member.email.toLowerCase() === normalizedEmail))
    return 'Project member with this email already exists.';
  return null;
}

export function canRemoveProjectMember(
  role: BuilderRole,
  members: BuilderMember[],
  memberId: string
): string | null {
  if (!canManageMembers(role))
    return 'Only admins or owners can manage project members.';
  const target = members.find((member) => member.userId === memberId);
  if (!target) return 'Project member was not found.';
  if (
    target.role === 'owner' &&
    members.filter((member) => member.role === 'owner').length === 1
  )
    return 'Cannot remove the last project owner.';
  return null;
}

export function canChangeProjectMemberRole(
  role: BuilderRole,
  members: BuilderMember[],
  memberId: string,
  nextRole: BuilderRole
): string | null {
  if (!canManageMembers(role))
    return 'Only admins or owners can manage project members.';
  const target = members.find((member) => member.userId === memberId);
  if (!target) return 'Project member was not found.';
  if (target.role === nextRole) return null;
  if (
    target.role === 'owner' &&
    nextRole !== 'owner' &&
    members.filter((member) => member.role === 'owner').length === 1
  )
    return 'Cannot demote the last project owner.';
  return null;
}

export function canInviteProjectMember(
  role: BuilderRole,
  members: BuilderMember[],
  email: string
): string | null {
  return canAddProjectMember(role, members, email);
}

export function canAcceptProjectInvite(role: BuilderRole): string | null {
  return canManageMembers(role)
    ? null
    : 'Only admins or owners can accept project invitations.';
}
