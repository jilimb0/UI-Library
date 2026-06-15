import {
  Badge,
  Button,
  Heading,
  Icon,
  Navigation,
  Text,
  useTheme,
} from '@ui-construction-library/core';

export function HeaderBar({ scrollTo }: { scrollTo: (id: string) => void }) {
  const { theme, setTheme } = useTheme();

  return (
    <Navigation className="site-nav">
      <div className="brand-lockup">
        <div className="brand-mark">
          <Icon name="star" size={18} />
        </div>
        <div className="stack stack-tight">
          <Heading as="h1" className="brand-title">
            UI Construction Library
          </Heading>
          <Text className="brand-subtitle">Composable React UI system</Text>
        </div>
        <Badge>v0.1</Badge>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('components')}
        >
          Components
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('integrations')}
        >
          Integrations
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('hooks')}
        >
          Hooks
        </button>
        <button
          type="button"
          className="nav-link"
          onClick={() => scrollTo('flagship-flows')}
        >
          Flagship flows
        </button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </div>
    </Navigation>
  );
}
