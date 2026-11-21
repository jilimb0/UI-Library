import { describe, expect, it } from 'vitest';
import {
  type LinkedEntityPayload,
  LinkedEntityPayloadSchema,
  LinkedEntityTypeSchema,
  type WidgetColorGroup,
  WidgetColorGroupSchema,
  WidgetLinkBroadcastMessageSchema,
} from './index';

describe('widget-link.schema', () => {
  const validPayload: LinkedEntityPayload = {
    symbol: 'AAPL',
    entityType: 'ticker',
    timeframe: '1D',
    sourceWidgetId: 'watchlist-1',
    updatedAtMs: 1_700_000_000_000,
  };

  it('validates allowed WidgetColorGroup values', () => {
    const groups: WidgetColorGroup[] = [
      'green',
      'blue',
      'red',
      'amber',
      'unlinked',
    ];
    for (const group of groups) {
      expect(WidgetColorGroupSchema.safeParse(group).success).toBe(true);
    }
    expect(WidgetColorGroupSchema.safeParse('purple').success).toBe(false);
    expect(WidgetColorGroupSchema.safeParse('').success).toBe(false);
  });

  it('validates allowed LinkedEntityType values', () => {
    const types = ['ticker', 'account', 'repo', 'outlet', 'location'] as const;
    for (const entityType of types) {
      expect(LinkedEntityTypeSchema.safeParse(entityType).success).toBe(true);
    }
    expect(LinkedEntityTypeSchema.safeParse('user').success).toBe(false);
  });

  it('parses valid LinkedEntityPayload with and without timeframe', () => {
    const withTf = LinkedEntityPayloadSchema.parse(validPayload);
    expect(withTf.symbol).toBe('AAPL');
    expect(withTf.timeframe).toBe('1D');

    const { timeframe: _tf, ...withoutTf } = validPayload;
    const parsedWithoutTf = LinkedEntityPayloadSchema.parse(withoutTf);
    expect(parsedWithoutTf.timeframe).toBeUndefined();
  });

  it('rejects empty symbol, empty sourceWidgetId, and non-integer or negative updatedAtMs', () => {
    expect(
      LinkedEntityPayloadSchema.safeParse({
        ...validPayload,
        symbol: '   ',
      }).success
    ).toBe(false);
    expect(
      LinkedEntityPayloadSchema.safeParse({
        ...validPayload,
        sourceWidgetId: '',
      }).success
    ).toBe(false);
    expect(
      LinkedEntityPayloadSchema.safeParse({
        ...validPayload,
        updatedAtMs: 1234.56,
      }).success
    ).toBe(false);
    expect(
      LinkedEntityPayloadSchema.safeParse({
        ...validPayload,
        updatedAtMs: -1,
      }).success
    ).toBe(false);
  });

  it('validates WidgetLinkBroadcastMessageSchema and blocks unlinked group broadcasts', () => {
    expect(
      WidgetLinkBroadcastMessageSchema.safeParse({
        group: 'green',
        payload: validPayload,
      }).success
    ).toBe(true);

    expect(
      WidgetLinkBroadcastMessageSchema.safeParse({
        group: 'amber',
        payload: null,
      }).success
    ).toBe(true);

    expect(
      WidgetLinkBroadcastMessageSchema.safeParse({
        group: 'unlinked',
        payload: validPayload,
      }).success
    ).toBe(false);
  });
});
