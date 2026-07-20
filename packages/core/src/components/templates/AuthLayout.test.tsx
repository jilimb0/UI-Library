import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthLayout } from './AuthLayout';

describe('AuthLayout', () => {
  it('renders children', () => {
    render(
      <AuthLayout>
        <div>Form</div>
      </AuthLayout>
    );
    expect(screen.getByText('Form')).toBeInTheDocument();
  });

  it('renders title and subtitle', () => {
    render(
      <AuthLayout title="Sign in" subtitle="Welcome back">
        <div>Form</div>
      </AuthLayout>
    );
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(
      <AuthLayout logo={<span data-testid="logo">L</span>}>
        <div>Form</div>
      </AuthLayout>
    );
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });
});
