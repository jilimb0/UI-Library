import { describe, expect, it } from 'vitest';
import {
  createInMemoryVersionRepository,
  createSupabaseVersionRepository,
} from './versionRepository';

describe('versionRepository', () => {
  it('preserves version metadata order', async () => {
    const repo = createInMemoryVersionRepository();
    await repo.createVersion({
      id: 'v1',
      pageId: 'home',
      label: 'Initial',
      snapshot: { id: 'r', componentId: 'card', props: {}, children: [] },
      authorId: 'u1',
      createdAt: '2026-01-01',
    });
    await repo.createVersion({
      id: 'v2',
      pageId: 'home',
      label: 'Published',
      snapshot: {
        id: 'r2',
        componentId: 'card',
        props: { title: 'Published' },
        children: [],
      },
      authorId: 'u1',
      createdAt: '2026-01-02',
    });
    const list = await repo.listVersions('home');
    expect(list.map((item) => item.id)).toEqual(['v1', 'v2']);
  });

  it('in-memory lists and creates versions', async () => {
    const repo = createInMemoryVersionRepository();
    await repo.createVersion({
      id: 'v1',
      pageId: 'home',
      label: 'Initial',
      snapshot: { id: 'r', componentId: 'card', props: {}, children: [] },
      authorId: 'u1',
      createdAt: '2026-01-01',
    });
    const list = await repo.listVersions('home');
    expect(list).toHaveLength(1);
  });

  it('supabase stub throws when not wired', async () => {
    const repo = createSupabaseVersionRepository();
    await expect(repo.listVersions('home')).rejects.toThrow(/not wired/i);
  });
});
