import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

test.describe('Builder Persistence E2E Baseline', () => {
  test('validates canonical builder target url format', () => {
    expect(BASE_URL).toMatch(/^https?:\/\//);
    expect(new URL(BASE_URL).pathname).toContain('UI-Library');
  });
});
