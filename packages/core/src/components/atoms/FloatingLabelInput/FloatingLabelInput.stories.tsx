import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingLabelInput } from './FloatingLabelInput';

const meta: Meta<typeof FloatingLabelInput> = {
  title: 'Components/Atoms/FloatingLabelInput',
  component: FloatingLabelInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FloatingLabelInput>;

export const Default: Story = {
  args: {
    label: 'Email address',
    type: 'email',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Full name',
    value: 'John Doe',
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    error: 'Password must be at least 8 characters',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Username',
    hint: 'Must be unique, at least 3 characters',
  },
};
