import { describe, expect, it } from 'vitest';
import {
  createInMemoryPublishEventRepository,
  createSupabasePublishEventRepository,
} from './publishEventRepository';

describe('publishEventRepository', () => {
  it('stores and filters events by project', async () => {
    const repo = createInMemoryPublishEventRepository();
    await repo.createEvent({
      id: 'e1',
      projectId: 'project-1',
      pageId: 'home',
      type: 'published',
      actorId: 'u1',
      createdAt: '2026-01-01',
      sourceVersionId: 'v1',
      note: 'Published home',
    });
    await repo.createEvent({
      id: 'e2',
      projectId: 'project-2',
      pageId: 'docs',
      type: 'unpublished',
      actorId: 'u2',
      createdAt: '2026-01-02',
      sourceVersionId: null,
      note: null,
    });
    const list = await repo.listEvents('project-1');
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe('e1');
  });

  it('throws when supabase client is missing', async () => {
    const repo = createSupabasePublishEventRepository();
    await expect(repo.listEvents('project-1')).rejects.toThrow(/not wired/i);
  });
});

it('persists governance payloads', async () => {
  const repo = createInMemoryPublishEventRepository();
  await repo.createEvent({
    id: 'e3',
    projectId: 'project-1',
    pageId: null,
    type: 'member-added',
    actorId: 'u1',
    createdAt: '2026-01-03',
    sourceVersionId: null,
    note: 'Added member',
    payload: {
      kind: 'member-added',
      memberId: 'm1',
      memberEmail: 'new@builder.dev',
    },
  });
  const list = await repo.listEvents('project-1');
  expect(list[0]?.payload?.kind).toBe('member-added');
});
