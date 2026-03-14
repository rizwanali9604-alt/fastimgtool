// scripts/generate-search-index.js
const fs = require('fs').promises;
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'search.json');

async function loadTools() {
    const raw = await fs.readFile(path.join(__dirname, '..', 'data', 'tools.json'), 'utf8');
    return JSON.parse(raw).map(t => ({
        title: t.title,
        description: t.description,
        url: `/tools/${t.slug}/`,
        type: 'tool',
    }));
}

async function loadGuides() {
    const raw = await fs.readFile(path.join(__dirname, '..', 'data', 'guide-data.json'), 'utf8');
    return JSON.parse(raw).map(g => ({
        title: g.title,
        description: g.description,
        url: `/guides/${g.slug}.html`,
        type: 'guide',
    }));
}

async function loadBlogPosts() {
    const raw = await fs.readFile(path.join(__dirname, '..', 'data', 'blog-posts.json'), 'utf8');
    return JSON.parse(raw).map(b => ({
        title: b.title,
        description: b.description,
        url: b.url,
        type: 'blog',
    }));
}

async function main() {
    console.log('🔍 Generating search index...');
    const [tools, guides, blogPosts] = await Promise.all([
        loadTools(),
        loadGuides(),
        loadBlogPosts(),
    ]);
    const index = [...tools, ...guides, ...blogPosts];
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(index, null, 2));
    console.log(`✅ search.json created with ${index.length} entries.`);
}

main().catch(console.error);