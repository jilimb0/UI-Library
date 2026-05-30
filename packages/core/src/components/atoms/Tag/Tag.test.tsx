import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders content with an icon and custom variant classes', () => {
    render(
      <Tag variant="success" icon={<span>i</span>}>
        Active
      </Tag>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('i')).toBeInTheDocument();
    expect(screen.getByText('Active').parentElement).toHaveClass('tag');
  });

  it('renders a removable tag button when onRemove is provided', () => {
    const onRemove = vi.fn();
    render(
      <Tag onRemove={onRemove} removeLabel="Remove tag">
        Alpha
      </Tag>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove tag' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
