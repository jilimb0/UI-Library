import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarketingLayout } from './MarketingLayout';

describe('MarketingLayout', () => {
  it('renders children', () => {
    render(
      <MarketingLayout>
        <div>Content</div>
      </MarketingLayout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders header and footer', () => {
    render(
      <MarketingLayout
        header={<header>Header</header>}
        footer={<footer>Footer</footer>}
      >
        <div>Content</div>
      </MarketingLayout>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
