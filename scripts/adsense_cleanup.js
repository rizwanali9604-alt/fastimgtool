// One-off AdSense-readiness cleanup. Safe, deterministic, reversible via git.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const AFFILIATE = 'https://www.amazon.in/s?k=ring+light+photography&tag=fastimgtool78-21';

// 1) Collect all HTML files we want to touch (exclude templates/, node_modules/, scripts/)
function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'templates', 'scripts', '.git', 'config', 'python_marketing'].includes(entry.name)) continue;
      walk(full, acc);
    } else if (entry.name.endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc;
}

const files = walk(ROOT);

// 2) Identify thin duplicate clones to noindex
const extra = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'guide-data-extra.json'), 'utf8'));
const cloneFiles = new Set(
  extra.map(g => path.join(ROOT, 'guides', g.slug + '.html')).filter(f => fs.existsSync(f))
);

let globalFixes = 0, noindexed = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // a) Fix placeholder affiliate links
  html = html.replace(/href="#affiliate-link-needed"/g, `href="${AFFILIATE}"`);
  html = html.replace(/<!--\s*#affiliate-link-needed\s*-->\s*/g, '');

  // b) Fix broken privacy-policy links -> real privacy page
  html = html.replace(/\/privacy-policy\.html\/?/g, '/privacy.html');

  // c) Brand consistency (display name only; domain & affiliate tag are lowercase)
  html = html.replace(/FastImgTool/g, 'FastImageTool');

  // d) noindex the thin duplicate clones
  if (cloneFiles.has(file) && !/name=["']robots["']/i.test(html)) {
    html = html.replace(/(<meta charset=["']UTF-8["']>)/i, `$1\n    <meta name="robots" content="noindex, follow">`);
    noindexed++;
  }

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    globalFixes++;
  }
}

// 3) Drop clone URLs from guides.json so they leave the sitemap on rebuild
const guidesPath = path.join(ROOT, 'data', 'guides.json');
const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));
const cloneUrls = new Set(extra.map(g => `/guides/${g.slug}.html`));
const filtered = guides.filter(g => !cloneUrls.has(g.url));
const removed = guides.length - filtered.length;
fs.writeFileSync(guidesPath, JSON.stringify(filtered, null, 2) + '\n', 'utf8');

console.log(`HTML files modified: ${globalFixes}`);
console.log(`Clones set to noindex: ${noindexed}`);
console.log(`guides.json entries removed: ${removed} (now ${filtered.length})`);
