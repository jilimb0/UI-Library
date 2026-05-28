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

test.describe('builder roles and lifecycle surfaces', () => {
  test('generated draft shows blocked membership controls', async ({
    page,
  }) => {
    await openGeneratedDraft(page);

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(
      page.getByText(
        'Publish blocked: Only admins or owners can manage publish lifecycle actions.'
      )
    ).toBeVisible();
    await expect(
      page.getByPlaceholder('new.member@builder.dev')
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Invite member' })
    ).toBeDisabled();
    await expect(
      page.getByPlaceholder('invited.member@builder.dev')
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Accept invite' })
    ).toBeDisabled();
  });

  test('generated draft keeps blocked membership controls after reload', async ({
    page,
  }) => {
    await openGeneratedDraft(page);

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(
      page.getByRole('heading', { name: 'Project members' })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder('new.member@builder.dev')
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Invite member' })
    ).toBeDisabled();

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/Editing page:/i)).toBeVisible();

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(
      page.getByRole('heading', { name: 'Project members' })
    ).toBeVisible();
    await expect(
      page.getByPlaceholder('new.member@builder.dev')
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Invite member' })
    ).toBeDisabled();
  });

  test('generated draft starts with empty publish history and no open comments', async ({
    page,
  }) => {
    await openGeneratedDraft(page);

    await page.getByRole('button', { name: 'Publish', exact: true }).click();

    await expect(
      page.getByRole('heading', { name: 'Publish history' })
    ).toBeVisible();
    await expect(page.getByText('No lifecycle events yet')).toBeVisible();

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible();
    await expect(page.getByText('No comments yet')).toBeVisible();

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.getByText(/Editing page:/i)).toBeVisible();

    await page.getByRole('button', { name: 'Publish', exact: true }).click();

    await expect(page.getByText('No lifecycle events yet')).toBeVisible();

    await page.getByRole('button', { name: 'Review', exact: true }).click();

    await expect(page.getByText('No comments yet')).toBeVisible();
  });
});
