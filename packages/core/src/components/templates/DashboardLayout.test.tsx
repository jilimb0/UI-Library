import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DashboardLayout } from './DashboardLayout';

describe('DashboardLayout', () => {
  it('renders children', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders sidebar and header', () => {
    render(
      <DashboardLayout
        sidebar={<nav>Sidebar</nav>}
        header={<header>Header</header>}
      >
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders without sidebar', () => {
    render(
      <DashboardLayout header={<div>H</div>}>
        <div>C</div>
      </DashboardLayout>
    );
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
