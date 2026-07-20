import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/Organisms/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Settings',
    subtitle: 'Manage your account settings and preferences.',
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: 'Team members',
    subtitle: 'Manage who has access to your workspace.',
    breadcrumbs: [
      { key: 'home', label: 'Home', href: '/' },
      { key: 'settings', label: 'Settings', href: '/settings' },
      { key: 'team', label: 'Team' },
    ],
  },
};

export const WithActions: Story = {
  args: {
    title: 'Projects',
    subtitle: 'All your active projects.',
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" className="button button--outline button--sm">
          Export
        </button>
        <button type="button" className="button button--default button--sm">
          New project
        </button>
      </div>
    ),
  },
};

export const FullExample: Story = {
  args: {
    title: 'Analytics',
    subtitle: 'Track your key metrics and performance.',
    breadcrumbs: [
      { key: 'home', label: 'Home', href: '/' },
      { key: 'analytics', label: 'Analytics' },
    ],
    actions: (
      <button type="button" className="button button--default button--sm">
        Download report
      </button>
    ),
  },
};
