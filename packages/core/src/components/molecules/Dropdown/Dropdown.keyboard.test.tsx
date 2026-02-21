import { describe, it, expect } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './Dropdown';

const mockItems = [
  { id: 1, label: 'Item 1', value: 'item1' },
  { id: 2, label: 'Item 2', value: 'item2' },
  { id: 3, label: 'Item 3', value: 'item3' },
];

describe('Dropdown Keyboard Navigation', () => {
  it('navigates items with keyboard', async () => {
    const user = userEvent.setup();
    render(<Dropdown items={mockItems} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
