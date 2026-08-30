#!/usr/bin/env node
/**
 * Greenlight pass: 301 doorways + clone how-tos, rebuild sitemap/guides/search,
 * inject consent scripts, unify leftover indexables.
 * Usage: ALLOW_GREENLIGHT=1 node scripts/greenlight_apply.js
 */
const fs = require('fs');
const path = require('path');

if (process.env.ALLOW_GREENLIGHT !== '1') {
  console.error(
    'Refusing to run greenlight_apply.js (rewrites _redirects, sitemap, and HTML). Set ALLOW_GREENLIGHT=1 only if you intend that.'
  );
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');

const KEEP_GUIDES = [
  {
    tool_slug: 'image-resizer',
    title: 'How to Resize an Image Online',
    url: '/guides/how-to-resize-image-online',
  },
  {
    tool_slug: 'image-resizer',
    title: 'Resize Image for Instagram – Perfect Post & Story Dimensions',
    url: '/guides/resize-image-for-instagram',
  },
  {
    tool_slug: 'image-resizer',
    title: 'Resize Image for YouTube Thumbnail – Best Size (1280x720)',
    url: '/guides/resize-image-for-youtube-thumbnail',
  },
  {
    tool_slug: 'image-compressor',
    title: 'Compress Image for Email – Stay Under Attachment Limits',
    url: '/guides/compress-image-for-email',
  },
  {
    tool_slug: 'image-compressor',
    title: 'How to Compress an Image Online – Reduce File Size Free',
    url: '/guides/how-to-compress-image-online',
  },
  {
    tool_slug: 'image-compressor',
    title: 'Compress Image for WhatsApp – Send Photos Faster',
    url: '/guides/compress-image-for-whatsapp',
  },
  {
    tool_slug: 'image-compressor',
    title: 'Meesho Product Image 600×600 Under 2MB — Seller Guide',
    url: '/guides/meesho-product-image-size-600x600-under-50kb',
  },
  {
    tool_slug: 'image-compressor',
    title: 'Amazon India Product Image Requirements 2026',
    url: '/guides/amazon-india-product-image-requirements',
  },
  {
    tool_slug: 'image-to-webp',
    title: 'Shopify Product Images — WebP & Compression',
    url: '/guides/shopify-product-images-webp-compression',
  },
  {
    tool_slug: 'webp-to-jpg',
    title: 'WEBP vs JPG: Which Format Is Better?',
    url: '/guides/webp-vs-jpg-which-is-better',
  },
];

const GUIDE_REDIRECTS = {
  'how-to-convert-jpg-to-png.html': '/tools/jpg-to-png/',
  'how-to-convert-png-to-jpg.html': '/tools/png-to-jpg/',
  'how-to-convert-webp-to-jpg.html': '/tools/webp-to-jpg/',
  'how-to-blur-image-online.html': '/tools/image-blur/',
  'how-to-sharpen-image-online.html': '/tools/image-sharpen/',
  'how-to-convert-image-to-grayscale.html': '/tools/image-grayscale/',
  'how-to-flip-image-online.html': '/tools/flip-image/',
  'how-to-rotate-image-online.html': '/tools/rotate-image/',
  'how-to-crop-image-online.html': '/tools/image-crop/',
  'how-to-use-base64-to-image.html': '/tools/base64-to-image/',
  'how-to-use-bmp-to-jpg.html': '/tools/bmp-to-jpg/',
  'how-to-use-gif-to-png.html': '/tools/gif-to-png/',
  'how-to-use-heic-to-jpg.html': '/tools/heic-to-jpg/',
  'how-to-adjust-image-brightness-online.html': '/tools/image-brightness/',
  'how-to-adjust-image-contrast-online.html': '/tools/image-contrast/',
  'how-to-invert-image-colors-online.html': '/tools/image-invert/',
  'how-to-adjust-image-saturation-online.html': '/tools/image-saturation/',
  'how-to-apply-sepia-filter-online.html': '/tools/image-sepia/',
  'how-to-convert-image-to-base64.html': '/tools/image-to-base64/',
  'how-to-convert-image-to-webp.html': '/tools/image-to-webp/',
  'how-to-convert-png-to-webp.html': '/tools/png-to-webp/',
  'how-to-use-tiff-to-jpg.html': '/tools/tiff-to-jpg/',
  'resize-image-online.html': '/guides/how-to-resize-image-online',
};

const ROOT_REDIRECTS = {
  '/compress-image-online-free.html': '/tools/image-compressor/',
  '/resize-image-online-free.html': '/tools/image-resizer/',
  '/image-resizer.html': '/tools/image-resizer/',
  '/png-to-jpg-converter.html': '/tools/png-to-jpg/',
  '/webp-to-jpg-converter.html': '/tools/webp-to-jpg/',
  '/convert-jpg-to-png-online-free.html': '/tools/jpg-to-png/',
  '/how-to-convert-jpg-to-png-online-free.html': '/tools/jpg-to-png/',
  '/community.html': '/contact',
  '/newsletter.html': '/contact',
  '/blog/first-post.html': '/blog/image-compression-best-practices',
    '/guides/convert-webp-to-jpg.html': '/tools/webp-to-jpg/',
    '/guides/convert-webp-to-jpg': '/tools/webp-to-jpg/',
    '/favicon.ico': '/assets/favicon.png',
};

const ROOT_DELETE = [
  'compress-image-online-free.html',
  'resize-image-online-free.html',
  'image-resizer.html',
  'png-to-jpg-converter.html',
  'webp-to-jpg-converter.html',
  'convert-jpg-to-png-online-free.html',
  'how-to-convert-jpg-to-png-online-free.html',
  'community.html',
  'newsletter.html',
];

const BLOG_KEEP = [
  ['/blog/image-file-formats-explained.html', 'Image File Formats Explained: JPG, PNG, WEBP, and More'],
  ['/blog/how-to-resize-images-for-social-media.html', 'How to Resize Images for Social Media (2026 Guide)'],
  ['/blog/batch-image-processing-tips.html', 'One-at-a-time catalog workflow (no batch uploader)'],
  ['/blog/image-seo-guide.html', 'The Ultimate Guide to Image SEO for Higher Rankings'],
  ['/blog/how-to-compress-images-for-email.html', 'How to Compress Images for Email (Stay Under Attachment Limits)'],
  ['/blog/webp-vs-jpg-vs-png.html', 'WEBP vs JPG vs PNG: Which Format Should You Use?'],
  ['/blog/how-to-create-a-favicon.html', 'How to Create a Favicon for Your Website (Easy Steps)'],
  ['/blog/image-compression-best-practices.html', 'Image Compression Best Practices for 2026'],
  ['/blog/remove-background-from-image.html', 'We do not remove backgrounds — what to do instead'],
];

function today() {
  return '2026-08-21';
}

function writeRedirects() {
  const lines = [
    '/guides/how-to-use-test-tool.html /404.html 404',
    '/tools/test-tool /404.html 404',
    '/tools/test-tool/ /404.html 404',
    '/tools/test-tool/* /404.html 404',
  ];
  Object.entries(ROOT_REDIRECTS).forEach(([from, to]) => {
    lines.push(`${from} ${to} 301`);
  });
  Object.entries(GUIDE_REDIRECTS).forEach(([file, to]) => {
    lines.push(`/guides/${file} ${to} 301`);
  });
  fs.writeFileSync(path.join(ROOT, '_redirects'), lines.join('\n') + '\n');
  console.log('Wrote _redirects');
}

function deleteFiles() {
  ROOT_DELETE.forEach((f) => {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log('deleted', f);
    }
  });
  Object.keys(GUIDE_REDIRECTS).forEach((f) => {
    const p = path.join(ROOT, 'guides', f);
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log('deleted guides/' + f);
    }
  });
  const first = path.join(ROOT, 'blog', 'first-post.html');
  if (fs.existsSync(first)) {
    fs.unlinkSync(first);
    console.log('deleted blog/first-post.html');
  }
}

