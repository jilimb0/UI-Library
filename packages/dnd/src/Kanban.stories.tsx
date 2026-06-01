import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kanban } from './Kanban';

const meta: Meta<typeof Kanban> = {
  title: 'Components/Organisms/Kanban',
  component: Kanban,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Kanban>;

export const Default: Story = {
  args: {
    columns: [
      {
        id: 'todo',
        title: 'To do',
        cards: [
          { id: 'c1', title: 'Design token review' },
          { id: 'c2', title: 'Story coverage' },
        ],
      },
      {
        id: 'doing',
        title: 'In progress',
        cards: [{ id: 'c3', title: 'Integrations' }],
      },
      {
        id: 'done',
        title: 'Done',
        cards: [{ id: 'c4', title: 'ThemeProvider refactor' }],
      },
    ],
  },
};
