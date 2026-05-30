import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { OTPInput } from './OTPInput';

const meta: Meta<typeof OTPInput> = {
  title: 'Components/Molecules/OTPInput',
  component: OTPInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('');
      return <OTPInput length={6} value={value} onValueChange={setValue} />;
    };
    return <Demo />;
  },
};
