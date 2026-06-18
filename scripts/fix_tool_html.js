const fs = require('fs');
const path = require('path');
const tools = path.join(__dirname, '..', 'tools');
let n = 0;
const re = /(<a href="https:\/\/www\.amazon\.in\/s\?k=photography\+lighting\+kit[^>]*>Shop Amazon →<\/a>\s*<\/div>)\s*<\/div>(\s*<\/div>\s*<\/main>)/g;
for (const d of fs.readdirSync(tools)) {
  const f = path.join(tools, d, 'index.html');
  if (!fs.existsSync(f)) continue;
  let h = fs.readFileSync(f, 'utf8');
  const next = h.replace(re, '$1$2');
  if (next !== h) {
    fs.writeFileSync(f, next);
    n++;
    console.log('fixed', d);
  }
}
console.log('done', n);
