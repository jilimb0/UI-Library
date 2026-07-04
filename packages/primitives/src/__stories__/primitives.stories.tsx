import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '../accordion';
import { Box } from '../box';
import { Dialog } from '../dialog';
import { Field, InputBase, Label, SelectBase } from '../field';
import { Grid } from '../grid';
import { Popover } from '../popover';
import { Range, Root, Thumb, Track } from '../slider';
import { Stack } from '../stack';
import { Switch } from '../switch';
import { Tabs } from '../tabs';

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

const AccordionMeta: Meta<typeof Accordion.Root> = {
  title: 'Primitives/Accordion',
  component: Accordion.Root,
  tags: ['autodocs'],
};

export default AccordionMeta;
type AccordionStory = StoryObj<typeof Accordion.Root>;

export const AccordionSingle: AccordionStory = {
  render: () => (
    <Accordion.Root type="single" collapsible style={{ maxWidth: 400 }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Section 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '8px 0' }}>Content for section 1.</div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Section 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '8px 0' }}>Content for section 2.</div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const AccordionMultiple: AccordionStory = {
  render: () => (
    <Accordion.Root type="multiple" style={{ maxWidth: 400 }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>Section A</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '8px 0' }}>Content for section A.</div>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>Section B</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '8px 0' }}>Content for section B.</div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

// ---------------------------------------------------------------------------
// Box
// ---------------------------------------------------------------------------

const _BoxMeta: Meta<typeof Box> = {
  title: 'Primitives/Box',
  component: Box,
  tags: ['autodocs'],
};

export const BoxDefault: StoryObj<typeof Box> = {
  name: 'Box',
  render: () => (
    <Box padding="16px" style={{ border: '1px dashed #ccc' }}>
      This is a Box with 16px padding.
    </Box>
  ),
};

export const BoxAsSection: StoryObj<typeof Box> = {
  name: 'Box as Section',
  render: () => (
    <Box
      as="section"
      padding="24px"
      margin="8px"
      style={{ border: '1px solid #e0e0e0' }}
    >
      Rendered as a &lt;section&gt; element with margin and padding.
    </Box>
  ),
};

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------

const _DialogMeta: Meta<typeof Dialog.Root> = {
  title: 'Primitives/Dialog',
  component: Dialog.Root,
  tags: ['autodocs'],
};

export const DialogDefault: StoryObj<typeof Dialog.Root> = {
  name: 'Dialog',
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            padding: 24,
            borderRadius: 8,
            minWidth: 320,
          }}
        >
          <Dialog.Title style={{ margin: 0 }}>Dialog Title</Dialog.Title>
          <Dialog.Description>This is a dialog description.</Dialog.Description>
          <div style={{ marginTop: 16 }}>
            <Dialog.Close>Close</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

const _FieldMeta: Meta<typeof Field> = {
  title: 'Primitives/Field',
  component: Field,
  tags: ['autodocs'],
};

export const FieldDefault: StoryObj<typeof Field> = {
  name: 'Field',
  render: () => (
    <Field>
      <Label>Email</Label>
      <InputBase type="email" placeholder="you@example.com" />
    </Field>
  ),
};

export const FieldWithError: StoryObj<typeof Field> = {
  name: 'Field with Error',
  render: () => (
    <Field error>
      <Label>Password</Label>
      <InputBase type="password" defaultValue="abc" />
      <span style={{ color: 'red', fontSize: 12 }}>Password is too short.</span>
    </Field>
  ),
};

export const SelectBaseExample: StoryObj<typeof SelectBase> = {
  name: 'SelectBase',
  render: () => (
    <Field>
      <Label>Country</Label>
      <SelectBase>Select a country</SelectBase>
    </Field>
  ),
};

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

const _GridMeta: Meta<typeof Grid> = {
  title: 'Primitives/Grid',
  component: Grid,
  tags: ['autodocs'],
};

export const GridDefault: StoryObj<typeof Grid> = {
  name: 'Grid',
  render: () => (
    <Grid columns={3} gap="12px">
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        Item 1
      </div>
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        Item 2
      </div>
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        Item 3
      </div>
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        Item 4
      </div>
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        Item 5
      </div>
      <div style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        Item 6
      </div>
    </Grid>
  ),
};

