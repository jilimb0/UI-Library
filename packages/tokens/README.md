# @ui-lib/tokens

Design token package for multi-framework consumption.

## Includes

- Color scales (`50..900`) and semantic light/dark colors
- Motion tokens (duration/easing)
- Opacity tokens
- CSS variable generator
- Tailwind preset

## Usage

```ts
import { generateCSSVariables, colors, motion } from '@ui-lib/tokens';

const css = generateCSSVariables({ mode: 'dark' });
```

Tailwind preset:

```ts
import preset from '@ui-lib/tokens/tailwind.preset';

export default {
  presets: [preset],
};
```
