const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function getFiles(dir, list = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'guides_backup' || e.name === 'node_modules') continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) getFiles(f, list);
    else if (e.name.endsWith('.html')) list.push(f);
  }
  return list;
}

const html = getFiles(ROOT);
const ads = 'pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
const title = [];
const noAd = [];
const badCan = [];
const badNav = [];
const toolIssues = [];

for (const f of html) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('{{title}}') && !rel.startsWith('templates/')) title.push(rel);
  if (!c.includes(ads)) noAd.push(rel);
  if (/https:\/[^/]/.test(c)) badCan.push(rel);
  const skipNav = rel.startsWith('templates/') || ['nav-tools.html', 'scripts/pin_helper.html', 'googleb8199118b9c9cbcb.html'].includes(rel);
  if (!skipNav && !c.includes('class="nav-inner"')) badNav.push(rel);
  const m = rel.match(/^tools\/([^/]+)\/index\.html$/);
  if (m && !['test-tool', 'index'].includes(m[1])) {
    if (!c.includes('#affiliate-pending')) toolIssues.push(`${rel} missing affiliate`);
    if (!c.includes('WebApplication')) toolIssues.push(`${rel} missing schema`);
  }
}

const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
console.log(JSON.stringify({
  htmlFiles: html.length,
  titleLiteral: title,
  missingAdsense: noAd,
  badCanonical: badCan,
  badNavCount: badNav.length,
  badNavSample: badNav.slice(0, 10),
  toolIssues,
  homepageCards: (idx.match(/class="tool-card"/g) || []).length,
  homeToolsJs: idx.includes('home-tools.js'),
}, null, 2));
