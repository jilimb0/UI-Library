# @ui-construction-library/icons

Standalone React icon package for the UI Construction Library. Works independently — no dependency on `core`.

## When to use

Use this package whenever you need icons. It is intentionally separate from `core` so you can use it in projects that don't use the full component library.

## Installation

```bash
pnpm add @ui-construction-library/icons
```

## Peer dependencies

```json
{
  "react": ">=18.0.0"
}
```

## Minimal example

```tsx
import { SearchIcon, CloseIcon, ChevronDownIcon } from '@ui-construction-library/icons';

function SearchBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <SearchIcon size={16} />
      <input placeholder="Search…" />
      <CloseIcon size={16} aria-label="Clear search" />
    </div>
  );
}
```

## Icon props

All icons accept the same prop contract:

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `number \| string` | `24` | Width and height in pixels |
| `color` | `string` | `currentColor` | Fill or stroke colour |
| `className` | `string` | — | CSS class for styling |
| `title` | `string` | — | Accessible title for informative icons |
| `aria-hidden` | `boolean` | — | Set to `true` for decorative icons |

## Accessibility

For **decorative** icons (purely visual, meaning conveyed by adjacent text):

```tsx
<SearchIcon aria-hidden="true" />
```

For **informative** icons (the icon itself conveys meaning):

```tsx
<SearchIcon title="Search" role="img" />
```

## Integration with core

Icons are used inside `core` components automatically. You can also pass them as props:

```tsx
import { Button } from '@ui-construction-library/core';
import { PlusIcon } from '@ui-construction-library/icons';

<Button leftIcon={<PlusIcon size={16} />}>Add item</Button>
```

## Compatibility

- React 18 and 19
- Tree-shakeable — only imported icons are included in the bundle

## Public API

All icons are exported from the package root:

```ts
import { SearchIcon, CloseIcon, ChevronDownIcon, ... } from '@ui-construction-library/icons';
```

## Troubleshooting

**Icon not rendering** — confirm `react` is installed and the icon name is spelled correctly (PascalCase with `Icon` suffix).

**Icon colour not matching text** — icons use `currentColor` by default. Set the parent element's `color` CSS property to control the icon colour.
