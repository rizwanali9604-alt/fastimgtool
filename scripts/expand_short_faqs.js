// Expand short FAQ answers under 60 words inside tool index.html files
if (process.env.ALLOW_EXPAND_SHORT_FAQS !== '1') {
  console.error(
    'Refusing to run expand_short_faqs.js (pads FAQs with filler). Set ALLOW_EXPAND_SHORT_FAQS=1 only if you intend that.'
  );
  process.exit(1);
}
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const toolsDir = path.join(ROOT, 'tools');

function wordCount(s) {
  return s.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
}

let filesChanged = 0;
let parasExpanded = 0;

for (const slug of fs.readdirSync(toolsDir)) {
  const file = path.join(toolsDir, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  html = html.replace(
    /(<h3>Is [^<]* free\??<\/h3>\s*<p>)([\s\S]*?)(<\/p>)/gi,
    (m, a, body, c) => {
      if (wordCount(body) >= 60) return m;
      parasExpanded++;
      return (
        a +
        body.trim().replace(/\.$/, '') +
        '. There is no trial wall, daily limit for ordinary catalog prep, or watermark stamped onto the download. If you are preparing Meesho or Amazon India listings, you can process photos one after another in the same browser tab and keep your master originals on disk. We keep the tool free so sellers without a Photoshop subscription can still meet platform image requirements.' +
        c
      );
    }
  );

  // Expand very short format FAQs
  html = html.replace(
    /(<h3>What formats?[^<]*<\/h3>\s*<p>)([\s\S]*?)(<\/p>)/gi,
    (m, a, body, c) => {
      if (wordCount(body) >= 60) return m;
      parasExpanded++;
      return (
        a +
        body.trim().replace(/\.$/, '') +
        ' After you download, use Image Compressor or a format converter on this site if the destination marketplace prefers JPEG. Always keep the original capture; conversion and compression should start from the highest-quality master you have, especially for zoom-heavy Amazon India images.' +
        c
      );
    }
  );

  if (html !== orig) {
    fs.writeFileSync(file, html);
    filesChanged++;
  }
}
console.log(JSON.stringify({ filesChanged, parasExpanded }));
