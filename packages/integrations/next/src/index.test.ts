import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: 'mock-link',
}));

vi.mock('next/image', () => ({
  default: 'mock-image',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe('integration-next', () => {
  it('re-exports NextLink and NextImage and adapts router methods', async () => {
    const mod = await import('./index');

    expect(mod.NextLink).toBe('mock-link');
    expect(mod.NextImage).toBe('mock-image');

    const navigation = mod.useNextNavigation();
    expect(navigation).toHaveProperty('push');
    expect(navigation).toHaveProperty('replace');
    expect(navigation).toHaveProperty('back');
    expect(navigation).toHaveProperty('refresh');
  });
});
