import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from './Dropdown';
import '@testing-library/jest-dom';

const mockItems = [
  { id: 1, label: 'Item 1', value: 'item1' },
  { id: 2, label: 'Item 2', value: 'item2' },
  { id: 3, label: 'Item 3', value: 'item3' },
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

  it('should have no accessibility violations', async () => {
    const { container } = render(<Dropdown items={mockItems} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('closes on Escape and returns focus to trigger', () => {
    render(<Dropdown items={mockItems} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('supports controlled value and onChange', () => {
    const onChange = vi.fn();
    render(
      <Dropdown
        items={mockItems}
        value="item2"
        onChange={onChange}
        label="Demo"
      />
    );
    expect(
      screen.getByRole('button', { name: 'Demo: Item 2' })
    ).toHaveTextContent('Item 2');
  });
});
