#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walkHtml(dir, acc) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (['node_modules', 'templates', 'scripts', '.git', 'legacy-data'].includes(name)) continue;
      walkHtml(p, acc);
    } else if (name.endsWith('.html')) acc.push(p);
  }
}

const files = [];
walkHtml(path.join(ROOT, 'guides'), files);

files.forEach((f) => {
  let html = fs.readFileSync(f, 'utf8');
  if (html.includes('/assets/js/nav.js')) return;
  if (!html.includes('consent-ui.js')) return;
  html = html.replace(
    '<script src="/assets/js/consent-ui.js" defer></script>',
    '<script src="/assets/js/nav.js"></script>\n    <script src="/assets/js/consent-ui.js" defer></script>'
  );
  fs.writeFileSync(f, html);
  console.log('nav.js →', path.relative(ROOT, f));
});

console.log('nav/legal pass done');
