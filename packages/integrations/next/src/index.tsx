import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';

// Re-export Next.js primitives
export const NextLink = Link;
export const NextImage = Image;

export function useNextNavigation() {
  const router = useRouter();
  return {
    push: router.push,
    replace: router.replace,
    back: router.back,
    refresh: router.refresh,
  };
}

// ---------------------------------------------------------------------------
// NextThemeProvider — SSR-safe theme wrapper
// ---------------------------------------------------------------------------

export type NextThemeProviderProps = {
  /** Initial theme for SSR. Read from cookie or header in layout.tsx. */
  initialTheme?: 'light' | 'dark';
  /** Children to render. */
  children: ReactNode;
};

/**
 * SSR-safe theme provider for Next.js App Router.
 *
 * Usage in `app/layout.tsx`:
 * ```tsx
 * import { cookies } from 'next/headers';
 * import { NextThemeProvider } from '@ui-construction-library/integration-next';
 *
 * export default async function RootLayout({ children }) {
 *   const cookieStore = await cookies();
 *   const theme = cookieStore.get('theme')?.value ?? 'light';
 *   return (
 *     <html lang="en" data-theme={theme}>
 *       <body>
 *         <NextThemeProvider initialTheme={theme}>
 *           {children}
 *         </NextThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function NextThemeProvider({
  initialTheme = 'light',
  children,
}: NextThemeProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);

  useEffect(() => {
    // Sync with DOM after hydration
    const stored = document.documentElement.getAttribute('data-theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div data-theme={theme} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}

/**
 * Toggle between light and dark themes.
 * Works alongside NextThemeProvider to persist theme across navigations.
 */
export function useNextTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    return (
      (document.documentElement.getAttribute('data-theme') as
        | 'light'
        | 'dark') ?? 'light'
    );
  });

  const setTheme = (next: 'light' | 'dark') => {
    setThemeState(next);
    document.documentElement.setAttribute('data-theme', next);
    // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not supported in all browsers; document.cookie is intentional for theme persistence.
    document.cookie = `theme=${next};path=/;max-age=31536000`;
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return { theme, setTheme, toggleTheme };
}

// ---------------------------------------------------------------------------
// NextAppShell — layout wrapper using core's AppShell + Next.js Link
// ---------------------------------------------------------------------------

export type NextAppShellProps = {
  /** Sidebar navigation items. */
  sidebarItems?: Array<{
    key: string;
    label: string;
    href: string;
    active?: boolean;
  }>;
  /** Brand name shown in top navigation. */
  brand?: string;
  /** Page content. */
  children: ReactNode;
};

/**
 * Next.js-aware application shell.
 *
 * Wraps content with a sidebar navigation that uses Next.js Link for
 * client-side transitions. Provides theme toggle in the top nav actions.
 *
 * @example
 * ```tsx
 * // app/dashboard/layout.tsx
 * import { NextAppShell } from '@ui-construction-library/integration-next';
 *
 * export default function DashboardLayout({ children }) {
 *   return (
 *     <NextAppShell
 *       brand="My App"
 *       sidebarItems={[
 *         { key: 'overview', label: 'Overview', href: '/dashboard' },
 *         { key: 'settings', label: 'Settings', href: '/dashboard/settings' },
 *       ]}
 *     >
 *       {children}
 *     </NextAppShell>
 *   );
 * }
 * ```
 */
export function NextAppShell({
  sidebarItems,
  brand,
  children,
}: NextAppShellProps) {
  return (
    <div data-next-app-shell="">
      {brand ? (
        <header data-region="topnav">
          <span>{brand}</span>
        </header>
      ) : null}
      <div data-region="body" style={{ display: 'flex' }}>
        {sidebarItems && sidebarItems.length > 0 ? (
          <nav data-region="sidebar">
            <ul>
              {sidebarItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    data-active={item.active || undefined}
                    aria-current={item.active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <main data-region="main" style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
