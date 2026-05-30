import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Dropdown } from './Dropdown';
import '@testing-library/jest-dom';

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

    await waitFor(() => expect(screen.getByText('Item 1')).toHaveFocus());
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(screen.getByRole('button')).toHaveTextContent('Item 3');
  });
});
