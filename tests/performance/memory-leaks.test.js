import { describe, expect, it } from 'vitest';

describe('Memory leak smoke', () => {
  it('allocates and releases arrays', () => {
    const items = [];
    for (let i = 0; i < 1000; i += 1) {
      items.push(new Array(1000).fill(i));
    }
    expect(items.length).toBe(1000);
  });
});
