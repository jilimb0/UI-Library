import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, TextArea } from '../../atoms';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
  title: 'Components/Molecules/Field',
  component: Field,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    children: <Input type="email" placeholder="Enter your email" />,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Password',
    description: 'Must be at least 8 characters long',
    children: <Input type="password" placeholder="Enter your password" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    error: 'Email is required',
    children: <Input type="email" placeholder="Enter your email" />,
  },
};

export const WithTextarea: Story = {
  args: {
    label: 'Message',
    description: 'Enter your message here',
    children: <TextArea placeholder="Type your message..." rows={4} />,
  },
};
