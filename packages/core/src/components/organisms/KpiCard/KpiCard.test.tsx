import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { KpiCard } from './KpiCard';

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Revenue" value="$12,345" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,345')).toBeInTheDocument();
  });

  it('renders subtext', () => {
    render(<KpiCard label="Users" value="1,234" subtext="+12% vs last week" />);
    expect(screen.getByText('+12% vs last week')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(
      <KpiCard
        label="Sales"
        value="500"
        icon={<span data-testid="icon">$</span>}
      />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders as button when onClick is provided', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<KpiCard label="Clickable" value="42" onClick={onClick} />);
    const card = screen.getByRole('button');
    await user.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant class', () => {
    const { container } = render(
      <KpiCard label="Error" value="0" variant="error" />
    );
    expect(container.firstChild).toHaveClass('kpi-card--error');
  });

  it('applies selected class', () => {
    const { container } = render(
      <KpiCard label="Selected" value="1" selected />
    );
    expect(container.firstChild).toHaveClass('kpi-card--selected');
  });
});
