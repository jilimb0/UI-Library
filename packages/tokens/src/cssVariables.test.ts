import { describe, expect, it } from 'vitest';
import { generateCSSVariables } from './cssVariables';

describe('generateCSSVariables', () => {
  it('emits deterministic light and dark theme layers', () => {
    const first = generateCSSVariables();
    const second = generateCSSVariables();

    expect(first).toBe(second);
    expect(first).toContain(':root:not([data-theme]), [data-theme="light"]');
    expect(first).toContain(':root:not([data-theme]), [data-theme="dark"]');
    expect(first).toContain('--color-primary-500');
  });

  it('emits composable override layers after theme layers', () => {
    const css = generateCSSVariables({
      overrides: {
        '--color-primary-500': '#123456',
        'color-surface': '#fefefe',
      },
    });

    expect(css).toContain(
      '[data-theme="light"] {\n  --color-primary-500: #123456;\n  --color-surface: #fefefe;\n}'
    );
    expect(css).toContain(
      '[data-theme="dark"] {\n  --color-primary-500: #123456;\n  --color-surface: #fefefe;\n}'
    );
  });
});
