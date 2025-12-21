
import { test, expect } from '@playwright/test';

const axeSource = require('axe-core').source;

test('accessibility check for storybook', async ({ page }) => {
  await page.goto('http://localhost:6006');
  // Inject axe for accessibility tests
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => {
    return await new Promise((resolve) => {
      // @ts-ignore
      axe.run((err, results) => {
        if (err) throw err;
        resolve(results);
      });
    });
  });
  expect(results.violations.length).toBe(0);
});
