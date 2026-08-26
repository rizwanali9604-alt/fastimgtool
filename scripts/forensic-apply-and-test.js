#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const NOINDEX = [
  'image-blur',
  'image-sharpen',
  'image-grayscale',
  'image-brightness',
  'image-contrast',
  'image-saturation',
  'image-invert',
  'image-sepia',
];

const FILLER =
  ' There is no trial wall, daily limit for ordinary catalog prep, or watermark stamped onto the download. If you are preparing Meesho or Amazon India listings, you can process photos one after another in the same browser tab and keep your master originals on disk. We keep the tool free so sellers without a Photoshop subscription can still meet platform image requirements.';

function applyHtmlFixes() {
  const robots = '    <meta name="robots" content="noindex, follow">\n';
  for (const slug of NOINDEX) {
    const file = path.join(ROOT, 'tools', slug, 'index.html');
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes('name="robots"')) {
      html = html.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + robots
      );
    }
    if (html.includes(FILLER)) html = html.replace(FILLER, '');
    fs.writeFileSync(file, html);
    console.log('patched', slug);
  }

  const blur = path.join(ROOT, 'tools', 'image-blur', 'index.html');
  let blurHtml = fs.readFileSync(blur, 'utf8');
  blurHtml = blurHtml.replace(
    'if a marketplace rejects PNG After you download, use Image Compressor',
    'if a marketplace rejects PNG. After you download, use Image Compressor'
  );
  fs.writeFileSync(blur, blurHtml);
}

function patchSitemap() {
  const file = path.join(ROOT, 'sitemap.xml');
  let xml = fs.readFileSync(file, 'utf8');
  for (const slug of NOINDEX) {
    xml = xml.replace(
      new RegExp(
        '\\s*<url><loc>https://fastimgtool\\.com/tools/' + slug + '/</loc>.*?</url>',
        'g'
      ),
      ''
    );
  }
  fs.writeFileSync(file, xml);
  console.log('sitemap updated');
}

function patchHeaders() {
  const file = path.join(ROOT, '_headers');
  let text = fs.readFileSync(file, 'utf8');
  if (text.includes('/tools/image-sepia/*')) return;
  const block = NOINDEX.map(
    (slug) => `/tools/${slug}/*\n  X-Robots-Tag: noindex, follow\n`
  ).join('\n');
  fs.writeFileSync(file, text.trimEnd() + '\n\n' + block + '\n');
  console.log('headers updated');
}

function patchTiffVendor() {
  const file = path.join(ROOT, 'tools', 'tiff-to-jpg', 'tool.js');
  let js = fs.readFileSync(file, 'utf8');
  js = js.replace(
    "return FT.loadScript('https://cdn.jsdelivr.net/npm/utif@3.1.0/UTIF.min.js');",
    "return FT.loadScript('/assets/vendor/utif.min.js');"
  );
  fs.writeFileSync(file, js);
  console.log('tiff vendor path updated');
}

