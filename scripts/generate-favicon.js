#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const svg = fs.readFileSync(path.join(ROOT, 'assets', 'favicon.svg'));

async function main() {
  await sharp(svg).resize(32, 32).png().toFile(path.join(ROOT, 'assets', 'favicon-32.png'));
  await sharp(svg).resize(64, 64).png().toFile(path.join(ROOT, 'assets', 'favicon.png'));
  await sharp(svg).resize(180, 180).png().toFile(path.join(ROOT, 'assets', 'apple-touch-icon.png'));
  console.log('Wrote favicon.png, favicon-32.png, apple-touch-icon.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
