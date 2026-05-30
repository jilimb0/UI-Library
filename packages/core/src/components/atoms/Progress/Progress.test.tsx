import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('exposes the current value and label to assistive technologies', () => {
    render(<Progress value={72} label="Upload progress" />);

    const bar = screen.getByRole('progressbar', { name: 'Upload progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '72');
    expect(bar.querySelector('.progress__bar')).toHaveStyle({ width: '72%' });
  });

  it('clamps values into the supported range', () => {
    render(<Progress value={140} label="Upload progress" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100'
    );
  });
});
