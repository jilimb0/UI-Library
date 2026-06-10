import { describe, expect, it } from 'vitest';
import { generateCSSVariables } from './cssVariables';

describe('generateCSSVariables', () => {
  it('emits deterministic light and dark theme layers', () => {
    const first = generateCSSVariables();
    const second = generateCSSVariables();

    expect(first).toBe(second);
    expect(first).toContain(':root:not([data-theme]), [data-theme="light"]');
    expect(first).toContain(':root:not([data-theme]), [data-theme="dark"]');
    expect(first).toContain('--ucl-color-primary-500');
    // Backward-compat alias
    expect(first).toContain('--color-primary-500');
  });

  it('emits composable override layers after theme layers', () => {
    const css = generateCSSVariables({
      overrides: {
        '--color-primary-500': '#123456',
        'color-surface': '#fefefe',
      },
    });

    // Overrides should include both --ucl- and legacy aliases
    expect(css).toContain('--ucl-color-primary-500: #123456');
    expect(css).toContain('--color-primary-500: #123456');
    expect(css).toContain('--ucl-color-surface: #fefefe');
    expect(css).toContain('--color-surface: #fefefe');
  });
});
