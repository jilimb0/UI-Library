import type { Meta, StoryObj } from '@storybook/react-vite';
import { TreeView } from './TreeView';

const meta: Meta<typeof TreeView> = {
  title: 'Components/Organisms/TreeView',
  component: TreeView,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TreeView>;

export const Default: Story = {
  args: {
    nodes: [
      {
        id: 'root',
        label: 'Project',
        children: [
          { id: 'overview', label: 'Overview' },
          { id: 'settings', label: 'Settings' },
        ],
      },
    ],
  },
};
