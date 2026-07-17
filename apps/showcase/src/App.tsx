import { useState } from 'react';
import './App.css';

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
    name: '@ui-construction-library/themes',
    version: '0.1.0',
    desc: 'Standalone CSS theme files — dark, light, and neutral color schemes',
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
    <div className="app-shell">
      <header className="app-header">
        <h1>UI Construction Library</h1>
        <p className="section-subtitle">
          A modular, integration-first React UI component ecosystem — 19
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
            { value: '19', label: 'Packages' },
            { value: '240+', label: 'Tests' },
            { value: '99.7%', label: 'Mutation Score' },
            { value: '15k+', label: 'Files' },
          ].map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="main-content">
        <section className="section">
          <h2 className="section-title">Getting Started</h2>
          <div className="code-block">
            <pre>{`npm install @ui-construction-library/core @ui-construction-library/tokens @ui-construction-library/themes

import { Button, Card, Dialog } from '@ui-construction-library/core'
import '@ui-construction-library/themes/theme-dark.css'`}</pre>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Packages</h2>
          <div className="cat-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cat-btn${filter === cat.id ? ' cat-btn--active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pkg-grid">
            {filtered.map((p) => (
              <div key={p.name} className="pkg-card">
                <div>
                  <div className="pkg-name">{p.name}</div>
                  <div className="pkg-version">v{p.version}</div>
                </div>
                <p className="pkg-desc">{p.desc}</p>
                <div className="pkg-footer">
                  <span className={`pkg-category pkg-category--${p.category}`}>
                    {p.category}
                  </span>
                  <button
                    type="button"
                    className={`install-btn${copied === p.name ? ' install-btn--copied' : ''}`}
                    onClick={() => copyInstall(p.name)}
                  >
                    {copied === p.name ? 'Copied!' : 'npm install'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Interactive Examples</h2>
          <div className="example-grid">
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

        <footer className="app-footer">
          <p>
            UI Construction Library —
            <a href="https://github.com/jilimb0/UI-Library"> GitHub</a>
            {' · '}
            <a href="https://www.npmjs.com/search?q=%40ui-construction-library">
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
    <div className="example-card">
      <div className="example-card-title">{title}</div>
      <p className="example-card-desc">{desc}</p>
    </div>
  );
}

export default App;
