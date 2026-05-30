import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders navigation items with separators', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Library', href: '/library' },
          { label: 'Current', current: true },
        ]}
      />
    );

    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: 'Library' })).toHaveAttribute(
      'href',
      '/library'
    );
    expect(screen.getByText('Current').parentElement).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('invokes item click handlers', () => {
    const onClick = vi.fn();

    render(<Breadcrumb items={[{ label: 'Home', onClick }]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
