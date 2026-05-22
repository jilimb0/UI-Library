import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

test.describe('UI Library Pages smoke', () => {
  test('demo root loads and contains core CTAs', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await expect(
      page.getByRole('heading', { name: /UI Construction Library/i })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Open docs' }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Open Storybook' }).first()
    ).toBeVisible();
  });

  test('docs route loads from demo link', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Open docs' }).first().click();
    await expect(page).toHaveURL(/\/UI-Library\/docs\/?$/);
    await expect(
      page.getByRole('heading', {
        name: /Documentation for a composable React UI system/i,
      })
    ).toBeVisible();
  });

  test('storybook route loads and top-level stories are reachable', async ({
    page,
  }) => {
    test.setTimeout(90_000);

    const openStory = async (path: string) => {
      await page.goto(`${BASE_URL}storybook/?path=${path}`, {
        waitUntil: 'networkidle',
      });
      await page.waitForSelector('iframe', { timeout: 30_000 });
      return page.frameLocator('iframe').first();
    };

    const intro = await openStory('/story/design-system-introduction--default');
    await expect(
      intro.getByRole('heading', { name: 'UI Construction Library Storybook' })
    ).toBeVisible({ timeout: 45_000 });

    const colors = await openStory('/story/design-system-colors--palette');
    await expect(colors.getByText('Cross-site navigation')).toBeVisible({
      timeout: 45_000,
    });

    const spacing = await openStory('/story/design-system-spacing--scale');
    await expect(spacing.getByText('space-1', { exact: true })).toBeVisible({
      timeout: 45_000,
    });

    const typography = await openStory(
      '/story/design-system-typography--scale'
    );
    await expect(typography.getByText('Heading 1')).toBeVisible({
      timeout: 45_000,
    });

    const icons = await openStory('/story/design-tokens-icons--icons');
    await expect(
      icons.getByText('Representative icon set from the core package.')
    ).toBeVisible({ timeout: 45_000 });
  });

  test('demo interactions: modal, toast, table filters/search', async ({
    page,
  }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    await page.getByRole('button', { name: 'Open modal' }).click();
    await expect(
      page.getByRole('heading', { name: 'Component stack' })
    ).toBeVisible();

    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: 'Trigger toast' }).click();
    await expect(
      page.getByText('Toast feedback from the same UI kit.')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Primary' }).first().click();
    await expect(page.getByText(/Active filter: primary/i)).toBeVisible();

    await page.getByLabel('Search packages').fill('tokens');
    await expect(page.getByText(/Results:/)).toBeVisible();
  });
});
