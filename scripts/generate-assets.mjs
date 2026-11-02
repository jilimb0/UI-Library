import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SVG_SOURCE = path.join(ROOT, 'apps/showcase/public/favicon.svg');
const svgBuffer = fs.readFileSync(SVG_SOURCE);

const TARGET_DIRS = [
  path.join(ROOT, 'public'),
  path.join(ROOT, 'apps/showcase/public'),
  path.join(ROOT, 'apps/builder/public'),
  path.join(ROOT, 'apps/docs/public'),
  path.join(ROOT, 'apps/demo-showcase/public'),
];

for (const dir of TARGET_DIRS) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. apple-touch-icon.png (180x180, non-transparent brand background)
const appleTouchIconBuffer = await sharp({
  create: {
    width: 180,
    height: 180,
    channels: 4,
    background: '#09090b',
  },
})
  .composite([
    {
      input: await sharp(svgBuffer).resize(120, 120, { fit: 'contain' }).toBuffer(),
      gravity: 'center',
    },
  ])
  .png()
  .toBuffer();

// 2. icon-192.png and icon-512.png (PWA manifest icons)
const icon192Buffer = await sharp({
  create: {
    width: 192,
    height: 192,
    channels: 4,
    background: '#09090b',
  },
})
  .composite([
    {
      input: await sharp(svgBuffer).resize(136, 136, { fit: 'contain' }).toBuffer(),
      gravity: 'center',
    },
  ])
  .png()
  .toBuffer();

const icon512Buffer = await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: '#09090b',
  },
})
  .composite([
    {
      input: await sharp(svgBuffer).resize(360, 360, { fit: 'contain' }).toBuffer(),
      gravity: 'center',
    },
  ])
  .png()
  .toBuffer();

// 3. og-banner.png (1200x630, Open Graph card)
const ogBannerSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0d14"/>
      <stop offset="50%" stop-color="#09090b"/>
      <stop offset="100%" stop-color="#141126"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(100, 160)">
    <text x="0" y="80" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" fill="#ffffff" letter-spacing="-0.03em">
      UI Construction Library
    </text>
    <text x="0" y="145" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="500" fill="#a78bfa">
      Enterprise Accessible Design System &amp; React Component Library
    </text>
    <text x="0" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="400" fill="#a1a1aa">
      70+ Components · WAI-ARIA APG · Tailwind CSS v4 · Multi-framework
    </text>
  </g>
</svg>
`;

const ogBannerBuffer = await sharp(Buffer.from(ogBannerSvg))
  .composite([
    {
      input: await sharp(svgBuffer).resize(200, 200, { fit: 'contain' }).toBuffer(),
      top: 215,
      left: 920,
    },
  ])
  .png({ quality: 90 })
  .toBuffer();

// 4. Create multi-size ICO file (PNG-encoded frames inside standard ICO container)
function createIco(pngBuffers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(pngBuffers.length, 4); // Number of images

  let offset = 6 + pngBuffers.length * 16;
  const directoryEntries = [];
  const imageBuffers = [];

  for (const { width, height, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Image size in bytes
    entry.writeUInt32LE(offset, 12); // File offset

    directoryEntries.push(entry);
    imageBuffers.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...directoryEntries, ...imageBuffers]);
}

const p16 = await sharp(svgBuffer).resize(16, 16, { fit: 'contain' }).png().toBuffer();
const p32 = await sharp(svgBuffer).resize(32, 32, { fit: 'contain' }).png().toBuffer();
const p48 = await sharp(svgBuffer).resize(48, 48, { fit: 'contain' }).png().toBuffer();

const icoBuffer = createIco([
  { width: 16, height: 16, buffer: p16 },
  { width: 32, height: 32, buffer: p32 },
  { width: 48, height: 48, buffer: p48 },
]);

// 5. site.webmanifest
const webmanifestContent = JSON.stringify(
  {
    name: 'UI Construction Library',
    short_name: 'UI-Library',
    description: 'Enterprise Accessible Design System & React Component Library',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#7c3aed',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  },
  null,
  2
);

// 6. robots.txt
const robotsContent = `User-agent: *
Allow: /
Sitemap: https://jilimb0.github.io/UI-Library/sitemap.xml
`;

// 7. sitemap.xml
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jilimb0.github.io/UI-Library/</loc>
    <lastmod>2026-11-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jilimb0.github.io/UI-Library/builder/</loc>
    <lastmod>2026-11-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://jilimb0.github.io/UI-Library/docs/</loc>
    <lastmod>2026-11-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`;

// Write to all target public directories
for (const dir of TARGET_DIRS) {
  fs.writeFileSync(path.join(dir, 'favicon.svg'), svgBuffer);
  fs.writeFileSync(path.join(dir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(dir, 'apple-touch-icon.png'), appleTouchIconBuffer);
  fs.writeFileSync(path.join(dir, 'icon-192.png'), icon192Buffer);
  fs.writeFileSync(path.join(dir, 'icon-512.png'), icon512Buffer);
  fs.writeFileSync(path.join(dir, 'og-banner.png'), ogBannerBuffer);
  fs.writeFileSync(path.join(dir, 'site.webmanifest'), webmanifestContent);
  fs.writeFileSync(path.join(dir, 'robots.txt'), robotsContent);
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapContent);
  console.log(`Generated identity and SEO assets in ${dir}`);
}
