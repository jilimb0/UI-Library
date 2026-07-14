import { useState } from 'react';

const PACKAGES = [
  {
    name: '@ui-construction-library/core',
    version: '0.5.0',
    desc: 'Primary React UI component library — atoms, molecules, organisms, and layout',
    category: 'core',
  },
  {
    name: '@ui-construction-library/icons',
    version: '0.5.0',
    desc: 'Standalone React icon package',
    category: 'core',
  },
  {
    name: '@ui-construction-library/tokens',
    version: '0.5.0',
    desc: 'Design token and theme contract — colors, spacing, typography',
    category: 'foundations',
  },
  {
    name: '@ui-construction-library/styles',
    version: '0.4.0',
    desc: 'Universal CSS layer — reset, utilities, preflights',
    category: 'foundations',
  },
  {
    name: '@ui-construction-library/primitives',
    version: '0.4.0',
    desc: 'Headless overlay primitives — Dialog, Popover, Tooltip',
    category: 'ui',
  },
  {
    name: '@ui-construction-library/behaviors',
    version: '0.4.0',
    desc: 'Framework-agnostic behavior layer',
    category: 'core',
  },
  {
    name: '@ui-construction-library/motion',
    version: '0.4.0',
    desc: 'Motion extension — Framer Motion wrapper, transitions, animations',
    category: 'extensions',
  },
  {
    name: '@ui-construction-library/dnd',
    version: '0.4.0',
    desc: 'Drag-and-drop extension — @dnd-kit wrapper',
    category: 'extensions',
  },
  {
    name: '@ui-construction-library/utils',
    version: '0.4.0',
    desc: 'Internal-first infrastructure utilities',
    category: 'foundations',
  },
  {
    name: '@ui-construction-library/export-core',
    version: '0.3.0',
    desc: 'Core export logic — project export, HTML sanitization',
    category: 'tools',
  },
  {
    name: '@ui-construction-library/registry',
    version: '0.3.0',
    desc: 'Internal component registry for build tooling',
    category: 'tools',
  },
  {
    name: '@ui-construction-library/schema',
    version: '0.3.0',
    desc: 'Internal schema definitions for build tooling',
    category: 'tools',
  },
  {
    name: '@ui-construction-library/prompt-engine',
    version: '0.3.0',
    desc: 'Internal AI prompt generation engine',
    category: 'tools',
  },
  {
    name: '@ui-construction-library/integration-tanstack-router',
    version: '0.4.1',
    desc: 'TanStack Router integration',
    category: 'integrations',
  },
  {
    name: '@ui-construction-library/integration-tanstack-query',
    version: '0.4.1',
    desc: 'TanStack Query integration',
    category: 'integrations',
  },
  {
    name: '@ui-construction-library/integration-i18n',
    version: '0.4.0',
    desc: 'i18next integration — locale-aware components',
    category: 'integrations',
  },
  {
    name: '@ui-construction-library/react-hook-form',
    version: '0.4.1',
    desc: 'React Hook Form adapter layer',
    category: 'integrations',
  },
  {
    name: '@ui-construction-library/integration-next',
    version: '0.3.0',
    desc: 'Next.js App Router integration',
    category: 'integrations',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Packages' },
  { id: 'core', label: 'Core' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'ui', label: 'UI Components' },
  { id: 'extensions', label: 'Extensions' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'tools', label: 'Tools' },
];

function App() {
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered =
    filter === 'all' ? PACKAGES : PACKAGES.filter((p) => p.category === filter);

  const copyInstall = (name: string) => {
    navigator.clipboard.writeText(`npm install ${name}`);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d1117',
        color: '#c9d1d9',
        fontFamily:
          '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif',
      }}
    >
      <header
        style={{
          borderBottom: '1px solid #30363d',
          padding: '3rem 2rem 2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#f0f6fc',
            margin: 0,
          }}
        >
          UI Construction Library
        </h1>
        <p
          style={{ fontSize: '1.1rem', color: '#8b949e', marginTop: '0.5rem' }}
        >
          A modular, integration-first React UI component ecosystem — 18
          packages, 240+ tests, 2,150 mutants
        </p>
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            marginTop: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: '18', label: 'Packages' },
            { value: '240+', label: 'Tests' },
            { value: '99.7%', label: 'Mutation Score' },
            { value: '15k+', label: 'Files' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#58a6ff',
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#8b949e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
        <section style={{ marginBottom: '3rem' }}>
          <h2
            style={{
              color: '#f0f6fc',
              fontSize: '1.3rem',
              marginBottom: '0.5rem',
            }}
          >
            Getting Started
          </h2>
          <div
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 8,
              padding: '1.5rem',
            }}
          >
            <pre style={{ margin: 0, fontSize: '0.85rem', color: '#8b949e' }}>
              {`npm install @ui-construction-library/core @ui-construction-library/tokens @ui-construction-library/styles

import { Button, Card, Dialog } from '@ui-construction-library/core'
import { theme } from '@ui-construction-library/tokens'
import '@ui-construction-library/styles/preflight.css'`}
            </pre>
          </div>
        </section>

        <section>
          <h2
            style={{
              color: '#f0f6fc',
              fontSize: '1.3rem',
              marginBottom: '1rem',
            }}
          >
            Packages
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 20,
                  border: `1px solid ${filter === cat.id ? '#58a6ff' : '#30363d'}`,
                  background: filter === cat.id ? '#1f6feb22' : 'transparent',
                  color: filter === cat.id ? '#58a6ff' : '#8b949e',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: filter === cat.id ? 600 : 400,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {filtered.map((p) => (
              <div
                key={p.name}
                style={{
                  background: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: 8,
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <div
                    style={{
                      color: '#58a6ff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {p.name}
                  </div>
                  <div style={{ color: '#8b949e', fontSize: '0.75rem' }}>
                    v{p.version}
                  </div>
                </div>
                <p
                  style={{
                    color: '#c9d1d9',
                    fontSize: '0.85rem',
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {p.desc}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 12,
                      background:
                        p.category === 'integrations'
                          ? '#1f6feb33'
                          : p.category === 'extensions'
                            ? '#3fb95033'
                            : p.category === 'tools'
                              ? '#d2992233'
                              : '#8b949e33',
                      color:
                        p.category === 'integrations'
                          ? '#58a6ff'
                          : p.category === 'extensions'
                            ? '#3fb950'
                            : p.category === 'tools'
                              ? '#d29922'
                              : '#8b949e',
                      textTransform: 'capitalize',
                    }}
                  >
                    {p.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyInstall(p.name)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 6,
                      border: '1px solid #30363d',
                      background: 'transparent',
                      color: copied === p.name ? '#3fb950' : '#8b949e',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    {copied === p.name ? 'Copied!' : 'npm install'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: '3rem' }}>
          <h2
            style={{
              color: '#f0f6fc',
              fontSize: '1.3rem',
              marginBottom: '1rem',
            }}
          >
            Interactive Examples
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <ExampleCard
              title="Button"
              desc="Primary, secondary, ghost, danger variants. Loading state, icon support."
            />
            <ExampleCard
              title="Card"
              desc="Container with header, body, footer slots. Elevation and border variants."
            />
            <ExampleCard
              title="Dialog"
              desc="Modal dialog with overlay, focus trap, keyboard dismiss."
            />
            <ExampleCard
              title="Input"
              desc="Text input with label, error, helper text. Prefix/suffix adornments."
            />
            <ExampleCard
              title="Select"
              desc="Dropdown select with search, groups, multi-select."
            />
            <ExampleCard
              title="Toast"
              desc="Notification toast with success/error/info variants. Auto-dismiss."
            />
          </div>
        </section>

        <footer
          style={{
            textAlign: 'center',
            padding: '3rem 0 2rem',
            borderTop: '1px solid #30363d',
            marginTop: '3rem',
            color: '#8b949e',
            fontSize: '0.85rem',
          }}
        >
          <p style={{ margin: 0 }}>
            UI Construction Library —{' '}
            <a
              href="https://github.com/jilimb0/UI-Library"
              style={{ color: '#58a6ff' }}
            >
              GitHub
            </a>
            {' · '}
            <a
              href="https://www.npmjs.com/search?q=%40ui-construction-library"
              style={{ color: '#58a6ff' }}
            >
              npm
            </a>
            {' · v0.5.0'}
          </p>
        </footer>
      </main>
    </div>
  );
}

function ExampleCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      style={{
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 8,
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          color: '#f0f6fc',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </div>
      <p
        style={{
          color: '#8b949e',
          fontSize: '0.8rem',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

export default App;
