/**
 * Ensure every production tool has 5 guides in guide-data-extra.json
 * Run: node scripts/ensure-five-guides.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOLS_FILE = path.join(ROOT, 'data', 'tools.json');
const GUIDE_DATA = path.join(ROOT, 'data', 'guide-data.json');
const EXTRA_FILE = path.join(ROOT, 'data', 'guide-data-extra.json');

const AMAZON_TAG = 'fastimgtool78-21';

const TOPIC_TEMPLATES = [
    { suffix: 'for-amazon-listings', title: (t) => `${t} for Amazon Product Listings`, h2: 'Amazon listing requirements' },
    { suffix: 'for-meesho-sellers', title: (t) => `${t} for Meesho Sellers`, h2: 'Meesho image tips' },
    { suffix: 'for-social-media', title: (t) => `${t} for Social Media Posts`, h2: 'Social media best practices' },
    { suffix: 'common-mistakes', title: (t) => `${t}: Common Mistakes to Avoid`, h2: 'Mistakes to avoid' }
];

function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildContent(tool, topic, toolUrl) {
    const name = tool.title;
    return `
<h2 id="intro">Introduction</h2>
<p>Whether you sell on Amazon, Meesho, or create content online, knowing how to use <strong>${name}</strong> saves time and improves results. This guide covers practical steps using our free browser-based tool — no signup, no uploads to our servers.</p>

<h2 id="why">${topic.h2}</h2>
<p>Marketplace and social platforms compress and resize images automatically if yours are too large or the wrong format. Starting with optimized files means sharper thumbnails, faster page loads, and fewer rejections.</p>
<ul>
<li><strong>Speed:</strong> Smaller files upload faster on slow mobile networks.</li>
<li><strong>Quality:</strong> Correct dimensions prevent awkward cropping on product cards.</li>
<li><strong>Compliance:</strong> Many platforms specify minimum and maximum file sizes.</li>
</ul>

<h2 id="steps">Step-by-step</h2>
<ol>
<li>Open <a href="${toolUrl}">${name}</a> on FastImageTool.</li>
<li>Upload your image (drag-and-drop supported on most tools).</li>
<li>Adjust settings — quality, dimensions, or effect strength as needed.</li>
<li>Preview the result, then download the processed file.</li>
<li>Upload the final image to your listing or post.</li>
</ol>

<h2 id="tips">Pro tips</h2>
<ul>
<li>Keep a master copy at full resolution; export sized copies for each channel.</li>
<li>For product photos, use consistent aspect ratios across your catalog.</li>
<li>After converting or resizing, run <a href="/tools/image-compressor/">Image Compressor</a> if file size is still high.</li>
</ul>

<h2 id="faq">FAQ</h2>
<h3>Is this tool free?</h3>
<p>Yes — 100% free, browser-based, no account required.</p>
<h3>Are my images uploaded to your servers?</h3>
<p>No. Processing happens locally in your browser whenever possible.</p>
<h3>What format should I use for Amazon India?</h3>
<p>JPEG is preferred for photos; PNG for graphics with transparency. Check current Seller Central image guidelines.</p>
<h3>Can I use this on mobile?</h3>
<p>Yes. Works in modern mobile browsers (Chrome, Safari, Edge).</p>
<h3>What if my file is HEIC from iPhone?</h3>
<p>Use our <a href="/tools/heic-to-jpg/">HEIC to JPG</a> converter first, then continue with ${name}.</p>

<h2 id="cta">Try it now</h2>
<p>Ready to optimize your images? <a href="${toolUrl}">Open ${name} →</a></p>

<div class="recommended-tools"><h4>Recommended products</h4><ul><li><a href="https://www.amazon.in/s?k=ring+light+photography&amp;tag=${AMAZON_TAG}" target="_blank" rel="noopener sponsored">Ring light for product photos (Amazon)</a></li></ul></div>`;
}

const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8')).filter((t) => t.slug !== 'test-tool');
const existing = JSON.parse(fs.readFileSync(GUIDE_DATA, 'utf8'));
const existingSlugs = new Set(existing.map((g) => g.slug));

const countByTool = {};
existing.forEach((g) => {
    countByTool[g.tool_slug] = (countByTool[g.tool_slug] || 0) + 1;
});

let extra = [];
if (fs.existsSync(EXTRA_FILE)) {
    extra = JSON.parse(fs.readFileSync(EXTRA_FILE, 'utf8'));
    extra.forEach((g) => {
        existingSlugs.add(g.slug);
        countByTool[g.tool_slug] = (countByTool[g.tool_slug] || 0) + 1;
    });
}

const added = [];

tools.forEach((tool) => {
    const have = countByTool[tool.slug] || 0;
    const need = Math.max(0, 5 - have);
    if (need === 0) return;

    const topics = TOPIC_TEMPLATES.slice(0, need);
    topics.forEach((topic) => {
        const slug = slugify(`${tool.slug}-${topic.suffix}`);
        if (existingSlugs.has(slug)) return;

        const title = topic.title(tool.title);
        const entry = {
            tool_slug: tool.slug,
            tool_name: tool.title,
            slug,
            title,
            description: `Learn ${tool.title.toLowerCase()} — ${topic.h2.toLowerCase()}. Free guide for sellers and creators.`,
            h1: title,
            content: buildContent(tool, topic, `/tools/${tool.slug}/`),
            date: '2026-05-31'
        };
        extra.push(entry);
        existingSlugs.add(slug);
        added.push(slug);
    });
});

fs.writeFileSync(EXTRA_FILE, JSON.stringify(extra, null, 2), 'utf8');
console.log(`✅ guide-data-extra.json: ${extra.length} total entries (${added.length} new)`);
added.forEach((s) => console.log('  +', s));
