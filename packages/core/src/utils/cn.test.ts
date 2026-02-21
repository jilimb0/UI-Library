import { cn } from './cn';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('a', 'b')).toBe('a b');
    expect(cn('a', null, 'b')).toBe('a b');
    expect(cn('a', undefined, 'b')).toBe('a b');
    expect(cn('a', 'b', { c: true })).toBe('a b c');
    expect(cn('a', 'b', { c: false })).toBe('a b');
  });
});
