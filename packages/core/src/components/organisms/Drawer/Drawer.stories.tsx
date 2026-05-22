import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Drawer } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Organisms/Drawer',
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Right: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open Drawer</Button>
          <Drawer open={open} onOpenChange={setOpen} side="right" title="Panel">
            Drawer content
          </Drawer>
        </>
      );
    };
    return <Demo />;
  },
};
