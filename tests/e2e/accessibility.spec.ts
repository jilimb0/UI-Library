import { expect, test } from '@playwright/test';

const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? 'http://127.0.0.1:4173/UI-Library/';
const axeSource = require('axe-core').source;

async function runAxe(page: import('@playwright/test').Page) {
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => {
    return await new Promise<any>((resolve, reject) => {
      // @ts-expect-error global from axe injection
      axe.run((error: Error, value: unknown) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(value);
      });
    });
  });

  return results;
}

test.describe('A11y smoke', () => {
  test('demo has no critical accessibility violations', async ({ page }) => {
    await page.goto(BASE_URL);
    const results = await runAxe(page);
    const critical = results.violations.filter(
      (v: any) => v.impact === 'critical'
    );
    expect(critical).toEqual([]);
  });

  test('docs has no critical accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}docs/`);
    const results = await runAxe(page);
    const critical = results.violations.filter(
      (v: any) => v.impact === 'critical'
    );
    expect(critical).toEqual([]);
  });
});
