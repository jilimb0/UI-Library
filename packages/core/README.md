# @ui-construction-library/core

React UI component library with layered architecture:

- Atoms
- Molecules
- Organisms
- Templates

## Highlights

- ThemeProvider with light/dark + token overrides
- Compound components (`Modal`, `Tabs`, `Accordion`)
- Polymorphic API (`Button`, `Text`, `Heading` via `as`)
- Dashboard-ready organisms (`Sidebar`, `Drawer`, `Kanban`, `CommandPalette`, `DataTable`, `Calendar`)

## Example

```tsx
import { ThemeProvider, Button, Modal } from '@ui-construction-library/core';

export function App() {
  return (
    <ThemeProvider theme="dark">
      <Button as="a" href="/docs">Open docs</Button>
      <Modal>
        <Modal.Trigger asChild>
          <Button>Open modal</Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Title</Modal.Title>
          </Modal.Header>
          <Modal.Body>Body</Modal.Body>
        </Modal.Content>
      </Modal>
    </ThemeProvider>
  );
}
```
