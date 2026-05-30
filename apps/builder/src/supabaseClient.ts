import type { SupabaseLikeClient } from './types';

type Env = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

export type SupabaseBootstrapState = {
  enabled: boolean;
  mode: 'configured' | 'stub' | 'partial';
  detail: string;
  summary: string;
  guidance: string[];
  severity: 'healthy' | 'warning' | 'error';
};

export function getSupabaseEnv(env?: Partial<Env>): Env {
  const source =
    env ?? (import.meta as ImportMeta & { env?: Partial<Env> }).env ?? {};
  return {
    VITE_SUPABASE_URL: source.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: source.VITE_SUPABASE_ANON_KEY,
  };
}

const stubStorage = {
  getItem(key: string) {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(`ui-library-supabase-stub-${key}`);
  },
  setItem(key: string, value: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(`ui-library-supabase-stub-${key}`, value);
  },
};

function isRowWithId(value: unknown): value is Record<string, unknown> & {
  id: unknown;
} {
  return value !== null && typeof value === 'object' && 'id' in value;
}

export function createSupabaseClientStub(
  _env = getSupabaseEnv()
): SupabaseLikeClient {
  return {
    from: (table: string) => ({
      async select() {
        const raw = stubStorage.getItem(table);
        const data = raw ? JSON.parse(raw) : [];
        return { data, error: null };
      },
      async upsert(rows: unknown[]) {
        const raw = stubStorage.getItem(table);
        const parsed: unknown = raw ? JSON.parse(raw) : [];
        const data: Record<string, unknown>[] = Array.isArray(parsed)
          ? parsed.filter(
              (item): item is Record<string, unknown> =>
                item !== null && typeof item === 'object'
            )
          : [];

        const rowsArray = Array.isArray(rows) ? rows : [rows];
        for (const row of rowsArray) {
          if (row && typeof row === 'object') {
            const rowObj = row as Record<string, unknown>;
            const existingIndex = data.findIndex(
              (item) => isRowWithId(item) && item.id === rowObj.id
            );
            if (existingIndex !== -1) {
              data[existingIndex] = { ...data[existingIndex], ...rowObj };
            } else {
              data.push(rowObj);
            }
          }
        }
        stubStorage.setItem(table, JSON.stringify(data));
        return { error: null };
      },
    }),
  };
}

export function getSupabaseConnectionStatus(
  env = getSupabaseEnv()
): SupabaseBootstrapState {
  const hasUrl = Boolean(env.VITE_SUPABASE_URL);
  const hasAnonKey = Boolean(env.VITE_SUPABASE_ANON_KEY);

  if (hasUrl && hasAnonKey) {
    return {
      enabled: true,
      mode: 'configured',
      detail: 'Supabase environment variables detected.',
      summary: 'Remote repository is connected.',
      guidance: [
        'Builder can use Supabase-backed project and member repositories.',
        'If remote actions fail, verify table migrations and Row Level Security policies next.',
      ],
      severity: 'healthy',
    };
  }

  if (hasUrl || hasAnonKey) {
    const missingVariable = hasUrl
      ? 'VITE_SUPABASE_ANON_KEY'
      : 'VITE_SUPABASE_URL';
    return {
      enabled: false,
      mode: 'partial',
      detail: `Supabase configuration is incomplete. Missing ${missingVariable}.`,
      summary: 'Remote repository setup is incomplete.',
      guidance: [
        `Add ${missingVariable} so Supabase mode can connect to the real backend.`,
        'Until configuration is complete, remote mode should be treated as disconnected and non-authoritative.',
        'Switch to local or memory mode if you need predictable editing while environment setup is being fixed.',
      ],
      severity: 'error',
    };
  }

  return {
    enabled: false,
    mode: 'stub',
    detail:
      'Supabase mode is using the local stub client until env credentials are provided.',
    summary: 'Remote repository is not configured.',
    guidance: [
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable the real remote-backed mode.',
      'Until then, Supabase mode only simulates reads and writes with the local stub client.',
      'If you expected a real backend, switch repository mode to local or memory to avoid false confidence.',
    ],
    severity: 'warning',
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
