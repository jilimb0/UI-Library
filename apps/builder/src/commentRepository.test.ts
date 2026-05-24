import { describe, expect, it } from 'vitest';
import {
  createInMemoryCommentRepository,
  createSupabaseCommentRepository,
} from './commentRepository';

describe('commentRepository', () => {
  it('in-memory create/list/resolve', async () => {
    const repo = createInMemoryCommentRepository();
    await repo.createComment({
      id: 'c1',
      pageId: 'home',
      body: 'Looks good',
      authorId: 'u1',
      resolved: false,
      createdAt: '2026-01-01',
    });
    await repo.resolveComment('c1');
    const list = await repo.listComments('home');
    expect(list[0].resolved).toBe(true);
  });

  it('supabase stub throws when not wired', async () => {
    const repo = createSupabaseCommentRepository();
    await expect(repo.listComments('home')).rejects.toThrow(/not wired/i);
  });
});
