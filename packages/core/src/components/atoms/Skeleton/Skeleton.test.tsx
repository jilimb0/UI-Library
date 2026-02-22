import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';

test('renders skeleton', () => {
  render(<Skeleton data-testid="sk" className="h-4 w-20" />);
  expect(screen.getByTestId('sk')).toHaveAttribute('aria-busy', 'true');
});
