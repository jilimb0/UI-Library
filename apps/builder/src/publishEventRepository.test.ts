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

  it('preserves governance payloads when reading from supabase rows', async () => {
    const rows = [
      {
        id: 'e3',
        project_id: 'project-1',
        page_id: null,
        type: 'member-added',
        actor_id: 'u1',
        created_at: '2026-01-03',
        source_version_id: null,
        note: 'Added member',
        payload: {
          kind: 'member-added',
          member_id: 'm1',
          member_email: 'new@builder.dev',
        },
      },
    ];
    const repo = createSupabasePublishEventRepository({
      from() {
        return {
          async select() {
            return { data: rows, error: null };
          },
          async upsert() {
            return { error: null };
          },
        };
      },
    } as never);

    const list = await repo.listEvents('project-1');
    expect(list[0]?.payload?.kind).toBe('member-added');
    expect(list[0]?.payload?.memberEmail).toBe('new@builder.dev');
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
