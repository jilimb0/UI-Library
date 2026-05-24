import { describe, expect, it } from 'vitest';
import {
  createDefaultPublishRecord,
  createInMemoryProjectRepository,
  createSupabaseProjectRepository,
} from './persistence';
import type { BuilderProject, SupabaseLikeClient } from './types';

const sample: BuilderProject[] = [
  {
    id: 'p1',
    name: 'Demo',
    pages: [
      {
        id: 'landing',
        title: 'Landing',
        root: { id: 'root', componentId: 'stack', props: {}, children: [] },
      },
    ],
    publish: createDefaultPublishRecord(),
    members: [],
  },
];

function makeSupabaseClient(
  seed: BuilderProject[] = sample
): SupabaseLikeClient {
  let rows = [...seed];
  return {
    from: () => ({
      select: async () => ({ data: rows, error: null }),
      upsert: async (nextRows) => {
        rows = nextRows as BuilderProject[];
        return { error: null };
      },
    }),
  };
}

describe('persistence repositories', () => {
  it('loads and saves projects in memory', async () => {
    const repo = createInMemoryProjectRepository(sample);
    const loaded = await repo.loadProjects();
    expect(loaded?.[0].name).toBe('Demo');
    await repo.renameProject('p1', 'Renamed');
    const renamed = await repo.listProjects();
    expect(renamed[0].name).toBe('Renamed');
  });

  it('normalizes publish metadata from supabase rows', async () => {
    const client = makeSupabaseClient([
      {
        ...sample[0],
        publish: {
          status: 'published',
          publishedAt: '2026-05-24T00:00:00.000Z',
          publishedBy: 'owner-1',
          sourceVersionId: 'v1',
        },
      },
    ]);
    const repo = createSupabaseProjectRepository(client);
    const loaded = await repo.loadProjects();
    expect(loaded?.[0].publish.status).toBe('published');
    expect(loaded?.[0].publish.publishedBy).toBe('owner-1');
    expect(loaded?.[0].publish.sourceVersionId).toBe('v1');
  });
});

it('saves pages through the supabase repository and preserves publish metadata', async () => {
  const client = makeSupabaseClient([
    {
      ...sample[0],
      publish: {
        status: 'published',
        publishedAt: '2026-05-24T00:00:00.000Z',
        publishedBy: 'owner-1',
        sourceVersionId: 'v1',
      },
    },
  ]);
  const repo = createSupabaseProjectRepository(client);

  const next = await repo.savePage('p1', {
    id: 'docs',
    title: 'Docs',
    root: {
      id: 'docs-root',
      componentId: 'stack',
      props: { title: 'Docs' },
      children: [],
    },
  });

  expect(next[0].pages.some((page) => page.id === 'docs')).toBe(true);
  expect(next[0].publish.status).toBe('published');
  expect(next[0].publish.sourceVersionId).toBe('v1');
});

it('renames projects through the supabase repository', async () => {
  const repo = createSupabaseProjectRepository(makeSupabaseClient());
  const next = await repo.renameProject('p1', 'Remote rename');
  expect(next[0].name).toBe('Remote rename');
});
