import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Atoms/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [checked, setChecked] = useState(false);
      return (
        <Switch
          label="Enable notifications"
          description="Receive product updates"
          checked={checked}
          onCheckedChange={setChecked}
        />
      );
    };
    return <Demo />;
  },
};
