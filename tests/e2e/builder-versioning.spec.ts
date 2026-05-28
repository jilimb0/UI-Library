import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

async function openGeneratedDraft(page: any) {
  await page.goto(`${BASE_URL}builder/`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await page.getByRole('button', { name: 'Generate draft' }).click();
  await expect(page.getByText('Generated prompt draft project.')).toBeVisible();
  await expect(page.getByText(/Editing page:/i)).toBeVisible();
}

test.describe('builder versioning flows', () => {
  test('generated draft shows versioning blocked state', async ({ page }) => {
    await openGeneratedDraft(page);

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Versions' })).toBeVisible();
    await expect(page.getByPlaceholder('Version label')).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Save version' })
    ).toBeDisabled();
    await expect(page.getByText('No saved versions yet')).toBeVisible();
  });

  test('generated draft keeps blocked versioning state after reload', async ({
    page,
  }) => {
    await openGeneratedDraft(page);

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(page.getByPlaceholder('Version label')).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Save version' })
    ).toBeDisabled();
    await expect(
      page.getByText(
        'Publish blocked: Only admins or owners can manage publish lifecycle actions.'
      )
    ).toBeVisible();

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/Editing page:/i)).toBeVisible();

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(page.getByPlaceholder('Version label')).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Save version' })
    ).toBeDisabled();
    await expect(page.getByText('No saved versions yet')).toBeVisible();
  });

  test('generated draft does not expose restore actions without versions', async ({
    page,
  }) => {
    await openGeneratedDraft(page);

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(page.getByText('No saved versions yet')).toBeVisible();
    await expect(page.getByRole('button', { name: /restore/i })).toHaveCount(0);

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/Editing page:/i)).toBeVisible();

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(page.getByText('No saved versions yet')).toBeVisible();
    await expect(page.getByRole('button', { name: /restore/i })).toHaveCount(0);
  });
});
