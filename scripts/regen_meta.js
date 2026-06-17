// Safe regenerator: rebuilds sitemap.xml + tools/index.html + guides/index.html
// from cleaned data ONLY. Does NOT regenerate individual tool/guide pages.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOMAIN = 'https://fastimgtool.com';
const today = new Date().toISOString().split('T')[0];

const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'tools.json'), 'utf8'));
const guides = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'guides.json'), 'utf8'));
const blog = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'blog-posts.json'), 'utf8'));

// ---- sitemap.xml ----
const u = (loc, pri, freq) => `  <url><loc>${DOMAIN}${loc}</loc><priority>${pri}</priority><changefreq>${freq}</changefreq><lastmod>${today}</lastmod></url>`;
const urls = [u('/', '1.0', 'weekly'), u('/tools/', '0.9', 'weekly'), u('/guides/', '0.9', 'weekly'), u('/blog/', '0.8', 'weekly'), u('/affiliate/', '0.5', 'monthly')];
['/about.html', '/contact.html', '/privacy.html', '/terms.html', '/faq.html', '/community.html'].forEach(p => urls.push(u(p, '0.5', 'monthly')));
tools.forEach(t => urls.push(u(`/tools/${t.slug}/`, '0.8', 'monthly')));
guides.forEach(g => urls.push(u(g.url, '0.7', 'monthly')));
blog.forEach(b => urls.push(u(b.url, '0.6', 'monthly')));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

// ---- tools/index.html ----
const toolsTpl = fs.readFileSync(path.join(ROOT, 'templates', 'tools-listing-template.html'), 'utf8');
const toolCards = tools.map(t => `
        <div class="tool-card">
            <h3>${t.title}</h3>
            <p>${t.description}</p>
            <a href="/tools/${t.slug}/" class="btn">Open Tool</a>
        </div>
    `).join('');
fs.writeFileSync(path.join(ROOT, 'tools', 'index.html'), toolsTpl.replace('{{tools}}', toolCards), 'utf8');

// ---- guides/index.html ----
const guidesTpl = fs.readFileSync(path.join(ROOT, 'templates', 'guides-listing-template.html'), 'utf8');
const guideCards = guides.map(g => `
        <a href="${g.url}" class="tool-card-h">
            <div class="tool-icon-wrap">📖</div>
            <div class="tool-info">
                <div class="tool-name">${g.title}</div>
                <div class="tool-desc">${g.description || 'Learn more...'}</div>
            </div>
            <div class="tool-arrow">→</div>
        </a>
    `).join('');
fs.writeFileSync(path.join(ROOT, 'guides', 'index.html'), guidesTpl.replace('{{guides}}', guideCards), 'utf8');

console.log(`sitemap.xml: ${urls.length} URLs`);
console.log(`tools/index.html: ${tools.length} tools`);
console.log(`guides/index.html: ${guides.length} guides`);
