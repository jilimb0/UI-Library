# Advanced Patterns

Copy-ready recipes for complex interaction patterns using `@ui-construction-library/core` and `@ui-construction-library/primitives`.

---

## Controlled overlay family

All overlay components share the same `open / defaultOpen / onOpenChange` contract. This makes it straightforward to drive them from shared state.

```tsx
import { Dropdown, Modal, Popover } from '@ui-construction-library/core';
import { ContextMenu } from '@ui-construction-library/primitives';
import { useState } from 'react';

// Controlled Dropdown
const [dropdownOpen, setDropdownOpen] = useState(false);
<Dropdown
  items={items}
  open={dropdownOpen}
  onOpenChange={setDropdownOpen}
  onChange={handleSelect}
/>

// Controlled Modal
const [modalOpen, setModalOpen] = useState(false);
<Modal open={modalOpen} onOpenChange={setModalOpen}>
  <Modal.Content title="Confirm">...</Modal.Content>
</Modal>

// Controlled Popover
const [popoverOpen, setPopoverOpen] = useState(false);
<Popover
  open={popoverOpen}
  onOpenChange={setPopoverOpen}
  trigger={<button>Info</button>}
  content={<p>Details here.</p>}
/>

// Controlled ContextMenu (new in this release)
const [ctxOpen, setCtxOpen] = useState(false);
<ContextMenu.Root open={ctxOpen} onOpenChange={setCtxOpen}>
  <ContextMenu.Trigger>Right-click me</ContextMenu.Trigger>
  <ContextMenu.Portal>
    <ContextMenu.Content>
      <ContextMenu.Item onSelect={() => console.log('edit')}>Edit</ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Portal>
</ContextMenu.Root>
```

---

## Modal with size variants

```tsx
import { Modal, Button } from '@ui-construction-library/core';

// Small — confirmations, alerts
<Modal open={open} onOpenChange={setOpen}>
  <Modal.Content size="sm" title="Delete item">
    <Modal.Body>Are you sure? This cannot be undone.</Modal.Body>
    <Modal.Footer>
      <Modal.Close asChild><Button variant="outline">Cancel</Button></Modal.Close>
      <Button variant="destructive">Delete</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>

// Large — editors, previews
<Modal open={open} onOpenChange={setOpen}>
  <Modal.Content size="lg" title="Edit component">
    <Modal.Body>{/* rich editor */}</Modal.Body>
  </Modal.Content>
</Modal>

// Full — canvas overlays, image viewers
<Modal open={open} onOpenChange={setOpen}>
  <Modal.Content size="full" title="Preview">
    <Modal.Body>{/* full-width content */}</Modal.Body>
  </Modal.Content>
</Modal>
```

---

## Focus trap in custom overlays

Use `trapFocus` from the primitives package to add keyboard-safe focus management to any custom overlay:

```tsx
import { trapFocus } from '@ui-construction-library/core'; // re-exported from primitives
import { useEffect, useRef } from 'react';

function CustomPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    // Returns a cleanup function — removes the keydown listener on unmount/close
    return trapFocus(panelRef.current, onClose);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Custom panel">
      <button type="button">First focusable</button>
      <button type="button">Second focusable</button>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  );
}
```

---

## Command palette with keyboard shortcut

```tsx
import { CommandPalette } from '@ui-construction-library/core';
import { useEffect, useState } from 'react';

const COMMANDS = [
  {
    heading: 'Navigation',
    items: [
      { id: 'home', label: 'Go to home', onSelect: () => navigate('/') },
      { id: 'settings', label: 'Open settings', onSelect: () => navigate('/settings') },
    ],
  },
  {
    heading: 'Actions',
    items: [
      { id: 'new', label: 'New project', onSelect: () => createProject() },
      { id: 'export', label: 'Export current page', onSelect: () => exportPage() },
    ],
  },
];

export function AppWithCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        ⌘K — Open commands
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} groups={COMMANDS} />
    </>
  );
}
```

---

## DataTable with custom cell renderers

```tsx
import { Badge, Button, DataTable } from '@ui-construction-library/core';

type Project = {
  id: string;
  name: string;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
};

const STATUS_VARIANT = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline',
} as const;

<DataTable<Project>
  columns={[
    { key: 'name', header: 'Project', sortable: true },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
      ),
    },
    { key: 'updatedAt', header: 'Last updated', sortable: true },
    {
      key: 'id',
      header: '',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={() => openProject(row.id)}>
          Open
        </Button>
      ),
    },
  ]}
  data={projects}
  pageSize={20}
/>
```

---

## Drawer with controlled state

```tsx
import { Button, Drawer } from '@ui-construction-library/core';
import { useState } from 'react';

export function InspectorDrawer({ nodeId }: { nodeId: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open inspector
      </Button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="right"
        title="Node inspector"
        description={nodeId ? `Inspecting node ${nodeId}` : 'No node selected'}
      >
        <div style={{ padding: '1rem' }}>
          {nodeId ? (
            <p>Properties for node <code>{nodeId}</code></p>
          ) : (
            <p>Select a node on the canvas to inspect its properties.</p>
          )}
        </div>
      </Drawer>
    </>
  );
}
```

---

## useControllableState for custom components

Build your own controlled/uncontrolled components using the same hook the library uses internally:

```tsx
import { useControllableState } from '@ui-construction-library/primitives';

interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: React.ReactNode;
}

export function Toggle({ pressed, defaultPressed, onPressedChange, children }: ToggleProps) {
  const [isPressed, setIsPressed] = useControllableState({
    value: pressed,
    defaultValue: defaultPressed ?? false,
    onChange: onPressedChange,
  });

  return (
    <button
      type="button"
      aria-pressed={Boolean(isPressed)}
      onClick={() => setIsPressed(!isPressed)}
      style={{
        background: isPressed ? 'var(--primary)' : 'transparent',
        color: isPressed ? 'var(--primary-foreground)' : 'inherit',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '0.375rem 0.75rem',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
```
