import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Atoms/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
    },
    weight: {
      control: { type: 'select' },
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: 'This is default text',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'This is small text',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'This is large text',
  },
};

export const Bold: Story = {
  args: {
    weight: 'bold',
    children: 'This is bold text',
  },
};

export const Semibold: Story = {
  args: {
    weight: 'semibold',
    children: 'This is semibold text',
  },
};
