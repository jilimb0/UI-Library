# @ui-construction-library/integration-next

Next.js App Router adapter for the UI Construction Library. Provides SSR-safe providers, link components, image wrappers, and theme hydration helpers.

## When to use

Use this package in **Next.js App Router** projects. It handles:

- SSR-safe `ThemeProvider` that avoids hydration mismatch
- `NextLink` wrapper that integrates `@ui-construction-library/core` link components with Next.js routing
- `NextImage` wrapper for next/image integration
- `NextThemeProvider` with server-side token injection

## Installation

```bash
pnpm add @ui-construction-library/core @ui-construction-library/integration-next
```

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "next": ">=15.0.0"
}
```

## Minimal example

```tsx
// app/providers.tsx
'use client';

import { ThemeProvider } from '@ui-construction-library/core';
import { NextThemeProvider } from '@ui-construction-library/integration-next';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </NextThemeProvider>
  );
}
```

```tsx
// app/layout.tsx
import '@ui-construction-library/core/styles.css';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Components

### `NextLink`

Wraps Next.js `next/link` for use with core components that accept an `asChild` pattern:

```tsx
import { Button } from '@ui-construction-library/core';
import { NextLink } from '@ui-construction-library/integration-next';

<Button asChild>
  <NextLink href="/dashboard">Dashboard</NextLink>
</Button>
```

### `NextImage`

Wraps Next.js `next/image` with design token defaults for border radius and shadow:

```tsx
import { NextImage } from '@ui-construction-library/integration-next';

<NextImage
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority
/>
```

## Compatibility

- Next.js 15+ (App Router only — Pages Router is not supported)
- React 18 and 19
- TypeScript 5.x and 6.x

## Public API

```ts
import { NextThemeProvider, NextLink, NextImage, useNextTheme } from '@ui-construction-library/integration-next';
```

## Troubleshooting

**Hydration mismatch** — confirm `ThemeProvider` is inside a `'use client'` component and that you are not rendering different tokens on server vs client. Use `NextThemeProvider` to inject token variables server-side.

**Link not navigating** — `NextLink` must receive an `href` prop and must be used as a child of a component that supports the `asChild` pattern (e.g., `Button`, `MenuItem`).
