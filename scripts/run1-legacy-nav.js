const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NAV = `<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="nav-logo">⚡ FastImageTool</a>
    <div class="nav-links">
      <a href="/tools/" class="nav-link">All Tools</a>
      <a href="/guides/" class="nav-link">Guides</a>
      <a href="/blog/" class="nav-link">Blog</a>
      <a href="/affiliate/" class="nav-link">Recommended</a>
      <a href="/tools/image-compressor/" class="nav-cta">
        Compress Free →
      </a>
    </div>
    <button class="nav-toggle" aria-label="Toggle menu">☰</button>
  </div>
</nav>`;

const ADSENSE =
  '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8332278513903196" crossorigin="anonymous"></script>';

const legacyPages = [
  'compress-image-online-free.html',
  'convert-jpg-to-png-online-free.html',
  'how-to-convert-jpg-to-png-online-free.html',
  'image-resizer.html',
  'png-to-jpg-converter.html',
  'resize-image-online-free.html',
  'webp-to-jpg-converter.html',
];

legacyPages.forEach((f) => {
  const file = path.join(ROOT, f);
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('nav-inner')) {
    c = c.replace(/<body>\s*/i, `<body>\n${NAV}\n\n`);
  }
  if (!c.includes('overhaul.css')) {
    c = c.replace(
      '</head>',
      '    <link rel="stylesheet" href="/assets/css/overhaul.css">\n    <script src="/assets/js/calc-core.js"></script>\n</head>'
    );
  }
  fs.writeFileSync(file, c);
  console.log('nav fixed:', f);
});

// nav-tools.html fragment — wrap with minimal head for AdSense
const navTools = path.join(ROOT, 'nav-tools.html');
let nt = fs.readFileSync(navTools, 'utf8');
if (!nt.includes('adsbygoogle')) {
  nt = `<!DOCTYPE html><html><head>${ADSENSE}</head><body>${nt}</body></html>`;
  fs.writeFileSync(navTools, nt);
  console.log('nav-tools.html wrapped with AdSense');
}

console.log('Done');
