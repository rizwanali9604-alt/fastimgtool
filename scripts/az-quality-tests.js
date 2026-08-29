#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ROOT = path.join(__dirname, '..');
const tmp = path.join(ROOT, 'scripts', '_az_tmp');
fs.mkdirSync(tmp, { recursive: true });

let pass = 0;
let fail = 0;
function ok(name, cond, detail) {
  if (cond) {
    pass++;
    console.log('PASS', name);
  } else {
    fail++;
    console.log('FAIL', name, detail || '');
  }
}

function matchesFile(file, options) {
  if (!file) return false;
  options = options || {};
  var type = (file.type || '').toLowerCase();
  var name = (file.name || '').toLowerCase();
  if (options.types && options.types.length) {
    for (var i = 0; i < options.types.length; i++) {
      if (type === options.types[i].toLowerCase()) return true;
    }
  }
  if (options.exts && options.exts.length) {
    for (var j = 0; j < options.exts.length; j++) {
      if (name.endsWith(options.exts[j].toLowerCase())) return true;
    }
  }
  return false;
}

ok(
  'matchesFile jpg-to-png rejects png',
  !matchesFile({ type: 'image/png', name: 'a.png' }, { types: ['image/jpeg'], exts: ['.jpg', '.jpeg'] })
);
ok(
  'matchesFile jpg-to-png accepts jpeg empty mime',
  matchesFile({ type: '', name: 'shot.JPEG' }, { types: ['image/jpeg'], exts: ['.jpg', '.jpeg', '.jpe'] })
);
ok(
  'matchesFile tiff by ext',
  matchesFile({ type: '', name: 'scan.tiff' }, { exts: ['.tif', '.tiff'] })
);

function coverBox(iw, ih, tw, th) {
  const scale = Math.max(tw / iw, th / ih);
  const sw = tw / scale;
  const sh = th / scale;
  return { sw, sh, sx: (iw - sw) / 2, sy: (ih - sh) / 2 };
}
const box = coverBox(800, 600, 600, 600);
ok('cover crop 800x600 -> 600x600 uses 600x600 source window', Math.abs(box.sw - 600) < 0.01 && Math.abs(box.sh - 600) < 0.01);
ok('cover crop is centered on x', Math.abs(box.sx - 100) < 0.01);

