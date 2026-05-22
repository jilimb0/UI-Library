import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Organisms/EmptyState',
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'No records found',
    description: 'Try adjusting filters or create a new item.',
    action: <Button>Create item</Button>,
  },
};
