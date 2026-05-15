import { type ReactNode, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface SidebarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
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
        'flex h-full min-h-[400px] flex-col border-r border-slate-200 bg-white transition-all',
        collapsed ? 'w-20' : 'w-72',
        className
      )}
    >
      {collapsible ? (
        <div className="flex justify-end p-2">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="rounded border border-slate-300 px-2 py-1 text-xs"
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      ) : null}

      <nav className="flex-1 space-y-4 p-3">
        {groups.map((group) => (
          <div key={group.key}>
            {!collapsed && group.label ? (
              <div className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {group.label}
              </div>
            ) : null}

            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  className={cn(
                    'flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors',
                    item.active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  )}
                >
                  {item.icon ? (
                    <span className="mr-2 inline-flex">{item.icon}</span>
                  ) : null}
                  {!collapsed ? (
                    <span className="flex-1 text-left">{item.label}</span>
                  ) : null}
                  {!collapsed && hasBadges && item.badge !== undefined ? (
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-700">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
