import type { Meta, StoryObj } from '@storybook/react-vite';
import { DocsLayout } from './DocsLayout';

const meta: Meta<typeof DocsLayout> = {
  title: 'Templates/DocsLayout',
  component: DocsLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof DocsLayout>;

export const Default: Story = {
  args: {
    sidebar: (
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <a href="https://example.com" className="link">
          Getting started
        </a>
        <a href="https://example.com" className="link">
          Components
        </a>
        <a href="https://example.com" className="link">
          API reference
        </a>
      </nav>
    ),
    children: (
      <div>
        <h1 className="page-header__title">Documentation</h1>
        <p style={{ marginTop: '1rem', color: 'var(--muted-foreground)' }}>
          Content goes here.
        </p>
      </div>
    ),
    toc: (
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          fontSize: '0.875rem',
        }}
      >
        <a href="https://example.com" className="link">
          Overview
        </a>
        <a href="https://example.com" className="link">
          Installation
        </a>
        <a href="https://example.com" className="link">
          Usage
        </a>
      </nav>
    ),
  },
};
