import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DocsLayout } from './DocsLayout';

describe('DocsLayout', () => {
  it('renders children, sidebar, and toc', () => {
    render(
      <DocsLayout sidebar={<nav>Nav</nav>} toc={<aside>TOC</aside>}>
        <article>Content</article>
      </DocsLayout>
    );
    expect(screen.getByText('Nav')).toBeInTheDocument();
    expect(screen.getByText('TOC')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    render(
      <DocsLayout>
        <div>Content</div>
      </DocsLayout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
