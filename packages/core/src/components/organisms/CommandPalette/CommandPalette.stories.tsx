import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../atoms/Button';
import { CommandPalette } from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
  title: 'Components/Organisms/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

const sampleGroups = [
  {
    heading: 'Navigation',
    items: [
      { id: 'home', label: 'Go to Home', onSelect: () => {} },
      { id: 'settings', label: 'Open Settings', onSelect: () => {} },
      { id: 'profile', label: 'View Profile', onSelect: () => {} },
    ],
  },
  {
    heading: 'Actions',
    items: [
      { id: 'new', label: 'Create New', onSelect: () => {} },
      { id: 'export', label: 'Export Data', onSelect: () => {} },
      { id: 'delete', label: 'Delete Item', onSelect: () => {} },
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={sampleGroups}
      />
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open palette (Cmd+K)</Button>
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          groups={sampleGroups}
        />
      </>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={sampleGroups}
        placeholder="Search commands..."
      />
    );
  },
};

export const SingleGroup: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={[
          {
            heading: 'Quick actions',
            items: [
              { id: '1', label: 'Save', onSelect: () => {} },
              { id: '2', label: 'Share', onSelect: () => {} },
            ],
          },
        ]}
      />
    );
  },
};
