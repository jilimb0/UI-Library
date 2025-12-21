
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from './Dropdown';

const mockItems = [
  { id: 1, label: 'Item 1', value: 'item1' },
  { id: 2, label: 'Item 2', value: 'item2' },
  { id: 3, label: 'Item 3', value: 'item3' }
];

describe('Dropdown', () => {
  it('renders dropdown', () => {
    render(<Dropdown items={mockItems} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles menu on click', () => {
    render(<Dropdown items={mockItems} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
