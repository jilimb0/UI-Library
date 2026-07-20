import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthLayout } from './AuthLayout';

const meta: Meta<typeof AuthLayout> = {
  title: 'Templates/AuthLayout',
  component: AuthLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof AuthLayout>;

export const Default: Story = {
  args: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue.',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input className="input" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        <button
          type="button"
          className="button button--default"
          style={{ width: '100%' }}
        >
          Sign in
        </button>
      </div>
    ),
  },
};

export const WithLogo: Story = {
  args: {
    logo: <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>MyApp</div>,
    title: 'Create account',
    subtitle: 'Fill in the details below to get started.',
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input className="input" placeholder="Full name" />
        <input className="input" placeholder="Email" />
        <button
          type="button"
          className="button button--default"
          style={{ width: '100%' }}
        >
          Create account
        </button>
      </div>
    ),
  },
};