function writeSitemap() {
  const urls = [
    ['https://fastimgtool.com/', '1.0', 'weekly'],
    ['https://fastimgtool.com/tools/', '0.9', 'weekly'],
    ['https://fastimgtool.com/guides/', '0.9', 'weekly'],
    ['https://fastimgtool.com/blog/', '0.8', 'weekly'],
    ['https://fastimgtool.com/affiliate/', '0.5', 'monthly'],
    ['https://fastimgtool.com/about', '0.5', 'monthly'],
    ['https://fastimgtool.com/contact', '0.5', 'monthly'],
    ['https://fastimgtool.com/privacy', '0.5', 'monthly'],
    ['https://fastimgtool.com/terms', '0.5', 'monthly'],
    ['https://fastimgtool.com/faq', '0.5', 'monthly'],
  ];
  const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tools.json'), 'utf8'));
  tools.forEach((t) => {
    if (t.slug === 'test-tool') return;
    urls.push([`https://fastimgtool.com/tools/${t.slug}/`, '0.8', 'monthly']);
  });
  KEEP_GUIDES.forEach((g) => {
    urls.push([`https://fastimgtool.com${g.url}`, '0.7', 'monthly']);
  });
  BLOG_KEEP.forEach(([u]) => {
    urls.push([`https://fastimgtool.com${u}`, '0.6', 'monthly']);
  });
  const d = today();
  const body = urls
    .map(
      ([loc, pri, freq]) =>
        `  <url><loc>${loc}</loc><priority>${pri}</priority><changefreq>${freq}</changefreq><lastmod>${d}</lastmod></url>`
    )
    .join('\n');
  fs.writeFileSync(
    path.join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
  console.log('Wrote sitemap', urls.length, 'urls');
}

function writeGuidesJson() {
  fs.writeFileSync(
    path.join(ROOT, 'data', 'guides.json'),
    JSON.stringify(KEEP_GUIDES, null, 2) + '\n'
  );
  console.log('Wrote guides.json', KEEP_GUIDES.length);
}

function walkHtml(dir, acc) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (['node_modules', 'templates', 'scripts', '.git'].includes(name)) continue;
      walkHtml(p, acc);
    } else if (name.endsWith('.html')) {
      acc.push(p);
    }
  }
}

