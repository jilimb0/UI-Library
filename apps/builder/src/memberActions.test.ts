import { describe, expect, it } from 'vitest';
import {
  getMemberByEmail,
  getMemberById,
  validateInviteAcceptance,
  validateMemberRemoval,
  validateMemberRoleChange,
  validateNewMember,
} from './memberActions';

describe('memberActions', () => {
  const members = [
    { userId: 'u1', email: 'owner@builder.dev', role: 'owner' as const },
    { userId: 'u2', email: 'viewer@builder.dev', role: 'viewer' as const },
  ];

  it('finds members', () => {
    expect(getMemberByEmail(members, 'Viewer@Builder.Dev')?.userId).toBe('u2');
    expect(getMemberByEmail(members, 'viewer@builder.dev')?.userId).toBe('u2');
    expect(getMemberById(members, 'u1')?.email).toBe('owner@builder.dev');
  });

  it('validates member actions through policy helpers', () => {
    expect(validateNewMember('viewer', members, 'x@y.dev')).toBe(
      'Only admins or owners can manage project members.'
    );
    expect(validateInviteAcceptance('viewer')).toBe(
      'Only admins or owners can accept project invitations.'
    );
    expect(
      validateMemberRoleChange('owner', members, 'u2', 'editor')
    ).toBeNull();
    expect(validateMemberRemoval('owner', members, 'u2')).toBeNull();
  });
});
