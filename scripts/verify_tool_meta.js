const fs = require('fs');
const path = require('path');

const TOOLS = path.join(__dirname, '..', 'tools');
let bad = 0;

for (const slug of fs.readdirSync(TOOLS)) {
  const file = path.join(TOOLS, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  const m = fs.readFileSync(file, 'utf8').match(/meta name="description" content="([^"]*)"/);
  if (!m) continue;
  const len = m[1].length;
  const ok = len >= 120 && len <= 155 && /free|no signup/i.test(m[1]) && /seller|Meesho|Amazon|Shopify|creator/i.test(m[1]);
  console.log(`${ok ? 'OK' : 'BAD'} ${slug}: ${len} chars`);
  if (!ok) bad++;
}
process.exit(bad ? 1 : 0);
