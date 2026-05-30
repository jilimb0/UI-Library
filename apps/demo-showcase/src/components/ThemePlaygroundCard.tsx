import {
  Alert,
  Button,
  Card,
  Text,
  useTheme,
} from '@ui-construction-library/core';
import { useState } from 'react';
import { SectionIntro } from './SectionIntro';

export function ThemePlaygroundCard() {
  const { theme, setTheme } = useTheme();
  const [modeLabel, setModeLabel] = useState('Brand default');

  return (
    <Card className="panel">
      <SectionIntro
        eyebrow="Theme system"
        title="ThemeProvider drives runtime product theming"
        description="This section demonstrates that theming is a real app concern. The provider updates runtime state, switches semantic surfaces and keeps docs or product shells aligned without page reloads."
      />
      <div className="stack">
        <div className="row wrap-row">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => {
              setTheme('light');
              setModeLabel('Light product surface applied');
            }}
          >
            Light workspace
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => {
              setTheme('dark');
              setModeLabel('Dark product surface applied');
            }}
          >
            Dark workspace
          </Button>
        </div>
        <Alert variant="default" title="Theme state">
          {modeLabel}. Current runtime theme: {theme}.
        </Alert>
        <div className="theme-token-preview">
          <div className="theme-swatch theme-swatch--primary" />
          <div className="theme-swatch theme-swatch--accent" />
          <div className="theme-swatch theme-swatch--card" />
          <div className="theme-swatch theme-swatch--border" />
        </div>
        <div className="feature-grid feature-grid--dual">
          <Card className="compact-panel">
            <Text className="eyebrow">Runtime state</Text>
            <Text className="text-muted">
              ThemeProvider updates `data-theme`, persists the current mode and
              keeps the whole surface in sync without routing or reloads.
            </Text>
          </Card>
          <Card className="compact-panel">
            <Text className="eyebrow">Semantic surfaces</Text>
            <Text className="text-muted">
              These swatches represent the same token vocabulary used by panels,
              borders, emphasis and content layers across the library.
            </Text>
          </Card>
        </div>
      </div>
    </Card>
  );
}
