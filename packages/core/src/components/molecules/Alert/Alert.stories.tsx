import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Molecules/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    children: 'This is a default alert message',
    variant: 'default',
  },
};

export const Success: Story = {
  args: {
    children: 'Operation completed successfully!',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning: Please review your changes',
    variant: 'warning',
  },
};

export const ErrorVariant: Story = {
  args: {
    children: 'Error: Something went wrong',
    variant: 'error',
  },
};

export const Interaction: Story = {
  args: {
    children: 'Warning: Please review your changes',
    variant: 'warning',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText('Warning: Please review your changes')
    ).toBeInTheDocument();
  },
};
