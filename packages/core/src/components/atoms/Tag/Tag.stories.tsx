import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Atoms/Tag',
  component: Tag,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Active',
    variant: 'success',
  },
};

export const Removable: Story = {
  args: {
    children: 'Alpha',
    onRemove: () => {},
    removeLabel: 'Remove tag',
    icon: '•',
  },
};
