import { describe, expect, it } from 'vitest';
import {
  createInMemoryMemberRepository,
  createSupabaseMemberRepository,
} from './memberRepository';

describe('memberRepository', () => {
  it('stores and lists members by project', async () => {
    const repo = createInMemoryMemberRepository({
      'project-1': [
        { userId: 'owner-1', email: 'owner@builder.dev', role: 'owner' },
      ],
    });

    expect(await repo.listMembers('project-1')).toEqual([
      { userId: 'owner-1', email: 'owner@builder.dev', role: 'owner' },
    ]);

    await repo.saveMembers('project-2', [
      { userId: 'viewer-1', email: 'viewer@builder.dev', role: 'viewer' },
    ]);
    expect(await repo.listMembers('project-2')).toEqual([
      { userId: 'viewer-1', email: 'viewer@builder.dev', role: 'viewer' },
    ]);
  });

  it('throws when supabase client is missing', async () => {
    const repo = createSupabaseMemberRepository();
    await expect(repo.listMembers('project-1')).rejects.toThrow(/not wired/i);
    await expect(repo.saveMembers('project-1', [])).rejects.toThrow(
      /not wired/i
    );
  });
});
