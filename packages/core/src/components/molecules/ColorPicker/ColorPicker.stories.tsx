import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/Molecules/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('#3b82f6');
      return <ColorPicker value={value} onValueChange={setValue} />;
    };
    return <Demo />;
  },
};
