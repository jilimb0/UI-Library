import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const port = process.env.PORT ?? '4173';
const BASE_URL =
  process.env.UI_LIBRARY_BASE_URL ?? `http://127.0.0.1:${port}/UI-Library/`;

/**
 * Axe-based accessibility release gates for the builder UI.
 * These run as E2E checks and block release if critical/serious violations exist.
 * Uses @axe-core/playwright for deep DOM analysis rather than a manual axe injection.
 */
test.describe('builder accessibility release gates', () => {
  test('projects list has no critical or serious a11y violations', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('[data-axe-skip]')
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );

    if (blocking.length > 0) {
      const summary = blocking
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} node(s))`
        )
        .join('\n');
      throw new Error(
        `${blocking.length} blocking accessibility violation(s) on projects page:\n${summary}`
      );
    }

    expect(blocking).toHaveLength(0);
  });

  test('builder editor (generate draft) has no critical a11y violations', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');

    if (critical.length > 0) {
      const summary = critical
        .map(
          (v) =>
            `[critical] ${v.id}: ${v.description} — ${v.nodes[0]?.html ?? 'n/a'}`
        )
        .join('\n');
      throw new Error(
        `${critical.length} critical a11y violation(s) in editor view:\n${summary}`
      );
    }

    expect(critical).toHaveLength(0);
  });

  test('export screen has no critical a11y violations', async ({ page }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    await page.getByRole('button', { name: 'Export', exact: true }).click();
    await expect(page.getByText('Export handoff')).toBeVisible({
      timeout: 10000,
    });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');

    if (critical.length > 0) {
      const summary = critical
        .map((v) => `[critical] ${v.id}: ${v.description}`)
        .join('\n');
      throw new Error(
        `${critical.length} critical a11y violation(s) on export screen:\n${summary}`
      );
    }

    expect(critical).toHaveLength(0);
  });

  test('publish screen has no critical a11y violations', async ({ page }) => {
    await page.goto(`${BASE_URL}builder/projects`, { waitUntil: 'load' });
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible({
      timeout: 15000,
    });

    await page.getByRole('button', { name: 'Generate draft' }).click();
    await expect(page.getByText('Generated prompt draft project.')).toBeVisible(
      { timeout: 15000 }
    );

    await page.getByRole('button', { name: 'Publish', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: 'Publish project' })
    ).toBeVisible({ timeout: 10000 });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');

    if (critical.length > 0) {
      const summary = critical
        .map((v) => `[critical] ${v.id}: ${v.description}`)
        .join('\n');
      throw new Error(
        `${critical.length} critical a11y violation(s) on publish screen:\n${summary}`
      );
    }

    expect(critical).toHaveLength(0);
  });
});
