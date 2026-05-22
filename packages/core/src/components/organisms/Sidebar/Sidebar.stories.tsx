import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HomeIcon,
  SettingsIcon,
  UsersIcon,
} from '@ui-construction-library/icons';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
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
            icon: <HomeIcon width={14} height={14} />,
            active: true,
          },
          {
            key: 'users',
            label: 'Users',
            icon: <UsersIcon width={14} height={14} />,
            badge: 12,
          },
          {
            key: 'settings',
            label: 'Settings',
            icon: <SettingsIcon width={14} height={14} />,
          },
        ],
      },
    ],
  },
};
