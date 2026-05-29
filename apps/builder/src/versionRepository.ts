import type { PageVersion, SupabaseLikeClient } from './types';

export type VersionRepository = {
  listVersions: (pageId: string) => Promise<PageVersion[]>;
  createVersion: (version: PageVersion) => Promise<void>;
};

export function createInMemoryVersionRepository(
  seed: PageVersion[] = []
): VersionRepository {
  let state = seed;
  return {
    async listVersions(pageId) {
      return state.filter((v) => v.pageId === pageId);
    },
    async createVersion(version) {
      state = [...state, version];
    },
  };
}

export function createSupabaseVersionRepository(
  client?: SupabaseLikeClient
): VersionRepository {
  if (!client) {
    return {
      async listVersions() {
        throw new Error('Supabase version repository is not wired yet.');
      },
      async createVersion() {
        throw new Error('Supabase version repository is not wired yet.');
      },
    };
  }

  return {
    async listVersions(pageId) {
      const { data, error } = await client
        .from('page_version')
        .select('id,page_id,label,snapshot_json,author_id,created_at');
      if (error) throw new Error('Supabase version list failed');
      const rows = (data as any[]) ?? [];
      return rows
        .map((row) => ({
          id: String(row.id),
          pageId: String(row.page_id),
          label: String(row.label),
          snapshot: row.snapshot_json,
          authorId: String(row.author_id),
          createdAt: String(row.created_at),
        }))
        .filter((v) => v.pageId === pageId);
    },
    async createVersion(version) {
      const { error } = await client.from('page_version').upsert([
        {
          id: version.id,
          page_id: version.pageId,
          label: version.label,
          snapshot_json: version.snapshot,
          author_id: version.authorId,
          created_at: version.createdAt,
        },
      ]);
      if (error) throw new Error('Supabase version create failed');
    },
  };
}
