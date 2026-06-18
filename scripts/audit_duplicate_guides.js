#!/usr/bin/env node
/**
 * FIX 10: Audit duplicate pattern guides and noindex clones with >60% identical text.
 */
const fs = require('fs');
const path = require('path');

const GUIDES = path.join(__dirname, '..', 'guides');
const KEEP_INDEXABLE = new Set([
  'meesho-product-image-size-600x600-under-50kb.html',
  'amazon-india-product-image-requirements.html',
  'shopify-product-images-webp-compression.html',
]);

const PATTERNS = [
  /-for-amazon-listings\.html$/,
  /-for-meesho-sellers\.html$/,
  /-for-social-media\.html$/,
  /-common-mistakes\.html$/,
];

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function paragraphs(text) {
  return text.split(/(?<=[.!?])\s+/).filter((p) => p.length > 40);
}

function jaccard(a, b) {
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  const union = sa.size + sb.size - inter;
  return union ? inter / union : 0;
}

function toolKey(filename) {
  for (const re of PATTERNS) {
    if (re.test(filename)) return filename.replace(re, '');
  }
  return null;
}

function hasNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
}

function addNoindex(html) {
  if (hasNoindex(html)) return html;
  return html.replace(
    /(<head[^>]*>)/i,
    '$1\n    <meta name="robots" content="noindex, nofollow">'
  );
}

const files = fs.readdirSync(GUIDES).filter((f) => f.endsWith('.html'));
const groups = {};

for (const f of files) {
  const key = toolKey(f);
  if (!key) continue;
  if (!groups[key]) groups[key] = [];
  groups[key].push(f);
}

let noindexed = 0;
let kept = 0;
let groupsChecked = 0;
const report = [];

for (const [key, group] of Object.entries(groups)) {
  if (group.length < 2) continue;
  groupsChecked++;

  const data = group.map((f) => {
    const html = fs.readFileSync(path.join(GUIDES, f), 'utf8');
    const text = stripHtml(html);
  const paras = paragraphs(text);
    return { f, html, text, paras, words: text.split(' ').length };
  });

  // Pick keeper: longest unique content, prefer protected names
  data.sort((a, b) => {
    const ap = KEEP_INDEXABLE.has(a.f) ? 1 : 0;
    const bp = KEEP_INDEXABLE.has(b.f) ? 1 : 0;
    if (ap !== bp) return bp - ap;
    return b.words - a.words;
  });
  const keeper = data[0];

  for (const item of data) {
    if (KEEP_INDEXABLE.has(item.f)) {
      kept++;
      report.push(`KEEP (protected): ${item.f}`);
      continue;
    }

    const sim = jaccard(item.paras, keeper.paras);
    const textSim =
      item.text.length && keeper.text.length
        ? Math.min(item.text.length, keeper.text.length) /
          Math.max(item.text.length, keeper.text.length)
        : 0;

    const duplicate = sim >= 0.6 || (textSim > 0.85 && item.words > 100);

    if (item.f === keeper.f) {
      kept++;
      report.push(`KEEP (primary): ${item.f}`);
      continue;
    }

    if (duplicate) {
      const updated = addNoindex(item.html);
      if (updated !== item.html) {
        fs.writeFileSync(path.join(GUIDES, item.f), updated, 'utf8');
        noindexed++;
        report.push(`NOINDEX (${Math.round(sim * 100)}% para sim): ${item.f} → keeper ${keeper.f}`);
      } else {
        report.push(`ALREADY noindex: ${item.f}`);
      }
    } else {
      kept++;
      report.push(`KEEP (unique): ${item.f}`);
    }
  }
}

const out = {
  groupsChecked,
  noindexedThisRun: noindexed,
  report,
};
fs.writeFileSync(
  path.join(__dirname, '..', 'reports', 'duplicate-guide-audit.json'),
  JSON.stringify(out, null, 2)
);

console.log(`Groups checked: ${groupsChecked}`);
console.log(`Noindexed this run: ${noindexed}`);
console.log(`Report: reports/duplicate-guide-audit.json`);
report.forEach((l) => console.log(l));
