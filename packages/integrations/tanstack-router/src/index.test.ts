import { describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-router', () => ({
  Link: 'mock-router-link',
  useNavigate: () => vi.fn(),
}));

describe('integration-tanstack-router', () => {
  it('re-exports tanstack router helpers', async () => {
    const mod = await import('./index');

    expect(mod.TanStackLink).toBe('mock-router-link');
    expect(typeof mod.useTanStackNavigate).toBe('function');
  });
});
