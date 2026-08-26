#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const out = path.join(ROOT, 'assets', 'og-image.png');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#050b18"/>
  <rect x="48" y="48" width="1104" height="534" rx="20" fill="#0b1225" stroke="#1e293b" stroke-width="2"/>
  <text x="96" y="220" fill="#4da3ff" font-family="Arial,Helvetica,sans-serif" font-size="56" font-weight="700">FastImageTool</text>
  <text x="96" y="290" fill="#e6edf7" font-family="Arial,Helvetica,sans-serif" font-size="32">Browser compressor, resizer and converters</text>
  <text x="96" y="350" fill="#a0b3d9" font-family="Arial,Helvetica,sans-serif" font-size="24">For Meesho and Amazon sellers. One file at a time. No signup.</text>
  <rect x="48" y="500" width="1104" height="82" rx="0" fill="#111a30"/>
  <text x="96" y="550" fill="#94a3b8" font-family="Arial,Helvetica,sans-serif" font-size="22">fastimgtool.com</text>
</svg>`;

async function main() {
  const buf = await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  const rootOut = path.join(ROOT, 'og-image.png');
  fs.writeFileSync(out, buf);
  fs.writeFileSync(rootOut, buf);
  const meta = await sharp(out).metadata();
  console.log('Wrote', out);
  console.log('Wrote', rootOut);
  console.log('bytes', buf.length, 'format', meta.format, 'size', meta.width + 'x' + meta.height);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