function injectConsent(html) {
  if (html.includes('/assets/js/consent-boot.js')) return html;
  html = html.replace(/<head([^>]*)>/i, '<head$1>\n    <script src="/assets/js/consent-boot.js"></script>');
  if (!html.includes('consent-ui.js')) {
    html = html.replace(/<\/body>/i, '    <script src="/assets/js/consent-ui.js" defer></script>\n</body>');
  }
  return html;
}

function injectAllConsent() {
  const files = [];
  walkHtml(ROOT, files);
  let n = 0;
  files.forEach((f) => {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    if (rel.startsWith('templates/') || rel.startsWith('scripts/') || rel.startsWith('reports/')) return;
    let html = fs.readFileSync(f, 'utf8');
    if (!html.includes('adsbygoogle') && !html.includes('gtag/js') && !html.includes('googletagmanager')) {
      return;
    }
    const next = injectConsent(html);
    if (next !== html) {
      fs.writeFileSync(f, next);
      n++;
    }
  });
  console.log('Injected consent on', n, 'pages');
}

function writeSearch() {
  const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tools.json'), 'utf8'))
    .filter((t) => t.slug !== 'test-tool')
    .map((t) => ({
      title: t.title,
      description: t.description,
      url: `/tools/${t.slug}/`,
      type: 'tool',
      category: t.category || 'uncategorized',
    }));
  const guides = KEEP_GUIDES.map((g) => ({
    title: g.title,
    description: g.title,
    url: g.url,
    type: 'guide',
    tool_slug: g.tool_slug,
  }));
  const blog = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'blog-posts.json'), 'utf8')).map((b) => ({
    title: b.title,
    description: b.description,
    url: b.url,
    type: 'blog',
    date: b.date,
  }));
  const index = [...tools, ...guides, ...blog];
  fs.writeFileSync(path.join(ROOT, 'search.json'), JSON.stringify(index, null, 2) + '\n');
  console.log('search.json', index.length, 'entries');
}

function patchAdsenseFix() {
  const p = path.join(ROOT, 'scripts', 'adsense_final_fix.js');
  if (!fs.existsSync(p)) return;
  let s = fs.readFileSync(p, 'utf8');
  const set = KEEP_GUIDES.map((g) => path.basename(g.url));
  const body =
    'const INDEXABLE_GUIDES = new Set([\n' +
    set.map((f) => `  '${f}',`).join('\n') +
    '\n]);\n';
  s = s.replace(/const INDEXABLE_GUIDES = new Set\(\[[\s\S]*?\]\);/, body.trim());
  fs.writeFileSync(p, s);
  console.log('Updated adsense_final_fix INDEXABLE_GUIDES');
}

writeRedirects();
deleteFiles();
writeSitemap();
writeGuidesJson();
injectAllConsent();
patchAdsenseFix();
writeSearch();
console.log('Greenlight apply complete.');
