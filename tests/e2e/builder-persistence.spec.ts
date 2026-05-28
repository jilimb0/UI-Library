import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

async function openGeneratedDraft(
  page: Parameters<typeof test>[1] extends never ? never : any
) {
  await page.goto(`${BASE_URL}builder/`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await page.getByRole('button', { name: 'Generate draft' }).click();
  await expect(page.getByText('Generated prompt draft project.')).toBeVisible();
  await expect(page.getByText(/Editing page:/i)).toBeVisible();
}

test.describe('builder persistence flows', () => {
  test('restores generated draft editor after reload', async ({ page }) => {
    await openGeneratedDraft(page);

    await expect(
      page.getByRole('button', { name: /Generated Draft/i })
    ).toBeVisible();

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/Editing page:/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Generated Draft/i })
    ).toBeVisible();
    await expect(
      page.getByText('Generated prompt draft project.')
    ).not.toBeVisible();
  });

  test('persists selected session member across reload', async ({ page }) => {
    await openGeneratedDraft(page);

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(
      page.getByText(
        'Publish blocked: Only admins or owners can manage publish lifecycle actions.'
      )
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Save version' })
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Invite member' })
    ).toBeDisabled();

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/Editing page:/i)).toBeVisible();

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(
      page.getByText(
        'Publish blocked: Only admins or owners can manage publish lifecycle actions.'
      )
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Save version' })
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Invite member' })
    ).toBeDisabled();
  });

  test('keeps page-creation controls state after reload', async ({ page }) => {
    await openGeneratedDraft(page);

    await expect(
      page.getByText(
        'Publish blocked: Only admins or owners can manage publish lifecycle actions.'
      )
    ).toBeVisible();
    await expect(page.getByPlaceholder('New page title')).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Add page' })).toBeEnabled();

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/Editing page:/i)).toContainText(
      'Generated Draft'
    );
    await expect(
      page.getByRole('button', { name: /Generated Draft/i })
    ).toBeVisible();
    await expect(page.getByPlaceholder('New page title')).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Add page' })).toBeEnabled();
  });
});
