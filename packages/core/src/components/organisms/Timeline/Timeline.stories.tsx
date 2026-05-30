import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Components/Organisms/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {
    items: [
      { id: '1', title: 'Draft', timestamp: '09:00' },
      { id: '2', title: 'Review', timestamp: '10:30' },
      { id: '3', title: 'Publish', timestamp: '12:00' },
    ],
  },
};
