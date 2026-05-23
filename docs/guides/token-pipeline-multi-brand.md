# Token Pipeline and Multi-Brand Theming

## Pipeline

1. Source tokens live in `packages/tokens/src`.
2. Build step generates consumable artifacts (`dist`) and CSS variable helpers.
3. `@ui-construction-library/core` consumes token output through `ThemeProvider`.

## Multi-Brand Model

Use semantic token groups by brand and apply them through `ThemeProvider` overrides.

```tsx
import { ThemeProvider } from '@ui-construction-library/core';

const brandATokens = {
  colors: {
    primary: '#0F4C81',
    accent: '#2CA58D',
  },
};

const brandBTokens = {
  colors: {
    primary: '#7A1CAC',
    accent: '#FF8A00',
  },
};

export function BrandedApp({
  brand,
  children,
}: {
  brand: 'brandA' | 'brandB';
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider customTokens={brand === 'brandA' ? brandATokens : brandBTokens}>
      {children}
    </ThemeProvider>
  );
}
```

## Operational Rules

1. Token names are stable public contract.
2. New brand themes must be additive first; avoid destructive renames.
3. Breaking token removals are major-version only.
