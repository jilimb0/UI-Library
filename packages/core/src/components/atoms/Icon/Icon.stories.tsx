
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['Home', 'User', 'Settings', 'Search', 'Heart', 'Star', 'Bell', 'Mail'],
    },
    size: {
      control: { type: 'number' },
    },
    color: {
      control: { type: 'color' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'Home',
    size: 24,
  },
};

export const User: Story = {
  args: {
    name: 'User',
    size: 24,
  },
};

export const Settings: Story = {
  args: {
    name: 'Settings',
    size: 24,
  },
};

export const Search: Story = {
  args: {
    name: 'Search',
    size: 24,
  },
};

export const Large: Story = {
  args: {
    name: 'Star',
    size: 48,
  },
};

export const Colored: Story = {
  args: {
    name: 'Heart',
    size: 32,
    color: '#ef4444',
  },
};

export const MultipleIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon name="Home" size={24} />
      <Icon name="User" size={24} />
      <Icon name="Settings" size={24} />
      <Icon name="Search" size={24} />
      <Icon name="Heart" size={24} color="#ef4444" />
    </div>
  ),
};
