import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface TopNavLink {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface TopNavProps {
  /** Brand name or logo element. */
  brand?: ReactNode;
  /** Navigation links (rendered in the center or left section). */
  links?: TopNavLink[];
  /** Actions rendered on the right side (e.g., user menu, theme toggle). */
  actions?: ReactNode;
  /** Additional class name. */
  className?: string;
}

/**
 * TopNav — application top navigation bar.
 *
 * Provides a brand slot, navigation links, and an actions area.
 *
 * @example
 * ```tsx
 * <TopNav
 *   brand="Aurora"
 *   links={[
 *     { key: 'home', label: 'Home', href: '/', active: true },
 *     { key: 'settings', label: 'Settings', href: '/settings' },
 *   ]}
 *   actions={<Button size="sm">Sign out</Button>}
 * />
 * ```
 */
export function TopNav({ brand, links, actions, className }: TopNavProps) {
  return (
    <nav className={cn('topnav', className)} data-topnav="">
      {brand ? (
        <div className="topnav__brand" data-slot="brand">
          {brand}
        </div>
      ) : null}

      {links && links.length > 0 ? (
        <ul className="topnav__links" data-slot="links">
          {links.map((link) => (
            <li key={link.key}>
              {link.href ? (
                <a
                  href={link.href}
                  className={cn(
                    'topnav__link',
                    link.active && 'topnav__link--active'
                  )}
                  data-active={link.active || undefined}
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  type="button"
                  className={cn(
                    'topnav__link',
                    link.active && 'topnav__link--active'
                  )}
                  data-active={link.active || undefined}
                  onClick={link.onClick}
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {actions ? (
        <div className="topnav__actions" data-slot="actions">
          {actions}
        </div>
      ) : null}
    </nav>
  );
}
