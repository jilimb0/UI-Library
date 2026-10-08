import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { type PricingPlan, PricingTable } from './PricingTable';

describe('PricingTable', () => {
  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      priceMonthly: 10,
      features: ['1 Project', '1,000 Requests'],
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonthly: 29,
      isPopular: true,
      features: ['Unlimited Projects', '100,000 Requests', 'Priority Support'],
    },
  ];

  it('renders plans with monthly price by default', () => {
    render(<PricingTable plans={plans} title="Simple Pricing" />);

    expect(screen.getByText('Simple Pricing')).toBeDefined();
    expect(screen.getByText('Starter')).toBeDefined();
    expect(screen.getByText('$10')).toBeDefined();
    expect(screen.getByText('Pro')).toBeDefined();
    expect(screen.getByText('$29')).toBeDefined();
    expect(screen.getByText('Most Popular')).toBeDefined();
  });

  it('switches to annual pricing with discount calculation', () => {
    render(<PricingTable plans={plans} annualDiscountPercent={20} />);

    const annualTab = screen.getByText('Annual');
    fireEvent.click(annualTab);

    // Monthly 10 * 12 * 0.8 = 96
    expect(screen.getByText('$96')).toBeDefined();
    // Monthly 29 * 12 * 0.8 = 278.4 -> 278
    expect(screen.getByText('$278')).toBeDefined();
  });

  it('calls onPlanSelect when clicking action button', () => {
    const handleSelect = vi.fn();
    render(<PricingTable plans={plans} onPlanSelect={handleSelect} />);

    const buttons = screen.getAllByRole('button', { name: /Get Started/i });
    fireEvent.click(buttons[0]);

    expect(handleSelect).toHaveBeenCalledWith(plans[0], 'monthly');
  });
});
