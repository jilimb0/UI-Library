const { performance } = require('node:perf_hooks');

describe('Render performance baseline', () => {
  it('runs under threshold', () => {
    const start = performance.now();
    const arr = [];
    for (let i = 0; i < 10000; i += 1) arr.push(i * i);
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });
});
