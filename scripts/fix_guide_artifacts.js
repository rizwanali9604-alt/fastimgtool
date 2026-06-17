// Fix AI-generation artifacts in consolidated guides:
//  1) Remove empty stub headings like "<h3>Title: Conclusion</h3>"
//  2) Demote duplicate in-content <h1> to <h2> (page already has guide-title H1)
const fs = require('fs');
const path = require('path');

const GUIDES = path.join(__dirname, '..', 'guides');

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

let changed = 0;
for (const file of walk(GUIDES)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // 1) Drop stub headings (h2-h4) whose text ends in ": Conclusion/FAQ/Step-by-Step/Introduction"
  html = html.replace(/<h([2-4])>[^<]*?:\s*(Conclusion|FAQ|Step-by-Step|Introduction)<\/h\1>\s*/g, '');

  // 2) Demote bare in-content <h1>text</h1> to <h2> (guide-title uses <h1 class="...">, untouched)
  html = html.replace(/<h1>([^<]*)<\/h1>/g, '<h2>$1</h2>');

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}
console.log(`Guide files cleaned of artifacts: ${changed}`);
