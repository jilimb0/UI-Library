import type { Preview } from '@storybook/react';
import {
  Button,
  Card,
  Link,
  Text,
  ThemeProvider,
} from '@ui-construction-library/core';
import type { ReactNode } from 'react';
import './storybook.css';

type ThemeMode = 'light' | 'dark';

function StorybookSiteNav() {
  return (
    <Card className="surface-panel" style={{ padding: '1rem 1.25rem' }}>
      <div
        className="inline-cluster"
        style={{ justifyContent: 'space-between', width: '100%' }}
      >
        <div className="stack-vertical" style={{ gap: '0.25rem' }}>
          <Text className="field-label" style={{ textTransform: 'none' }}>
            Cross-site navigation
          </Text>
          <Text className="field-hint">
            Move between demo, docs and Storybook without losing theme context.
          </Text>
        </div>
        <div className="inline-cluster">
          <Link href="../">
            <Button variant="outline" size="sm">
              Open demo
            </Button>
          </Link>
          <Link href="../docs/">
            <Button variant="outline" size="sm">
              Open docs
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function StorybookShell({
  children,
  theme,
  hideSiteNav,
}: {
  children: ReactNode;
  theme: ThemeMode;
  hideSiteNav?: boolean;
}) {
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <div
          className="stack-vertical"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: 24,
            gap: 24,
          }}
        >
          {!hideSiteNav ? <StorybookSiteNav /> : null}
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Light or dark theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, { globals, parameters }) => (
      <StorybookShell
        theme={(globals.theme as ThemeMode) || 'light'}
        hideSiteNav={parameters.hideSiteNav}
      >
        <Story />
      </StorybookShell>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    a11y: { test: 'error' },
    layout: 'padded',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
      },
    },
    options: {
      storySort: {
        order: [
          'Design System',
          ['Introduction', 'Colors', 'Typography', 'Spacing', 'Icons'],
          'Components',
          ['Atoms', 'Molecules', 'Organisms'],
        ],
      },
    },
  },
};

export default preview;
