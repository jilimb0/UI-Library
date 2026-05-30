import type { Page } from '@playwright/test';

/**
 * Overrides the user role inside the builder client context during E2E testing.
 */
export async function setE2ERole(
  page: Page,
  role: 'owner' | 'editor' | 'viewer'
) {
  await page.addInitScript((roleOverride) => {
    (window as any).__E2E_ROLE__ = roleOverride;
  }, role);
}
