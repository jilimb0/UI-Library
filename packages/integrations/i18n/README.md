# @ui-construction-library/integration-i18n

Internationalisation adapter for the UI Construction Library. Provides locale-aware wrappers and translation context for consuming core components in multilingual applications.

## When to use

Use this package when your application supports multiple languages and you want the UI Construction Library's built-in labels, descriptions, and ARIA attributes to switch based on the current locale.

## Installation

```bash
pnpm add @ui-construction-library/integration-i18n
```

## Minimal example

```tsx
import { TranslationProvider, useTranslation } from '@ui-construction-library/integration-i18n';

const resources = {
  en: { ui: { close: 'Close', search: 'Search' } },
  fr: { ui: { close: 'Fermer', search: 'Rechercher' } },
};

function App() {
  return (
    <TranslationProvider language="fr" resources={resources}>
      <MyComponent />
    </TranslationProvider>
  );
}

function MyComponent() {
  const { t } = useTranslation();
  return <button aria-label={t('ui.close')}>X</button>;
}
```

## Compatibility

- React 18 and 19
- Works alongside `@ui-construction-library/core`
- TypeScript 5.x and 6.x

## Public API

```ts
import { TranslationProvider, useTranslation } from '@ui-construction-library/integration-i18n';
```

## Troubleshooting

**Translations not resolving** — confirm the `resources` object contains a namespace matching the second argument to `useTranslation()`. The default namespace is `translation`.
