import type { Meta, StoryObj } from '@storybook/react-vite';
import { DashboardLayout } from './DashboardLayout';

const meta: Meta<typeof DashboardLayout> = {
  title: 'Templates/DashboardLayout',
  component: DashboardLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

export const Default: Story = {
  args: {
    sidebar: (
      <div style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>
        Sidebar content
      </div>
    ),
    header: <div style={{ padding: '0.5rem 0' }}>Header</div>,
    children: <div>Main content area</div>,
  },
};

export const WithoutSidebar: Story = {
  args: {
    header: <div>Header</div>,
    children: <div>Main content area</div>,
  },
};

export const WithoutHeader: Story = {
  args: {
    sidebar: (
      <div style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>
        Sidebar
      </div>
    ),
    children: <div>Main content area</div>,
  },
};
