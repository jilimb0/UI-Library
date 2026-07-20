import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cluster } from './Cluster';

const meta: Meta<typeof Cluster> = {
  title: 'Components/Atoms/Cluster',
  component: Cluster,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Cluster>;

function Tag({ children }: { children: string }) {
  return (
    <span
      style={{
        padding: '0.25rem 0.75rem',
        background: 'var(--muted)',
        borderRadius: 'var(--radius)',
        fontSize: '0.875rem',
        border: '1px solid var(--border)',
      }}
    >
      {children}
    </span>
  );
}

export const Default: Story = {
  render: () => (
    <Cluster>
      <Tag>React</Tag>
      <Tag>TypeScript</Tag>
      <Tag>Tailwind</Tag>
      <Tag>Storybook</Tag>
      <Tag>Vitest</Tag>
    </Cluster>
  ),
};

export const WithCustomGap: Story = {
  render: () => (
    <Cluster gap="1rem">
      <Tag>Spaced</Tag>
      <Tag>Tags</Tag>
    </Cluster>
  ),
};
