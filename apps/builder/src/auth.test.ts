import { describe, expect, it } from 'vitest';
import {
  canComment,
  canEditLayout,
  canManageProject,
  canManagePublishLifecycle,
  canRestoreVersion,
  canSaveVersion,
  createLocalSession,
  createLocalSessionRepository,
  createSessionFromMember,
  createSessionRepository,
} from './auth';
import {
  getSupabaseConnectionStatus,
  getSupabaseSessionIdentity,
} from './supabaseClient';

describe('auth role guards', () => {
  it('editor can edit and comment', () => {
    const s = createLocalSession('editor');
    expect(canEditLayout(s)).toBe(true);
    expect(canComment(s)).toBe(true);
  });

  it('viewer cannot edit or comment', () => {
    const s = createLocalSession('viewer');
    expect(canEditLayout(s)).toBe(false);
    expect(canComment(s)).toBe(false);
  });

  it('admin can manage project', () => {
    const s = createLocalSession('admin');
    expect(canManageProject(s)).toBe(true);
  });
});

it('editor cannot manage publish lifecycle', () => {
  const s = createLocalSession('editor');
  expect(canManagePublishLifecycle(s)).toBe(false);
});

it('owner can manage publish lifecycle', () => {
  const s = createLocalSession('owner');
  expect(canManagePublishLifecycle(s)).toBe(true);
});

it('editor can save versions but not restore them', () => {
  const s = createLocalSession('editor');
  expect(canSaveVersion(s)).toBe(true);
  expect(canRestoreVersion(s)).toBe(false);
});

it('viewer cannot save versions', () => {
  const s = createLocalSession('viewer');
  expect(canSaveVersion(s)).toBe(false);
});

describe('session repository', () => {
  it('persists and clears selected session member id and route', () => {
    const store = new Map();
    const localStorageMock = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });

    const repository = createLocalSessionRepository('test-session-key');
    expect(repository.loadSessionMemberId()).toBeNull();
    repository.saveSessionMemberId('local-admin');
    expect(repository.loadSessionMemberId()).toBe('local-admin');
    repository.saveRoute('/projects/project-1/pages/landing');
    expect(repository.loadRoute()).toBe('/projects/project-1/pages/landing');
    repository.clearSessionMemberId();
    repository.clearRoute();
    expect(repository.loadSessionMemberId()).toBeNull();
    expect(repository.loadRoute()).toBeNull();
  });
});

describe('supabase connection status', () => {
  it('reports configured when both supabase env variables are present', () => {
    expect(
      getSupabaseConnectionStatus({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'anon-key',
      })
    ).toEqual({
      enabled: true,
      mode: 'configured',
      detail: 'Supabase environment variables detected.',
    });
  });

  it('reports stub when supabase env variables are missing', () => {
    expect(getSupabaseConnectionStatus({})).toEqual({
      enabled: false,
      mode: 'stub',
      detail:
        'Supabase mode is using the local stub client until env credentials are provided.',
    });
  });
});

describe('session provider', () => {
  it('creates local sessions by default', () => {
    expect(
      createSessionFromMember({
        userId: 'u1',
        email: 'user@example.com',
        role: 'editor',
      })
    ).toMatchObject({
      provider: 'local',
      userId: 'u1',
      email: 'user@example.com',
      role: 'editor',
    });
  });

  it('allows overriding provider for remote-backed sessions', () => {
    expect(
      createSessionFromMember(
        { userId: 'u2', email: 'remote@example.com', role: 'viewer' },
        'supabase'
      )
    ).toMatchObject({
      provider: 'supabase',
      userId: 'u2',
      email: 'remote@example.com',
      role: 'viewer',
    });
  });
});

describe('supabase session identity', () => {
  it('returns authenticated identity when env is configured', () => {
    expect(
      getSupabaseSessionIdentity({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'anon-key',
      })
    ).toEqual({
      provider: 'supabase',
      status: 'authenticated',
      email: 'connected@supabase.builder.dev',
      userId: 'supabase-connected-user',
    });
  });

  it('returns stub identity when env is missing', () => {
    expect(getSupabaseSessionIdentity({})).toEqual({
      provider: 'supabase',
      status: 'stub',
      email: 'stub@supabase.builder.dev',
      userId: 'supabase-stub-user',
    });
  });
});

describe('session repository factory', () => {
  it('returns a working session repository abstraction', () => {
    const store = new Map();
    const localStorageMock = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });

    const repository = createSessionRepository('factory-session-key');
    repository.saveSessionMemberId('member-1');
    expect(repository.loadSessionMemberId()).toBe('member-1');
  });
});
