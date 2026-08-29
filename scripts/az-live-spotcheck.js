#!/usr/bin/env node
'use strict';
const https = require('https');
const http = require('http');

function fetchUrl(url, redirects) {
  redirects = redirects || 0;
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(
      url,
      { method: 'GET', headers: { 'User-Agent': 'FastImageTool-AZ-Continue/1.0' } },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const buf = Buffer.concat(chunks);
          const loc = res.headers.location;
          if (res.statusCode >= 300 && res.statusCode < 400 && loc && redirects < 5) {
            const next = loc.startsWith('http') ? loc : new URL(loc, url).href;
            return fetchUrl(next, redirects + 1).then((inner) =>
              resolve(Object.assign({ via: res.statusCode, from: url }, inner))
            );
          }
          resolve({
            url,
            status: res.statusCode,
            type: res.headers['content-type'] || '',
            robots: res.headers['x-robots-tag'] || '',
            bytes: buf.length,
            body: buf.toString('utf8'),
            location: loc || '',
          });
        });
      }
    );
    req.on('error', (e) => resolve({ url, status: 0, error: String(e), body: '', type: '', robots: '' }));
    req.setTimeout(20000, () => {
      req.destroy();
      resolve({ url, status: 0, error: 'timeout', body: '', type: '', robots: '' });
    });
    req.end();
  });
}

function flags(body) {
  return {
    has990: /ca-pub-8332278519903196/.test(body),
    has390: /ca-pub-8332278513903196/.test(body),
    adsby: (body.match(/adsbygoogle\.js/g) || []).length,
    noindex: /noindex/i.test(body),
    setSize: /function setSize/.test(body),
    resizerJs: /image-resizer\/tool\.js/.test(body),
    lunr: /unpkg\.com\/lunr/.test(body),
    falseTransp: /Preserves transparency/i.test(body),
    worker: /Web Worker/.test(body),
    b64: /id="base64Input"/.test(body),
    filters: /Simple canvas filters/.test(body),
    title: (body.match(/<title>([^<]*)<\/title>/i) || [,''])[1],
  };
}

(async () => {
  const urls = [
    'https://fastimgtool.com/ads.txt',
    'https://fastimgtool.com/robots.txt',
    'https://fastimgtool.com/sitemap.xml',
    'https://fastimgtool.com/sitemap-part5-guides.xml',
    'https://fastimgtool.com/guides_backup/index.html',
    'https://fastimgtool.com/image-sitemap.xml',
    'https://fastimgtool.com/',
    'https://fastimgtool.com/tools/',
    'https://fastimgtool.com/tools/image-resizer/',
    'https://fastimgtool.com/tools/image-compressor/',
    'https://fastimgtool.com/tools/jpg-to-png/',
    'https://fastimgtool.com/tools/heic-to-jpg/tool.js',
    'https://fastimgtool.com/tools/tiff-to-jpg/tool.js',
    'https://fastimgtool.com/tools/base64-to-image/',
    'https://fastimgtool.com/tools/image-blur/',
    'https://fastimgtool.com/about',
    'https://fastimgtool.com/privacy',
    'https://fastimgtool.com/affiliate/',
  ];
  for (const u of urls) {
    const r = await fetchUrl(u);
    const f = flags(r.body || '');
    const extra = [];
    if (f.has990) extra.push('990');
    if (f.has390) extra.push('390');
    extra.push('adsby=' + f.adsby);
    if (f.noindex) extra.push('noindex');
    if (f.setSize) extra.push('SETSIZE');
    if (f.resizerJs) extra.push('resizerJS');
    if (f.lunr) extra.push('LUNR');
    if (f.falseTransp) extra.push('FALSETRANS');
    if (f.worker) extra.push('worker');
    if (f.b64) extra.push('b64');
    if (f.filters) extra.push('filtersH2');
    if (r.robots) extra.push('xr=' + r.robots);
    console.log([r.status, r.bytes, extra.join(','), r.url].join('\t'));
    if (u.endsWith('/ads.txt') || u.endsWith('/robots.txt')) {
      console.log('---BODY---\n' + (r.body || '').slice(0, 400) + '\n---');
    }
  }
})();
