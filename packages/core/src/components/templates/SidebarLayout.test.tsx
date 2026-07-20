import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SidebarLayout } from './SidebarLayout';

describe('SidebarLayout', () => {
  it('renders children and sidebar', () => {
    render(
      <SidebarLayout sidebar={<nav>Nav</nav>}>
        <div>Content</div>
      </SidebarLayout>
    );
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies sidebarClassName', () => {
    const { container } = render(
      <SidebarLayout sidebar={<nav>N</nav>} sidebarClassName="custom-sidebar">
        <div>C</div>
      </SidebarLayout>
    );
    const aside = container.querySelector('.custom-sidebar');
    expect(aside).toBeInTheDocument();
  });
});
