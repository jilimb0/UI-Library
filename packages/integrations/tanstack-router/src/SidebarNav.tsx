import { useMatchRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export type SidebarNavItem = {
  /** Unique key for the item. */
  key: string;
  /** Display label. */
  label: string;
  /** TanStack Router path. */
  to: string;
  /** Route params for dynamic segments. */
  params?: Record<string, string | number>;
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  /** Optional badge rendered after the label. */
  badge?: string | number;
};

export type SidebarNavGroup = {
  /** Unique key for the group. */
  key: string;
  /** Group label (optional). */
  label?: string;
  /** Items in this group. */
  items: SidebarNavItem[];
};

export type SidebarNavProps = {
  /** Navigation groups. */
  groups: SidebarNavGroup[];
  /** CSS class name for the root `<nav>`. */
  className?: string;
};

/**
 * Sidebar navigation bound to TanStack Router state.
 *
 * Uses `useMatchRoute` to determine which item is active and renders
 * plain anchor-free `<a>` elements styled with the design system.
 * Pair with core's `<Sidebar>` or use standalone.
 *
 * @example
 * ```tsx
 * <SidebarNav
 *   groups={[
 *     {
 *       key: 'main',
 *       label: 'Main',
 *       items: [
 *         { key: 'home', label: 'Home', to: '/' },
 *         { key: 'users', label: 'Users', to: '/users' },
 *       ],
 *     },
 *   ]}
 * />
 * ```
 */
export function SidebarNav({ groups, className }: SidebarNavProps) {
  const matchRoute = useMatchRoute();

  return (
    <nav data-sidebar-nav="" className={className}>
      {groups.map((group) => (
        <div key={group.key} data-sidebar-nav-group="">
          {group.label ? (
            <span data-sidebar-nav-label="">{group.label}</span>
          ) : null}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {group.items.map((item) => {
              const isActive =
                matchRoute({ to: item.to, fuzzy: true }) !== false;
              return (
                <li key={item.key} data-sidebar-nav-item="">
                  <a
                    href={item.to}
                    data-active={isActive || undefined}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0.75rem',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    {item.icon ? (
                      <span data-sidebar-nav-icon="">{item.icon}</span>
                    ) : null}
                    <span>{item.label}</span>
                    {item.badge !== undefined ? (
                      <span data-sidebar-nav-badge="">{item.badge}</span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
