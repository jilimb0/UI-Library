import { describe, expect, it } from 'vitest';
import { getRepositoryConnectivityStatus } from './repositoryConnectivity';

describe('repositoryConnectivity', () => {
  it('returns a local connectivity status for local mode', () => {
    const status = getRepositoryConnectivityStatus('local', {
      enabled: false,
      mode: 'stub',
      detail: 'stub',
      summary: 'stub summary',
      guidance: ['stub guidance'],
      severity: 'warning',
    });

    expect(status.mode).toBe('local');
    expect(status.state).toBe('local-only');
    expect(status.label).toBe('local runtime');
  });

  it('returns a connected status when Supabase is configured', () => {
    const status = getRepositoryConnectivityStatus('supabase', {
      enabled: true,
      mode: 'configured',
      detail: 'configured',
      summary: 'Remote repository is connected.',
      guidance: ['use remote'],
      severity: 'healthy',
    });

    expect(status.mode).toBe('supabase');
    expect(status.state).toBe('connected');
    expect(status.isRemoteAuthoritative).toBe(true);
  });
});
