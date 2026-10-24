import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ThemeProvider, { useTheme } from './ThemeProvider';

function ThemeConsumer() {
  const { theme } = useTheme();
  return <div data-testid="theme-value">{theme}</div>;
}

describe('ThemeProvider', () => {
  it('uses the default theme when there is no stored preference', () => {
    window.localStorage.removeItem('ucl-theme');

    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.getElementById('ucl-theme')?.textContent).toContain(
      '--ucl-color-background:'
    );
  });

  it('prefers the stored theme over the default theme', () => {
    window.localStorage.setItem('ucl-theme', 'dark');

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
    window.localStorage.removeItem('ucl-theme');

    render(
      <ThemeProvider theme="dark">
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    expect(setItemSpy).not.toHaveBeenCalledWith('ucl-theme', 'dark');

    setItemSpy.mockRestore();
  });
});
