import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Organisms/Drawer',
  component: Drawer,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(true);
      return (
        <div>
          <Button onClick={() => setOpen(true)}>Open drawer</Button>
          <Drawer
            open={open}
            onOpenChange={setOpen}
            title="Settings"
            description="Manage preferences"
          >
            Drawer content
          </Drawer>
        </div>
      );
    };
    return <Demo />;
  },
};
