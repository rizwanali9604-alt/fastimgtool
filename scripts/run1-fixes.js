/**
 * RUN 1 bulk fixes — FastImageTool (excludes guides_backup/)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ADSENSE =
  '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8332278513903196" crossorigin="anonymous"></script>';

const STANDARD_NAV = `<nav class="nav">
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

const AFFILIATE_BLOCK = `<!-- TO DO: replace href with your Amazon affiliate URL from affiliate-program.amazon.in -->
<div class="affiliate-cta">
  <div class="aff-icon">📦</div>
  <div class="aff-text">
    <strong>Need better product photos?</strong>
    <span>Shop lighting kits, cameras &amp; accessories on Amazon</span>
  </div>
  <a href="#affiliate-pending" target="_blank"
     rel="noopener sponsored" class="aff-btn aff-amazon">
    Shop Amazon →
  </a>
</div>

<!-- TO DO: replace href with your Canva affiliate URL from canva.com/affiliates -->
<div class="affiliate-cta" style="margin-top:10px;">
  <div class="aff-icon">🎨</div>
  <div class="aff-text">
    <strong>Want professional designs?</strong>
    <span>Try Canva Pro — 100M+ templates for sellers</span>
  </div>
  <a href="#affiliate-pending" target="_blank"
     rel="noopener sponsored" class="aff-btn aff-canva">
    Try Canva Free →
  </a>
</div>`;

const TOOL_SLUGS = [
  'image-compressor', 'image-resizer', 'jpg-to-png', 'png-to-jpg', 'image-to-webp',
  'webp-to-jpg', 'image-blur', 'image-sharpen', 'image-brightness', 'image-contrast',
  'image-grayscale', 'image-sepia', 'image-invert', 'image-saturation', 'image-crop',
  'rotate-image', 'flip-image', 'image-to-base64', 'base64-to-image', 'heic-to-jpg',
  'bmp-to-jpg', 'gif-to-png', 'png-to-webp', 'tiff-to-jpg',
];

const toolsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/tools.json'), 'utf8'));
const toolMap = Object.fromEntries(toolsData.map((t) => [t.slug, t]));

const stats = {
  titleFixed: 0,
  canonicalFixed: 0,
  navFixed: 0,
  adsenseAdded: 0,
  affiliateUpdated: 0,
  schemaAdded: 0,
};

function getHtmlFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'guides_backup' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) getHtmlFiles(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function relPath(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function fixCanonical(content) {
  const before = content;
  content = content.replace(/https:\/(?!\/)/g, 'https://');
  if (content !== before) stats.canonicalFixed++;
  return content;
}

function fixTitle(content, file) {
  const rel = relPath(file);
  let newTitle = null;

  if (rel === 'blog/index.html') {
    newTitle = 'FastImageTool Blog — Image Optimization Tips';
  } else if (rel === 'guides/index.html') {
    newTitle = 'Image Optimization Guides — FastImageTool';
  } else {
    const toolMatch = rel.match(/^tools\/([^/]+)\/index\.html$/);
    if (toolMatch && toolMatch[1] !== 'index') {
      const slug = toolMatch[1];
      const tool = toolMap[slug];
      const name = tool ? tool.title.replace(/ Online$/, '').replace(/^Fast /, '') : slug;
      newTitle = `${name} Free Online — FastImageTool`;
    } else if (content.includes('{{title}}')) {
      const base = path.basename(rel, '.html');
      newTitle = base === 'index' ? 'FastImageTool' : base.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) + ' — FastImageTool';
    }
  }

  if (newTitle) {
    content = content.replace(/<title>[^<]*<\/title>/i, `<title>${newTitle}</title>`);
    content = content.replace(/\{\{title\}\}/g, newTitle);
    stats.titleFixed++;
  } else if (content.includes('{{title}}')) {
    content = content.replace(/\{\{title\}\}/g, 'FastImageTool');
    stats.titleFixed++;
  }
  return content;
}

function replaceNav(content) {
  if (content.includes('class="nav-inner"')) return content;
  if (!/<nav[\s\S]*?<\/nav>/i.test(content)) return content;
  stats.navFixed++;
  return content.replace(/<nav[\s\S]*?<\/nav>/i, STANDARD_NAV);
}

function ensureAdsense(content) {
  if (content.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js')) return content;
  stats.adsenseAdded++;
  if (content.includes('</head>')) {
    return content.replace('</head>', `    ${ADSENSE}\n</head>`);
  }
  return content;
}

function schemaBlock(slug, tool) {
  const name = tool.title;
  const desc = tool.description.split('.')[0] + '.';
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": ${JSON.stringify(name)},
  "url": "https://fastimgtool.com/tools/${slug}/",
  "description": ${JSON.stringify(desc)},
  "applicationCategory": "ImageEditor",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>`;
}

function ensureSchema(content, slug) {
  if (content.includes('"@type": "WebApplication"') || content.includes('"@type":"WebApplication"')) {
    return content;
  }
  const tool = toolMap[slug];
  if (!tool) return content;
  stats.schemaAdded++;
  return content.replace('</head>', `${schemaBlock(slug, tool)}\n</head>`);
}

function updateAffiliate(content) {
  const hadOld = /affiliate-cta|affiliate-btn|affiliate-icon/.test(content);
  if (hadOld) {
    content = content.replace(/<!--[^>]*affiliate[^>]*-->\s*/gi, '');
    content = content.replace(/<div class="affiliate-cta"[\s\S]*?<\/div>\s*(<div class="affiliate-cta"[\s\S]*?<\/div>\s*)?/gi, '');
  }
  const markers = [
    /(<button[^>]*id="downloadBtn"[^>]*>[\s\S]*?<\/button>)/i,
    /(<button[^>]*class="[^"]*btn-primary[^"]*"[^>]*>[\s\S]*?<\/button>)/i,
    /(<button[^>]*class="[^"]*ic-btn-primary[^"]*"[^>]*>[\s\S]*?<\/button>)/i,
  ];
  for (const re of markers) {
    const m = content.match(re);
    if (m) {
      stats.affiliateUpdated++;
      return content.replace(re, `$1\n\n            ${AFFILIATE_BLOCK}`);
    }
  }
  if (!hadOld) stats.affiliateUpdated++;
  return content.replace(/(<\/main>)/i, `\n            ${AFFILIATE_BLOCK}\n    $1`);
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const rel = relPath(file);
  const slugMatch = rel.match(/^tools\/([^/]+)\/index\.html$/);
  const isToolPage = slugMatch && TOOL_SLUGS.includes(slugMatch[1]);

  content = fixCanonical(content);
  content = fixTitle(content, file);
  content = replaceNav(content);
  content = ensureAdsense(content);

  if (isToolPage && rel !== 'tools/image-resizer/index.html') {
    content = ensureSchema(content, slugMatch[1]);
    content = updateAffiliate(content);
  }

  fs.writeFileSync(file, content, 'utf8');
}

const files = getHtmlFiles(ROOT);
files.forEach(processFile);

console.log(JSON.stringify(stats, null, 2));
console.log(`Processed ${files.length} HTML files`);
