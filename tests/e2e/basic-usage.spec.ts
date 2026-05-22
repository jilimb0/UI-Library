import { expect, test } from '@playwright/test';

const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? 'http://127.0.0.1:4173/UI-Library/';

test.describe('UI Library Pages smoke', () => {
  test('demo root loads and contains core CTAs', async ({ page }) => {
    await page.goto(BASE_URL);

    await expect(
      page.getByRole('heading', { name: /UI Construction Library/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open docs' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Open Storybook' })
    ).toBeVisible();
  });

  test('docs route loads from demo link', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Open docs' }).click();
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
    await page.goto(
      `${BASE_URL}storybook/?path=/story/design-system-introduction--default`
    );
    await expect(
      page.getByText('UI Construction Library Storybook')
    ).toBeVisible();

    await page.goto(
      `${BASE_URL}storybook/?path=/story/design-system-colors--palette`
    );
    await expect(page.getByText('Cross-site navigation')).toBeVisible();

    await page.goto(
      `${BASE_URL}storybook/?path=/story/design-system-spacing--scale`
    );
    await expect(page.getByText('space-1')).toBeVisible();

    await page.goto(
      `${BASE_URL}storybook/?path=/story/design-system-typography--scale`
    );
    await expect(page.getByText('Heading 1')).toBeVisible();

    await page.goto(
      `${BASE_URL}storybook/?path=/story/design-tokens-icons--icons`
    );
    await expect(
      page.getByText('Representative icon set from the core package.')
    ).toBeVisible();
  });

  test('demo interactions: modal, toast, table filters/search', async ({
    page,
  }) => {
    await page.goto(BASE_URL);

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
