import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Molecules/Slider',
  component: Slider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState([40]);
      return <Slider value={value} onValueChange={setValue} />;
    };
    return <Demo />;
  },
};
