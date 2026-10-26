import { describe, expect, it } from 'vitest';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

describe('Builder Persistence E2E Baseline', () => {
  it('validates canonical builder target url format', () => {
    expect(BASE_URL).toMatch(/^https?:\/\//);
    expect(new URL(BASE_URL).pathname).toContain('UI-Library');
  });
});
