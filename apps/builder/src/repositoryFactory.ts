import type { MemberRepository } from './memberRepository';
import {
  createInMemoryMemberRepository,
  createLocalMemberRepository,
  createSupabaseMemberRepository,
} from './memberRepository';
import type { ProjectRepository } from './persistence';
import {
  createInMemoryProjectRepository,
  createLocalProjectRepository,
  createSupabaseProjectRepository,
} from './persistence';
import { createSupabaseClientStub } from './supabaseClient';
import type { BuilderMember, SupabaseLikeClient } from './types';

type Mode = 'local' | 'memory' | 'supabase';

export function resolveRepositoryMode(): Mode {
  const globalMode = (
    globalThis as unknown as { __UI_BUILDER_REPOSITORY__?: string }
  ).__UI_BUILDER_REPOSITORY__;

  if (typeof globalMode === 'string') {
    const normalized = globalMode.toLowerCase();
    if (
      normalized === 'supabase' ||
      normalized === 'memory' ||
      normalized === 'local'
    ) {
      return normalized;
    }
  }

  return 'local';
}

export function createProjectRepository(options?: {
  storageKey?: string;
  supabaseClient?: SupabaseLikeClient;
  seed?: Parameters<typeof createInMemoryProjectRepository>[0];
}): ProjectRepository {
  const mode = resolveRepositoryMode();

  if (mode === 'memory') {
    return createInMemoryProjectRepository(options?.seed ?? []);
  }

  if (mode === 'supabase') {
    return createSupabaseProjectRepository(
      createBuilderSupabaseClient({ supabaseClient: options?.supabaseClient })
    );
  }

  return createLocalProjectRepository(options?.storageKey);
}

export function createMemberRepository(options?: {
  storageKey?: string;
  supabaseClient?: SupabaseLikeClient;
  seed?: Record<string, BuilderMember[]>;
}): MemberRepository {
  const mode = resolveRepositoryMode();

  if (mode === 'memory') {
    return createInMemoryMemberRepository(options?.seed ?? {});
  }

  if (mode === 'supabase') {
    return createSupabaseMemberRepository(
      createBuilderSupabaseClient({ supabaseClient: options?.supabaseClient })
    );
  }

  return createLocalMemberRepository(options?.storageKey);
}

export function setRepositoryModeOverride(mode: Mode | null): void {
  const target = globalThis as unknown as {
    __UI_BUILDER_REPOSITORY__?: string;
  };
  if (mode === null) {
    delete target.__UI_BUILDER_REPOSITORY__;
    return;
  }
  target.__UI_BUILDER_REPOSITORY__ = mode;
}

export function createBuilderSupabaseClient(options?: {
  supabaseClient?: SupabaseLikeClient;
}): SupabaseLikeClient {
  return options?.supabaseClient ?? createSupabaseClientStub();
}
