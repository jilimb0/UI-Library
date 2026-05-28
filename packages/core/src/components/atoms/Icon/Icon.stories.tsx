import type { Meta, StoryObj } from '@storybook/react-vite';
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
      options: [
        'home',
        'user',
        'settings',
        'search',
        'heart',
        'star',
        'bell',
        'mail',
        'check',
      ],
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
    name: 'home',
    size: 24,
  },
};

export const User: Story = {
  args: {
    name: 'user',
    size: 24,
  },
};

export const Settings: Story = {
  args: {
    name: 'settings',
    size: 24,
  },
};

export const Search: Story = {
  args: {
    name: 'search',
    size: 24,
  },
};

export const Large: Story = {
  args: {
    name: 'star',
    size: 48,
  },
};

export const Colored: Story = {
  args: {
    name: 'heart',
    size: 32,
    color: '#ef4444',
  },
};

export const MultipleIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Icon name="home" size={24} />
      <Icon name="user" size={24} />
      <Icon name="settings" size={24} />
      <Icon name="search" size={24} />
      <Icon name="heart" size={24} color="#ef4444" />
    </div>
  ),
};
