import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('normalizes words and punctuation', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('  spaced   text  ')).toBe('spaced-text');
  });

  it('collapses repeated separators', () => {
    expect(slugify('a---b')).toBe('a-b');
    expect(slugify('foo___bar')).toBe('foo-bar');
  });

  it('handles long hyphen runs without hanging', () => {
    const input = `a${'-'.repeat(50_000)}b`;
    const start = performance.now();
    expect(slugify(input)).toBe('a-b');
    expect(performance.now() - start).toBeLessThan(500);
  });
});
