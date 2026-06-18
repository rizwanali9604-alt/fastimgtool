#!/usr/bin/env node
/**
 * AdSense final polish: tool ads, SEO sections, guides noindex/sitemap, policy pages.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOL_SEO = require('./tool-seo-content.js');

const AD_TOP = `    <div style="min-height:90px;text-align:center;margin:16px 0;">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8332278513903196" data-ad-slot="9490701260" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>`;

const AD_MID = `    <div style="min-height:90px;text-align:center;margin:24px 0;">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8332278513903196" data-ad-slot="8664200172" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>`;

const AD_BOTTOM = `    <div style="min-height:90px;text-align:center;margin:24px 0 32px;">
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8332278513903196" data-ad-slot="3445350863" data-ad-format="auto" data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
    </div>`;

const AFFILIATE = `            <div class="affiliate-cta">
              <div class="aff-icon">📦</div>
              <div class="aff-text">
                <strong>Need better product photos?</strong>
                <span>Shop lighting kits and accessories on Amazon</span>
              </div>
              <a href="https://www.amazon.in/s?k=photography+lighting+kit&tag=fastimgtool78-21" target="_blank" rel="noopener sponsored" class="aff-btn aff-amazon">Shop Amazon →</a>
            </div>`;

const INDEXABLE_GUIDES = new Set([
  'how-to-resize-image-online.html',
  'resize-image-for-instagram.html',
  'resize-image-for-youtube-thumbnail.html',
  'compress-image-for-email.html',
  'how-to-compress-image-online.html',
  'compress-image-for-whatsapp.html',
  'meesho-product-image-size-600x600-under-50kb.html',
  'amazon-india-product-image-requirements.html',
  'shopify-product-images-webp-compression.html',
  'webp-vs-jpg-which-is-better.html',
  'resize-image-online.html',
  'how-to-convert-jpg-to-png.html',
  'how-to-convert-png-to-jpg.html',
  'how-to-convert-webp-to-jpg.html',
  'convert-webp-to-jpg.html',
  'how-to-blur-image-online.html',
  'how-to-sharpen-image-online.html',
  'how-to-convert-image-to-grayscale.html',
  'how-to-flip-image-online.html',
  'how-to-rotate-image-online.html',
  'how-to-crop-image-online.html',
  'how-to-use-base64-to-image.html',
  'how-to-use-bmp-to-jpg.html',
  'how-to-use-gif-to-png.html',
  'how-to-use-heic-to-jpg.html',
  'how-to-adjust-image-brightness-online.html',
  'how-to-adjust-image-contrast-online.html',
  'how-to-invert-image-colors-online.html',
  'how-to-adjust-image-saturation-online.html',
  'how-to-apply-sepia-filter-online.html',
  'how-to-convert-image-to-base64.html',
  'how-to-convert-image-to-webp.html',
  'how-to-convert-png-to-webp.html',
  'how-to-use-tiff-to-jpg.html',
]);

const GUIDE_META = {
  'meesho-product-image-size-600x600-under-50kb.html': { tool_slug: 'image-compressor', title: 'Meesho Product Image 600×600 Under 2MB — Seller Guide' },
  'amazon-india-product-image-requirements.html': { tool_slug: 'image-compressor', title: 'Amazon India Product Image Requirements 2026' },
  'shopify-product-images-webp-compression.html': { tool_slug: 'image-to-webp', title: 'Shopify Product Images — WebP & Compression' },
  'convert-webp-to-jpg.html': { tool_slug: 'webp-to-jpg', title: 'How to Convert WebP to JPG Online' },
};

function buildSeoSection(slug, data) {
  const steps = data.howTo.map((s, i) => `          <li><strong>Step ${i + 1}:</strong> ${s}</li>`).join('\n');
  return `    <section class="seo-content container" style="max-width:800px;margin:40px auto;padding:24px;background:var(--card,#111a30);border-radius:12px;line-height:1.8;border:1px solid var(--border,#334155);">
        <h2>About ${data.name}</h2>
        <p>${data.about}</p>
        <h2>How to Use ${data.name}</h2>
        <ol>
${steps}
        </ol>
        <p><em>Privacy:</em> Your files are processed in your browser and are not uploaded to our servers.</p>
        <h2>Frequently Asked Questions</h2>
        <h3>Is ${data.name} free?</h3>
        <p>Yes — completely free with no signup or watermarks.</p>
        <h3>What formats are supported?</h3>
        <p>Common formats include JPG, PNG, and WebP. See the upload area on this page for the full list.</p>
        <h3>Are my images private?</h3>
        <p>Yes. Processing happens locally on your device whenever your browser supports it.</p>
    </section>`;
}

function fixToolPage(file) {
  const slug = path.basename(path.dirname(file));
  if (slug === 'image-compressor') {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<h3>About Fast Image Compressor<\/h3>\s*/g, '');
    html = html.replace(/<h3>Why Use Fast Image Compressor<\/h3>\s*/g, '');
    html = html.replace(/<h3>Common Use Cases for Fast Image Compressor<\/h3>\s*/g, '');
    fs.writeFileSync(file, html, 'utf8');
    console.log('Cleaned compressor duplicates:', slug);
    return;
  }

  let html = fs.readFileSync(file, 'utf8');
  const data = TOOL_SEO[slug];
  if (!data) {
    console.warn('No SEO data for', slug);
    return;
  }

  html = html.replace(/<div class="ad-slot-placeholder[^>]*>[\s\S]*?<\/div>/g, '___AD_PLACEHOLDER___');
  const parts = html.split('___AD_PLACEHOLDER___');
  if (parts.length >= 2) {
    html = parts[0] + '\n' + AD_TOP + '\n' + parts.slice(1).join('\n' + AD_MID + '\n');
  }
  html = html.replace(/___AD_PLACEHOLDER___/g, AD_BOTTOM);
  html = html.replace(/<div class="ad-slot-placeholder[^>]*>[\s\S]*?<\/div>/g, AD_BOTTOM);

  html = html.replace(/<section class="seo-content[\s\S]*?<\/section>/, buildSeoSection(slug, data));

  html = html.replace(/<!-- AFFILIATE:[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/main>)/, AFFILIATE + '\n');
  html = html.replace(/<div class="affiliate-text">[\s\S]*?<\/a>\s*<\/div>\s*<\/div>/, AFFILIATE + '\n        </div>');

  if (!html.includes('affiliate-cta')) {
    html = html.replace(
      /(<button[^>]*id="downloadBtn"[^>]*>[\s\S]*?<\/button>)/,
      `$1\n\n${AFFILIATE}`
    );
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log('Fixed tool:', slug);
}

function addNoindex(html) {
  if (/name=["']robots["'][^>]*noindex/i.test(html)) return html;
  return html.replace(/<head([^>]*)>/i, '<head$1>\n    <meta name="robots" content="noindex, nofollow">');
}

function removeNoindex(html) {
  return html.replace(/\s*<meta name="robots" content="noindex, nofollow">\s*/gi, '\n');
}

// --- Tools ---
const toolsDir = path.join(ROOT, 'tools');
fs.readdirSync(toolsDir).forEach((name) => {
  const idx = path.join(toolsDir, name, 'index.html');
  if (fs.existsSync(idx)) fixToolPage(idx);
});

// --- Guides noindex ---
let noindexed = 0;
let kept = 0;
function walkGuides(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      walkGuides(p);
      continue;
    }
    if (!name.endsWith('.html') || name === 'index.html') continue;
    let html = fs.readFileSync(p, 'utf8');
    if (INDEXABLE_GUIDES.has(name)) {
      html = removeNoindex(html);
      kept++;
    } else {
      html = addNoindex(html);
      noindexed++;
    }
    fs.writeFileSync(p, html, 'utf8');
  }
}
walkGuides(path.join(ROOT, 'guides'));
console.log(`Guides: ${kept} indexable, ${noindexed} noindexed`);

// --- guides.json ---
const oldGuides = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'guides.json'), 'utf8'));
const byUrl = {};
oldGuides.forEach((g) => {
  byUrl[path.basename(g.url)] = g;
});
const newGuides = [];
for (const file of INDEXABLE_GUIDES) {
  if (byUrl[file]) {
    newGuides.push(byUrl[file]);
  } else if (GUIDE_META[file]) {
    newGuides.push({ ...GUIDE_META[file], url: `/guides/${file}` });
  }
}
fs.writeFileSync(path.join(ROOT, 'data', 'guides.json'), JSON.stringify(newGuides, null, 2) + '\n', 'utf8');
console.log(`guides.json: ${newGuides.length} curated entries`);

console.log('Run: node scripts/regen_meta.js');
