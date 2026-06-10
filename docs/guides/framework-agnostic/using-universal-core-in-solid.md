# Using Universal Core in Solid

This guide shows how to use the Universal Core packages in SolidJS:
- `@ui-construction-library/tokens` (theme + CSS variables)
- `@ui-construction-library/styles` (universal CSS classes)
- `@ui-construction-library/behaviors` (headless ARIA + interaction logic)

---

## Install

```bash
npm install @ui-construction-library/tokens @ui-construction-library/styles @ui-construction-library/behaviors solid-js
```

---

## App entry (tokens + styles)

```ts
// src/main.tsx
import { generateCSSVariables } from '@ui-construction-library/tokens';
import '@ui-construction-library/styles/styles.css';

const style = document.createElement('style');
style.textContent = generateCSSVariables();
document.head.appendChild(style);
```

---

## Switch wrapper (behaviors)

```tsx
import { createSwitchBehavior } from '@ui-construction-library/behaviors';
import { createMemo, createSignal } from 'solid-js';

export function Switch() {
  const [checked, setChecked] = createSignal(false);
  const behavior = createMemo(() => createSwitchBehavior({ checked: checked() }));

  return (
    <button
      type="button"
      class="ucl-switch ucl-switch--md"
      {...behavior().rootAttrs}
      onClick={() => setChecked((v) => !v)}
    >
      <span class="ucl-switch-thumb" {...behavior().thumbAttrs} />
    </button>
  );
}
```
