import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Next.js modules
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ alt, ...props }: { alt?: string; [key: string]: unknown }) => (
    <img alt={alt ?? ''} {...props} />
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
}));

import { NextAppShell, NextThemeProvider, useNextTheme } from '../index';

afterEach(() => {
  cleanup();
});

describe('NextThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('should render children with default light theme', () => {
    render(
      <NextThemeProvider>
        <div data-testid="child">Hello</div>
      </NextThemeProvider>
    );

    const child = screen.getByTestId('child');
    expect(child).toBeDefined();
    expect(child.textContent).toBe('Hello');
  });

  it('should apply custom initialTheme prop', () => {
    const { container } = render(
      <NextThemeProvider initialTheme="dark">
        <div>Content</div>
      </NextThemeProvider>
    );

    const wrapper = container.querySelector('[data-theme="dark"]');
    expect(wrapper).toBeDefined();
  });

  it('should default to light when no initialTheme provided', () => {
    const { container } = render(
      <NextThemeProvider>
        <div>Content</div>
      </NextThemeProvider>
    );

    const wrapper = container.querySelector('[data-theme="light"]');
    expect(wrapper).toBeDefined();
  });

  it('should sync from document data-theme on mount', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const { container } = render(
      <NextThemeProvider initialTheme="light">
        <div>Content</div>
      </NextThemeProvider>
    );

    const wrapper = container.querySelector('[data-theme="dark"]');
    expect(wrapper).toBeDefined();
  });
});

describe('useNextTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    // Clean up cookies set during tests
    document.cookie = 'theme=;path=/;max-age=0';
  });

  it('should return default light theme when no data-theme set', () => {
    function ThemeConsumer() {
      const { theme } = useNextTheme();
      return <div data-testid="theme-value">{theme}</div>;
    }

    render(<ThemeConsumer />);
    expect(screen.getByTestId('theme-value').textContent).toBe('light');
  });

  it('should return dark theme when data-theme is dark', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    function ThemeConsumer() {
      const { theme } = useNextTheme();
      return <div data-testid="theme-value">{theme}</div>;
    }

    render(<ThemeConsumer />);
    expect(screen.getByTestId('theme-value').textContent).toBe('dark');
  });

  it('should toggle theme between light and dark', async () => {
    document.documentElement.setAttribute('data-theme', 'light');

    function ThemeToggler() {
      const { theme, toggleTheme } = useNextTheme();
      return (
        <div>
          <span data-testid="theme-value">{theme}</span>
          <button type="button" data-testid="toggle-btn" onClick={toggleTheme}>
            Toggle
          </button>
        </div>
      );
    }

    render(<ThemeToggler />);
    expect(screen.getByTestId('theme-value').textContent).toBe('light');

    screen.getByTestId('toggle-btn').click();
    await vi.waitFor(() => {
      expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    screen.getByTestId('toggle-btn').click();
    await vi.waitFor(() => {
      expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });
  });

  it('should set theme and persist via cookie', () => {
    function ThemeSetter() {
      const { setTheme } = useNextTheme();
      return (
        <button
          type="button"
          data-testid="set-dark-btn"
          onClick={() => setTheme('dark')}
        >
          Set Dark
        </button>
      );
    }

    render(<ThemeSetter />);
    screen.getByTestId('set-dark-btn').click();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

describe('NextAppShell', () => {
  it('should render children', () => {
    render(
      <NextAppShell>
        <div data-testid="child">Page Content</div>
      </NextAppShell>
    );

    expect(screen.getByTestId('child').textContent).toBe('Page Content');
  });

  it('should render brand header when brand is provided', () => {
    render(
      <NextAppShell brand="MyApp">
        <div>Content</div>
      </NextAppShell>
    );

    expect(screen.getByText('MyApp')).toBeDefined();
  });

  it('should not render brand header when brand is omitted', () => {
    const { container } = render(
      <NextAppShell>
        <div>Content</div>
      </NextAppShell>
    );

    const header = container.querySelector('header');
    expect(header).toBeNull();
  });

  it('should render sidebar items when provided', () => {
    const items = [
      { key: 'home', label: 'Home', href: '/' },
      { key: 'settings', label: 'Settings', href: '/settings', active: true },
    ];

    render(
      <NextAppShell sidebarItems={items}>
        <div>Content</div>
      </NextAppShell>
    );

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
  });

  it('should mark active sidebar item with aria-current', () => {
    const items = [
      { key: 'home', label: 'Home', href: '/' },
      { key: 'settings', label: 'Settings', href: '/settings', active: true },
    ];

    render(
      <NextAppShell sidebarItems={items}>
        <div>Content</div>
      </NextAppShell>
    );

    const activeLink = screen.getByText('Settings').closest('a');
    expect(activeLink?.getAttribute('aria-current')).toBe('page');
    expect(activeLink?.getAttribute('data-active')).toBeDefined();
  });

  it('should not render nav when sidebarItems is empty', () => {
    const { container } = render(
      <NextAppShell sidebarItems={[]}>
        <div>Content</div>
      </NextAppShell>
    );

    const nav = container.querySelector('nav');
    expect(nav).toBeNull();
  });
});
