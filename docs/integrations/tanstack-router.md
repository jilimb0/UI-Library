# TanStack Router Integration

**Package:** `@ui-construction-library/integration-tanstack-router`

## Install

```bash
pnpm add @ui-construction-library/integration-tanstack-router @tanstack/react-router
```

## Setup

Ensure a TanStack Router provider is configured before using these components.

```tsx
import { createRouter, RouterProvider } from '@tanstack/react-router';

const router = createRouter({ routeTree });
function App() {
  return <RouterProvider router={router} />;
}
```

## Components

### RouterLink

TanStack Router-aware link that handles client-side route transitions.

```tsx
<RouterLink to="/dashboard/$dashboardId" params={{ dashboardId: '1' }}>
  Open dashboard
</RouterLink>
```

### SidebarNav

Sidebar navigation bound to router state. Uses `useMatchRoute` to highlight the active item.

```tsx
<SidebarNav
  groups={[
    {
      key: 'main',
      label: 'Main',
      items: [
        { key: 'home', label: 'Home', to: '/', icon: <HomeIcon /> },
        { key: 'users', label: 'Users', to: '/users', icon: <UsersIcon /> },
        { key: 'settings', label: 'Settings', to: '/settings' },
      ],
    },
  ]}
/>
```

### RouterBreadcrumbs

Breadcrumb trail automatically derived from matched route segments. Reads `staticData.crumb` or `staticData.title` from route definitions.

```tsx
// Route definition
const settingsRoute = createRoute({
  path: '/settings',
  staticData: { crumb: 'Settings' },
  component: SettingsPage,
});

// In your layout
<RouterBreadcrumbs separator=" / " />
// Renders: Home / Dashboard / Settings
```

### Re-exports

- `TanStackLink` — raw TanStack Router `Link` (for advanced use cases).
- `useTanStackNavigate` — raw `useNavigate` hook.

## Architecture notes

- `RouterLink` renders a disabled `<span>` when `disabled` is true.
- `SidebarNav` items use `<a href>` rather than `<Link to>` for simplicity; TanStack Router intercepts navigation automatically.
- `RouterBreadcrumbs` prefers `staticData.crumb` > `staticData.title` > last URL segment for label derivation.
