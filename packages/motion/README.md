# @ui-construction-library/motion

Motion extension for the UI Construction Library. Provides animation-enhanced components and wrappers built on top of `@ui-construction-library/core`.

## When to use

Use this package when you want animated transitions on core components — fade-ins, slide-ins, staggered lists, spring animations. It is an optional extension; `core` works without it.

## Installation

```bash
pnpm add @ui-construction-library/motion
```

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Minimal example

```tsx
import { AnimatedDiv, FadeIn, SlideIn } from '@ui-construction-library/motion';

function WelcomeScreen() {
  return (
    <FadeIn duration={300}>
      <h1>Welcome</h1>
    </FadeIn>
  );
}

function NotificationList({ items }: { items: string[] }) {
  return (
    <AnimatedList>
      {items.map((item) => (
        <AnimatedItem key={item}>{item}</AnimatedItem>
      ))}
    </AnimatedList>
  );
}
```

## Integration with core

Motion components wrap `core` components — they do not replace them:

```tsx
import { Card } from '@ui-construction-library/core';
import { FadeIn } from '@ui-construction-library/motion';

<FadeIn>
  <Card className="p-6">
    <h2>Animated card</h2>
  </Card>
</FadeIn>
```

## Compatibility

- React 18 and 19
- Works alongside `@ui-construction-library/core`
- No CSS side effects

## Public API

```ts
import { AnimatedDiv, FadeIn, SlideIn, ScaleIn, AnimatedList, AnimatedItem } from '@ui-construction-library/motion';
```

## Troubleshooting

**Animation not running** — confirm the component is mounted inside a React tree with `ThemeProvider` from `core`. Motion components respect `prefers-reduced-motion` — animations are disabled when the user has reduced motion enabled in their OS settings.
