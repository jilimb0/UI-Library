import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

test.describe('builder canonical flows', () => {
  test('create project draft and open generated page (URL assertions)', async ({
    page,
  }) => {
    // Navigating to builder/ lands directly on the Projects list (SPA resumes last session or defaults to /projects)
    await page.goto(`${BASE_URL}builder/`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page).toHaveURL(/\/UI-Library\/builder\/projects\/?$/);

    await page.getByRole('button', { name: 'Generate draft' }).click();

    await expect(
      page.getByText('Generated prompt draft project.')
    ).toBeVisible();
    await expect(page.getByText(/Editing page:/i)).toBeVisible();
    await expect(page).toHaveURL(
      /\/UI-Library\/builder\/projects\/.+\/pages\/.+/
    );

    await expect(page.getByText('Status: Draft')).toBeVisible();
    await expect(page.getByRole('button', { name: /Projects/i })).toBeVisible();

    await page.getByRole('button', { name: /Projects/i }).click();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page).toHaveURL(/\/UI-Library\/builder\/projects\/?$/);
  });

  test('builder projects route is addressable via in-app navigation', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}builder/`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page).toHaveURL(/\/UI-Library\/builder\/projects\/?$/);

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText(/Editing page:/i)).toBeVisible();
    await expect(page).toHaveURL(
      /\/UI-Library\/builder\/projects\/.+\/pages\/.+/
    );

    await page.getByRole('button', { name: /Projects/i }).click();
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page).toHaveURL(/\/UI-Library\/builder\/projects\/?$/);
  });
});
