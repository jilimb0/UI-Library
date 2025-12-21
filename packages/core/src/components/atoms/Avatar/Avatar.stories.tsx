
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=1',
    alt: 'User avatar',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    src: 'https://i.pravatar.cc/150?img=2',
    alt: 'User avatar',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'User avatar',
  },
};

export const WithFallback: Story = {
  args: {
    src: 'invalid-url',
    alt: 'User avatar',
    fallback: <div className="flex items-center justify-center h-full w-full bg-blue-500 text-white">JD</div>,
  },
};

export const FallbackOnly: Story = {
  args: {
    fallback: <div className="flex items-center justify-center h-full w-full bg-gray-400 text-white">AB</div>,
  },
};
