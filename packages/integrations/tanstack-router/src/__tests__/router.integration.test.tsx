import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks for @tanstack/react-router
// ---------------------------------------------------------------------------

const mockUseMatches = vi.fn();
const mockUseMatchRoute = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: {
    children: React.ReactNode;
    to: string;
    [key: string]: unknown;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
  useMatches: () => mockUseMatches(),
  useMatchRoute: () => mockUseMatchRoute,
}));

import { RouterBreadcrumbs, RouterLink, SidebarNav } from '../index';

afterEach(() => {
  cleanup();
});

describe('RouterLink', () => {
  it('should render a link with children', () => {
    render(
      <RouterLink to="/dashboard" params={{}}>
        Dashboard
      </RouterLink>
    );

    const link = screen.getByText('Dashboard');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('/dashboard');
  });

  it('should render as span when disabled', () => {
    render(
      <RouterLink to="/dashboard" disabled>
        Dashboard
      </RouterLink>
    );

    const disabledEl = screen.getByText('Dashboard');
    expect(disabledEl.getAttribute('data-router-link-disabled')).toBe('');
    expect(disabledEl.getAttribute('aria-disabled')).toBe('true');
    expect(disabledEl.tagName).toBe('SPAN');
  });

  it('should pass className to the link', () => {
    render(
      <RouterLink to="/settings" className="nav-link">
        Settings
      </RouterLink>
    );

    const link = screen.getByText('Settings');
    expect(link.getAttribute('class')).toBe('nav-link');
  });

  it('should pass params to the link', () => {
    render(
      <RouterLink to="/users/$userId" params={{ userId: '42' }}>
        User 42
      </RouterLink>
    );

    const link = screen.getByText('User 42');
    expect(link).toBeDefined();
  });

  it('should render children in disabled state', () => {
    render(
      <RouterLink to="/protected" disabled>
        <span data-testid="child-icon">🔒</span>
        Protected
      </RouterLink>
    );

    expect(screen.getByTestId('child-icon')).toBeDefined();
    expect(screen.getByText('Protected')).toBeDefined();
  });
});

describe('RouterBreadcrumbs', () => {
  beforeEach(() => {
    mockUseMatches.mockReset();
  });

  it('should return null when there are no matches', () => {
    mockUseMatches.mockReturnValue([]);

    const { container } = render(<RouterBreadcrumbs />);
    const nav = container.querySelector('nav');
    expect(nav).toBeNull();
  });

  it('should render breadcrumb segments from matches', () => {
    mockUseMatches.mockReturnValue([
      { pathname: '/', staticData: { crumb: 'Home' } },
      {
        pathname: '/dashboard',
        staticData: { crumb: 'Dashboard' },
      },
      {
        pathname: '/dashboard/settings',
        staticData: { crumb: 'Settings' },
      },
    ]);

    render(<RouterBreadcrumbs />);

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
  });

  it('should mark the last segment with aria-current="page"', () => {
    mockUseMatches.mockReturnValue([
      { pathname: '/', staticData: { crumb: 'Home' } },
      {
        pathname: '/dashboard',
        staticData: { crumb: 'Dashboard' },
      },
    ]);

    render(<RouterBreadcrumbs />);

    const lastSegment = screen.getByText('Dashboard');
    expect(lastSegment.getAttribute('aria-current')).toBe('page');
  });

  it('should fall back to title then pathname when no crumb is set', () => {
    mockUseMatches.mockReturnValue([
      { pathname: '/', staticData: { title: 'Homepage' } },
      {
        pathname: '/some-route',
        staticData: {},
      },
    ]);

    render(<RouterBreadcrumbs />);

    expect(screen.getByText('Homepage')).toBeDefined();
    expect(screen.getByText('some-route')).toBeDefined();
  });

  it('should render custom separator', () => {
    mockUseMatches.mockReturnValue([
      { pathname: '/', staticData: { crumb: 'Home' } },
      {
        pathname: '/about',
        staticData: { crumb: 'About' },
      },
    ]);

    const { container } = render(<RouterBreadcrumbs separator=" > " />);

    const separators = container.querySelectorAll(
      '[data-breadcrumbs-separator]'
    );
    expect(separators.length).toBe(1);
    expect(separators[0].textContent).toBe(' > ');
  });

  it('should apply className to nav', () => {
    mockUseMatches.mockReturnValue([
      { pathname: '/', staticData: { crumb: 'Home' } },
    ]);

    const { container } = render(
      <RouterBreadcrumbs className="breadcrumbs-nav" />
    );

    const nav = container.querySelector('nav');
    expect(nav?.getAttribute('class')).toBe('breadcrumbs-nav');
  });
});

