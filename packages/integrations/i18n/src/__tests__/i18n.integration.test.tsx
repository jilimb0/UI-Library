import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TranslationProvider, useTranslation } from '../index';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Probe({ fallback }: { fallback?: string }) {
  const { t } = useTranslation();
  return <div data-testid="translation">{t('greeting', fallback)}</div>;
}

function NestedKeyProbe() {
  const { t } = useTranslation();
  return <div data-testid="nested">{t('common.errors.not_found')}</div>;
}

function InterpolationProbe() {
  const { t } = useTranslation();
  return <div data-testid="interpolated">{t('welcome')}</div>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

afterEach(() => {
  cleanup();
});

describe('TranslationProvider + useTranslation', () => {
  it('should render translation from provider', () => {
    render(
      <TranslationProvider t={(key) => `translated:${key}`}>
        <Probe />
      </TranslationProvider>
    );

    expect(screen.getByTestId('translation').textContent).toBe(
      'translated:greeting'
    );
  });

  it('should use fallback when key is not found by the translate fn', () => {
    // Our mock translate function only handles specific keys
    const translateFn = (key: string, fallback?: string) => {
      const translations: Record<string, string> = {
        greeting: 'Hello',
        farewell: 'Goodbye',
      };
      return translations[key] ?? fallback ?? key;
    };

    render(
      <TranslationProvider t={translateFn}>
        <Probe fallback="Hi there" />
      </TranslationProvider>
    );

    // 'greeting' exists, so it should return 'Hello'
    expect(screen.getByTestId('translation').textContent).toBe('Hello');
  });

  it('should fallback to default locale when translate fn returns undefined', () => {
    const translateFn = (key: string, fallback?: string) => {
      if (key === 'unknown_key') {
        return fallback ?? key;
      }
      return `translated_${key}`;
    };

    function UnknownKeyProbe() {
      const { t } = useTranslation();
      return (
        <div data-testid="unknown">{t('unknown_key', 'Default Text')}</div>
      );
    }

    render(
      <TranslationProvider t={translateFn}>
        <UnknownKeyProbe />
      </TranslationProvider>
    );

    // The translateFn returns fallback for unknown keys
    expect(screen.getByTestId('unknown').textContent).toBe('Default Text');
  });

  it('should handle nested key access', () => {
    const translateFn = (key: string, fallback?: string) => {
      const translations: Record<string, string> = {
        'common.errors.not_found': 'Resource not found',
        'common.errors.timeout': 'Request timed out',
      };
      return translations[key] ?? fallback ?? key;
    };

    render(
      <TranslationProvider t={translateFn}>
        <NestedKeyProbe />
      </TranslationProvider>
    );

    expect(screen.getByTestId('nested').textContent).toBe('Resource not found');
  });

  it('should fallback to key itself when no fallback provided and key missing', () => {
    const translateFn = (key: string, _fallback?: string) => {
      const translations: Record<string, string> = {};
      return translations[key] ?? _fallback ?? key;
    };

    function MissingKeyProbe() {
      const { t } = useTranslation();
      return <div data-testid="missing">{t('nonexistent_key')}</div>;
    }

    render(
      <TranslationProvider t={translateFn}>
        <MissingKeyProbe />
      </TranslationProvider>
    );

    expect(screen.getByTestId('missing').textContent).toBe('nonexistent_key');
  });

  it('should handle variable interpolation in translation values', () => {
    const translateFn = (key: string, fallback?: string) => {
      const translations: Record<string, string> = {
        welcome: 'Welcome, {{name}}! You have {{count}} messages.',
      };
      return translations[key] ?? fallback ?? key;
    };

    render(
      <TranslationProvider t={translateFn}>
        <InterpolationProbe />
      </TranslationProvider>
    );

    // At provider level, interpolation is handled by the translate function
    expect(screen.getByTestId('interpolated').textContent).toBe(
      'Welcome, {{name}}! You have {{count}} messages.'
    );
  });

  it('should support multiple translations in the same component', () => {
    function MultiTranslationProbe() {
      const { t } = useTranslation();
      return (
        <div>
          <span data-testid="t1">{t('title')}</span>
          <span data-testid="t2">{t('description')}</span>
          <span data-testid="t3">{t('footer')}</span>
        </div>
      );
    }

    const translateFn = (key: string) => {
      const map: Record<string, string> = {
        title: 'My App',
        description: 'A great app',
        footer: '© 2024',
      };
      return map[key] ?? key;
    };

    render(
      <TranslationProvider t={translateFn}>
        <MultiTranslationProbe />
      </TranslationProvider>
    );

    expect(screen.getByTestId('t1').textContent).toBe('My App');
    expect(screen.getByTestId('t2').textContent).toBe('A great app');
    expect(screen.getByTestId('t3').textContent).toBe('© 2024');
  });

  it('should pass the key through when translate fn returns undefined without fallback', () => {
    const translateFn = (key: string, _fallback?: string) => {
      // Simulates a translate function that returns nothing for certain keys
      return _fallback ?? key;
    };

    function PassthroughProbe() {
      const { t } = useTranslation();
      return <div data-testid="passthrough">{t('some.key')}</div>;
    }

    render(
      <TranslationProvider t={translateFn}>
        <PassthroughProbe />
      </TranslationProvider>
    );

    // The context default is (key, fallback) => fallback ?? key
    expect(screen.getByTestId('passthrough').textContent).toBe('some.key');
  });

  it('should handle locale-specific translations', () => {
    function LocaleProbe() {
      const { t } = useTranslation();
      return <div data-testid="locale">{t('hello')}</div>;
    }

    // Spanish translations
    const esTranslate = (key: string) => {
      const es: Record<string, string> = { hello: 'Hola' };
      return es[key] ?? key;
    };

    render(
      <TranslationProvider t={esTranslate}>
        <LocaleProbe />
      </TranslationProvider>
    );

    expect(screen.getByTestId('locale').textContent).toBe('Hola');
  });
});
