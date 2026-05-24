import { describe, expect, it } from 'vitest';
import {
  createBuilderSupabaseClient,
  createMemberRepository,
  createProjectRepository,
  resolveRepositoryMode,
  setRepositoryModeOverride,
} from './repositoryFactory';

describe('repositoryFactory', () => {
  it('defaults to local mode', () => {
    delete (globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string })
      .__UI_BUILDER_REPOSITORY__;
    expect(resolveRepositoryMode()).toBe('local');
  });

  it('supports memory mode from global override', async () => {
    (
      globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string }
    ).__UI_BUILDER_REPOSITORY__ = 'memory';
    const repo = createProjectRepository({
      seed: [
        {
          id: 'p1',
          name: 'Memory',
          pages: [],
          publish: {
            status: 'draft',
            publishedAt: null,
            publishedBy: null,
            sourceVersionId: null,
          },
          members: [],
        },
      ],
    });
    const loaded = await repo.loadProjects();
    expect(loaded?.[0].name).toBe('Memory');
    delete (globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string })
      .__UI_BUILDER_REPOSITORY__;
  });

  it('creates member repository in memory mode', async () => {
    (
      globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string }
    ).__UI_BUILDER_REPOSITORY__ = 'memory';
    const repo = createMemberRepository({
      seed: {
        'project-1': [
          { userId: 'owner-1', email: 'owner@builder.dev', role: 'owner' },
        ],
      },
    });
    const loaded = await repo.listMembers('project-1');
    expect(loaded[0]?.email).toBe('owner@builder.dev');
    delete (globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string })
      .__UI_BUILDER_REPOSITORY__;
  });
});

describe('repository mode resolution', () => {
  it('prefers explicit global repository mode override', () => {
    (
      globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string }
    ).__UI_BUILDER_REPOSITORY__ = 'memory';
    expect(resolveRepositoryMode()).toBe('memory');
    delete (globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string })
      .__UI_BUILDER_REPOSITORY__;
  });

  it('falls back to local for unsupported values', () => {
    (
      globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string }
    ).__UI_BUILDER_REPOSITORY__ = 'unknown';
    expect(resolveRepositoryMode()).toBe('local');
    delete (globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string })
      .__UI_BUILDER_REPOSITORY__;
  });
});

describe('repository mode override setter', () => {
  it('can set and clear repository mode override', () => {
    setRepositoryModeOverride('supabase');
    expect(resolveRepositoryMode()).toBe('supabase');
    setRepositoryModeOverride(null);
    expect(resolveRepositoryMode()).toBe('local');
  });
});

describe('builder supabase client factory', () => {
  it('returns provided supabase client when supplied', () => {
    const client = {
      from: () => ({
        select: async () => ({ data: [], error: null }),
        upsert: async () => ({ error: null }),
      }),
    };

    expect(createBuilderSupabaseClient({ supabaseClient: client })).toBe(
      client
    );
  });

  it('falls back to the stub client when no client is supplied', async () => {
    const client = createBuilderSupabaseClient();
    await expect(client.from('builder_projects').select()).resolves.toEqual({
      data: [],
      error: null,
    });
  });
});
