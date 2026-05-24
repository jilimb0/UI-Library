import type { SupabaseLikeClient } from './types';

type Env = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

export type SupabaseBootstrapState = {
  enabled: boolean;
  mode: 'configured' | 'stub';
  detail: string;
};

export function getSupabaseEnv(env?: Partial<Env>): Env {
  const source =
    env ?? (import.meta as ImportMeta & { env?: Partial<Env> }).env ?? {};
  return {
    VITE_SUPABASE_URL: source.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: source.VITE_SUPABASE_ANON_KEY,
  };
}

export function createSupabaseClientStub(
  _env = getSupabaseEnv()
): SupabaseLikeClient {
  return {
    from: (_table: string) => ({
      async select() {
        return { data: [], error: null };
      },
      async upsert() {
        return { error: null };
      },
    }),
  };
}

export function getSupabaseConnectionStatus(
  env = getSupabaseEnv()
): SupabaseBootstrapState {
  if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
    return {
      enabled: true,
      mode: 'configured',
      detail: 'Supabase environment variables detected.',
    };
  }

  return {
    enabled: false,
    mode: 'stub',
    detail:
      'Supabase mode is using the local stub client until env credentials are provided.',
  };
}

export function getSupabaseSessionIdentity(env = getSupabaseEnv()): {
  provider: 'supabase';
  status: 'authenticated' | 'stub';
  email: string;
  userId: string;
} {
  const status = getSupabaseConnectionStatus(env);

  if (status.mode === 'configured') {
    return {
      provider: 'supabase',
      status: 'authenticated',
      email: 'connected@supabase.builder.dev',
      userId: 'supabase-connected-user',
    };
  }

  return {
    provider: 'supabase',
    status: 'stub',
    email: 'stub@supabase.builder.dev',
    userId: 'supabase-stub-user',
  };
}
