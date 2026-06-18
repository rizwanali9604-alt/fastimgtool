#!/usr/bin/env node
/**
 * FIX 2: Remove Canva affiliate CTA blocks from HTML files.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let changed = 0;

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(p, files);
    } else if (name.endsWith('.html')) files.push(p);
  }
  return files;
}

const canvaBlockRe =
  /<!--\s*AFFILIATE:.*?canva\.com\/affiliates\s*-->[\s\S]*?<\/div>\s*\n?/gi;

const canvaBlockRe2 =
  /<div class="affiliate-cta"[^>]*>[\s\S]*?Try Canva Free[\s\S]*?<\/div>\s*\n?/gi;

for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  html = html.replace(canvaBlockRe, '');
  html = html.replace(canvaBlockRe2, '');

  // Other dead affiliate fragments
  html = html.replace(/href="#affiliate-link-needed"/g, 'href="#"');

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
    console.log('Updated:', path.relative(ROOT, file));
  }
}

console.log(`\nRemoved Canva CTAs / fixed dead links in ${changed} files`);
