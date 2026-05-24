import {
  type CommentRepository,
  createSupabaseCommentRepository,
} from './commentRepository';
import {
  createSupabaseMemberRepository,
  type MemberRepository,
} from './memberRepository';
import type { ProjectRepository } from './persistence';
import {
  createSupabasePublishEventRepository,
  type PublishEventRepository,
} from './publishEventRepository';
import { createProjectRepository } from './repositoryFactory';
import type { SupabaseLikeClient } from './types';
import {
  createSupabaseVersionRepository,
  type VersionRepository,
} from './versionRepository';

export type BuilderDataServices = {
  projects: ProjectRepository;
  comments: CommentRepository;
  versions: VersionRepository;
  publishEvents: PublishEventRepository;
  members: MemberRepository;
};

export function createDataServices(options?: {
  supabaseClient?: SupabaseLikeClient;
}): BuilderDataServices {
  return {
    projects: createProjectRepository({
      supabaseClient: options?.supabaseClient,
    }),
    comments: createSupabaseCommentRepository(options?.supabaseClient),
    versions: createSupabaseVersionRepository(options?.supabaseClient),
    publishEvents: createSupabasePublishEventRepository(
      options?.supabaseClient
    ),
    members: createSupabaseMemberRepository(options?.supabaseClient),
  };
}
