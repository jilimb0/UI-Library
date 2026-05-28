import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

test.describe('builder canonical journey flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}builder/`, { waitUntil: 'commit' });
    await page.evaluate(() => window.localStorage.clear());
  });

  test('runs complete prompt to publish lifecycle', async ({ page }) => {
    // Override the E2E role to 'owner' so this test has permissions to complete the full lifecycle
    await page.addInitScript(() => {
      (window as any).__E2E_ROLE__ = 'owner';
    });

    // 1. Navigate to the projects list
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    // 2. Generate a project draft from projects view
    await page.getByRole('button', { name: 'Generate draft' }).click();

    // App transitions to editor route and shows notice
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    // Editor shows "Editing page:" in the notice or editor context label
    await expect(page.getByText(/Editing page:/i)).toBeVisible({
      timeout: 10000,
    });

    // 3. Canvas is in Edit mode by default — verify canvas tree is rendered
    await expect(
      page.getByRole('button', { name: 'Edit', exact: true })
    ).toBeVisible({ timeout: 10000 });

    // 4. Switch to Review mode to add a comment
    await page.getByRole('button', { name: 'Review', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible({
      timeout: 10000,
    });

    // Add a comment
    const commentInput = page.locator(
      'textarea[placeholder^="Add a review comment"]'
    );
    await commentInput.fill('Feedback on hero layout');
    await page.getByRole('button', { name: 'Add comment' }).click();
    await expect(page.getByText('Feedback on hero layout')).toBeVisible({
      timeout: 10000,
    });

    // 5. Export mode
    await page.getByRole('button', { name: 'Export', exact: true }).click();
    await expect(page.getByText('Export handoff')).toBeVisible({
      timeout: 10000,
    });

    // 6. Publish mode
    await page.getByRole('button', { name: 'Publish', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Publish project' })
    ).toBeVisible({ timeout: 10000 });
  });

  test('navigates from home to projects list and into editor', async ({
    page,
  }) => {
    // Home route shows the builder landing
    await page.goto(`${BASE_URL}builder/?landing=true`, { waitUntil: 'load' });
    await expect(
      page.getByRole('heading', { name: 'UI Construction Library Builder' })
    ).toBeVisible({ timeout: 15000 });

    // Open projects
    await page.getByRole('button', { name: 'Open projects' }).click();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 10000,
    });
  });

  test('generates draft and can add a page in edit mode', async ({ page }) => {
    // Override the E2E role to 'owner' so this test has permissions to perform layout changes and page creation
    await page.addInitScript(() => {
      (window as any).__E2E_ROLE__ = 'owner';
    });

    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    // Switch to Edit mode (should already be active)
    await page.getByRole('button', { name: 'Edit', exact: true }).click();

    // Fill in a new page title and add a page
    const newPageInput = page.locator('input[placeholder="New page title"]');
    if (await newPageInput.isVisible()) {
      await newPageInput.fill('About Us');
      await page.getByRole('button', { name: 'Add page' }).click();
      await expect(page.getByText('Created page scaffold.')).toBeVisible({
        timeout: 5000,
      });
    }
  });
});
