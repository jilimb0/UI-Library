import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

/**
 * Visual regression snapshots for builder UI screens.
 *
 * These use Playwright's built-in screenshot comparison. On first run they
 * create baseline snapshots in tests/e2e/__snapshots__/. Subsequent runs
 * compare against those baselines using a pixel-diff threshold.
 *
 * To update baselines after an intentional UI change:
 *   npx playwright test visual-regression.spec.ts --update-snapshots
 */
test.describe('builder visual regression', () => {
  test.use({
    // Stable viewport for consistent screenshots
    viewport: { width: 1280, height: 900 },
  });

  test('projects list matches baseline', async ({ page }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    // Wait for any loading states to settle
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('builder-projects-list.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    });
  });

  test('builder editor canvas matches baseline after generate', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    // Settle animations
    await page.waitForTimeout(400);

    await expect(page).toHaveScreenshot('builder-editor-canvas.png', {
      maxDiffPixelRatio: 0.03,
      animations: 'disabled',
    });
  });

  test('review panel with comments matches baseline', async ({ page }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    await page.getByRole('button', { name: 'Review', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible({
      timeout: 10000,
    });

    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('builder-review-panel.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    });
  });

  test('export screen matches baseline', async ({ page }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    await page.getByRole('button', { name: 'Export', exact: true }).click();
    await expect(page.getByText('Export handoff')).toBeVisible({
      timeout: 10000,
    });

    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('builder-export-screen.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    });
  });

  test('publish screen matches baseline', async ({ page }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    await page.getByRole('button', { name: 'Publish', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Publish project' })
    ).toBeVisible({ timeout: 10000 });

    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('builder-publish-screen.png', {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    });
  });
});
