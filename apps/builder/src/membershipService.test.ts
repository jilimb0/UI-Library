import { describe, expect, it } from 'vitest';
import { createInMemoryMemberRepository } from './memberRepository';
import { createMembershipService } from './membershipService';

function makeService() {
  return createMembershipService({
    membersRepository: createInMemoryMemberRepository({
      'project-1': [
        { userId: 'owner-1', email: 'owner@builder.dev', role: 'owner' },
      ],
    }),
  });
}

describe('membershipService', () => {
  it('adds a member and returns governance event', async () => {
    const service = makeService();
    const result = await service.addMember({
      projectId: 'project-1',
      actorId: 'owner-1',
      actorRole: 'owner',
      members: [
        { userId: 'owner-1', email: 'owner@builder.dev', role: 'owner' },
      ],
      email: 'new@builder.dev',
      role: 'editor',
    });

    expect(result.notice).toBeNull();
    expect(result.members).toHaveLength(2);
    expect(result.event?.type).toBe('member-added');
  });

  it('rejects duplicate email', async () => {
    const service = makeService();
    const result = await service.addMember({
      projectId: 'project-1',
      actorId: 'owner-1',
      actorRole: 'owner',
      members: [
        { userId: 'owner-1', email: 'owner@builder.dev', role: 'owner' },
      ],
      email: 'owner@builder.dev',
      role: 'editor',
    });

    expect(result.notice).toMatch(/already exists/i);
    expect(result.event).toBeNull();
  });
});
