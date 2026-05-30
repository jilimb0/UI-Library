import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CommandPalette } from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
  title: 'Components/Organisms/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(true);
      return (
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          groups={[
            {
              heading: 'Actions',
              items: [
                { id: 'new', label: 'New document', onSelect: () => {} },
                { id: 'open', label: 'Open recent', onSelect: () => {} },
              ],
            },
          ]}
        />
      );
    };
    return <Demo />;
  },
};
