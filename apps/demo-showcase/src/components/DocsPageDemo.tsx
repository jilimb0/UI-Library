import {
  Alert,
  Card,
  Heading,
  Navigation,
  Text,
} from '@ui-construction-library/core';
import { useState } from 'react';

const SECTIONS = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'installation', label: 'Installation' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'api-reference', label: 'API reference' },
];

export function DocsPageDemo() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '12rem 1fr',
        gap: '1.5rem',
      }}
    >
      {/* Sidebar */}
      <Navigation
        style={{
          position: 'sticky',
          top: '1rem',
          alignSelf: 'start',
          display: 'grid',
          gap: '0.25rem',
        }}
      >
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            style={{
              textAlign: 'left',
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius)',
              border: 'none',
              background:
                activeSection === section.id ? 'var(--accent)' : 'transparent',
              color:
                activeSection === section.id
                  ? 'var(--accent-foreground)'
                  : 'inherit',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            {section.label}
          </button>
        ))}
      </Navigation>

      {/* Content */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {activeSection === 'getting-started' && (
          <>
            <Heading as="h3">Getting started</Heading>
            <Text>
              UI Construction Library is a deterministic UI production system.
              Install the core package and wrap your app with ThemeProvider.
            </Text>
            <Alert title="Quick tip">
              Use the integration kits for Vite, Next.js, or static HTML to get
              started faster.
            </Alert>
          </>
        )}

        {activeSection === 'installation' && (
          <>
            <Heading as="h3">Installation</Heading>
            <Card
              className="p-3"
              style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
            >
              pnpm add @ui-construction-library/core
            </Card>
            <Text style={{ marginTop: '0.5rem' }}>
              Import styles in your app entry point before rendering any
              components.
            </Text>
          </>
        )}

        {activeSection === 'configuration' && (
          <>
            <Heading as="h3">Configuration</Heading>
            <Text>
              ThemeProvider accepts a default mode and optional custom tokens.
              Override tokens via the tokens package for brand consistency.
            </Text>
          </>
        )}

        {activeSection === 'api-reference' && (
          <>
            <Heading as="h3">API reference</Heading>
            <Text>
              All primitives accept standard HTML attributes plus
              component-specific props. Consult the TypeScript definitions for
              exact contracts.
            </Text>
          </>
        )}
      </div>
    </div>
  );
}
