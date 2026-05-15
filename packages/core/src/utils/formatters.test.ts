import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeTime,
  slugify,
  truncateText,
} from './formatters';

describe('formatters', () => {
  it('should format currency', () => {
    expect(formatCurrency(100, 'USD', 'en-US')).toBe('$100.00');
    expect(formatCurrency(100, 'EUR', 'de-DE')).toBe('100,00 €');
  });

  it('should format number', () => {
    expect(formatNumber(1000, 'en-US')).toBe('1,000');
    expect(formatNumber(1000, 'de-DE')).toBe('1.000');
  });

  it('should format date', () => {
    expect(formatDate('2025-12-25', 'en-US')).toBe('12/25/2025');
    expect(formatDate('2025-12-25', 'ru-RU')).toBe('25.12.2025');
  });

  it('should format relative time', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 60 * 1000);
    expect(formatRelativeTime(past)).toMatch(/minute/);
  });

  it('should truncate text', () => {
    expect(truncateText('Hello world', 8)).toBe('Hello...');
    expect(truncateText('Hi', 8)).toBe('Hi');
  });

  it('should slugify text', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  spaced   text  ')).toBe('spaced-text');
  });
});