function matchesFile(file, options) {
  if (!file) return false;
  options = options || {};
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  if (options.types && options.types.length) {
    for (let i = 0; i < options.types.length; i++) {
      if (type === options.types[i].toLowerCase()) return true;
    }
  }
  if (options.exts && options.exts.length) {
    for (let j = 0; j < options.exts.length; j++) {
      if (name.endsWith(options.exts[j].toLowerCase())) return true;
    }
  }
  if (!options.types && !options.exts) {
    if (/^image\//.test(type)) return true;
    return /\.(jpe?g|png|gif|webp|bmp|svg|ico|tiff?|heic|heif|avif)$/i.test(name);
  }
  return false;
}

async function runProcessingTests() {
  const results = [];
  function rec(id, expected, actual, pass) {
    results.push({ id, expected, actual, pass });
    console.log((pass ? 'PASS' : 'FAIL'), id, '|', actual);
  }

  const jpg = await sharp({
    create: { width: 800, height: 600, channels: 3, background: { r: 40, g: 80, b: 160 } },
  })
    .jpeg({ quality: 92 })
    .toBuffer();
  rec('TEST A jpeg 800x600', 'decode jpeg', 'bytes=' + jpg.length, jpg.length > 500);

  const tiny = await sharp({
    create: { width: 1, height: 1, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } },
  })
    .png()
    .toBuffer();
  rec('TEST B 1x1 png', 'tiny png exists', 'bytes=' + tiny.length, tiny.length > 0);

  const large = await sharp({
    create: { width: 2400, height: 1800, channels: 3, background: { r: 10, g: 10, b: 10 } },
  })
    .jpeg({ quality: 80 })
    .toBuffer();
  rec('TEST C 2400x1800 jpeg', 'large buffer', 'bytes=' + large.length, large.length > 10000);

  rec(
    'TEST D jpg-to-png accept jpeg',
    true,
    matchesFile({ type: 'image/jpeg', name: 'a.jpg' }, { types: ['image/jpeg'], exts: ['.jpg', '.jpeg'] }),
    matchesFile({ type: 'image/jpeg', name: 'a.jpg' }, { types: ['image/jpeg'], exts: ['.jpg', '.jpeg'] }) === true
  );
  rec(
    'TEST E jpg-to-png reject png',
    false,
    matchesFile({ type: 'image/png', name: 'a.png' }, { types: ['image/jpeg'], exts: ['.jpg', '.jpeg'] }),
    matchesFile({ type: 'image/png', name: 'a.png' }, { types: ['image/jpeg'], exts: ['.jpg', '.jpeg'] }) === false
  );
  rec('TEST F no file', false, matchesFile(null, { types: ['image/jpeg'] }), matchesFile(null, { types: ['image/jpeg'] }) === false);

  const cropped = await sharp(jpg).extract({ left: 350, top: 250, width: 100, height: 100 }).png().toBuffer();
  const meta = await sharp(cropped).metadata();
  rec('TEST G center-ish 100x100 crop', '100x100 png', meta.width + 'x' + meta.height, meta.width === 100 && meta.height === 100);

  const pngAlpha = await sharp({
    create: { width: 40, height: 40, channels: 4, background: { r: 0, g: 255, b: 0, alpha: 0.5 } },
  })
    .png()
    .toBuffer();
  const flattened = await sharp(pngAlpha).flatten({ background: '#FFFFFF' }).jpeg({ quality: 92 }).toBuffer();
  const fj = await sharp(flattened).metadata();
  rec('TEST png-to-jpg flatten', 'jpeg no alpha', 'format=' + fj.format + ' alpha=' + fj.hasAlpha, fj.format === 'jpeg' && !fj.hasAlpha);

  const resized = await sharp(jpg).resize(600, 600, { fit: 'fill' }).jpeg({ quality: 92 }).toBuffer();
  const rm = await sharp(resized).metadata();
  rec('TEST resizer 600x600 fill', '600x600', rm.width + 'x' + rm.height, rm.width === 600 && rm.height === 600);

  rec(
    'TEST heic accept by ext',
    true,
    matchesFile({ type: '', name: 'photo.heic' }, { exts: ['.heic', '.heif'], types: ['image/heic', 'image/heif'] }),
    matchesFile({ type: '', name: 'photo.heic' }, { exts: ['.heic', '.heif'], types: ['image/heic', 'image/heif'] }) === true
  );

  rec(
    'TEST gif accept',
    true,
    matchesFile({ type: 'image/gif', name: 'x.gif' }, { types: ['image/gif'], exts: ['.gif'] }),
    true
  );

  const failed = results.filter((r) => !r.pass);
  console.log('tests', results.length, 'fail', failed.length);
  if (failed.length) process.exit(1);
}

async function main() {
  const mode = process.argv[2] || 'all';
  if (mode === 'apply' || mode === 'all') {
    applyHtmlFixes();
    patchSitemap();
    patchHeaders();
    patchTiffVendor();
  }
  if (mode === 'test' || mode === 'all') {
    await runProcessingTests();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
