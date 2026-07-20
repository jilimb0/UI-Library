import { type ReactNode, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface SidebarGroup {
  key: string;
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  groups: SidebarGroup[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export function Sidebar({
  groups,
  collapsible = true,
  defaultCollapsed = false,
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const hasBadges = useMemo(
    () =>
      groups.some((group) =>
        group.items.some((item) => item.badge !== undefined)
      ),
    [groups]
  );

  return (
    <aside
      className={cn(
        'sidebar',
        collapsed ? 'sidebar--collapsed' : 'sidebar--expanded',
        className
      )}
    >
      {collapsible ? (
        <div className="sidebar__toolbar">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="button button--outline button--sm"
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      ) : null}

      <nav className="sidebar__nav">
        {groups.map((group) => (
          <div key={group.key}>
            {!collapsed && group.label ? (
              <div className="sidebar__group-label">{group.label}</div>
            ) : null}

            <div className="sidebar__items">
              {group.items.map((item) =>
                item.href ? (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={item.onClick}
                    className={cn(
                      'sidebar__item',
                      item.active && 'sidebar__item--active'
                    )}
                  >
                    {item.icon ? (
                      <span className="sidebar__item-icon">{item.icon}</span>
                    ) : null}
                    {!collapsed ? (
                      <span className="flex-1 text-left">{item.label}</span>
                    ) : null}
                    {!collapsed && hasBadges && item.badge !== undefined ? (
                      <span className="sidebar__badge">{item.badge}</span>
                    ) : null}
                  </a>
                ) : (
                  <button
                    key={item.key}
                    type="button"
                    onClick={item.onClick}
                    className={cn(
                      'sidebar__item',
                      item.active && 'sidebar__item--active'
                    )}
                  >
                    {item.icon ? (
                      <span className="sidebar__item-icon">{item.icon}</span>
                    ) : null}
                    {!collapsed ? (
                      <span className="flex-1 text-left">{item.label}</span>
                    ) : null}
                    {!collapsed && hasBadges && item.badge !== undefined ? (
                      <span className="sidebar__badge">{item.badge}</span>
                    ) : null}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
