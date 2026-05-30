import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from './Image';

const meta: Meta<typeof Image> = {
  title: 'Components/Atoms/Image',
  component: Image,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
    alt: 'Placeholder landscape',
    aspectRatio: '16 / 9',
  },
};
