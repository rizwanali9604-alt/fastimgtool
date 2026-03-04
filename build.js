// ToolForge Builder
const fs = require('fs');
const path = require('path');

const DATA_FILE = 'data/tools.json';
const TEMPLATE_FILE = 'templates/tool-template.html';
const OUTPUT_DIR = 'tools';
const DOMAIN = 'https://fastimgtool.com';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const tools = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

tools.forEach(tool => {
    const slug = tool.slug;
    const title = tool.title;
    const description = tool.description;

    const toolDir = path.join(OUTPUT_DIR, slug);
    if (!fs.existsSync(toolDir)) {
        fs.mkdirSync(toolDir, { recursive: true });
    }

    let page = template
        .replace(/\{\{title\}\}/g, title)
        .replace(/\{\{description\}\}/g, description)
        .replace(/\{\{slug\}\}/g, slug);

    const outputPath = path.join(toolDir, 'index.html');
    fs.writeFileSync(outputPath, page, 'utf8');
    console.log('Generated: ' + outputPath);
});

const today = new Date().toISOString().split('T')[0];
const urls = tools.map(tool => `
  <url>
    <loc>${DOMAIN}/tools/${tool.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
urls +
'\n</urlset>';

fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
console.log('Sitemap generated');