const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

describe('Bundle Size', () => {
  const distPath = path.join(__dirname, '../../packages/core/dist');

  it('has acceptable gzip size', () => {
    if (!fs.existsSync(distPath)) return;
    const jsFiles = fs.readdirSync(distPath).filter((f) => f.endsWith('.js'));
    for (const file of jsFiles) {
      const content = fs.readFileSync(path.join(distPath, file));
      const size = zlib.gzipSync(content).length;
      if (file.includes('index')) {
        expect(size).toBeLessThan(30 * 1024);
      }
      expect(size).toBeLessThan(50 * 1024);
    }
  });
});
