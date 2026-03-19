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
    TOOL_CONTENT_FILE: path.join(__dirname, "data", "tool-content.json"),
};

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

// ------------------- Helper Functions -------------------
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

    const required = ['{{title}}', '{{description}}', '{{slug}}'];
    for (const token of required) {
        if (!template.includes(token)) {
            console.error(`❌ Template missing placeholder: ${token}`);
            process.exit(1);
        }
    }
    return template;
}

async function generateSitemap(tools, guides, blogPosts) {
    const today = new Date().toISOString().split('T')[0];
    let urls = [];

    // Homepage
    urls.push(`
  <url>
    <loc>${CONFIG.DOMAIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);

    // Tool pages
    tools.forEach(tool => {
        urls.push(`
  <url>
    <loc>${CONFIG.DOMAIN}/tools/${tool.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
    });

    // Guide pages
    guides.forEach(guide => {
        urls.push(`
  <url>
    <loc>${CONFIG.DOMAIN}${guide.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
    });

    // Blog posts
    blogPosts.forEach(post => {
        urls.push(`
  <url>
    <loc>${CONFIG.DOMAIN}${post.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
    });

    // Static pages
    const staticPages = [
        '/about.html',
        '/contact.html',
        '/privacy.html',
        '/terms.html',
        '/faq.html',
        '/community.html',
        '/tools/',
        '/guides/',
        '/blog/'
    ];
    staticPages.forEach(page => {
        urls.push(`
  <url>
    <loc>${CONFIG.DOMAIN}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`);
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

    await fs.writeFile(CONFIG.SITEMAP_FILE, sitemap, 'utf8');
    console.log('📄 sitemap.xml generated with all pages');
}
// ------------------- Listing Generators -------------------
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

// ========== IMPROVED BLOG INDEX GENERATION ==========
async function generateBlogIndex() {
    // Read blog posts data
    let posts = [];
    try {
        posts = JSON.parse(await fs.readFile(CONFIG.BLOG_POSTS_FILE, 'utf8'));
    } catch (err) {
        console.warn('⚠️ Could not read blog-posts.json, proceeding with empty list.');
        posts = [];
    }

    // Read the blog template
    const template = await fs.readFile(CONFIG.BLOG_TEMPLATE, 'utf8');

    // Generate the list of posts (or a message if none)
    let listItems = '';
    if (posts.length === 0) {
        listItems = '<li class="post-item">No blog posts yet. Check back soon!</li>';
    } else {
        listItems = posts.map(post => `
            <li class="post-item">
                <a href="${post.url}">${post.title}</a>
                <span class="post-date">– ${post.date}</span>
            </li>
        `).join('');
    }

    // Build the final HTML by replacing all placeholders
    let page = template
        // Replace basic meta tags
        .replace('{{title}}', 'Blog – Fast Image Tools')
        .replace('{{description}}', 'Read the latest articles, tutorials, and guides about image editing, compression, and conversion.')
        // Remove the entire image section (screenshot not needed for index)
        .replace(/<div class="blog-screenshot">[\s\S]*?<\/div>/, '')
        // Replace canonical link with a clean one using the domain from config
        .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${CONFIG.DOMAIN}/blog/">`)
        // Finally, insert the posts list
        .replace('{{posts}}', listItems);

    // Write the generated page
    const outputPath = path.join(__dirname, 'blog', 'index.html');
    await ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, page, 'utf8');
    console.log('✅ Generated: blog/index.html');
}
// =====================================================

// ------------------- Main Build -------------------
async function build() {
    console.log('\n🚀 ToolForge Builder Starting\n');
    const start = Date.now();

    // 1. Load tools, template, and AI content
    const tools = await loadTools();
    const template = await loadTemplate();

// Load guides and blog posts for sitemap
const guides = JSON.parse(await fs.readFile(CONFIG.GUIDES_DATA_FILE, 'utf8'));
const blogPosts = JSON.parse(await fs.readFile(CONFIG.BLOG_POSTS_FILE, 'utf8'));

    // Load AI content
    let toolContentMap = new Map();
    try {
        const contentRaw = await fs.readFile(CONFIG.TOOL_CONTENT_FILE, 'utf8');
        const contentArray = JSON.parse(contentRaw);
        toolContentMap = new Map(contentArray.map(c => [c.slug, c]));
        console.log('📦 Loaded AI content for tools');
    } catch (err) {
        console.warn('⚠️ No tool-content.json found or error reading. Proceeding with empty content.');
    }

    await ensureDir(CONFIG.OUTPUT_DIR);

    // 2. Define page generator (inside build to access toolContentMap)
    async function generatePage(tool) {
        const toolDir = path.join(CONFIG.OUTPUT_DIR, tool.slug);
        await ensureDir(toolDir);

        const toolContent = toolContentMap.get(tool.slug) || {};

        let html = template
            .replace(/\{\{title\}\}/g, tool.title)
            .replace(/\{\{description\}\}/g, tool.description)
            .replace(/\{\{slug\}\}/g, tool.slug)
            .replace(/\{\{about\}\}/g, toolContent.about || '')
            .replace(/\{\{howTo\}\}/g, toolContent.howTo || '')
            .replace(/\{\{whyUse\}\}/g, toolContent.whyUse || '')
            .replace(/\{\{useCases\}\}/g, toolContent.useCases || '')
            .replace(/\{\{faq\}\}/g, toolContent.faq || '')
                    .replace(/\{\{screenshot_jpg\}\}/g, `/assets/images/tools/${tool.slug}-screenshot.jpg`)
        .replace(/\{\{screenshot_webp\}\}/g, `/assets/images/tools/${tool.slug}-screenshot.webp`);


        const outPath = path.join(toolDir, 'index.html');
        await fs.writeFile(outPath, html, 'utf8');
        console.log(`✅ Generated: ${outPath}`);
        return outPath;
    }

    // 3. Generate all tool pages
    const results = await Promise.allSettled(
        tools.map(tool => generatePage(tool))
    );

    let success = 0;
    results.forEach((res, i) => {
        if (res.status === 'fulfilled') success++;
        else console.error(`❌ Failed to generate ${tools[i].slug}: ${res.reason}`);
    });

    // 4. Generate sitemap
   await generateSitemap(tools, guides, blogPosts);

    // 5. Generate listing pages
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