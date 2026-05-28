import { describe, expect, it } from 'vitest';
import {
  canAcceptProjectInvite,
  canAddProjectMember,
  canChangeProjectMemberRole,
  canRemoveProjectMember,
} from './memberPolicy';
import type { BuilderMember } from './types';

const baseMembers: BuilderMember[] = [
  { userId: 'owner-1', email: 'owner@builder.dev', role: 'owner' },
  { userId: 'editor-1', email: 'editor@builder.dev', role: 'editor' },
];

describe('memberPolicy', () => {
  it('blocks adding members for non-governance roles', () => {
    expect(
      canAddProjectMember('editor', baseMembers, 'new@builder.dev')
    ).toMatch(/only admins or owners/i);
  });

  it('requires an email when adding a project member', () => {
    expect(canAddProjectMember('owner', baseMembers, '   ')).toMatch(
      /enter an email/i
    );
  });

  it('rejects duplicate emails when adding a member', () => {
    expect(
      canAddProjectMember('owner', baseMembers, 'OWNER@builder.dev')
    ).toMatch(/already exists/i);
  });

  it('blocks demoting the last owner', () => {
    expect(
      canChangeProjectMemberRole('owner', [baseMembers[0]], 'owner-1', 'editor')
    ).toMatch(/last project owner/i);
  });

  it('allows changing a member role when governance checks pass', () => {
    expect(
      canChangeProjectMemberRole('owner', baseMembers, 'editor-1', 'viewer')
    ).toBeNull();
  });

  it('blocks removing the last owner', () => {
    expect(
      canRemoveProjectMember('owner', [baseMembers[0]], 'owner-1')
    ).toMatch(/last project owner/i);
  });

  it('requires governance role to accept project invites', () => {
    expect(canAcceptProjectInvite('viewer')).toMatch(/only admins or owners/i);
  });

  it('allows owners to accept project invites', () => {
    expect(canAcceptProjectInvite('owner')).toBeNull();
  });
});
