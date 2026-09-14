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

  it('emits per-mode values in each theme layer (dark must not leak light values)', () => {
    const css = generateCSSVariables();
    const darkStart = css.indexOf(
      ':root:not([data-theme]), [data-theme="dark"]'
    );
    expect(darkStart).toBeGreaterThan(-1);
    const lightBlock = css.slice(0, darkStart);
    const darkBlock = css.slice(darkStart);
    // semantic tokens differ per layer (regression: dark shipped #ffffff)
    expect(lightBlock).toContain('--color-background: #ffffff');
    expect(darkBlock).toContain('--color-background: #09090b');
    expect(darkBlock).not.toContain('--color-background: #ffffff');
    expect(lightBlock).toContain('--card-bg-default: #ffffff');
    expect(darkBlock).toContain('--card-bg-default: #09090b');
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
