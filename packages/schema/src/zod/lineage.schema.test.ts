import { describe, expect, it } from 'vitest';
import {
  type FundamentalLineageCitation,
  FundamentalLineageCitationSchema,
} from './index';

describe('FundamentalLineageCitationSchema', () => {
  const baseValid = {
    accessionNumber: '0000320193-24-000123',
    ticker: 'AAPL',
    formType: '10-K' as const,
    metricCode: 'REVENUE_TOTAL',
    xbrlTag: 'us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax',
    valueMinor: 39103500000000n,
    sourceByteOffset: 1024,
    sourceByteLength: 48,
  };

  it('accepts a valid citation with bigint valueMinor and defaults currency to USD', () => {
    const parsed: FundamentalLineageCitation =
      FundamentalLineageCitationSchema.parse(baseValid);
    expect(parsed.currency).toBe('USD');
    expect(parsed.valueMinor).toBe(39103500000000n);
  });

  it('accepts an integer number valueMinor and optional fields', () => {
    const parsed = FundamentalLineageCitationSchema.parse({
      ...baseValid,
      valueMinor: -25050,
      currency: 'EUR',
      excerpt: 'Total net sales were $391,035 million.',
      filedAt: '2024-11-01T00:00:00Z',
    });
    expect(parsed.valueMinor).toBe(-25050);
    expect(parsed.currency).toBe('EUR');
    expect(parsed.excerpt).toBe('Total net sales were $391,035 million.');
    expect(parsed.filedAt).toBe('2024-11-01T00:00:00Z');
  });

  it('accepts all allowed formType values', () => {
    const forms = [
      '10-K',
      '10-Q',
      '20-F',
      '8-K',
      '13F-HR',
      '4',
      'CSV',
    ] as const;
    for (const formType of forms) {
      const result = FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        formType,
      });
      expect(result.success, `expected formType ${formType} to pass`).toBe(
        true
      );
    }
  });

  it('rejects floating-point valueMinor (Axis 4 numeric precision)', () => {
    const result = FundamentalLineageCitationSchema.safeParse({
      ...baseValid,
      valueMinor: 123.45,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative sourceByteOffset and non-positive sourceByteLength', () => {
    expect(
      FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        sourceByteOffset: -1,
      }).success
    ).toBe(false);
    expect(
      FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        sourceByteLength: 0,
      }).success
    ).toBe(false);
    expect(
      FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        sourceByteLength: -10,
      }).success
    ).toBe(false);
  });

  it('rejects empty required identifiers and invalid formType', () => {
    expect(
      FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        accessionNumber: '',
      }).success
    ).toBe(false);
    expect(
      FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        ticker: '',
      }).success
    ).toBe(false);
    expect(
      FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        metricCode: '',
      }).success
    ).toBe(false);
    expect(
      FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        xbrlTag: '',
      }).success
    ).toBe(false);
    expect(
      FundamentalLineageCitationSchema.safeParse({
        ...baseValid,
        formType: 'S-1',
      }).success
    ).toBe(false);
  });
});
