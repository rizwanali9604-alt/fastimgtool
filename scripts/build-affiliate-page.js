/**
 * Build affiliate/index.html from data/affiliate-products.json
 * Run: node scripts/build-affiliate-page.js
 */
const fs = require('fs');
const path = require('path');

const TAG = 'fastimgtool78-21';
const products = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/affiliate-products.json'), 'utf8'));

function amazonUrl(search) {
    return `https://www.amazon.in/s?k=${encodeURIComponent(search.replace(/\+/g, ' '))}&tag=${TAG}`;
}

const byCat = {};
products.forEach((p) => {
    if (!byCat[p.category]) byCat[p.category] = [];
    byCat[p.category].push(p);
});

let cards = '';
Object.entries(byCat).forEach(([cat, items]) => {
    cards += `<div class="affiliate-category"><h2 class="cat-title">${items[0].emoji} ${cat}</h2><div class="affiliate-grid">`;
    items.forEach((p) => {
        const url = amazonUrl(p.search);
        const feats = p.features.map((f) => `<span>✓ ${f}</span>`).join('');
        cards += `
<a href="${url}" target="_blank" rel="noopener sponsored" class="affiliate-card">
  <div class="aff-left">
    <div class="aff-logo">${p.emoji}</div>
    <div class="aff-info">
      <div class="aff-name">${p.name}</div>
      <div class="aff-tagline">${p.tagline}</div>
      <div class="aff-stars">⭐⭐⭐⭐ <span>${p.stars}/5</span></div>
    </div>
  </div>
  <div class="aff-right">
    <div class="aff-price">${p.price}</div>
    <div class="aff-badge">${p.badge}</div>
    <span class="aff-btn">View on Amazon →</span>
  </div>
  <div class="aff-features">${feats}</div>
</a>`;
    });
    cards += '</div></div>';
});

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recommended Tools &amp; Products – FastImageTool</title>
  <meta name="description" content="Hand-picked tools and products for image creators, Amazon sellers, and Meesho sellers. Affiliate links at no extra cost to you.">
  <link rel="canonical" href="https://fastimgtool.com/affiliate/">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/overhaul.css">
  <link rel="icon" href="/assets/favicon.png">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8332278513903196" crossorigin="anonymous"></script>
</head>
<body>
  <nav class="navbar">
    <div class="logo"><a href="/">⚡ FastImageTool</a></div>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/#tools">Tools</a>
      <a href="/guides/">Guides</a>
      <a href="/affiliate/">Recommended</a>
      <a href="/tools/image-compressor/" class="nav-cta">Try Compressor →</a>
    </div>
  </nav>

  <header class="hero" style="padding:60px 20px 40px;">
    <div class="hero-inner">
      <h1 class="hero-title" style="font-size:clamp(28px,4vw,42px);">Tools &amp; Products We Recommend</h1>
      <p class="hero-subtitle">Carefully selected gear for sellers and creators who work with images every day.</p>
      <p style="font-size:13px;color:#64748B;margin-top:12px;">⚡ Amazon affiliate links (tag: ${TAG}). We may earn a commission at no extra cost to you.</p>
    </div>
  </header>

  <div class="ad-container">
    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8332278513903196" data-ad-slot="9490701260" data-ad-format="auto" data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>

  <main style="max-width:1200px;margin:0 auto;padding:20px 20px 60px;">
    ${cards}
  </main>

  <div class="ad-container">
    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8332278513903196" data-ad-slot="3445350863" data-ad-format="auto" data-full-width-responsive="true"></ins>
    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
  </div>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom" style="border:none;margin:0;padding:0;">
        <span>© 2026 FastImageTool</span>
        <span><a href="/" style="color:#64748b">Back to free tools →</a></span>
      </div>
    </div>
  </footer>
</body>
</html>`;

const outDir = path.join(__dirname, '../affiliate');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
console.log(`✅ Built affiliate/index.html with ${products.length} products`);
