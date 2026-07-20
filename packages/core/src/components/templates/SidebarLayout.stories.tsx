import type { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarLayout } from './SidebarLayout';

const meta: Meta<typeof SidebarLayout> = {
  title: 'Templates/SidebarLayout',
  component: SidebarLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof SidebarLayout>;

export const Default: Story = {
  args: {
    sidebar: (
      <div style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>
        Sidebar
      </div>
    ),
    children: <div>Main content</div>,
  },
};
