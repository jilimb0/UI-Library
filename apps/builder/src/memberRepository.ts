import type { BuilderMember, SupabaseLikeClient } from './types';

export type MemberRepository = {
  listMembers: (projectId: string) => Promise<BuilderMember[]>;
  saveMembers: (projectId: string, members: BuilderMember[]) => Promise<void>;
};

export function createInMemoryMemberRepository(
  seed?: Record<string, BuilderMember[]>
): MemberRepository {
  const memory = new Map<string, BuilderMember[]>(Object.entries(seed ?? {}));

  return {
    async listMembers(projectId) {
      return memory.get(projectId) ?? [];
    },
    async saveMembers(projectId, members) {
      memory.set(projectId, members);
    },
  };
}

export function createLocalMemberRepository(
  storageKey = 'ui-library-builder-members'
): MemberRepository {
  const loadState = async (): Promise<Record<string, BuilderMember[]>> => {
    const raw = globalThis.localStorage?.getItem(storageKey);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw) as Record<string, BuilderMember[]>;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  };

  const saveState = async (state: Record<string, BuilderMember[]>) => {
    globalThis.localStorage?.setItem(storageKey, JSON.stringify(state));
  };

  return {
    async listMembers(projectId) {
      const state = await loadState();
      return state[projectId] ?? [];
    },
    async saveMembers(projectId, members) {
      const state = await loadState();
      state[projectId] = members;
      await saveState(state);
    },
  };
}

export function createSupabaseMemberRepository(
  client?: SupabaseLikeClient
): MemberRepository {
  if (!client) {
    return {
      async listMembers() {
        throw new Error('Supabase member repository is not wired yet.');
      },
      async saveMembers() {
        throw new Error('Supabase member repository is not wired yet.');
      },
    };
  }

  return {
    async listMembers(projectId) {
      const { data, error } = await client
        .from('builder_projects')
        .select('id, members');
      if (error) throw error;
      const row = Array.isArray(data)
        ? data.find(
            (item) =>
              item &&
              typeof item === 'object' &&
              String((item as Record<string, unknown>).id ?? '') === projectId
          )
        : null;
      const members =
        row && typeof row === 'object'
          ? (row as Record<string, unknown>).members
          : null;
      return Array.isArray(members) ? (members as BuilderMember[]) : [];
    },
    async saveMembers(projectId, members) {
      const { data, error } = await client
        .from('builder_projects')
        .select('id, name, pages, publish, members');
      if (error) throw error;
      const rows = Array.isArray(data) ? data : [];
      const nextRows = rows.map((row) => {
        if (!row || typeof row !== 'object') return row;
        const source = row as Record<string, unknown>;
        if (String(source.id ?? '') !== projectId) return row;
        return {
          id: source.id,
          name: source.name,
          pages: source.pages,
          publish: source.publish,
          members,
        };
      });
      const { error: upsertError } = await client
        .from('builder_projects')
        .upsert(nextRows);
      if (upsertError) throw upsertError;
    },
  };
}
