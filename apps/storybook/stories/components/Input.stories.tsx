import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@ui-construction-library/core';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@company.com',
    type: 'email',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    placeholder: '••••••••',
    error: true,
    errorMessage: 'Password is required',
  },
};
