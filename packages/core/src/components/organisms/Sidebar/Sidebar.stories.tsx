import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, Settings, Users } from 'lucide-react';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    groups: [
      {
        key: 'main',
        label: 'Main',
        items: [
          {
            key: 'home',
            label: 'Home',
            icon: <Home size={14} />,
            active: true,
          },
          {
            key: 'users',
            label: 'Users',
            icon: <Users size={14} />,
            badge: 12,
          },
          { key: 'settings', label: 'Settings', icon: <Settings size={14} /> },
        ],
      },
    ],
  },
};
