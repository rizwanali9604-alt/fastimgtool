#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LEGACY = path.join(ROOT, 'scripts', 'legacy-data');

const MOVE = [
  'guide-data-backup.json',
  'guide-data-extra.json',
  'guide-data.json',
  'guide-data.backup-20260402-155644.json',
  'blog-topics.json',
  'tool-content.json',
  'consolidation-report.json',
  'pillar-overrides.json',
  'site-config.json',
];

if (!fs.existsSync(LEGACY)) fs.mkdirSync(LEGACY, { recursive: true });

MOVE.forEach((name) => {
  const from = path.join(ROOT, 'data', name);
  const to = path.join(LEGACY, name);
  if (!fs.existsSync(from)) return;
  fs.renameSync(from, to);
  console.log('moved', name, '→ scripts/legacy-data/');
});

const BLOG_DELETE = [
  'how-to-compress-images-for-email.html',
  'how-to-resize-images-for-social-media.html',
  'webp-vs-jpg-vs-png.html',
];
BLOG_DELETE.forEach((f) => {
  const p = path.join(ROOT, 'blog', f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log('deleted blog/' + f);
  }
});

console.log('pass2 move/delete done');
