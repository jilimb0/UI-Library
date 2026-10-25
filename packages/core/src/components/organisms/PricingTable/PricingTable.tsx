import { type ReactNode, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  priceMonthly: number;
  priceAnnual?: number;
  currency?: string;
  features: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  badge?: string;
  ctaText?: string;
  ctaVariant?: 'default' | 'gradient' | 'outline';
  onSelect?: (billingCycle: 'monthly' | 'annual') => void;
  ctaSlot?: ReactNode;
}

export interface PricingTableProps {
  plans: PricingPlan[];
  defaultBillingCycle?: 'monthly' | 'annual';
  annualDiscountPercent?: number;
  title?: ReactNode;
  subtitle?: ReactNode;
  onPlanSelect?: (
    plan: PricingPlan,
    billingCycle: 'monthly' | 'annual'
  ) => void;
  className?: string;
}

export function PricingTable({
  plans,
  defaultBillingCycle = 'monthly',
  annualDiscountPercent = 20,
  title,
  subtitle,
  onPlanSelect,
  className,
}: PricingTableProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    defaultBillingCycle
  );

  return (
    <div className={cn('ucl-pricing-table', className)}>
      {(title || subtitle) && (
        <div className="ucl-pricing-table__header text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Monthly / Annual toggle */}
      <div className="ucl-pricing-table__toggle-container flex justify-center items-center gap-3 mb-10">
        <button
          type="button"
          className="text-sm font-medium cursor-pointer bg-transparent border-0 p-0"
          style={{
            color:
              billingCycle === 'monthly'
                ? 'var(--foreground)'
                : 'var(--muted-foreground)',
            fontWeight: billingCycle === 'monthly' ? 600 : 400,
          }}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={billingCycle === 'annual'}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
          style={{
            backgroundColor:
              billingCycle === 'annual' ? 'var(--primary)' : 'var(--muted)',
          }}
          onClick={() =>
            setBillingCycle((prev) =>
              prev === 'monthly' ? 'annual' : 'monthly'
            )
          }
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out',
              billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'
            )}
            style={{ backgroundColor: 'var(--background)' }}
          />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
          onClick={() => setBillingCycle('annual')}
        >
          <span
            className="text-sm font-medium"
            style={{
              color:
                billingCycle === 'annual'
                  ? 'var(--foreground)'
                  : 'var(--muted-foreground)',
              fontWeight: billingCycle === 'annual' ? 600 : 400,
            }}
          >
            Annual
          </span>
          {annualDiscountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Save {annualDiscountPercent}%
            </span>
          )}
        </button>
      </div>

      {/* Grid of pricing cards */}
      <div className="ucl-pricing-table__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const currency = plan.currency ?? '$';
          const isAnnual = billingCycle === 'annual';
          const price = isAnnual
            ? (plan.priceAnnual ??
              Math.round(
                plan.priceMonthly * 12 * (1 - annualDiscountPercent / 100)
              ))
            : plan.priceMonthly;
          const displayPeriod = isAnnual ? '/year' : '/month';
          const isFeatured = plan.isPopular || plan.isRecommended;

          return (
            <div
              key={plan.id}
              className={cn(
                'ucl-pricing-card relative flex flex-col justify-between p-8 rounded-2xl transition-all duration-200',
                'bg-[rgba(18,21,31,0.75)] backdrop-blur-[16px] border',
                isFeatured
                  ? 'border-[#6C7BFF] shadow-[0_0_24px_rgba(108,123,255,0.18)] scale-[1.02]'
                  : 'border-[rgba(108,123,255,0.12)] hover:border-[rgba(108,123,255,0.28)]'
              )}
            >
              {/* Badge for Popular / Recommended */}
              {(plan.badge || isFeatured) && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#6C7BFF] to-[#828FFF] text-white shadow-md">
                    {plan.badge ??
                      (plan.isPopular ? 'Most Popular' : 'Recommended')}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                {plan.description && (
                  <p
                    className="text-sm mb-6"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {plan.description}
                  </p>
                )}

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {currency}
                    {price}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {displayPeriod}
                  </span>
                </div>

                <div
                  className="my-6"
                  style={{ borderTop: '1px solid var(--border)' }}
                />

                <ul className="space-y-3 mb-8 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <svg
                        className="w-4 h-4 text-[#6C7BFF] shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        role="img"
                        aria-label="Included"
                      >
                        <title>Included</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button / Slot */}
              <div className="mt-auto pt-4">
                {plan.ctaSlot ?? (
                  <button
                    type="button"
                    onClick={() => {
                      plan.onSelect?.(billingCycle);
                      onPlanSelect?.(plan, billingCycle);
                    }}
                    className={cn(
                      'w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer shadow-sm',
                      plan.ctaVariant === 'gradient' || isFeatured
                        ? 'pricing-cta--gradient'
                        : plan.ctaVariant === 'outline'
                          ? 'pricing-cta--outline'
                          : 'pricing-cta--primary'
                    )}
                  >
                    {plan.ctaText ?? 'Get Started'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
