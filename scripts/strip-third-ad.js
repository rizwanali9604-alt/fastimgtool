#!/usr/bin/env node
/**
 * Keep at most 2 AdSense units on each tool page (top + mid).
 * Removes the last <ins class="adsbygoogle"> block and its wrapping divs/comment.
 */
const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', 'tools');
const UNIT_RE =
  /\s*(?:<!--[\s\S]*?[Aa]d[\s\S]*?-->\s*)?(?:<div[^>]*>\s*){1,4}<ins class="adsbygoogle"[\s\S]*?<\/ins>\s*<script>\s*\(adsbygoogle[\s\S]*?<\/script>\s*(?:<\/div>\s*){1,4}/g;

function stripLastUnit(html, file) {
  const matches = [...html.matchAll(UNIT_RE)];
  if (matches.length < 3) {
    console.log(`skip (${matches.length} units): ${file}`);
    return html;
  }
  const last = matches[matches.length - 1];
  return html.slice(0, last.index) + html.slice(last.index + last[0].length);
}

let changed = 0;
for (const name of fs.readdirSync(TOOLS_DIR)) {
  const file = path.join(TOOLS_DIR, name, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const next = stripLastUnit(html, name);
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    changed++;
    console.log('stripped last ad:', name);
  }
}
console.log(`Done. Updated ${changed} tool pages.`);
