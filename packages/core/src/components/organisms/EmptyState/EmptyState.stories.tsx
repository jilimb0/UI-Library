import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Organisms/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
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

export const Minimal: Story = {
  args: {
    title: 'No data available',
  },
};

export const WithIcon: Story = {
  args: {
    icon: <span>🔍</span>,
    title: 'Search results',
    description: 'No results match your query.',
  },
};