export const GridWithAreas: StoryObj<typeof Grid> = {
  name: 'Grid with Areas',
  render: () => (
    <Grid
      columns="1fr 2fr 1fr"
      gap="8px"
      areas="'header header header' 'nav main aside' 'footer footer footer'"
    >
      <div style={{ gridArea: 'header', background: '#e3f2fd', padding: 16 }}>
        Header
      </div>
      <div style={{ gridArea: 'nav', background: '#f3e5f5', padding: 16 }}>
        Nav
      </div>
      <div style={{ gridArea: 'main', background: '#fff', padding: 16 }}>
        Main Content
      </div>
      <div style={{ gridArea: 'aside', background: '#f3e5f5', padding: 16 }}>
        Aside
      </div>
      <div style={{ gridArea: 'footer', background: '#e3f2fd', padding: 16 }}>
        Footer
      </div>
    </Grid>
  ),
};

// ---------------------------------------------------------------------------
// Popover
// ---------------------------------------------------------------------------

const _PopoverMeta: Meta<typeof Popover.Root> = {
  title: 'Primitives/Popover',
  component: Popover.Root,
  tags: ['autodocs'],
};

export const PopoverDefault: StoryObj<typeof Popover.Root> = {
  name: 'Popover',
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          sideOffset={8}
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 6,
            padding: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          Popover content here.
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ),
};

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------

const _SliderMeta: Meta<typeof Root> = {
  title: 'Primitives/Slider',
  component: Root,
  tags: ['autodocs'],
};

export const SliderDefault: StoryObj<typeof Root> = {
  name: 'Slider',
  render: () => (
    <Root
      defaultValue={[40]}
      min={0}
      max={100}
      step={1}
      style={{ width: 300, padding: '20px 0' }}
    >
      <Track
        style={{
          height: 8,
          background: '#e0e0e0',
          borderRadius: 4,
          position: 'relative',
        }}
      >
        <Range
          style={{
            height: '100%',
            background: '#1976d2',
            borderRadius: 4,
          }}
        />
      </Track>
      <Thumb
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          border: '2px solid #1976d2',
          position: 'absolute',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          cursor: 'pointer',
        }}
      />
    </Root>
  ),
};

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------

const _StackMeta: Meta<typeof Stack> = {
  title: 'Primitives/Stack',
  component: Stack,
  tags: ['autodocs'],
};

export const StackColumn: StoryObj<typeof Stack> = {
  name: 'Stack (column)',
  render: () => (
    <Stack direction="column" gap="12px" align="center">
      <div
        style={{
          background: '#bbdefb',
          padding: 16,
          borderRadius: 4,
          width: '60%',
        }}
      >
        Item A
      </div>
      <div
        style={{
          background: '#bbdefb',
          padding: 16,
          borderRadius: 4,
          width: '60%',
        }}
      >
        Item B
      </div>
      <div
        style={{
          background: '#bbdefb',
          padding: 16,
          borderRadius: 4,
          width: '60%',
        }}
      >
        Item C
      </div>
    </Stack>
  ),
};

export const StackRow: StoryObj<typeof Stack> = {
  name: 'Stack (row)',
  render: () => (
    <Stack direction="row" gap="16px" justify="center">
      <div style={{ background: '#c8e6c9', padding: 16, borderRadius: 4 }}>
        Item X
      </div>
      <div style={{ background: '#c8e6c9', padding: 16, borderRadius: 4 }}>
        Item Y
      </div>
      <div style={{ background: '#c8e6c9', padding: 16, borderRadius: 4 }}>
        Item Z
      </div>
    </Stack>
  ),
};

export const StackBetween: StoryObj<typeof Stack> = {
  name: 'Stack (space-between)',
  render: () => (
    <Stack direction="row" justify="between" style={{ width: '100%' }}>
      <div style={{ background: '#ffe0b2', padding: 16, borderRadius: 4 }}>
        Left
      </div>
      <div style={{ background: '#ffe0b2', padding: 16, borderRadius: 4 }}>
        Right
      </div>
    </Stack>
  ),
};

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------

const _SwitchMeta: Meta<typeof Switch.Root> = {
  title: 'Primitives/Switch',
  component: Switch.Root,
  tags: ['autodocs'],
};

export const SwitchDefault: StoryObj<typeof Switch.Root> = {
  name: 'Switch',
  render: () => (
    <Switch.Root>
      <Switch.Thumb />
    </Switch.Root>
  ),
};

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const _TabsMeta: Meta<typeof Tabs.Root> = {
  title: 'Primitives/Tabs',
  component: Tabs.Root,
  tags: ['autodocs'],
};

export const TabsDefault: StoryObj<typeof Tabs.Root> = {
  name: 'Tabs',
  render: () => (
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Content for Tab 1</Tabs.Content>
      <Tabs.Content value="tab2">Content for Tab 2</Tabs.Content>
      <Tabs.Content value="tab3">Content for Tab 3</Tabs.Content>
    </Tabs.Root>
  ),
};
