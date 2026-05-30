import type { SupabaseBootstrapState } from './supabaseClient';
import type { RepositoryConnectivityStatus } from './types';

function createSupabaseConnectivityStatus(
  supabaseStatus: SupabaseBootstrapState
): RepositoryConnectivityStatus {
  if (supabaseStatus.mode === 'configured') {
    return {
      mode: 'supabase',
      state: 'connected',
      label: 'remote connected',
      summary: supabaseStatus.summary,
      guidance: supabaseStatus.guidance,
      recovery: 'Remote persistence is ready for collaborative editing.',
      tone: {
        background: '#dcfce7',
        color: '#166534',
        border: '1px solid #86efac',
      },
      isRemoteAuthoritative: true,
      allowsSafeRemoteActions: true,
    };
  }

  if (supabaseStatus.mode === 'partial') {
    return {
      mode: 'supabase',
      state: 'disconnected',
      label: 'remote disconnected',
      summary: supabaseStatus.summary,
      guidance: supabaseStatus.guidance,
      recovery:
        'Complete the missing Supabase environment variable or switch back to local or memory mode before continuing collaborative work.',
      tone: {
        background: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fca5a5',
      },
      isRemoteAuthoritative: false,
      allowsSafeRemoteActions: false,
    };
  }

  return {
    mode: 'supabase',
    state: 'degraded',
    label: 'remote stub',
    summary: supabaseStatus.summary,
    guidance: supabaseStatus.guidance,
    recovery:
      'Provide Supabase credentials to leave stub mode, or stay on local or memory mode for predictable non-remote editing.',
    tone: {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fcd34d',
    },
    isRemoteAuthoritative: false,
    allowsSafeRemoteActions: false,
  };
}

export function getRepositoryConnectivityStatus(
  repositoryMode: 'local' | 'memory' | 'supabase',
  supabaseStatus: SupabaseBootstrapState
): RepositoryConnectivityStatus {
  if (repositoryMode === 'supabase') {
    return createSupabaseConnectivityStatus(supabaseStatus);
  }

  if (repositoryMode === 'memory') {
    return {
      mode: 'memory',
      state: 'ephemeral',
      label: 'ephemeral runtime',
      summary: 'Changes live only for this in-memory session.',
      guidance: [
        'Use memory mode for demos, tests, and disposable editing sessions.',
        'Reloading the app resets unsaved in-memory state.',
      ],
      recovery:
        'Save or export anything important before reloading because memory mode is intentionally disposable.',
      tone: {
        background: '#e0f2fe',
        color: '#075985',
        border: '1px solid #7dd3fc',
      },
      isRemoteAuthoritative: false,
      allowsSafeRemoteActions: false,
    };
  }

  return {
    mode: 'local',
    state: 'local-only',
    label: 'local runtime',
    summary: 'Changes are stored in the local browser-backed repository.',
    guidance: [
      'Local mode keeps project state on this device only.',
      'Switch to Supabase mode when you need remote-backed collaboration and persistence diagnostics.',
    ],
    recovery:
      'Keep working locally on this device, or switch to Supabase when you need shared remote persistence.',
    tone: {
      background: '#e2e8f0',
      color: '#334155',
      border: '1px solid #cbd5e1',
    },
    isRemoteAuthoritative: false,
    allowsSafeRemoteActions: false,
  };
}
