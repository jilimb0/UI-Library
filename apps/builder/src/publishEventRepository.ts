import type { PublishEventRecord, SupabaseLikeClient } from './types';

export type PublishEventRepository = {
  listEvents: (projectId: string) => Promise<PublishEventRecord[]>;
  createEvent: (event: PublishEventRecord) => Promise<void>;
};

export function createInMemoryPublishEventRepository(
  seed: PublishEventRecord[] = []
): PublishEventRepository {
  let state = seed;
  return {
    async listEvents(projectId) {
      return state.filter((event) => event.projectId === projectId);
    },
    async createEvent(event) {
      state = [event, ...state];
    },
  };
}

export function createSupabasePublishEventRepository(
  client?: SupabaseLikeClient
): PublishEventRepository {
  if (!client) {
    return {
      async listEvents() {
        throw new Error('Supabase publish event repository is not wired yet.');
      },
      async createEvent() {
        throw new Error('Supabase publish event repository is not wired yet.');
      },
    };
  }

  return {
    async listEvents(projectId) {
      const { data, error } = await client
        .from('publish_event')
        .select(
          'id,project_id,page_id,type,actor_id,created_at,source_version_id,note'
        );
      if (error) throw new Error('Supabase publish event list failed');
      const rows = (data as any[]) ?? [];
      return rows
        .map((row) => ({
          id: String(row.id),
          projectId: String(row.project_id),
          pageId: row.page_id ? String(row.page_id) : null,
          type: String(row.type) as any,
          actorId: String(row.actor_id),
          createdAt: String(row.created_at),
          sourceVersionId: row.source_version_id
            ? String(row.source_version_id)
            : null,
          note: row.note ? String(row.note) : null,
        }))
        .filter((event) => event.projectId === projectId);
    },
    async createEvent(event) {
      const { error } = await client.from('publish_event').upsert([
        {
          id: event.id,
          project_id: event.projectId,
          page_id: event.pageId,
          type: event.type,
          actor_id: event.actorId,
          created_at: event.createdAt,
          source_version_id: event.sourceVersionId,
          note: event.note,
        },
      ]);
      if (error) throw new Error('Supabase publish event create failed');
    },
  };
}
