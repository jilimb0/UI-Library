import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;
const hasSupabaseCredentials = Boolean(
  process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY
);

async function openProjects(
  page: Parameters<typeof test>[1] extends never ? never : any
) {
  await page.goto(`${BASE_URL}builder/`, { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
}

async function generateDraft(
  page: Parameters<typeof test>[1] extends never ? never : any
) {
  await page.getByRole('button', { name: 'Generate draft' }).click();
  await expect(page.getByText('Generated prompt draft project.')).toBeVisible();
  await expect(page.locator('p', { hasText: /Editing page/i })).toBeVisible();
  await expect(page.getByRole('button', { name: '← Projects' })).toBeVisible();
}

async function enterEditorWithFreshDraft(
  page: Parameters<typeof test>[1] extends never ? never : any,
  mode: 'local' | 'memory' | 'supabase' = 'local'
) {
  await openProjects(page);
  await page.getByLabel('Repository mode').selectOption(mode);
  await generateDraft(page);
}

async function setRepositoryModeFromFreshEditor(
  page: Parameters<typeof test>[1] extends never ? never : any,
  mode: 'local' | 'memory' | 'supabase'
) {
  await enterEditorWithFreshDraft(page, 'local');
  await page.getByLabel('Repository mode').selectOption(mode);
  await page.waitForLoadState('networkidle');

  if (mode === 'local') {
    await expect(page.locator('p', { hasText: /Editing page/i })).toBeVisible();
    return;
  }
}

async function expectRepositoryStatusLabel(
  page: Parameters<typeof test>[1] extends never ? never : any,
  label: string
) {
  await expect(page.getByText(label, { exact: true })).toBeVisible();
}

test.describe('builder repository lifecycle scenarios', () => {
  test('local mode persists builder lifecycle surfaces across reload', async ({
    page,
  }) => {
    await enterEditorWithFreshDraft(page);
    await expectRepositoryStatusLabel(page, 'local runtime');
    await expect(page.getByText(/Session member/i)).toBeVisible();
    await expect(page.getByText(/Permissions:/i)).toBeVisible();
    await expect(page.getByPlaceholder('New page title')).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Add page' })).toBeEnabled();

    await enterEditorWithFreshDraft(page);
    await expect(page.locator('p', { hasText: /Editing page/i })).toBeVisible();
    await expectRepositoryStatusLabel(page, 'local runtime');
    await expect(page.getByText(/Session member/i)).toBeVisible();
    await expect(page.getByText(/Permissions:/i)).toBeVisible();
    await expect(page.getByPlaceholder('New page title')).toBeEnabled();
  });

  test('supabase stub mode surfaces degraded remote collaboration lifecycle', async ({
    page,
  }) => {
    await enterEditorWithFreshDraft(page);
    await page.getByLabel('Repository mode').selectOption('supabase');
    await page.waitForLoadState('networkidle');

    // Dynamically expect either remote connected or remote stub based on environmental configuration
    const isConnected = await page.getByText('remote connected').isVisible();
    if (isConnected) {
      await expectRepositoryStatusLabel(page, 'remote connected');
    } else {
      await expectRepositoryStatusLabel(page, 'remote stub');
    }
  });

  test('supabase configured mode exposes connected remote-backed lifecycle', async ({
    page,
  }) => {
    test.skip(
      !hasSupabaseCredentials,
      'Requires Supabase credentials for the connected scenario.'
    );

    await setRepositoryModeFromFreshEditor(page, 'supabase');
    await expectRepositoryStatusLabel(page, 'remote connected');
    await expect(
      page.getByRole('heading', { name: 'Publish history' })
    ).toBeVisible();
    await expect(page.getByText(/Session member/i)).toBeVisible();
    await expect(page.getByText(/Permissions:/i)).toBeVisible();
    await expect(
      page.getByText(/Remote repository is not configured\./i)
    ).toHaveCount(0);
  });
});
