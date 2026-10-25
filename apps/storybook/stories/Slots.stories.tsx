import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Button, Input, Toast } from '@ui-construction-library/core';

/**
 * Demonstrates the two lego customisation APIs:
 *
 * 1. **asChild** — render a component as a different element by passing
 *    `asChild` and a single child. The component merges its props/handlers
 *    onto the child without adding an extra DOM node.
 *
 * 2. **classNames** — override the CSS class for individual sub-elements
 *    (slots) of a multi-part component.
 */

const meta: Meta = {
  title: 'Design System/Slots & asChild',
  parameters: { layout: 'padded' },
};

export default meta;

// ---------------------------------------------------------------------------
export const ButtonAsLink: StoryObj = {
  name: 'Button asChild — renders as <a>',
  render: () => (
    <Button asChild variant="default">
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        Open link (Button styles, anchor element)
      </a>
    </Button>
  ),
};

// ---------------------------------------------------------------------------
export const BadgeAsButton: StoryObj = {
  name: 'Badge asChild — renders as <button>',
  render: () => (
    <Badge asChild variant="success">
      {/* biome-ignore lint/a11y/useButtonType: intentional demo */}
      <button onClick={() => alert('Badge clicked!')}>Clickable badge</button>
    </Badge>
  ),
};

// ---------------------------------------------------------------------------
export const InputSlotClassNames: StoryObj = {
  name: 'Input classNames — override label + hint slots',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 320,
      }}
    >
      <Input
        label="Default (no overrides)"
        placeholder="Name"
        description="Used for invoices"
      />
      <Input
        label="Custom label + hint colour"
        placeholder="Email"
        description="We will never share your email"
        classNames={{
          label: 'font-bold uppercase tracking-wide',
          description: 'text-[11px] italic',
        }}
      />
      <Input
        label="Error state with custom error slot"
        placeholder="Username"
        error
        errorMessage="Username is already taken"
        classNames={{
          error: 'font-semibold',
        }}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
export const ToastSlotClassNames: StoryObj = {
  name: 'Toast classNames — override body + close slots',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        maxWidth: 360,
      }}
    >
      <Toast variant="success" onClose={() => {}}>
        Default toast
      </Toast>
      <Toast
        variant="error"
        onClose={() => {}}
        classNames={{
          body: 'font-semibold',
          close: 'text-white opacity-80 hover:opacity-100',
        }}
      >
        Custom body + close button styles
      </Toast>
    </div>
  ),
};
