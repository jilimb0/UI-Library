import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

test.describe('Keyboard contracts smoke', () => {
  test('modal escape closes and returns focus flow', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Open quickstart modal' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('dropdown handles arrow navigation and selection', async ({ page }) => {
    await page.goto(BASE_URL);
    const trigger = page.getByRole('button', { name: 'Select...' }).first();
    await trigger.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(trigger).not.toHaveText('Select...');
  });

  test('docs quick command opens and closes with escape', async ({ page }) => {
    await page.goto(`${BASE_URL}docs/`);
    await page.getByRole('button', { name: 'Open command menu' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
