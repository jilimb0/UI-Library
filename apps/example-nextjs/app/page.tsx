'use client';

import { useState } from 'react';

type Theme = 'dark' | 'light' | 'neutral';

const THEMES: Theme[] = ['dark', 'light', 'neutral'];

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    background: 'var(--ucl-background)',
    color: 'var(--ucl-foreground)',
    fontFamily: 'var(--ucl-font-sans)',
  },
  header: {
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid var(--ucl-border)',
  },
  title: {
    fontSize: 'var(--ucl-text-3xl)',
    fontWeight: 700,
    margin: '0 0 0.5rem',
    color: 'var(--ucl-foreground)',
  },
  subtitle: {
    color: 'var(--ucl-muted-foreground)',
    margin: 0,
  },
  card: {
    padding: '1.5rem',
    borderRadius: 'var(--ucl-radius-lg)',
    background: 'var(--ucl-card)',
    border: '1px solid var(--ucl-border)',
    marginBottom: '1rem',
  },
  badge: (variant: string) => ({
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--ucl-radius-full)',
    fontSize: '0.75rem',
    fontWeight: 600,
    background:
      variant === 'primary'
        ? 'var(--ucl-primary)'
        : variant === 'success'
          ? 'var(--ucl-success)'
          : 'var(--ucl-muted)',
    color:
      variant === 'primary'
        ? 'var(--ucl-primary-foreground)'
        : variant === 'success'
          ? 'var(--ucl-success-foreground)'
          : 'var(--ucl-muted-foreground)',
  }),
  themeRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  themeBtn: (active: boolean) => ({
    padding: '0.5rem 1rem',
    borderRadius: 'var(--ucl-radius-md)',
    border: `1px solid ${active ? 'var(--ucl-ring)' : 'var(--ucl-border)'}`,
    background: active ? 'var(--ucl-accent)' : 'transparent',
    color: 'var(--ucl-foreground)',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: active ? 600 : 400,
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  sampleBox: {
    padding: '1rem',
    borderRadius: 'var(--ucl-radius-md)',
    background: 'var(--ucl-muted)',
    border: '1px solid var(--ucl-border)',
  },
  code: {
    fontFamily: 'var(--ucl-font-mono)',
    fontSize: '0.875rem',
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--ucl-radius-sm)',
    background: 'var(--ucl-muted)',
    color: 'var(--ucl-foreground)',
  },
} as const;

export default function Home() {
  const [theme, setTheme] = useState<Theme>('dark');

  const updateTheme = (t: Theme) => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>UI-Library × Next.js</h1>
        <p style={styles.subtitle}>
          Example App Router application with theme switching via{' '}
          <code style={styles.code}>@ui-construction-library/themes</code>
        </p>

        <div style={styles.themeRow}>
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              style={styles.themeBtn(theme === t)}
              onClick={() => updateTheme(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <div style={styles.card}>
        <h2 style={{ marginTop: 0, color: 'var(--ucl-foreground)' }}>
          Theme Tokens in Action
        </h2>
        <p style={styles.subtitle}>
          All colors, spacing, and typography come from{' '}
          <code style={styles.code}>--ucl-*</code> CSS custom properties. Switch
          themes above to see them change.
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.sampleBox}>
          <span style={styles.badge('primary')}>Primary</span>
          <span style={{ ...styles.badge('success'), marginLeft: '0.5rem' }}>
            Success
          </span>
          <span style={{ ...styles.badge('default'), marginLeft: '0.5rem' }}>
            Default
          </span>
          <p style={{ marginTop: '1rem', color: 'var(--ucl-foreground)' }}>
            Badge variants using theme colors
          </p>
        </div>

        <div style={styles.sampleBox}>
          <p style={{ color: 'var(--ucl-foreground)', fontWeight: 600 }}>
            Typography Scale
          </p>
          <p style={{ fontSize: 'var(--ucl-text-xs)' }}>Extra small (xs)</p>
          <p style={{ fontSize: 'var(--ucl-text-sm)' }}>Small (sm)</p>
          <p style={{ fontSize: 'var(--ucl-text-base)' }}>Base</p>
          <p style={{ fontSize: 'var(--ucl-text-lg)' }}>Large (lg)</p>
        </div>

        <div style={styles.sampleBox}>
          <p style={{ color: 'var(--ucl-foreground)', fontWeight: 600 }}>
            Spacing Samples
          </p>
          <div style={{ display: 'flex', gap: 'var(--ucl-spacing-2)' }}>
            <div
              style={{
                width: 'var(--ucl-spacing-8)',
                height: 'var(--ucl-spacing-8)',
                borderRadius: 'var(--ucl-radius-md)',
                background: 'var(--ucl-primary)',
              }}
            />
            <div
              style={{
                width: 'var(--ucl-spacing-8)',
                height: 'var(--ucl-spacing-8)',
                borderRadius: 'var(--ucl-radius-md)',
                background: 'var(--ucl-muted)',
              }}
            />
            <div
              style={{
                width: 'var(--ucl-spacing-8)',
                height: 'var(--ucl-spacing-8)',
                borderRadius: 'var(--ucl-radius-md)',
                background: 'var(--ucl-ring)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
