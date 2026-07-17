import type { ReactNode } from 'react';

// Import the theme CSS
// Change to theme-light.css or theme-neutral.css for other variants
import '@ui-construction-library/themes/theme-dark.css';

export const metadata = {
  title: 'UI-Library × Next.js Example',
  description:
    'Example Next.js App Router application using @ui-construction-library/themes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body
        style={{
          margin: 0,
          fontFamily:
            'var(--ucl-font-sans, Inter, ui-sans-serif, system-ui, sans-serif)',
          background: 'var(--ucl-background, #09090b)',
          color: 'var(--ucl-foreground, #fafafa)',
        }}
      >
        {children}
      </body>
    </html>
  );
}
