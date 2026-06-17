#!/usr/bin/env node
/**
 * Live site spot-check for AdSense readiness and indexing queue.
 * Usage: node scripts/spotcheck_live.js
 */
const https = require('https');

const BASE = 'https://fastimgtool.com';

const URLS = [
  '/',
  '/privacy.html',
  '/terms.html',
  '/about.html',
  '/contact.html',
  '/robots.txt',
  '/sitemap.xml',
  '/guides/resize-image-for-instagram.html',
  '/guides/resize-image-for-youtube-thumbnail.html',
  '/guides/compress-image-for-email.html',
  '/guides/how-to-compress-image-online.html',
  '/guides/how-to-resize-image-online.html',
  '/guides/resize-image-online.html',
  '/tools/image-compressor/',
  '/tools/image-resizer/',
  '/tools/jpg-to-png/',
  '/tools/png-to-jpg/',
  '/tools/image-to-webp/',
  '/guides/how-to-use-test-tool.html',
  '/tools/test-tool/',
];

function fetch(path) {
  return new Promise((resolve) => {
    const url = BASE + path;
    const req = https.get(url, { timeout: 15000 }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400,
          hasNoindex: /noindex/i.test(body),
          hasAdsense: /adsbygoogle|ca-pub-8332278513903196/.test(body),
          title: (body.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1]?.trim() || '',
          snippet: body.slice(0, 500),
        });
      });
    });
    req.on('error', (e) => resolve({ path, status: 0, ok: false, error: e.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ path, status: 0, ok: false, error: 'timeout' });
    });
  });
}

(async () => {
  console.log(`Spot-check: ${BASE}\n`);
  const results = [];
  for (const path of URLS) {
    const r = await fetch(path);
    results.push(r);
    const flag = r.ok ? 'OK' : 'FAIL';
    const extra = [
      r.hasNoindex ? 'noindex' : '',
      r.error || '',
    ]
      .filter(Boolean)
      .join(' ');
    console.log(`${flag} ${r.status || '---'} ${path} ${extra}`);
  }

  const must404 = ['/guides/how-to-use-test-tool.html', '/tools/test-tool/'];
  const removed = must404.every((p) => {
    const r = results.find((x) => x.path === p);
    if (!r) return false;
    const is404 = r.status === 404;
    const isHomepageFallback =
      r.ok && /Free Online Image Editor/i.test(r.title || '');
    return is404 || isHomepageFallback;
  });

  const policyOk = results
    .filter((r) => ['/privacy.html', '/terms.html', '/about.html', '/contact.html'].includes(r.path))
    .every((r) => r.ok);

  console.log('\n--- Summary ---');
  console.log(`Policy pages OK: ${policyOk}`);
  console.log(`Test-tool removed (404): ${removed}`);
  console.log(`Total OK: ${results.filter((r) => r.ok).length}/${results.length}`);

  const reportPath = require('path').join(__dirname, '..', 'reports', 'spotcheck-latest.json');
  require('fs').writeFileSync(
    reportPath,
    JSON.stringify({ checked_at: new Date().toISOString(), base: BASE, results }, null, 2)
  );
  console.log(`\nWrote ${reportPath}`);
})();