describe('SidebarNav', () => {
  beforeEach(() => {
    mockUseMatchRoute.mockReset();
  });

  it('should render nav groups', () => {
    mockUseMatchRoute.mockReturnValue(undefined);

    render(
      <SidebarNav
        groups={[
          {
            key: 'main',
            label: 'Main',
            items: [{ key: 'home', label: 'Home', to: '/' }],
          },
        ]}
      />
    );

    expect(screen.getByText('Main')).toBeDefined();
    expect(screen.getByText('Home')).toBeDefined();
  });

  it('should render multiple groups', () => {
    mockUseMatchRoute.mockReturnValue(false);

    render(
      <SidebarNav
        groups={[
          {
            key: 'main',
            label: 'Main',
            items: [{ key: 'dashboard', label: 'Dashboard', to: '/dashboard' }],
          },
          {
            key: 'settings',
            label: 'Settings',
            items: [
              { key: 'profile', label: 'Profile', to: '/settings/profile' },
              { key: 'account', label: 'Account', to: '/settings/account' },
            ],
          },
        ]}
      />
    );

    expect(screen.getByText('Main')).toBeDefined();
    expect(screen.getByText('Settings')).toBeDefined();
    expect(screen.getByText('Dashboard')).toBeDefined();
    expect(screen.getByText('Profile')).toBeDefined();
    expect(screen.getByText('Account')).toBeDefined();
  });

  it('should highlight active item using useMatchRoute', () => {
    // useMatchRoute returns truthy for active route
    mockUseMatchRoute.mockImplementation(({ to }: { to: string }) =>
      to === '/dashboard' ? {} : false
    );

    render(
      <SidebarNav
        groups={[
          {
            key: 'main',
            label: 'Main',
            items: [
              { key: 'home', label: 'Home', to: '/' },
              {
                key: 'dashboard',
                label: 'Dashboard',
                to: '/dashboard',
              },
            ],
          },
        ]}
      />
    );

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink?.getAttribute('aria-current')).toBe('page');
    expect(dashboardLink?.getAttribute('data-active')).toBeDefined();

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink?.getAttribute('aria-current')).toBeNull();
    expect(homeLink?.getAttribute('data-active')).toBeNull();
  });

  it('should render icons and badges', () => {
    mockUseMatchRoute.mockReturnValue(false);

    render(
      <SidebarNav
        groups={[
          {
            key: 'main',
            items: [
              {
                key: 'inbox',
                label: 'Inbox',
                to: '/inbox',
                icon: <span data-testid="icon">📧</span>,
                badge: 5,
              },
            ],
          },
        ]}
      />
    );

    expect(screen.getByTestId('icon')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
  });

  it('should pass className to nav', () => {
    mockUseMatchRoute.mockReturnValue(false);

    const { container } = render(
      <SidebarNav
        groups={[
          {
            key: 'main',
            items: [{ key: 'home', label: 'Home', to: '/' }],
          },
        ]}
        className="sidebar-nav-custom"
      />
    );

    const nav = container.querySelector('nav');
    expect(nav?.getAttribute('class')).toBe('sidebar-nav-custom');
  });

  it('should render group without label', () => {
    mockUseMatchRoute.mockReturnValue(false);

    const { container } = render(
      <SidebarNav
        groups={[
          {
            key: 'main',
            items: [{ key: 'home', label: 'Home', to: '/' }],
          },
        ]}
      />
    );

    const labels = container.querySelectorAll('[data-sidebar-nav-label]');
    expect(labels.length).toBe(0);
  });
});
