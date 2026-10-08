import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthShell } from './AuthShell';

describe('AuthShell', () => {
  it('renders branding panel and auth form', () => {
    render(
      <AuthShell
        title="Sign In"
        subtitle="Access your developer dashboard"
        brandHeadline="Deploy fast, scale effortlessly"
      >
        <input placeholder="Email" />
      </AuthShell>
    );

    expect(screen.getByText('Sign In')).toBeDefined();
    expect(screen.getByText('Access your developer dashboard')).toBeDefined();
    expect(screen.getByText('Deploy fast, scale effortlessly')).toBeDefined();
    expect(screen.getByPlaceholderText('Email')).toBeDefined();
  });

  it('renders OAuth buttons and triggers click handler', () => {
    const handleGithub = vi.fn();
    render(
      <AuthShell
        title="Login"
        oauthProviders={[
          {
            name: 'github',
            label: 'Sign in with GitHub',
            onClick: handleGithub,
          },
        ]}
      >
        <button type="submit">Submit</button>
      </AuthShell>
    );

    const githubBtn = screen.getByText('Sign in with GitHub');
    expect(githubBtn).toBeDefined();

    fireEvent.click(githubBtn);
    expect(handleGithub).toHaveBeenCalled();
  });
});
