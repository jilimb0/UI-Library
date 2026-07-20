import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopNav } from './TopNav';

const meta: Meta<typeof TopNav> = {
  title: 'Components/Organisms/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof TopNav>;

export const Default: Story = {
  args: {
    brand: 'MyApp',
    links: [
      { key: 'dashboard', label: 'Dashboard', href: '/', active: true },
      { key: 'projects', label: 'Projects', href: '/projects' },
      { key: 'settings', label: 'Settings', href: '/settings' },
    ],
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span
          style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
        >
          John Doe
        </span>
      </div>
    ),
  },
};

export const BrandOnly: Story = {
  args: {
    brand: <strong>MyApp</strong>,
  },
};

export const WithActions: Story = {
  args: {
    brand: 'MyApp',
    actions: (
      <button type="button" className="button button--outline button--sm">
        Sign out
      </button>
    ),
  },
};

export const ManyLinks: Story = {
  args: {
    brand: 'MyApp',
    links: [
      { key: 'a', label: 'Home', href: '/' },
      { key: 'b', label: 'Explore', href: '/explore' },
      { key: 'c', label: 'Notifications', href: '/notifications' },
      { key: 'd', label: 'Messages', href: '/messages' },
      { key: 'e', label: 'Profile', href: '/profile', active: true },
    ],
  },
};
