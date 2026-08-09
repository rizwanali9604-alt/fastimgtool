const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const root = __dirname + '/..';

const files = [
  'blog/how-to-resize-images-for-social-media.html',
  'blog/how-to-compress-images-for-email.html',
  'blog/how-to-create-a-favicon.html',
  'blog/webp-vs-jpg-vs-png.html',
];
const re = /<a href="#">image resizer and compressor<\/a>/g;
const to =
  '<a href="/tools/image-resizer/">image resizer</a> and <a href="/tools/image-compressor/">compressor</a>';
for (const f of files) {
  const p = path.join(root, f);
  let h = fs.readFileSync(p, 'utf8');
  const n = (h.match(re) || []).length;
  h = h.replace(re, to);
  fs.writeFileSync(p, h);
  console.log(f, 'replaced', n);
}

let c = fs.readFileSync(path.join(root, 'community.html'), 'utf8');
c = c.replace(
  /<li><strong>📢 Follow us on social media:<\/strong> <a href="#">Twitter<\/a> \| <a href="#">Facebook<\/a> \(links to be added\)\.<\/li>/,
  '<li><strong>📢 Social updates:</strong> Follow new tool announcements on our <a href="/blog/">blog</a>.</li>'
);
fs.writeFileSync(path.join(root, 'community.html'), c);
console.log('community has href=#', c.includes('href="#"'));

function count(pattern, globDir) {
  try {
    return execSync(`rg -l ${JSON.stringify(pattern)} --glob "*.html" ${globDir}`, {
      cwd: root,
      encoding: 'utf8',
    })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean).length;
  } catch (e) {
    return 0;
  }
}

const guides = fs.readdirSync(path.join(root, 'guides')).filter((f) => f.endsWith('.html'));
const pillars = guides.filter((f) =>
  fs.readFileSync(path.join(root, 'guides', f), 'utf8').includes('pillar-merged')
);
const powerful = guides
  .concat(
    fs
      .readdirSync(path.join(root, 'tools'))
      .filter((d) => fs.existsSync(path.join(root, 'tools', d, 'index.html')))
      .map((d) => path.join('tools', d, 'index.html'))
  )
  .filter((f) => {
    const full = f.startsWith('tools') ? path.join(root, f) : path.join(root, 'guides', f);
    try {
      return fs.readFileSync(full, 'utf8').includes('powerful online tool designed');
    } catch {
      return false;
    }
  });

console.log(
  JSON.stringify(
    {
      guideHtmlCount: guides.length,
      pillarRemaining: pillars.length,
      powerfulRemaining: powerful,
      compressorClean: !fs
        .readFileSync(path.join(root, 'tools/image-compressor/index.html'), 'utf8')
        .includes('powerful online tool designed'),
      blurToolHasWhatIs: fs
        .readFileSync(path.join(root, 'tools/image-blur/index.html'), 'utf8')
        .includes('What is Image Blur?'),
      blogHash: files.map((f) => ({
        f,
        hash: fs.readFileSync(path.join(root, f), 'utf8').includes('href="#"'),
      })),
    },
    null,
    2
  )
);
