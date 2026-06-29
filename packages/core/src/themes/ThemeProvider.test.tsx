import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ThemeProvider, { useTheme } from './ThemeProvider';

function ThemeConsumer() {
  const { theme } = useTheme();
  return <div data-testid="theme-value">{theme}</div>;
}

describe('ThemeProvider', () => {
  it('uses the default theme when there is no stored preference', () => {
    window.localStorage.removeItem('ui-library-theme');

    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(
      document.getElementById('ui-lib-theme-variables')?.textContent
    ).toContain('--color-background:');
  });

  it('prefers the stored theme over the default theme', () => {
    window.localStorage.setItem('ui-library-theme', 'dark');

    render(
      <ThemeProvider defaultTheme="light">
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('does not persist controlled theme updates to localStorage', () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem');
    window.localStorage.removeItem('ui-library-theme');

    render(
      <ThemeProvider theme="dark">
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(setItemSpy).not.toHaveBeenCalledWith('ui-library-theme', 'dark');

    setItemSpy.mockRestore();
  });
});
