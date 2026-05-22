import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Organisms/Calendar',
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  args: {
    events: [
      { id: 'e1', title: 'Design review', date: new Date() },
      {
        id: 'e2',
        title: 'Release prep',
        date: new Date(Date.now() + 86400000),
      },
    ],
  },
};
