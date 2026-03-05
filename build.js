// ToolForge Builder – Complete (with automatic listing pages)
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
    DOMAIN: process.env.DOMAIN || "https://fastimgtool.com",
    DATA_FILE: path.join(__dirname, "data", "tools.json"),
    TEMPLATE_FILE: path.join(__dirname, "templates", "tool-template.html"),
    OUTPUT_DIR: path.join(__dirname, "tools"),
    SITEMAP_FILE: path.join(__dirname, "sitemap.xml"),
    GUIDES_DATA_FILE: path.join(__dirname, "data", "guides.json"),
    BLOG_POSTS_FILE: path.join(__dirname, "data", "blog-posts.json"),
    TOOLS_LISTING_TEMPLATE: path.join(__dirname, "templates", "tools-listing-template.html"),
    GUIDES_LISTING_TEMPLATE: path.join(__dirname, "templates", "guides-listing-template.html"),
    BLOG_TEMPLATE: path.join(__dirname, "templates", "blog-template.html"),
};

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

// ------------------- Original Tool Generation -------------------
async function loadTools() {
    let raw;
    try {
        raw = await fs.readFile(CONFIG.DATA_FILE, 'utf8');
    } catch (err) {
        console.error(`❌ Cannot read tools.json: ${err.message}`);
        process.exit(1);
    }

    let tools;
    try {
        tools = JSON.parse(raw);
    } catch (err) {
        console.error(`❌ Invalid JSON in tools.json: ${err.message}`);
        process.exit(1);
    }

    if (!Array.isArray(tools)) {
        console.error('❌ tools.json must contain an array');
        process.exit(1);
    }

    // Basic validation (you can expand this)
    const validated = tools.filter(tool => tool.slug && tool.title && tool.description);
    if (validated.length === 0) {
        console.error('❌ No valid tools found');
        process.exit(1);
    }
    return validated;
}

async function loadTemplate() {
    let template;
    try {
        template = await fs.readFile(CONFIG.TEMPLATE_FILE, 'utf8');
    } catch (err) {
        console.error(`❌ Cannot read template file: ${err.message}`);
        process.exit(1);
    }

    // Check required placeholders
    const required = ['{{title}}', '{{description}}', '{{slug}}'];
    for (const token of required) {
        if (!template.includes(token)) {
            console.error(`❌ Template missing placeholder: ${token}`);
            process.exit(1);
        }
    }
    return template;
}

async function generatePage(tool, template) {
    const toolDir = path.join(CONFIG.OUTPUT_DIR, tool.slug);
    await ensureDir(toolDir);

    const html = template
        .replace(/\{\{title\}\}/g, tool.title)
        .replace(/\{\{description\}\}/g, tool.description)
        .replace(/\{\{slug\}\}/g, tool.slug);

    const outPath = path.join(toolDir, 'index.html');
    await fs.writeFile(outPath, html, 'utf8');
    console.log(`✅ Generated: ${outPath}`);
    return outPath;
}

async function generateSitemap(tools) {
    const today = new Date().toISOString().split('T')[0];
    const urls = tools.map(tool => `
  <url>
    <loc>${CONFIG.DOMAIN}/tools/${tool.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    await fs.writeFile(CONFIG.SITEMAP_FILE, sitemap, 'utf8');
    console.log('📄 sitemap.xml generated');
}

// ------------------- New Listing Generators -------------------
async function generateToolsListing() {
    const tools = JSON.parse(await fs.readFile(CONFIG.DATA_FILE, 'utf8'));
    const template = await fs.readFile(CONFIG.TOOLS_LISTING_TEMPLATE, 'utf8');

    const cards = tools.map(tool => `
        <div class="tool-card">
            <h3>${tool.title}</h3>
            <p>${tool.description}</p>
            <a href="/tools/${tool.slug}/" class="btn">Open Tool</a>
        </div>
    `).join('');

    const page = template.replace('{{tools}}', cards);
    const outputPath = path.join(__dirname, 'tools', 'index.html');
    await fs.writeFile(outputPath, page, 'utf8');
    console.log('✅ Generated: tools/index.html');
}

async function generateGuidesListing() {
    const guides = JSON.parse(await fs.readFile(CONFIG.GUIDES_DATA_FILE, 'utf8'));
    const template = await fs.readFile(CONFIG.GUIDES_LISTING_TEMPLATE, 'utf8');

    const cards = guides.map(guide => `
        <div class="guide-card">
            <h3><a href="${guide.url}">${guide.title}</a></h3>
            <p>${guide.description || 'Learn more...'}</p>
        </div>
    `).join('');

    const page = template.replace('{{guides}}', cards);
    const outputPath = path.join(__dirname, 'guides', 'index.html');
    await fs.writeFile(outputPath, page, 'utf8');
    console.log('✅ Generated: guides/index.html');
}

async function generateBlogIndex() {
    const posts = JSON.parse(await fs.readFile(CONFIG.BLOG_POSTS_FILE, 'utf8'));
    const template = await fs.readFile(CONFIG.BLOG_TEMPLATE, 'utf8');

    const listItems = posts.map(post => `
        <li class="post-item">
            <a href="${post.url}">${post.title}</a>
            <span class="post-date">– ${post.date}</span>
        </li>
    `).join('');

    const page = template.replace('{{posts}}', listItems);
    const outputPath = path.join(__dirname, 'blog', 'index.html');
    await ensureDir(path.dirname(outputPath)); // ensure blog folder exists
    await fs.writeFile(outputPath, page, 'utf8');
    console.log('✅ Generated: blog/index.html');
}

// ------------------- Main Build -------------------
async function build() {
    console.log('\n🚀 ToolForge Builder Starting\n');
    const start = Date.now();

    // 1. Generate individual tool pages
    const tools = await loadTools();
    const template = await loadTemplate();
    await ensureDir(CONFIG.OUTPUT_DIR);

    // Generate each tool page
    const results = await Promise.allSettled(
        tools.map(tool => generatePage(tool, template))
    );

    let success = 0;
    results.forEach((res, i) => {
        if (res.status === 'fulfilled') success++;
        else console.error(`❌ Failed to generate ${tools[i].slug}: ${res.reason}`);
    });

    // Generate sitemap
    await generateSitemap(tools);

    // 2. Generate listing pages
    await generateToolsListing();
    await generateGuidesListing();
    await generateBlogIndex();

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n🎉 Build Complete`);
    console.log(`Pages generated: ${success}/${tools.length} tools + listings`);
    console.log(`Build time: ${elapsed}s\n`);
}

build().catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});