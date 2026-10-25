import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Badge,
  Button,
  Card,
  Heading,
  Input,
  Text,
  ThemeProvider,
  useTheme,
} from '@ui-construction-library/core';
import { useState } from 'react';

// ---------------------------------------------------------------------------
// Demo helpers
// ---------------------------------------------------------------------------

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {(['light', 'dark'] as const).map((t) => (
        <Button
          key={t}
          size="sm"
          variant={theme === t ? 'default' : 'outline'}
          onClick={() => setTheme(t)}
        >
          {t}
        </Button>
      ))}
    </div>
  );
}

function BrandPreview({ label, primary }: { label: string; primary: string }) {
  return (
    <Card style={{ padding: 20, flex: 1, minWidth: 200 }}>
      <Text
        size="sm"
        style={{ marginBottom: 12, color: 'var(--muted-foreground)' }}
      >
        {label}
      </Text>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: primary,
          marginBottom: 12,
        }}
      />
      <Button style={{ width: '100%', backgroundColor: primary }}>CTA</Button>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Design System/Theming',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ThemeProvider supports built-in light/dark themes and arbitrary ' +
          'multibrand themes. Custom themes override Tier-2 semantic and ' +
          'Tier-3 component-state tokens.',
      },
    },
  },
};

export default meta;

// ---------------------------------------------------------------------------
export const BuiltinThemes: StoryObj = {
  name: 'Built-in light / dark',
  render: () => (
    <ThemeProvider defaultTheme="light">
      <ThemeSwitcher />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button variant="default">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        {(['default', 'success', 'warning', 'error', 'info'] as const).map(
          (v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          )
        )}
      </div>
    </ThemeProvider>
  ),
};

// ---------------------------------------------------------------------------
export const MultibrandLego: StoryObj = {
  name: 'Multibrand lego',
  render: () => {
    const BRANDS = [
      { id: 'brand-ocean', label: 'Ocean', primary: '#0066cc' },
      { id: 'brand-forest', label: 'Forest', primary: '#1a7a4a' },
      { id: 'brand-ember', label: 'Ember', primary: '#c94a00' },
    ];

    const themes = Object.fromEntries(
      BRANDS.map(({ id, primary }) => [
        id,
        {
          semantic: {
            'color-primary': primary,
            'color-ring': primary,
          },
          component: {
            button: {
              'primary-default': primary,
            },
          },
        },
      ])
    );

    return (
      <ThemeProvider defaultTheme="light" themes={themes}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {BRANDS.map(({ id, label, primary }) => (
            <BrandPreview key={id} label={label} primary={primary} />
          ))}
        </div>
        <Text
          size="sm"
          style={{ marginTop: 16, color: 'var(--muted-foreground)' }}
        >
          Each brand overrides only semantic + component-state tokens — the
          structural CSS (spacing, radius, shadow) stays from the Mono Luxe
          default.
        </Text>
      </ThemeProvider>
    );
  },
};

// ---------------------------------------------------------------------------
export const RuntimeSwitch: StoryObj = {
  name: 'Runtime theme switch',
  render: () => {
    const CUSTOM_THEME = 'brand-neon';
    const [active, setActive] = useState<string>('light');

    return (
      <ThemeProvider
        theme={active}
        themes={{
          [CUSTOM_THEME]: {
            semantic: {
              'color-primary': '#9b00ff',
              'color-ring': '#9b00ff',
            },
            component: {
              button: {
                'primary-default': '#9b00ff',
                'primary-hover': '#7a00cc',
              },
            },
          },
        }}
      >
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['light', 'dark', CUSTOM_THEME].map((t) => (
            <Button
              key={t}
              size="sm"
              variant={active === t ? 'default' : 'outline'}
              onClick={() => setActive(t)}
            >
              {t}
            </Button>
          ))}
        </div>
        <Card style={{ padding: 20 }}>
          <Heading as="h3" style={{ marginBottom: 8 }}>
            Active theme: {active}
          </Heading>
          <Input label="Name" placeholder="Type something…" />
        </Card>
      </ThemeProvider>
    );
  },
};
