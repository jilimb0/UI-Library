# @ui-construction-library/motion

Motion extension for the UI Construction Library. Provides animation-enhanced components and wrappers that can be composed with `@ui-construction-library/core`.

## When to use

Use this package when you want animated transitions — fade-ins, slide-ins, bounces, or custom motion wrappers. It is an optional extension; `core` works without it.

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
import { FadeIn, SlideIn, Bounce } from '@ui-construction-library/motion';

// Fade in any content
<FadeIn>
  <h1>Welcome</h1>
</FadeIn>

// Slide in from a direction
<SlideIn direction="right">
  <nav>Sidebar</nav>
</SlideIn>

// Bounce entrance
<Bounce>
  <div className="notification">New message</div>
</Bounce>
```

## Available components

| Export | Description |
|---|---|
| `FadeIn` | Wraps children with a CSS fade-in entrance animation |
| `SlideIn` | Wraps children with a directional slide-in animation |
| `Bounce` | Wraps children with a bounce entrance animation |
| `MotionDiv` | Low-level animated `<div>` with `MotionProps` |
| `motion` | Object with `motion.div` for building custom animated elements |
| `MotionFadeIn` | Pre-configured `motion.div` with fade-in defaults |
| `MotionSlideIn` | Pre-configured `motion.div` with slide-in defaults |
| `fadeInProps` | Reusable animation prop object for fade-in |
| `getSlideInProps(direction)` | Returns animation props for a given slide direction |

## Types

```ts
import type {
  FadeInProps,
  BounceProps,
  MotionProps,
  MotionTransition,
} from '@ui-construction-library/motion';
```

## Integration with core

Motion components wrap `core` components — they do not replace them:

```tsx
import { Card, Heading } from '@ui-construction-library/core';
import { FadeIn } from '@ui-construction-library/motion';

<FadeIn>
  <Card className="p-6">
    <Heading as="h2">Animated card</Heading>
  </Card>
</FadeIn>
```

## Low-level usage

```tsx
import { motion, MotionDiv } from '@ui-construction-library/motion';

// motion.div — custom animated element
const AnimatedPanel = motion.div;

<AnimatedPanel
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 200 }}
>
  Panel content
</AnimatedPanel>

// MotionDiv — typed wrapper
<MotionDiv duration={300} easing="ease-out">
  Content
</MotionDiv>
```

## Compatibility

- React 18 and 19
- No dependency on `@ui-construction-library/core` at runtime
- No CSS side effects — animations are CSS-based

## Public API

```ts
import {
  FadeIn, FadeInProps,
  SlideIn,
  Bounce, BounceProps,
  MotionDiv, MotionProps, MotionTransition,
  motion,
  MotionFadeIn, fadeInProps,
  MotionSlideIn, getSlideInProps,
} from '@ui-construction-library/motion';
```

## Troubleshooting

**Animation not running** — confirm the component is mounted in the DOM. Animations trigger on mount; if the element is conditionally rendered, the animation fires each time it mounts.

**`prefers-reduced-motion`** — wrap animation durations with a check if you need to respect the user's OS motion preference:

```ts
const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300;
```
