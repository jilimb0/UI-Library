# Basic Usage

Copy-ready examples for the most common UI patterns using `@ui-construction-library/core`.

## Installation

```bash
pnpm add @ui-construction-library/core
```

Import the bundled stylesheet in your app entry point:

```tsx
import '@ui-construction-library/core/styles';
```

Wrap your app with `ThemeProvider`:

```tsx
import { ThemeProvider } from '@ui-construction-library/core';

export default function App() {
  return <ThemeProvider>{/* your app */}</ThemeProvider>;
}
```

---

## Button

```tsx
import { Button } from '@ui-construction-library/core';

// Default action
<Button onClick={() => console.log('clicked')}>Save changes</Button>

// Variants
<Button variant="secondary">Cancel</Button>
<Button variant="destructive">Delete account</Button>
<Button variant="outline">Export</Button>
<Button variant="ghost">Learn more</Button>

// Sizes
<Button size="sm">Compact</Button>
<Button size="lg">Prominent</Button>

// Loading state
<Button loading>Saving…</Button>

// With icons
<Button leftIcon={<PlusIcon />}>Add item</Button>
<Button rightIcon={<ArrowRightIcon />}>Continue</Button>

// As link
<Button as="a" href="/dashboard">Go to dashboard</Button>
```

---

## Input

```tsx
import { Input } from '@ui-construction-library/core';

// Basic
<Input label="Email" type="email" placeholder="you@example.com" />

// With description
<Input
  label="Username"
  description="Only letters, numbers, and underscores."
  placeholder="jane_doe"
/>

// Error state
<Input
  label="Password"
  type="password"
  error
  description="Must be at least 8 characters."
/>

// Controlled
const [value, setValue] = useState('');
<Input
  label="Search"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

## Modal

```tsx
import { Modal, Button } from '@ui-construction-library/core';
import { useState } from 'react';

function ConfirmDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete project</Button>

      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content size="sm" title="Delete project">
          <Modal.Body>
            <p>This action cannot be undone. The project and all its pages will be permanently removed.</p>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="outline">Cancel</Button>
            </Modal.Close>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
```

---

## Dropdown

```tsx
import { Dropdown } from '@ui-construction-library/core';

const items = [
  { id: 1, label: 'Edit', value: 'edit' },
  { id: 2, label: 'Duplicate', value: 'duplicate' },
  { id: 3, label: 'Archive', value: 'archive', disabled: true },
  { id: 4, label: 'Delete', value: 'delete' },
];

// Uncontrolled
<Dropdown
  label="Actions"
  items={items}
  placeholder="Choose action"
  onChange={(value) => console.log(value)}
/>

// Controlled open state
const [open, setOpen] = useState(false);
<Dropdown
  label="Actions"
  items={items}
  open={open}
  onOpenChange={setOpen}
  onChange={(value) => console.log(value)}
/>

// Sizes
<Dropdown items={items} size="sm" />
<Dropdown items={items} size="lg" />
```

---

## Card

```tsx
import { Card, Heading, Text, Button } from '@ui-construction-library/core';

<Card className="p-6" style={{ maxWidth: '24rem' }}>
  <Heading as="h3">Project Aurora</Heading>
  <Text style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
    A B2B analytics dashboard for operations teams.
  </Text>
  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
    <Button size="sm">Open</Button>
    <Button size="sm" variant="outline">Settings</Button>
  </div>
</Card>
```

---

## Badge

```tsx
import { Badge } from '@ui-construction-library/core';

<Badge>stable</Badge>
<Badge variant="secondary">beta</Badge>
<Badge variant="destructive">deprecated</Badge>
<Badge variant="outline">draft</Badge>
```

---

## Tabs

```tsx
import { Tabs } from '@ui-construction-library/core';

<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    <Tabs.Trigger value="members">Members</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="overview">
    <p>Project overview content.</p>
  </Tabs.Content>
  <Tabs.Content value="settings">
    <p>Project settings content.</p>
  </Tabs.Content>
  <Tabs.Content value="members">
    <p>Team members content.</p>
  </Tabs.Content>
</Tabs>
```

---

## Alert

```tsx
import { Alert } from '@ui-construction-library/core';

<Alert variant="default" title="Heads up">
  Your trial expires in 3 days. Upgrade to keep access.
</Alert>

<Alert variant="destructive" title="Error">
  Failed to save changes. Please try again.
</Alert>
```

---

## Popover

```tsx
import { Popover, Button, Text } from '@ui-construction-library/core';

<Popover
  size="md"
  trigger={<Button variant="outline">More info</Button>}
  content={
    <div>
      <Text style={{ fontWeight: 600 }}>What is this?</Text>
      <Text style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
        This field controls the visibility of the section in published exports.
      </Text>
    </div>
  }
/>
```
