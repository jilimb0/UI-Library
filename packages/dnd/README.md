# @ui-construction-library/dnd

Drag-and-drop extension for the UI Construction Library. Provides sortable lists, kanban boards, and drag-and-drop interactions built on top of `@ui-construction-library/core`.

## When to use

Use this package when you need drag-and-drop or sortable interactions. It is an optional extension; `core` works without it.

## Installation

```bash
pnpm add @ui-construction-library/dnd
```

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Minimal example — sortable list

```tsx
import { SortableList, SortableItem, DragHandle } from '@ui-construction-library/dnd';
import { useState } from 'react';

const initialItems = [
  { id: '1', label: 'Design tokens' },
  { id: '2', label: 'Core components' },
  { id: '3', label: 'Integration kits' },
];

function TaskList() {
  const [items, setItems] = useState(initialItems);

  return (
    <SortableList items={items} onReorder={setItems}>
      {items.map((item) => (
        <SortableItem key={item.id} id={item.id}>
          <DragHandle />
          <span>{item.label}</span>
        </SortableItem>
      ))}
    </SortableList>
  );
}
```

## Supported scenarios

- Sortable vertical lists
- Sortable horizontal lists
- Kanban board columns and cards
- Grid reordering

## Accessibility and keyboard support

- Drag handles are keyboard-accessible (`Space` to pick up, arrow keys to move, `Space` or `Enter` to drop, `Escape` to cancel)
- Screen reader announcements for pick-up, move, and drop actions
- Focus returns to the drag handle after drop

## Integration with core

DnD components wrap `core` components:

```tsx
import { Card } from '@ui-construction-library/core';
import { SortableItem, DragHandle } from '@ui-construction-library/dnd';

<SortableItem id={item.id}>
  <Card className="p-4">
    <DragHandle />
    {item.label}
  </Card>
</SortableItem>
```

## Compatibility

- React 18 and 19
- Works alongside `@ui-construction-library/core`
- No CSS side effects

## Public API

```ts
import { SortableList, SortableItem, DragHandle, DndContext } from '@ui-construction-library/dnd';
```

## Troubleshooting

**Items not reordering** — confirm you are passing the updated array back via `onReorder`. The component is controlled — it does not manage order internally.

**Keyboard drag not working** — ensure the `DragHandle` element is focusable and not inside a `disabled` container.
