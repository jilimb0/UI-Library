import type { CommentRecord, SupabaseLikeClient } from './types';

export type CommentRepository = {
  listComments: (pageId: string) => Promise<CommentRecord[]>;
  createComment: (comment: CommentRecord) => Promise<void>;
  resolveComment: (commentId: string) => Promise<void>;
};

export function createInMemoryCommentRepository(
  seed: CommentRecord[] = []
): CommentRepository {
  let state = seed;
  return {
    async listComments(pageId) {
      return state.filter((c) => c.pageId === pageId);
    },
    async createComment(comment) {
      state = [...state, comment];
    },
    async resolveComment(commentId) {
      state = state.map((c) =>
        c.id === commentId ? { ...c, resolved: true } : c
      );
    },
  };
}

export function createSupabaseCommentRepository(
  client?: SupabaseLikeClient
): CommentRepository {
  if (!client) {
    return {
      async listComments() {
        throw new Error('Supabase comment repository is not wired yet.');
      },
      async createComment() {
        throw new Error('Supabase comment repository is not wired yet.');
      },
      async resolveComment() {
        throw new Error('Supabase comment repository is not wired yet.');
      },
    };
  }

  return {
    async listComments(pageId) {
      const { data, error } = await client
        .from('comment')
        .select('id,page_id,node_id,body,author_id,resolved,created_at');
      if (error) throw new Error('Supabase comment list failed');
      return ((data as CommentRecord[]) ?? []).filter(
        (c) => c.pageId === pageId
      );
    },
    async createComment(comment) {
      const { error } = await client.from('comment').upsert([
        {
          id: comment.id,
          page_id: comment.pageId,
          node_id: comment.nodeId,
          body: comment.body,
          author_id: comment.authorId,
          resolved: comment.resolved,
          created_at: comment.createdAt,
        },
      ]);
      if (error) throw new Error('Supabase comment create failed');
    },
    async resolveComment(commentId) {
      const { error } = await client
        .from('comment')
        .upsert([{ id: commentId, resolved: true }]);
      if (error) throw new Error('Supabase comment resolve failed');
    },
  };
}
