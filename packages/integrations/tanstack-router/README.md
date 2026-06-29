# @ui-construction-library/integration-tanstack-router

TanStack Router adapter for the UI Construction Library. Provides typed router link components, sidebar navigation, breadcrumbs, and navigation-aware UI primitives.

## When to use

Use this package when your project uses `@tanstack/react-router` and you want:

- `RouterLink` — typed link component for use with core `Button`, `MenuItem`, and `Breadcrumb`
- `SidebarNav` — sidebar navigation that highlights the active route
- `RouterBreadcrumbs` — breadcrumbs that derive from the current route tree

## Installation

```bash
pnpm add @ui-construction-library/core @ui-construction-library/integration-tanstack-router @tanstack/react-router
```

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "@tanstack/react-router": ">=1.0.0"
}
```

## Minimal example

```tsx
import { RouterLink, SidebarNav } from '@ui-construction-library/integration-tanstack-router';
import { Button } from '@ui-construction-library/core';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { to: '/users', label: 'Users', icon: 'Users' },
  { to: '/settings', label: 'Settings', icon: 'Settings' },
];

function AppSidebar() {
  return (
    <SidebarNav items={navItems}>
      {(item) => (
        <Button asChild variant="ghost">
          <RouterLink to={item.to}>{item.label}</RouterLink>
        </Button>
      )}
    </SidebarNav>
  );
}
```

## Components

| Component | Description |
|---|---|
| `RouterLink` | Typed link wrapper around `@tanstack/react-router`'s `Link` component. Compatible with `asChild` pattern. |
| `SidebarNav` | Sidebar navigation with active route highlighting, nested route support, and collapsible sections. |
| `RouterBreadcrumbs` | Breadcrumbs derived from the current route tree. Renders as core `Breadcrumb` component. |

## Compatibility

- React 18 and 19
- @tanstack/react-router 1.x
- TypeScript 5.x and 6.x

## Public API

```ts
import { RouterLink, SidebarNav, RouterBreadcrumbs } from '@ui-construction-library/integration-tanstack-router';
```

## Troubleshooting

**Links not navigating** — confirm `RouterLink` receives a valid `to` path that exists in your route tree. The component uses TanStack Router's type-safe routing.

**Sidebar not highlighting active route** — confirm your route tree includes a `title` or `meta` property that `SidebarNav` uses to match active items.
