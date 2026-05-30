import type { LayoutNode, PageVersion, SupabaseLikeClient } from './types';

export type VersionRepository = {
  listVersions: (pageId: string) => Promise<PageVersion[]>;
  createVersion: (version: PageVersion) => Promise<void>;
};

type VersionRow = {
  id?: unknown;
  page_id?: unknown;
  label?: unknown;
  snapshot_json?: unknown;
  author_id?: unknown;
  created_at?: unknown;
};

function toRecordArray(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data)
    ? data.filter(
        (row): row is Record<string, unknown> =>
          row !== null && typeof row === 'object'
      )
    : [];
}

function isLayoutNode(value: unknown): value is LayoutNode {
  if (value === null || typeof value !== 'object') return false;
  const node = value as Record<string, unknown>;
  return (
    typeof node.id === 'string' &&
    typeof node.componentId === 'string' &&
    node.props !== null &&
    typeof node.props === 'object' &&
    Array.isArray(node.children) &&
    node.children.every(isLayoutNode)
  );
}

function fallbackSnapshot(id: unknown): LayoutNode {
  return {
    id: typeof id === 'string' && id.trim() ? id : 'recovered-version-root',
    componentId: 'container',
    props: {},
    children: [],
  };
}

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
      const rows = toRecordArray(data) as VersionRow[];
      return rows
        .map((row) => ({
          id: String(row.id),
          pageId: String(row.page_id),
          label: String(row.label),
          snapshot: isLayoutNode(row.snapshot_json)
            ? row.snapshot_json
            : fallbackSnapshot(row.id),
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
