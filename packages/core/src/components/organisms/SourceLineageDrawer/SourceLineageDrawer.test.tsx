import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  type FundamentalLineageCitation,
  SourceLineageDrawer,
} from './SourceLineageDrawer';

const SAMPLE_CITATION: FundamentalLineageCitation = {
  accessionNumber: '0000320193-24-000123',
  ticker: 'AAPL',
  formType: '10-K',
  metricCode: 'REVENUE_TOTAL',
  xbrlTag: 'us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax',
  valueMinor: 39103500000000n,
  currency: 'USD',
  sourceByteOffset: 1024,
  sourceByteLength: 48,
  excerpt: 'Total net sales were $391,035 million for fiscal year 2024.',
  filedAt: '2024-11-01',
};

describe('SourceLineageDrawer', () => {
  it('renders citation metadata, formatted bigint valueMinor without float loss, byte range, and excerpt when open', () => {
    render(
      <SourceLineageDrawer
        open
        onOpenChange={() => {}}
        citation={SAMPLE_CITATION}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /source lineage/i })
    ).toBeInTheDocument();

    expect(screen.getByText('0000320193-24-000123')).toBeInTheDocument();
    expect(
      screen.getByText(
        'us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('391,035,000,000.00 USD')).toBeInTheDocument();
    expect(screen.getByText(/\[1024 \.\. 1072\]/)).toBeInTheDocument();
    expect(
      screen.getByText(
        'Total net sales were $391,035 million for fiscal year 2024.'
      )
    ).toBeInTheDocument();
  });

  it('preserves exact precision for bigint values beyond Number.MAX_SAFE_INTEGER and negative minor units', () => {
    const { rerender } = render(
      <SourceLineageDrawer
        open
        onOpenChange={() => {}}
        citation={{
          ...SAMPLE_CITATION,
          valueMinor: 900719925474099317n,
          currency: 'USD',
        }}
      />
    );

    expect(
      screen.getByText('9,007,199,254,740,993.17 USD')
    ).toBeInTheDocument();

    rerender(
      <SourceLineageDrawer
        open
        onOpenChange={() => {}}
        citation={{
          ...SAMPLE_CITATION,
          valueMinor: -1050,
          currency: 'EUR',
        }}
      />
    );

    expect(screen.getByText('-10.50 EUR')).toBeInTheDocument();
  });

  it('renders empty state when citation is null', () => {
    render(
      <SourceLineageDrawer open onOpenChange={() => {}} citation={null} />
    );

    expect(
      screen.getByText(/no lineage citation selected/i)
    ).toBeInTheDocument();
  });

  it('does not render drawer content when closed', () => {
    render(
      <SourceLineageDrawer
        open={false}
        onOpenChange={() => {}}
        citation={SAMPLE_CITATION}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onOpenChange(false) when the accessible close button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <SourceLineageDrawer
        open
        onOpenChange={onOpenChange}
        citation={SAMPLE_CITATION}
      />
    );

    const closeBtn = screen.getByRole('button', {
      name: /close source lineage drawer/i,
    });
    await user.click(closeBtn);

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it('has no accessibility violations (WAI-ARIA)', async () => {
    const { container } = render(
      <SourceLineageDrawer
        open
        onOpenChange={() => {}}
        citation={SAMPLE_CITATION}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders safely during SSR without accessing window', () => {
    const html = renderToString(
      <SourceLineageDrawer
        open
        onOpenChange={() => {}}
        citation={SAMPLE_CITATION}
      />
    );
    expect(typeof html).toBe('string');
  });
});
