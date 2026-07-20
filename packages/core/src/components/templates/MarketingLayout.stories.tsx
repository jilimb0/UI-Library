import type { Meta, StoryObj } from '@storybook/react-vite';
import { MarketingLayout } from './MarketingLayout';

const meta: Meta<typeof MarketingLayout> = {
  title: 'Templates/MarketingLayout',
  component: MarketingLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof MarketingLayout>;

export const Default: Story = {
  args: {
    header: (
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <strong>Brand</strong>
        <span
          style={{
            color: 'var(--muted-foreground)',
            fontSize: '0.875rem',
          }}
        >
          Features
        </span>
        <span
          style={{
            color: 'var(--muted-foreground)',
            fontSize: '0.875rem',
          }}
        >
          Pricing
        </span>
        <span
          style={{
            color: 'var(--muted-foreground)',
            fontSize: '0.875rem',
          }}
        >
          About
        </span>
      </nav>
    ),
    children: (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 className="page-header__title">Landing page</h1>
        <p style={{ marginTop: '1rem', color: 'var(--muted-foreground)' }}>
          Hero section goes here.
        </p>
      </div>
    ),
    footer: (
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--muted-foreground)',
        }}
      >
        &copy; 2026 Company
      </div>
    ),
  },
};
