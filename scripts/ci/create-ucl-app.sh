#!/usr/bin/env bash
set -euo pipefail

# create-ucl-app — Scaffold a new project with @ui-construction-library pre-configured
#
# Usage:
#   ./scripts/ci/create-ucl-app.sh my-app [template]
#
# Templates:
#   vite        Vite + React + TypeScript (default)
#   next        Next.js 15 + App Router
#   minimal     Plain HTML + CDN
#
# Examples:
#   ./scripts/ci/create-ucl-app.sh my-dashboard
#   ./scripts/ci/create-ucl-app.sh my-site next

APP_NAME="${1:-}"
TEMPLATE="${2:-vite}"

if [ -z "$APP_NAME" ]; then
  echo "Usage: $0 <app-name> [template]"
  echo ""
  echo "Templates: vite (default), next, minimal"
  exit 1
fi

echo "==> Creating $APP_NAME with $TEMPLATE template..."

case "$TEMPLATE" in
  vite)
    pnpm create vite "$APP_NAME" --template react-ts
    cd "$APP_NAME"
    pnpm add @ui-construction-library/core @ui-construction-library/tokens
    cat > src/App.tsx << 'APPEOF'
import '@ui-construction-library/core/styles.css';
import { ThemeProvider, Button, Heading, Text } from '@ui-construction-library/core';

function App() {
  return (
    <ThemeProvider>
      <main style={{ padding: '2rem' }}>
        <Heading as="h1">My App</Heading>
        <Text>Built with UI Construction Library.</Text>
        <Button>Get started</Button>
      </main>
    </ThemeProvider>
  );
}

export default App;
APPEOF
    ;;

  next)
    pnpm create next-app "$APP_NAME" --typescript --app --tailwind=false --eslint=false
    cd "$APP_NAME"
    pnpm add @ui-construction-library/core @ui-construction-library/integration-next
    mkdir -p app
    cat > app/providers.tsx << 'PROVEOF'
'use client';
import { ThemeProvider } from '@ui-construction-library/core';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
PROVEOF
    cat > app/layout.tsx << 'LAYEOF'
import '@ui-construction-library/core/styles.css';
import { Providers } from './providers';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
LAYEOF
    cat > app/page.tsx << 'PGEOF'
import { Button, Card, Heading, Text } from '@ui-construction-library/core';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <Card style={{ padding: '1.5rem', maxWidth: '32rem' }}>
        <Heading as="h1">Dashboard</Heading>
        <Text>Your app is running with SSR-safe UI components.</Text>
        <Button>Open settings</Button>
      </Card>
    </main>
  );
}
PGEOF
    ;;

  minimal)
    mkdir -p "$APP_NAME"
    cd "$APP_NAME"
    cat > index.html << 'HTMLEOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>UI Library Starter</title>
  <link rel="stylesheet" href="https://unpkg.com/@ui-construction-library/core@latest/dist/styles.css" />
</head>
<body>
  <main style="padding: 2rem; font-family: var(--font-sans);">
    <h1 class="heading">My App</h1>
    <p class="text">Built with UI Construction Library.</p>
    <button class="button button--default">Get started</button>
  </main>
</body>
</html>
HTMLEOF
    ;;

  *)
    echo "Unknown template: $TEMPLATE"
    echo "Available: vite, next, minimal"
    exit 1
    ;;
esac

echo ""
echo "==> Done! Created $APP_NAME with $TEMPLATE template."
echo ""
echo "  cd $APP_NAME"
echo "  pnpm dev"
echo ""
