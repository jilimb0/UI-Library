import { expect, test } from '@playwright/test';

test('basic usage of button component', async ({ page }) => {
  await page.goto('http://localhost:6006');
  const button = page.locator('button');
  await expect(button).toHaveText('Save');
  await button.click();
  // Add additional assertions for expected behavior
});
