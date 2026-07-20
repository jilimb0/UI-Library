import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell } from './AppShell';

const meta: Meta<typeof AppShell> = {
  title: 'Components/Organisms/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  args: {
    topNav: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          gap: '1rem',
        }}
      >
        <strong>MyApp</strong>
        <span
          style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
        >
          Dashboard
        </span>
      </div>
    ),
    sidebar: (
      <div
        style={{
          padding: '0.5rem',
          color: 'var(--muted-foreground)',
          fontSize: '0.875rem',
        }}
      >
        <div>Home</div>
        <div>Settings</div>
        <div>Profile</div>
      </div>
    ),
    children: (
      <div>
        <h1 className="page-header__title">Dashboard</h1>
        <p style={{ marginTop: '1rem', color: 'var(--muted-foreground)' }}>
          Welcome to the dashboard.
        </p>
      </div>
    ),
  },
};

export const WithoutSidebar: Story = {
  args: {
    topNav: <div>MyApp</div>,
    children: <div>Full-width content.</div>,
  },
};

export const WithFooter: Story = {
  args: {
    topNav: <div>MyApp</div>,
    children: <div>Content</div>,
    footer: (
      <div
        style={{
          fontSize: '0.875rem',
          color: 'var(--muted-foreground)',
          textAlign: 'center',
        }}
      >
        Footer
      </div>
    ),
  },
};
