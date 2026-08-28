#!/usr/bin/env node
'use strict';
/**
 * Local inventory + live crawl for FastImageTool A→Z quality gate.
 * Does not mutate files.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const ROOT = path.join(__dirname, '..');

const NOINDEX_TOOLS = [
  'image-blur',
  'image-sharpen',
  'image-grayscale',
  'image-brightness',
  'image-contrast',
  'image-saturation',
  'image-invert',
  'image-sepia',
];

function walk(dir, acc) {
  acc = acc || [];
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function extract(html, re, def) {
  const m = html.match(re);
  return m ? m[1].trim() : def || '';
}

const files = walk(ROOT).filter((p) => p.endsWith('.html') || p.endsWith('.xml') || p.endsWith('.txt'));
const toolDirs = fs
  .readdirSync(path.join(ROOT, 'tools'))
  .filter((d) => fs.existsSync(path.join(ROOT, 'tools', d, 'index.html')));

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const inventory = {
  toolDirs,
  sitemapCount: sitemapUrls.length,
  sitemapUrls,
  pages: [],
};

const publicHtml = [];
for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  if (
    rel.startsWith('templates/') ||
    rel.startsWith('scripts/') ||
    rel.startsWith('reports/') ||
    rel.startsWith('config/') ||
    rel === 'assets/generate-og.html'
  ) {
    continue;
  }
  if (!rel.endsWith('.html')) continue;
  const html = fs.readFileSync(f, 'utf8');
  const title = extract(html, /<title>([^<]*)<\/title>/i);
  const desc = extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    extract(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const canonical = extract(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  const robots = extract(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').trim()
  );
  const adsby = (html.match(/adsbygoogle\.js/g) || []).length;
  const pub990 = (html.match(/ca-pub-8332278519903196/g) || []).length;
  const pub390 = (html.match(/ca-pub-8332278513903196/g) || []).length;
  const slots = [...html.matchAll(/data-ad-slot=["'](\d+)["']/g)].map((m) => m[1]);
  const consentBoot = html.includes('consent-boot.js');
  const consentUi = html.includes('consent-ui.js');
  const screenshots = [...html.matchAll(/\/assets\/images\/tools\/[^"'>\s]+/g)].map((m) => m[0]);
  publicHtml.push({
    rel,
    title,
    desc,
    canonical,
    robots,
    h1s,
    adsby,
    pub990,
    pub390,
    slots,
    consentBoot,
    consentUi,
    screenshots,
    wordish: html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length,
  });
}

inventory.pages = publicHtml;

const titles = {};
for (const p of publicHtml) {
  titles[p.title] = titles[p.title] || [];
  titles[p.title].push(p.rel);
}
const dupTitles = Object.entries(titles).filter(([, v]) => v.length > 1);

const missingConsent = publicHtml.filter((p) => !p.consentBoot || !p.consentUi);
const missingAdsense = publicHtml.filter((p) => p.adsby === 0 && !/404\.html$/.test(p.rel) && !/googleb/.test(p.rel));
const wrongPub = publicHtml.filter((p) => p.pub390);
const multiLoader = publicHtml.filter((p) => p.adsby > 1);

const screenshotRefs = new Set();
publicHtml.forEach((p) => p.screenshots.forEach((s) => screenshotRefs.add(s)));
const screenshotLocal = [...screenshotRefs].map((s) => {
  const local = path.join(ROOT, s.replace(/^\//, ''));
  return { url: s, exists: fs.existsSync(local) };
});

const leftoverNames = [
  'compress-image-online-free.html',
  'resize-image-online-free.html',
  'image-resizer.html',
  'png-to-jpg-converter.html',
  'webp-to-jpg-converter.html',
  'convert-jpg-to-png-online-free.html',
  'how-to-convert-jpg-to-png-online-free.html',
  'community.html',
  'newsletter.html',
  'blog/first-post.html',
  'nav-tools.html',
  'sitemap-part5-guides.xml',
];
const leftovers = leftoverNames.map((n) => ({
  n,
  exists: fs.existsSync(path.join(ROOT, n)),
}));

const generic = 'Processing is designed to run in your browser. Your images are not uploaded to a FastImageTool account.';
const clonedFiller = toolDirs.map((slug) => {
  const html = fs.readFileSync(path.join(ROOT, 'tools', slug, 'index.html'), 'utf8');
  return { slug, has: html.includes(generic), noindex: /noindex/i.test(html) };
});

function fetchUrl(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(
      url,
      { method: 'GET', headers: { 'User-Agent': 'FastImageTool-AZ-Audit/1.0' } },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          const body = buf.toString('utf8');
          resolve({
            url,
            status: res.statusCode,
            headers: res.headers,
            location: res.headers.location || '',
            type: res.headers['content-type'] || '',
            bytes: buf.length,
            body,
          });
        });
      }
    );
    req.on('error', (e) => resolve({ url, status: 0, error: String(e), body: '', headers: {}, bytes: 0 }));
    req.setTimeout(25000, () => {
      req.destroy();
      resolve({ url, status: 0, error: 'timeout', body: '', headers: {}, bytes: 0 });
    });
    req.end();
  });
}

(async () => {
  const extraLive = [
    'https://fastimgtool.com/ads.txt',
    'https://fastimgtool.com/robots.txt',
    'https://fastimgtool.com/sitemap.xml',
    'https://fastimgtool.com/sitemap-part5-guides.xml',
    'https://www.fastimgtool.com/',
    'http://fastimgtool.com/',
    'https://fastimgtool.com/tools/image-blur/',
    'https://fastimgtool.com/tools/image-resizer/',
    'https://fastimgtool.com/assets/og-image.png',
    'https://fastimgtool.com/assets/images/tools/jpg-to-png-screenshot.jpg',
    'https://fastimgtool.com/assets/images/tools/image-compressor-screenshot.jpg',
    'https://fastimgtool.com/this-page-does-not-exist-az-404',
    'https://fastimgtool.com/scripts/az-quality-tests.js',
    'https://fastimgtool.com/templates/tool-template.html',
    'https://fastimgtool.com/compress-image-online-free.html',
    'https://fastimgtool.com/assets/favicon.png',
  ];
  const liveTargets = [...new Set([...sitemapUrls, ...extraLive])];
  const live = [];
  for (const url of liveTargets) {
    live.push(await fetchUrl(url));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    sitemapCount: sitemapUrls.length,
    publicHtmlCount: publicHtml.length,
    toolDirCount: toolDirs.length,
    dupTitles,
    missingConsent: missingConsent.map((p) => p.rel),
    missingAdsense: missingAdsense.map((p) => ({ rel: p.rel, robots: p.robots })),
    wrongPub: wrongPub.map((p) => p.rel),
    multiLoader: multiLoader.map((p) => ({ rel: p.rel, n: p.adsby })),
    screenshotLocalMissing: screenshotLocal.filter((s) => !s.exists),
    leftovers,
    clonedFiller,
    pages: publicHtml,
    live: live.map((r) => ({
      url: r.url,
      status: r.status,
      type: r.type,
      bytes: r.bytes,
      location: r.location,
      robotsHeader: r.headers['x-robots-tag'] || '',
      has990: /ca-pub-8332278519903196/.test(r.body || ''),
      has390: /ca-pub-8332278513903196/.test(r.body || ''),
      adsby: ((r.body || '').match(/adsbygoogle\.js/g) || []).length,
      noindex: /noindex/i.test(r.body || ''),
      title: extract(r.body || '', /<title>([^<]*)<\/title>/i),
      error: r.error || '',
    })),
  };

  const out = path.join(ROOT, 'reports', 'az-full-audit.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2));

  console.log('LOCAL public HTML', publicHtml.length);
  console.log('TOOLS', toolDirs.length);
  console.log('SITEMAP', sitemapUrls.length);
  console.log('DUP TITLES', dupTitles.length, JSON.stringify(dupTitles));
  console.log('MISSING CONSENT', missingConsent.map((p) => p.rel).join(', ') || 'none');
  console.log('MISSING ADSENSE', missingAdsense.map((p) => p.rel).join(', ') || 'none');
  console.log('WRONG PUB', wrongPub.map((p) => p.rel).join(', ') || 'none');
  console.log('MULTI LOADER', JSON.stringify(multiLoader));
  console.log('SCREENSHOTS MISSING LOCAL', screenshotLocal.filter((s) => !s.exists).length);
  console.log('LEFTOVERS', JSON.stringify(leftovers));
  console.log('CLONED FILLER', JSON.stringify(clonedFiller.filter((c) => c.has)));
  console.log('--- LIVE ---');
  for (const r of report.live) {
    console.log(
      r.status,
      r.bytes,
      r.has990 ? '990' : 'no990',
      'adsby=' + r.adsby,
      r.noindex ? 'noindex' : '',
      r.robotsHeader,
      r.location,
      r.url
    );
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
