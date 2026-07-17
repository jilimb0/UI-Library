import { useState } from 'react';

type Theme = 'dark' | 'light' | 'neutral';

const THEMES: Theme[] = ['dark', 'light', 'neutral'];

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');

  const updateTheme = (t: Theme) => {
    setTheme(t);
    document.documentElement.setAttribute('data-theme', t);
  };

  return (
    <div
      style={{
        background: 'var(--ucl-background)',
        color: 'var(--ucl-foreground)',
        fontFamily: 'var(--ucl-font-sans)',
        minHeight: '100vh',
      }}
    >
      {/* Header with Tailwind utility classes */}
      <header
        style={{
          borderBottom: '1px solid var(--ucl-border)',
          padding: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--ucl-text-3xl)',
            fontWeight: 700,
            color: 'var(--ucl-foreground)',
            margin: 0,
          }}
        >
          UI-Library × Tailwind CSS 4
        </h1>
        <p style={{ color: 'var(--ucl-muted-foreground)' }}>
          Theme CSS variables work seamlessly alongside Tailwind utilities
        </p>

        {/* Theme switcher — Tailwind + CSS variables */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--ucl-radius-md)',
                border: `1px solid ${theme === t ? 'var(--ucl-ring)' : 'var(--ucl-border)'}`,
                background: theme === t ? 'var(--ucl-accent)' : 'transparent',
                color: 'var(--ucl-foreground)',
                cursor: 'pointer',
                fontWeight: theme === t ? 600 : 400,
              }}
              onClick={() => updateTheme(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        {/* Cards grid using CSS variables via style prop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          <Card title="Surface Colors" theme="primary">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Swatch label="Background" color="var(--ucl-background)" />
              <Swatch label="Card" color="var(--ucl-card)" />
              <Swatch label="Muted" color="var(--ucl-muted)" />
              <Swatch label="Border" color="var(--ucl-border)" />
            </div>
          </Card>

          <Card title="Brand Colors" theme="primary">
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Swatch label="Primary" color="var(--ucl-primary)" />
              <Swatch label="Success" color="var(--ucl-success)" />
              <Swatch label="Warning" color="var(--ucl-warning)" />
              <Swatch label="Error" color="var(--ucl-error)" />
            </div>
          </Card>

          <Card title="Spacing & Radius" theme="primary">
            <p
              style={{
                color: 'var(--ucl-muted-foreground)',
                fontSize: '0.875rem',
              }}
            >
              Spacing scale:{' '}
              {Array.from({ length: 5 }, (_, i) => i + 1).join(', ')}
            </p>
            <div style={{ display: 'flex', gap: 'var(--ucl-spacing-2)' }}>
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  style={{
                    width: `var(--ucl-spacing-${s * 2})`,
                    height: `var(--ucl-spacing-${s * 2})`,
                    borderRadius: 'var(--ucl-radius-md)',
                    background: 'var(--ucl-primary)',
                    opacity: 1 - s * 0.15,
                  }}
                />
              ))}
            </div>
          </Card>

          <Card title="Typography" theme="primary">
            <p style={{ fontSize: 'var(--ucl-text-xs)' }}>
              xs — The quick brown fox
            </p>
            <p style={{ fontSize: 'var(--ucl-text-sm)' }}>
              sm — The quick brown fox
            </p>
            <p style={{ fontSize: 'var(--ucl-text-base)' }}>
              base — The quick brown fox
            </p>
            <p style={{ fontSize: 'var(--ucl-text-lg)' }}>
              lg — The quick brown fox
            </p>
          </Card>
        </div>

        {/* Info section */}
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            borderRadius: 'var(--ucl-radius-lg)',
            background: 'var(--ucl-card)',
            border: '1px solid var(--ucl-border)',
          }}
        >
          <h2
            style={{
              color: 'var(--ucl-foreground)',
              fontSize: 'var(--ucl-text-xl)',
              margin: '0 0 0.5rem',
            }}
          >
            How It Works
          </h2>
          <p style={{ color: 'var(--ucl-muted-foreground)', margin: 0 }}>
            This app imports{' '}
            <code
              style={{
                fontFamily: 'var(--ucl-font-mono)',
                padding: '0.125rem 0.375rem',
                borderRadius: 'var(--ucl-radius-sm)',
                background: 'var(--ucl-muted)',
              }}
            >
              @ui-construction-library/themes/theme-dark.css
            </code>{' '}
            which scopes all CSS custom properties under{' '}
            <code
              style={{
                fontFamily: 'var(--ucl-font-mono)',
                padding: '0.125rem 0.375rem',
                borderRadius: 'var(--ucl-radius-sm)',
                background: 'var(--ucl-muted)',
              }}
            >
              [data-theme="dark"]
            </code>
            . Toggle themes above to switch between dark, light, and neutral
            color schemes — no JS runtime needed.
          </p>
        </div>
      </main>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  theme?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--ucl-radius-lg)',
        background: 'var(--ucl-card)',
        border: '1px solid var(--ucl-border)',
      }}
    >
      <h3
        style={{
          color: 'var(--ucl-foreground)',
          fontSize: 'var(--ucl-text-base)',
          fontWeight: 600,
          margin: '0 0 1rem',
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: '3rem',
          height: '3rem',
          borderRadius: 'var(--ucl-radius-md)',
          background: color,
          border: '1px solid var(--ucl-border)',
          marginBottom: '0.25rem',
        }}
      />
      <span
        style={{
          fontSize: '0.625rem',
          color: 'var(--ucl-muted-foreground)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