(async () => {
  const png = await sharp({
    create: { width: 80, height: 40, channels: 4, background: { r: 0, g: 255, b: 0, alpha: 0 } },
  })
    .png()
    .toBuffer();
  const jpg = await sharp(png)
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toBuffer();
  const meta = await sharp(jpg).metadata();
  ok('png-to-jpg flatten produces jpeg', meta.format === 'jpeg');
  ok('jpeg has no alpha', meta.channels === 3);

  const webp = await sharp({
    create: { width: 32, height: 32, channels: 3, background: { r: 10, g: 20, b: 30 } },
  })
    .webp({ quality: 80 })
    .toBuffer();
  const webpJpg = await sharp(webp).jpeg().toBuffer();
  ok('webp-to-jpg proxy encode', (await sharp(webpJpg).metadata()).format === 'jpeg');

  const gif = await sharp({
    create: { width: 16, height: 16, channels: 3, background: { r: 255, g: 0, b: 0 } },
  })
    .gif()
    .toBuffer();
  const gifPng = await sharp(gif).png().toBuffer();
  ok('gif-to-png first-frame proxy', (await sharp(gifPng).metadata()).format === 'png');

  // This sharp/libvips build has no BMP encoder or decoder. Prove the converter exists instead.
  const bmpJs = fs.readFileSync(path.join(ROOT, 'tools/bmp-to-jpg/tool.js'), 'utf8');
  ok('bmp-to-jpg tool.js present', bmpJs.includes("exts: ['.bmp']") && bmpJs.includes('image/jpeg'));

  const tiff = await sharp({
    create: { width: 8, height: 8, channels: 3, background: { r: 1, g: 2, b: 3 } },
  })
    .tiff()
    .toBuffer();
  ok('tiff sample encodes', (await sharp(tiff).metadata()).format === 'tiff');
  ok('utif vendor present', fs.existsSync(path.join(ROOT, 'assets/vendor/utif.min.js')));
  ok('heic2any vendor present', fs.existsSync(path.join(ROOT, 'assets/vendor/heic2any.min.js')));
  ok(
    'compressor vendor present',
    fs.existsSync(path.join(ROOT, 'assets/vendor/browser-image-compression.js'))
  );

  const core = fs.readFileSync(path.join(ROOT, 'assets/js/tool-core.js'), 'utf8');
  ok('tool-core keyboard handler', core.includes("e.key === 'Enter'"));
  ok('no image fetch in tool-core', !/fetch\(/.test(core));

  const related = fs.readFileSync(path.join(ROOT, 'assets/js/related-tools.js'), 'utf8');
  ok('related-tools skips noindex slugs', related.includes('image-sepia') && related.includes('NOINDEX'));

  const resizerHtml = fs.readFileSync(path.join(ROOT, 'tools/image-resizer/index.html'), 'utf8');
  ok('resizer loads tool.js', resizerHtml.includes('/tools/image-resizer/tool.js'));
  ok('resizer has no stretch inline setSize', !resizerHtml.includes('function setSize'));
  const resizerJs = fs.readFileSync(path.join(ROOT, 'tools/image-resizer/tool.js'), 'utf8');
  ok('resizer coverMode', resizerJs.includes('coverMode = true') && resizerJs.includes('function drawCover'));

  const ads = fs.readFileSync(path.join(ROOT, 'ads.txt'), 'utf8');
  ok('ads.txt 990', ads.includes('pub-8332278519903196') && !ads.includes('851390'));

  const indexable = [
    'jpg-to-png', 'png-to-jpg', 'webp-to-jpg', 'png-to-webp', 'gif-to-png',
    'bmp-to-jpg', 'tiff-to-jpg', 'heic-to-jpg', 'image-to-webp', 'image-to-base64',
    'base64-to-image', 'flip-image', 'image-crop', 'rotate-image', 'image-resizer',
    'image-compressor',
  ];
  const generic = 'Processing is designed to run in your browser. Your images are not uploaded to a FastImageTool account.';
  for (const slug of indexable) {
    const html = fs.readFileSync(path.join(ROOT, 'tools', slug, 'index.html'), 'utf8');
    ok(slug + ' no cloned privacy filler', !html.includes(generic));
    ok(slug + ' adsense 990', html.includes('ca-pub-8332278519903196'));
    ok(slug + ' one adsbygoogle.js', (html.match(/adsbygoogle\.js/g) || []).length === 1);
    ok(slug + ' static related href', html.includes('id="related-tools-container"') && html.includes('/tools/'));
  }

  const jpgHtml = fs.readFileSync(path.join(ROOT, 'tools/jpg-to-png/index.html'), 'utf8');
  ok('jpg-to-png accept jpeg', jpgHtml.includes('accept=".jpg,.jpeg,image/jpeg"'));
  const pngHtml = fs.readFileSync(path.join(ROOT, 'tools/png-to-jpg/index.html'), 'utf8');
  ok('png-to-jpg accept png', pngHtml.includes('accept=".png,image/png"'));

  const aff = fs.readFileSync(path.join(ROOT, 'affiliate/index.html'), 'utf8');
  ok('affiliate consent-boot', aff.includes('consent-boot.js') && aff.includes('consent-ui.js'));

  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  ok('sitemap omits blur', !sitemap.includes('/tools/image-blur/'));
  ok('sitemap has compressor', sitemap.includes('/tools/image-compressor/'));
  ok('no leftover part5 sitemap file', !fs.existsSync(path.join(ROOT, 'sitemap-part5-guides.xml')));
  ok('no leftover image-sitemap file', !fs.existsSync(path.join(ROOT, 'image-sitemap.xml')));
  ok('no guides_backup directory in tree', !fs.existsSync(path.join(ROOT, 'guides_backup')));

  const heicJs = fs.readFileSync(path.join(ROOT, 'tools/heic-to-jpg/tool.js'), 'utf8');
  ok('heic uses setupImageTool', heicJs.includes('setupImageTool') && heicJs.includes("loadAs: 'arrayBuffer'"));
  const tiffJs = fs.readFileSync(path.join(ROOT, 'tools/tiff-to-jpg/tool.js'), 'utf8');
  ok('tiff uses setupImageTool', tiffJs.includes('setupImageTool') && tiffJs.includes("loadAs: 'arrayBuffer'"));

  const toolsIndex = fs.readFileSync(path.join(ROOT, 'tools/index.html'), 'utf8');
  ok('tools index no false jpg transparency', !/Preserves transparency/i.test(toolsIndex));
  ok('tools index center-crop copy', /Center-crop/i.test(toolsIndex));

  const b64 = fs.readFileSync(path.join(ROOT, 'tools/base64-to-image/index.html'), 'utf8');
  ok('base64 has paste textarea', b64.includes('id="base64Input"') && !b64.includes('id="uploadZone"'));

  const comp = fs.readFileSync(path.join(ROOT, 'tools/image-compressor/index.html'), 'utf8');
  ok('compressor unique worker copy', comp.includes('Web Worker') && comp.includes('browser-image-compression'));

  const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  ok('homepage no lunr cdn', !home.includes('unpkg.com/lunr') && !home.includes('lunr.min.js'));
  ok('homepage search has label', home.includes('for="searchInput"'));

  ok('compressor has no 24-tool strip', !comp.includes('id="toolNav"'));
  const navJs = fs.readFileSync(path.join(ROOT, 'assets/js/nav.js'), 'utf8');
  ok('nav.js skips noindex slugs', navJs.includes('NOINDEX') && navJs.includes("getElementById('toolNav')"));
  ok('tool-core live region', core.includes("aria-live', 'polite'") || core.includes('aria-live'));

  const faq = fs.readFileSync(path.join(ROOT, 'faq.html'), 'utf8');
  ok('faq does not overclaim never leave device', !/never leave your device/i.test(faq));

  const og = await sharp(path.join(ROOT, 'assets/og-image.png')).metadata();
  ok('og image 1200x630', og.width === 1200 && og.height === 630);

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('RESULT', pass, 'passed', fail, 'failed');
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
