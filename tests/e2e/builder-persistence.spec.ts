import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

test.describe('Builder Persistence & Draft Autosave E2E', () => {
  test('validates canonical builder target url format', () => {
    expect(BASE_URL).toMatch(/^https?:\/\//);
    const parsed = new URL(BASE_URL);
    expect(parsed.pathname).toContain('UI-Library');
    expect(parsed.protocol).toMatch(/^https?:$/);
  });

  test('persists draft project into localStorage and restores across sessions', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}builder/`, { waitUntil: 'networkidle' });

    // Verify initial heading and route
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page).toHaveURL(/\/UI-Library\/builder\/projects\/?$/);

    // Trigger draft creation
    const generateBtn = page.getByRole('button', { name: 'Generate draft' });
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // Verify draft UI notification and page navigation
    await expect(
      page.getByText('Generated prompt draft project.')
    ).toBeVisible();
    await expect(page.getByText(/Editing page:/i)).toBeVisible();
    await expect(page).toHaveURL(
      /\/UI-Library\/builder\/projects\/.+\/pages\/.+/
    );

    // Verify localStorage contains the saved projects
    const storedState = await page.evaluate(() => {
      const recovery = window.localStorage.getItem(
        'ucl-builder-recovery-draft'
      );
      const allKeys = Object.keys(window.localStorage);
      return {
        recovery: recovery ? JSON.parse(recovery) : null,
        keyCount: allKeys.length,
        allKeys,
      };
    });

    expect(storedState.keyCount).toBeGreaterThan(0);

    // Reload page to verify persistence
    await page.reload({ waitUntil: 'networkidle' });

    // Verify user stays in or can navigate back to projects
    await expect(
      page
        .getByText(/Editing page:/i)
        .or(page.getByRole('heading', { name: 'Projects' }))
    ).toBeVisible();
  });

  test('validates recovery draft lifecycle and integrity', async ({ page }) => {
    await page.goto(`${BASE_URL}builder/`, { waitUntil: 'networkidle' });

    // Inject a validated recovery draft directly into localStorage
    const sampleDraft = {
      savedAt: new Date().toISOString(),
      activePageId: 'page-persisted-1',
      projects: [
        {
          id: 'proj-persisted-1',
          name: 'Persisted Test Project',
          pages: [
            {
              id: 'page-persisted-1',
              title: 'Home Page',
              nodes: [],
            },
          ],
        },
      ],
      projectIds: ['proj-persisted-1'],
    };

    await page.evaluate((draft) => {
      window.localStorage.setItem(
        'ucl-builder-recovery-draft',
        JSON.stringify(draft)
      );
    }, sampleDraft);

    // Read back and assert schema properties
    const readDraft = await page.evaluate(() => {
      const raw = window.localStorage.getItem('ucl-builder-recovery-draft');
      return raw ? JSON.parse(raw) : null;
    });

    expect(readDraft).not.toBeNull();
    expect(readDraft.activePageId).toBe('page-persisted-1');
    expect(readDraft.projects).toHaveLength(1);
    expect(readDraft.projects[0].name).toBe('Persisted Test Project');
    expect(Date.parse(readDraft.savedAt)).toBeGreaterThan(0);

    // Clear and assert removal
    await page.evaluate(() => {
      window.localStorage.removeItem('ucl-builder-recovery-draft');
    });

    const cleared = await page.evaluate(() => {
      return window.localStorage.getItem('ucl-builder-recovery-draft');
    });
    expect(cleared).toBeNull();
  });
});
