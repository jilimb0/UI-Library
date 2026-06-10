# Next.js Integration

**Package:** `@ui-construction-library/integration-next`

## Install

```bash
pnpm add @ui-construction-library/integration-next
```

## Components

### NextThemeProvider

SSR-safe theme provider that reads the initial theme from a server prop (cookie/header) and syncs the `data-theme` attribute on `<html>` after hydration.

```tsx
// app/layout.tsx
import { NextThemeProvider } from '@ui-construction-library/integration-next';
import { cookies } from 'next/headers';

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value ?? 'light';

  return (
    <NextThemeProvider initialTheme={theme}>
      {children}
    </NextThemeProvider>
  );
}
```

### useNextTheme

Hook for reading and toggling the current theme. Persists the choice to a cookie.

```tsx
function ThemeToggle() {
  const { theme, toggleTheme } = useNextTheme();
  return <button onClick={toggleTheme}>{theme === 'dark' ? '☀️' : '🌙'}</button>;
}
```

### NextAppShell

Layout wrapper that uses Next.js `Link` for sidebar navigation items.

```tsx
<NextAppShell
  brand="My App"
  sidebarItems={[
    { key: 'home', label: 'Dashboard', href: '/dashboard' },
    { key: 'settings', label: 'Settings', href: '/settings' },
  ]}
>
  {children}
</NextAppShell>
```

## Architecture notes

- Theme state is stored in a cookie (`theme`) so the server can read it on the next request.
- The provider sets `data-theme` on `<html>` inside a `useEffect`, avoiding hydration mismatches.
- Compatible with Next.js App Router (server components + client components).
