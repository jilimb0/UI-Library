import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Molecules/Rating',
  component: Rating,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState(3);
      return <Rating value={value} onValueChange={setValue} />;
    };
    return <Demo />;
  },
};
