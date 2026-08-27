/**
 * Add AdSense to HTML files missing the publisher script.
 * Run: node scripts/adsense-audit.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CLIENT = 'ca-pub-8332278519903196';
const SCRIPT =
    `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}" crossorigin="anonymous"></script>`;
const AD_UNIT = `
<div class="ad-container">
  <ins class="adsbygoogle" style="display:block" data-ad-client="${CLIENT}" data-ad-slot="8664200172" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>`;

function walk(dir, list) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach((name) => {
        const p = path.join(dir, name);
        if (fs.statSync(p).isDirectory()) walk(p, list);
        else if (name.endsWith('.html')) list.push(p);
    });
}

const files = [];
walk(ROOT, files);
files.push(...['about.html', 'contact.html', 'privacy.html', 'terms.html', 'faq.html', 'community.html', 'newsletter.html']
    .map((f) => path.join(ROOT, f))
    .filter((p) => fs.existsSync(p)));

let had = 0;
let fixed = 0;
const fixedList = [];

files.forEach((file) => {
    if (file.includes('node_modules') || file.includes('templates')) return;
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes(CLIENT)) {
        had++;
        return;
    }
    if (html.includes('</head>')) {
        html = html.replace('</head>', `    ${SCRIPT}\n</head>`);
    }
    if (html.includes('<body>') && !html.includes('adsbygoogle')) {
        html = html.replace('<body>', `<body>\n${AD_UNIT}`);
    } else if (html.includes('<body ') && !html.includes('adsbygoogle')) {
        html = html.replace(/<body[^>]*>/, (m) => m + AD_UNIT);
    }
    fs.writeFileSync(file, html, 'utf8');
    fixed++;
    fixedList.push(path.relative(ROOT, file));
});

console.log('ADSENSE AUDIT COMPLETE');
console.log('Pages that had AdSense:', had);
console.log('Pages fixed:', fixed);
fixedList.forEach((f) => console.log('  +', f));
